import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faExclamationCircle,
  faCheckCircle,
  faPlusCircle,
  faEdit,
  faTrashAlt,
  faSave,
  faTimes,
  faSyncAlt,
  faFolderOpen,
  faUsers,
  faLink
} from "@fortawesome/free-solid-svg-icons";

const ChainManagement = () => {
  const [chains, setChains] = useState([]);
  const [filteredChains, setFilteredChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filterByGroup, setFilterByGroup] = useState("");
  const [newChain, setNewChain] = useState({
    companyName: "",
    gstnNo: ""
  });
  const [editChainId, setEditChainId] = useState(null);
  const [editChain, setEditChain] = useState({
    companyName: "",
    gstnNo: "",
    groupId: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalChains, setTotalChains] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showAddChain, setShowAddChain] = useState(false);
  const [showEditChain, setShowEditChain] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChains();
    fetchGroups();
  }, []);

  useEffect(() => {
    if (filterByGroup) {
      const filtered = chains.filter(chain => 
        String(chain.group?.groupId) === String(filterByGroup)
      );
      setFilteredChains(filtered);
    } else {
      setFilteredChains(chains);
    }
  }, [filterByGroup, chains]);

  // Fetch All Chains
  const fetchChains = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/chains");
      setChains(response.data);
      setFilteredChains(response.data);
      setTotalChains(response.data.length);
      console.log("Fetched chains:", response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching chains:", err);
      setError("Failed to load chains. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Groups for dropdown
  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/groups");
      const activeGroups = response.data.filter(group => group.active !== false);
      setGroups(activeGroups);
      setTotalGroups(activeGroups.length);
      console.log("Fetched groups for dropdown:", activeGroups);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups. Please try again.");
    }
  };

  // Handle input change for new chain
  const handleNewChainChange = (e) => {
    const { name, value } = e.target;
    setNewChain({
      ...newChain,
      [name]: value
    });
  };

  // Handle input change for editing chain
  const handleEditChainChange = (e) => {
    const { name, value } = e.target;
    setEditChain({
      ...editChain,
      [name]: value
    });
  };

  // Add a New Chain
  const handleAddChain = async () => {
    if (!newChain.companyName.trim()) {
      setError("Company name cannot be empty.");
      return;
    }

    if (!newChain.gstnNo.trim() || newChain.gstnNo.length !== 15) {
      setError("GSTN number must be 15 characters long.");
      return;
    }

    if (!selectedGroup) {
      setError("Please select a group.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8080/api/chains?groupId=${selectedGroup}`, 
        newChain
      );

      setChains([...chains, response.data]);
      setNewChain({
        companyName: "",
        gstnNo: ""
      });
      setSelectedGroup("");
      setError(null);
      setSuccess("Chain added successfully!");
      setShowAddChain(false);
      fetchChains(); // Refresh the list to get accurate count
    } catch (error) {
      console.error("Error adding chain:", error);
      setError(error.response?.data?.error || "Failed to add chain.");
    } finally {
      setLoading(false);
    }
  };
  
  // Edit an Existing Chain
  const handleEditChain = async () => {
    if (!editChain.companyName.trim()) {
      setError("Company name cannot be empty");
      return;
    }
    
    if (!editChain.gstnNo.trim() || editChain.gstnNo.length !== 15) {
      setError("GSTN number must be 15 characters long.");
      return;
    }

    if (!editChain.groupId) {
      setError("Please select a group.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8080/api/chains/${editChainId}?groupId=${editChain.groupId}`, 
        {
          companyName: editChain.companyName,
          gstnNo: editChain.gstnNo
        }
      );
      
      console.log("Update response:", response.data);
      setEditChainId(null);
      setEditChain({
        companyName: "",
        gstnNo: "",
        groupId: ""
      });
      setError(null);
      setSuccess("Chain updated successfully!");
      setShowEditChain(false);
      fetchChains(); // Refresh list
    } catch (err) {
      console.error("Error updating chain:", err);
      setError(err.response?.data?.error || "Error updating chain");
    } finally {
      setLoading(false);
    }
  };

  // Check if chain can be deleted
  const checkCanDeleteChain = async (chainId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/chains/can-delete/${chainId}`);
      return response.data;
    } catch (err) {
      console.error("Error checking if chain can be deleted:", err);
      return false;
    }
  };

  // Delete a Chain
  const handleDeleteChain = async (chainId) => {
    if (!window.confirm("Are you sure you want to delete this chain?")) return;
  
    try {
      // First check if chain can be deleted
      const canDelete = await checkCanDeleteChain(chainId);
      
      if (!canDelete) {
        setError("Cannot delete chain as it is associated with brands.");
        return;
      }
      
      setLoading(true);
      console.log("Attempting to delete chain with ID:", chainId);
      
      const response = await axios.delete(`http://localhost:8080/api/chains/${chainId}`);
      
      console.log("Delete response:", response.data);
      setSuccess("Chain deleted successfully!");
      fetchChains(); // Refresh list
    } catch (err) {
      console.error("Error deleting chain:", err);
      
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You don't have authorization to delete this chain.");
      } else {
        setError(err.response?.data?.error || "Error deleting chain");
      }
    } finally {
      setLoading(false);
    }
  };

  const initiateEditChain = (chain) => {
    setEditChainId(chain.chainId);
    setEditChain({
      companyName: chain.companyName,
      gstnNo: chain.gstnNo,
      groupId: chain.group?.groupId || ""
    });
    setShowEditChain(true);
    setShowAddChain(false);
    setError(null);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleFilterChange = (e) => {
    setFilterByGroup(e.target.value);
  };
  
  return (
    <>
      <div className="page-header">
        <h1>Chain Management</h1>
        <p>Create, edit, and manage your business chains</p>
      </div>

      {/* Messages */}
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

      {!showAddChain && !showEditChain && (
        <div className="dashboard-content">
          <div className="dashboard-header">
            {/* Total Groups Card */}
            <div className="stats-card" style={{ backgroundColor: "#d9534f" }}>
              <div className="stats-card-content">
                <div className="card-title">Total Groups</div>
                <div className="card-value">{totalGroups}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>

            {/* Total Chains Card */}
            <div className="stats-card" style={{ backgroundColor: "#f0ad4e" }}>
              <div className="stats-card-content">
                <div className="card-title">Total Chains</div>
                <div className="card-value">{totalChains}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faLink} />
              </div>
            </div>

            {/* Add Chain Button */}
            <button 
              className="add-group-btn" 
              onClick={() => {
                setShowAddChain(true);
                clearMessages();
              }}
              disabled={loading}
              style={{ backgroundColor: "#28a745", color: "white" }}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              {loading ? "Loading..." : "Add Company"}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <div></div>
            {/* Filter by Group Dropdown */}
            <div style={{ width: "250px" }}>
              <h3 style={{ marginBottom: "10px" }}>Filter by Group</h3>
              <select
                value={filterByGroup}
                onChange={handleFilterChange}
                className="form-input"
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  borderRadius: "4px",
                  border: "1px solid #ced4da"
                }}
              >
                <option value="">All Groups</option>
                {groups.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chains Table */}
          <div className="chains-table-container">
            <table className="chains-table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Group Name</th>
                  <th>Company</th>
                  <th>GSTN</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-cell">
                      <div className="loading-spinner"></div>
                      <span>Loading chains...</span>
                    </td>
                  </tr>
                ) : filteredChains.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      <div className="empty-state">
                        <FontAwesomeIcon icon={faFolderOpen} className="empty-icon" />
                        <p>No chains found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredChains.map((chain, index) => (
                    <tr key={chain.chainId}>
                      <td>{index + 1}</td>
                      <td>{chain.group?.groupName || "N/A"}</td>
                      <td>{chain.companyName}</td>
                      <td>{chain.gstnNo}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => initiateEditChain(chain)}
                          disabled={loading}
                          title="Edit Chain"
                          style={{
                            backgroundColor: "#ffc107",
                            color: "black",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            width: ""
                          }}
                        ><FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                      </td>
                      <td>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteChain(chain.chainId)}
                          disabled={loading}
                          title="Delete Chain"
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            width: ""
                          }}
                        ><FontAwesomeIcon icon={faTrashAlt} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Chain Form */}
      {showAddChain && (
        <div className="group-form">
          <h3>Add New Chain</h3>
          <div className="form-group">
            <label htmlFor="companyName">Company Name:</label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Enter company name"
              value={newChain.companyName}
              onChange={handleNewChainChange}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gstnNo">GSTN Number:</label>
            <input
              id="gstnNo"
              name="gstnNo"
              type="text"
              placeholder="Enter 15-digit GSTN number"
              value={newChain.gstnNo}
              onChange={handleNewChainChange}
              className="form-input"
              maxLength={15}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="groupSelect">Select Group:</label>
            <select
              id="groupSelect"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="form-input"
              disabled={loading}
            >
              <option value="">-- Select a Group --</option>
              {groups.map((group) => (
                <option key={group.groupId} value={group.groupId}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button 
              className="submit-btn"
              onClick={handleAddChain}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Add Chain
                </>
              )}
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowAddChain(false);
                setNewChain({
                  companyName: "",
                  gstnNo: ""
                });
                setSelectedGroup("");
                clearMessages();
              }}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Chain Form */}
      {showEditChain && (
        <div className="group-form">
          <h3>Edit Chain</h3>
          <div className="form-group">
            <label htmlFor="editCompanyName">Company Name:</label>
            <input
              id="editCompanyName"
              name="companyName"
              type="text"
              value={editChain.companyName}
              onChange={handleEditChainChange}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editGstnNo">GSTN Number:</label>
            <input
              id="editGstnNo"
              name="gstnNo"
              type="text"
              value={editChain.gstnNo}
              onChange={handleEditChainChange}
              className="form-input"
              maxLength={15}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editGroupSelect">Select Group:</label>
            <select
              id="editGroupSelect"
              name="groupId"
              value={editChain.groupId}
              onChange={handleEditChainChange}
              className="form-input"
              disabled={loading}
            >
              <option value="">-- Select a Group --</option>
              {groups.map((group) => (
                <option key={group.groupId} value={group.groupId}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button 
              className="submit-btn"
              onClick={handleEditChain}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSyncAlt} />
                  Update
                </>
              )}
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowEditChain(false);
                setEditChain({
                  companyName: "",
                  gstnNo: "",
                  groupId: ""
                });
                clearMessages();
              }}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChainManagement;