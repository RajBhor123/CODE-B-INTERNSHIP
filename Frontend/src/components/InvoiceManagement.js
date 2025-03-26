import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faEdit,
  faTrashAlt,
  faSave,
  faTimes,
  faSyncAlt,
  faSearch,
  faFileInvoice,
  faFilePdf,
  faDownload,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [editInvoiceId, setEditInvoiceId] = useState(null);
  const [editInvoice, setEditInvoice] = useState({
    id: "",
    invoiceNo: "",
    estimateId: "",
    chainId: "",
    companyName: "",
    serviceDetails: "",
    qty: "",
    costPerQty: "",
    amountPayable: "",
    emailId: "",
    createdAt: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditInvoice, setShowEditInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("invoiceNo");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/invoices");
      console.log("Fetched invoices:", response.data);
      setInvoices(response.data);
      setTotalInvoices(response.data.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditInvoice({
      ...editInvoice,
      [name]: value
    });
  };

  const handleEditInvoice = async () => {
    if (!validateEmail(editInvoice.emailId)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.put(
        `/invoices/${editInvoiceId}?emailId=${encodeURIComponent(editInvoice.emailId)}`
      );
      
      setEditInvoiceId(null);
      setEditInvoice({
        id: "",
        invoiceNo: "",
        estimateId: "",
        chainId: "",
        companyName: "",
        serviceDetails: "",
        qty: "",
        costPerQty: "",
        amountPayable: "",
        emailId: "",
        createdAt: ""
      });
      setError(null);
      setSuccess("Invoice updated successfully!");
      setShowEditInvoice(false);
      fetchInvoices();
    } catch (err) {
      console.error("Error updating invoice:", err);
      setError(err.response?.data?.error || "Error updating invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
  
    try {
      setLoading(true);
      await api.delete(`/invoices/${invoiceId}`);
      setSuccess("Invoice deleted successfully!");
      fetchInvoices();
    } catch (err) {
      console.error("Error deleting invoice:", err);
      setError(err.response?.data?.error || "Error deleting invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/invoices/${invoiceId}/pdf`, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess("Invoice downloaded successfully!");
    } catch (err) {
      console.error("Error downloading invoice:", err);
      setError("Failed to download invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (invoiceId) => {
    try {
      setLoading(true);
      await api.post(`/invoices/${invoiceId}/send-email`);
      setSuccess("Invoice email sent successfully");
    } catch (err) {
      console.error("Error sending invoice by email:", err);
      setError(err.response?.data?.error || "Failed to send invoice by email");
    } finally {
      setLoading(false);
    }
  };

  const initiateEditInvoice = (invoice) => {
    setEditInvoiceId(invoice.id);
    setEditInvoice({
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      estimateId: invoice.estimate?.estimateId || "",
      chainId: invoice.chain?.chainId || "",
      companyName: invoice.chain?.companyName || "",
      serviceDetails: invoice.serviceDetails,
      qty: invoice.qty,
      costPerQty: invoice.costPerQty,
      amountPayable: invoice.amountPayable,
      emailId: invoice.emailId || "",
      createdAt: invoice.createdAt
    });
    
    setShowEditInvoice(true);
    clearMessages();
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const getFilteredInvoices = () => {
    if (!searchTerm.trim()) return invoices;
    
    return invoices.filter(invoice => {
      const searchValue = String(
        searchField === 'companyName' ? 
          (invoice.chain?.companyName || '') : 
          invoice[searchField] || ''
      ).toLowerCase();
      return searchValue.includes(searchTerm.toLowerCase());
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (err) {
      return dateString;
    }
  };
  
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getValueOrDefault = (obj, key, defaultValue = "N/A") => {
    return obj && obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue;
  };

  return (
    <>
      <div className="page-header">
        <h1>Invoice Management</h1>
        <p>View, edit, and manage your invoices</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
          {error}
          <button className="close-btn" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <FontAwesomeIcon icon={faCheckCircle} className="alert-icon" />
          <span className="alert-message">{success}</span>
          <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      {!showEditInvoice && (
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="stats-card invoices-card">
              <div className="stats-card-content">
                <div className="card-title">Total Invoices</div>
                <div className="card-value">{totalInvoices}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faFileInvoice} />
              </div>
            </div>

            <div className="search-section">
              <div className="search-container">
                <div className="search-field-select">
                  <select 
                    value={searchField} 
                    onChange={(e) => setSearchField(e.target.value)}
                    className="search-select"
                  >
                    <option value="invoiceNo">Invoice Number</option>
                    <option value="estimateId">Estimate ID</option>
                    <option value="chainId">Chain ID</option>
                    <option value="companyName">Company Name</option>
                    <option value="serviceDetails">Service Details</option>
                  </select>
                </div>
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder={`Search by ${searchField}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
              </div>
            </div>

            <button 
              className="refresh-btn" 
              onClick={fetchInvoices}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSyncAlt} spin={loading} />
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="table-container">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Invoice No</th>
                  <th>Estimate ID</th>
                  <th>Chain ID</th>
                  <th>Company Name</th>
                  <th>Service Details</th>
                  <th>Total Qty</th>
                  <th>Price Per Qty</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && invoices.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="loading-cell">
                      <div className="loading-spinner"></div>
                      <span>Loading invoices...</span>
                    </td>
                  </tr>
                ) : getFilteredInvoices().length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-cell">
                      <div className="empty-state">
                        <FontAwesomeIcon icon={faFileInvoice} className="empty-icon" />
                        <p>No invoices found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getFilteredInvoices().map((invoice, index) => (
                    <tr key={invoice.id}>
                      <td>{index + 1}</td>
                      <td>{getValueOrDefault(invoice, 'invoiceNo')}</td>
                      <td>{getValueOrDefault(invoice.estimate, 'estimateId')}</td>
                      <td>{getValueOrDefault(invoice.chain, 'chainId')}</td>
                      <td>{getValueOrDefault(invoice.chain, 'companyName')}</td>
                      <td>{getValueOrDefault(invoice, 'serviceDetails')}</td>
                      <td>{getValueOrDefault(invoice, 'qty')}</td>
                      <td>{formatCurrency(invoice.costPerQty)}</td>
                      <td>{formatCurrency(invoice.amountPayable)}</td>
                      <td className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => initiateEditInvoice(invoice)}
                          disabled={loading}
                          title="Edit Email"
                        >
                          <FontAwesomeIcon icon={faEdit} />Edit
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          disabled={loading}
                          title="Delete Invoice"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />Delete
                        </button>
                        <button 
                          className="download-btn" 
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          disabled={loading}
                          title="Download Invoice"
                        >
                          <FontAwesomeIcon icon={faDownload} />Download
                        </button>
                        {/* <button 
                          className="email-btn" 
                          onClick={() => handleSendEmail(invoice.id)}
                          disabled={loading || !invoice.emailId}
                          title={invoice.emailId ? "Send Email" : "No Email Address"}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </button> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

{showEditInvoice && (
  <div className="update-invoice-section">
    <div className="invoice-form">
      <div className="form-grid">
        <div className="form-edit">
          <label>Invoice No:</label>
          <input
            type="text"
            value={editInvoice.invoiceNo || ""}
            disabled
          />
        </div>
        <div className="form-edit">
          <label>Estimate ID:</label>
          <input
            type="text"
            value={editInvoice.estimateId || ""}
            disabled
          />
        </div>
        <div className="form-edit">
          <label>Chain ID:</label>
          <input
            type="text"
            value={editInvoice.chainId || ""}
            disabled
          />
        </div>
        <div className="form-edit">
          <label>Service Provided:</label>
          <input
            type="text"
            value={editInvoice.serviceDetails || ""}
            disabled
          />
        </div>
        <div className="form-edit">
          <label>Quantity:</label>
          <input
            type="text"
            value={editInvoice.qty || ""}
            disabled
          />
        </div>
        <div className="form-edit">
          <label>Cost per Quantity:</label>
          <input
            type="text"
            value={formatCurrency(editInvoice.costPerQty)}
            disabled
          />
        </div>
        <div className="form-edit">
          <label>Amount Payable in Rs:</label>
          <input
            type="text"
            value={formatCurrency(editInvoice.amountPayable)}
            disabled
          />
        </div>
        <div className="form-edit">
          <label>Delivery Date:</label>
          <input
            type="text"
            value={formatDate(editInvoice.createdAt)}
            disabled
          />
        </div>
        <div className="form-edit full-width">
          <label>Other Delivery Details:</label>
          <textarea
            value={`${editInvoice.companyName}\nDelta Tech Pvt Ltd\n2-A1`}
            disabled
          />
        </div>
        <div className="form-edit full-width">
          <label>Enter Email ID:</label>
          <input
            type="email"
            name="emailId"
            value={editInvoice.emailId || ""}
            onChange={handleEditInputChange}
            placeholder="Enter Email Address"
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          className="update-invoice-btn"
          onClick={handleEditInvoice}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Invoice"}
        </button>
        <button 
          className="cancel-btn"
          onClick={() => {
            setShowEditInvoice(false);
            setEditInvoiceId(null);
            clearMessages();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default InvoiceManagement;