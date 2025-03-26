import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faSave,
  faTimes,
  faFileInvoice,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";

const CreateInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const estimateData = location.state || {};

  // State for invoice form
  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    estimateId: estimateData.estimateId || "",
    chainId: estimateData.chainId || "",
    service: estimateData.service || "",
    quantity: estimateData.quantity || "",
    costPerUnit: estimateData.costPerUnit || "",
    amountPayable: estimateData.amountPayable || "",
    amountPaid: estimateData.amountPayable || "", // Initialize with full amount
    balance: "0", // Initialize with zero
    deliveryDate: estimateData.deliveryDate || "",
    deliveryDetails: estimateData.deliveryDetails || "",
    emailId: "",
  });

  // State for UI control
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState(null);
  
  
  


  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const generateInvoiceNumber = () => {
      const today = new Date();
      const year = today.getFullYear().toString().substr(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

      return `${random}`;
    };

    setInvoice((prev) => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(),
    }));

    setInitialLoading(false);
  }, []);


  const fetchInvoicePdf = async (invoiceId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/invoice/${invoiceId}/pdf`, {
            responseType: 'blob', // Ensures response is treated as a binary blob
        });

        // Create a Blob URL for preview
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
    } catch (error) {
        console.error("Error fetching PDF:", error);
    }
};

  
  // Call fetchPdf on component mount
  useEffect(() => {
    fetchInvoicePdf();
  }, []);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "emailId") {
      setInvoice({
        ...invoice,
        [name]: value,
      });
    } else if (name === "amountPaid") {
      const amountPaid = parseFloat(value) || 0;
      const amountPayable = parseFloat(invoice.amountPayable) || 0;
      const balance = Math.max(0, amountPayable - amountPaid).toFixed(2);
      
      setInvoice({
        ...invoice,
        amountPaid: value,
        balance: balance
      });
    }
  };

  // Try to fetch PDF again
  const handleRetryPdf = async () => {
    if (!createdInvoiceId || isNaN(createdInvoiceId)) {
      setPdfError("Cannot retry: Invalid invoice ID");
      return;
    }
    
    try {
      setLoading(true);
      setPdfError(null);
      
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/invoices/${createdInvoiceId}/pdf`, 
        { 
          responseType: "blob",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          } 
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPdfUrl(url);
    } catch (pdfErr) {
      setPdfError("PDF generation failed. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  // Create Invoice and generate PDF
  const handleCreateInvoice = async () => {
    if (!validateEmail(invoice.emailId)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setPdfError(null);
  
      const token = localStorage.getItem("token");
  
      // Create a simplified request object matching what the backend expects
      const requestData = {
        estimateId: invoice.estimateId,
        emailId: invoice.emailId,
        amountPaid: parseFloat(invoice.amountPaid) || 0
      };
  
      const response = await axios.post(
        "http://localhost:8080/api/invoices/generate", 
        requestData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      
      // Try multiple possible field names for the ID
      const invoiceId = response.data?.id || response.data?.invoiceId || response.data?.invoice_id;
      
      if (invoiceId && !isNaN(invoiceId)) {
        setCreatedInvoiceId(invoiceId);
        setInvoiceCreated(true);
        setSuccess("Invoice created successfully!");
  
        try {
          const response = await axios.get(
            `http://localhost:8080/api/invoices/${invoiceId}/pdf`, 
            { 
              responseType: "blob",
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
              } 
            }
          );
  
          const url = window.URL.createObjectURL(new Blob([response.data]));
          setPdfUrl(url);
        } catch (pdfErr) {
          setPdfError("Invoice created but PDF generation failed. You can try again or proceed without it.");
        }
      } else {
        setInvoiceCreated(true);
        setSuccess("Invoice created successfully!");
        setPdfError("Invoice created but cannot generate PDF - invalid invoice ID received.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create invoice.");
      setInvoiceCreated(false);
    } finally {
      setLoading(false);
    }
  };

  // Download the generated PDF
  const handleDownloadPdf = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", `Invoice-${invoice.invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
  };

  // Navigate back to estimates
  const handleGoBack = () => {
    navigate('/dashboard/estimate-management');
  };

  // Validate email format
  const validateEmail = (email) => {
    if (!email || email.trim() === "") return false;

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (initialLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
        <p>Loading estimate details...</p>
      </div>
    );
  }

  if (!estimateData.estimateId) {
    return (
      <div className="error-container">
        <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
        <h2>Missing Estimate Data</h2>
        <p>No estimate data was provided. Please select an estimate first.</p>
        <button className="back-btn" onClick={handleGoBack}>
          <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
        </button>
      </div>
    );
  }

  return (
    <div className="invoice-section">
      <div className="page-header">
        <h1>Create Invoice</h1>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
          {error}
          <button className="close-btn" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {success && !pdfUrl && (
        <div className="alert alert-success">
          <FontAwesomeIcon icon={faCheckCircle} className="alert-icon" />
          <span className="alert-message">{success}</span>
          <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
        </div>
      )}
      
      {pdfError && (
        <div className="alert alert-warning">
          <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
          {pdfError}
          <button className="close-btn" onClick={() => setPdfError(null)}>×</button>
          {createdInvoiceId && (
            <button className="retry-btn" onClick={handleRetryPdf} disabled={loading}>
              {loading ? 'Retrying...' : 'Retry PDF Generation'}
            </button>
          )}
        </div>
      )}

      {/* Invoice PDF Preview */}
      {pdfUrl && (
        <div className="pdf-preview-container">
          <h3>Invoice Preview</h3>
          {/* <div className="pdf-frame-container">
            <iframe 
              src={pdfUrl} 
              className="pdf-preview-frame" 
              title="Invoice Preview"
              type="application/pdf"
              width="100%"
              height="500px"
            ></iframe>
            <p className="pdf-fallback">
              If the PDF is not displaying correctly, you can 
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">view it in a new tab</a> 
              or download it directly.
            </p>
          </div> */}
          <div className="pdf-actions">
            <button className="download-btn" onClick={handleDownloadPdf}>
              <FontAwesomeIcon icon={faFileInvoice} /> Download Invoice PDF
            </button>
            <button className="back-btn" onClick={handleGoBack}>
              <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
            </button>
          </div>
        </div>
      )}

      {/* Invoice Created but No PDF */}
      {invoiceCreated && !pdfUrl && (
        <div className="invoice-created-container">
          <div className="success-message">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            <h3>Invoice Created Successfully</h3>
            <p>The invoice has been saved to the system and will be accessible via the dashboard.</p>
          </div>
          <div className="action-buttons">
            <button className="retry-btn" onClick={handleRetryPdf} disabled={loading}>
              {loading ? 'Retrying...' : 'Retry PDF Generation'}
            </button>
            <button className="back-btn" onClick={handleGoBack}>
              <FontAwesomeIcon icon={faAngleLeft} /> Back to Estimates
            </button>
          </div>
        </div>
      )}

      {/* Simple Invoice Form - Based on the image */}
      {!invoiceCreated && (
        <div className="invoice-form-simple">
          <div className="form-row">
            <div className="form-group">
              <label>Invoice No:</label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                className="form-input"
                disabled={true}
              />
            </div>
            
            <div className="form-group">
              <label>Estimate ID:</label>
              <input
                type="text"
                value={invoice.estimateId}
                className="form-input"
                disabled={true}
              />
            </div>
            
            <div className="form-group">
              <label>Chain ID:</label>
              <input
                type="text"
                value={invoice.chainId}
                className="form-input"
                disabled={true}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Service Provided:</label>
              <input
                type="text"
                value={invoice.service}
                className="form-input"
                disabled={true}
              />
            </div>
            
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="text"
                value={invoice.quantity}
                className="form-input"
                disabled={true}
              />
            </div>
            
            <div className="form-group">
              <label>Cost per Quantity:</label>
              <input
                type="text"
                value={invoice.costPerUnit}
                className="form-input"
                disabled={true}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Amount Payable in Rs:</label>
              <input
                type="text"
                value={invoice.amountPayable}
                className="form-input"
                disabled={true}
              />
            </div>
            
            <div className="form-group">
              <label>Amount Paid in Rs:</label>
              <input
                type="number"
                name="amountPaid"
                value={invoice.amountPaid}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Balance in Rs:</label>
              <input
                type="text"
                value={invoice.balance}
                className="form-input"
                disabled={true}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Delivery Date:</label>
              <input
                type="text"
                value={invoice.deliveryDate}
                className="form-input"
                disabled={true}
              />
            </div>
            
            <div className="form-group">
              <label>Other Delivery Details:</label>
              <textarea
                value={invoice.deliveryDetails}
                className="form-textarea"
                disabled={true}
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label>Enter Email ID:</label>
              <input
                type="email"
                name="emailId"
                value={invoice.emailId}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Email address"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="generate-invoice-btn"
              onClick={handleCreateInvoice}
              disabled={loading || !invoice.emailId}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;