import React, { useState, useEffect } from "react";
import axios from "axios";
// Import Font Awesome components
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
  faUsers
} from "@fortawesome/free-solid-svg-icons";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch All Groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/groups");
      const activeGroups = response.data.filter(group => group.active !== false);
      setGroups(activeGroups);
      setTotalGroups(activeGroups.length);
      console.log("Fetched groups:", response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a New Group
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/api/groups/add", {
        groupName: newGroupName,
      });

      setGroups([...groups, response.data.group]);
      setNewGroupName("");
      setError(null);
      setSuccess("Group added successfully!");
      setShowAddGroup(false);
      fetchGroups(); // Refresh the list to get accurate count
    } catch (error) {
      console.error("Error adding group:", error);
      setError(error.response?.data?.message || "Failed to add group.");
    } finally {
      setLoading(false);
    }
  };
  
  // Edit an Existing Group
  const handleEditGroup = async () => {
    if (!editGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:8080/api/groups/${editGroupId}`, {
        groupName: editGroupName
      });
      
      console.log("Update response:", response.data);
      setEditGroupId(null);
      setEditGroupName("");
      setError(null);
      setSuccess("Group updated successfully!");
      setShowEditGroup(false);
      fetchGroups(); // Refresh list
    } catch (err) {
      console.error("Error updating group:", err);
      setError(err.response?.data?.message || "Error updating group");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Group
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
  
    try {
      setLoading(true);
      console.log("Attempting to delete group with ID:", groupId);
      
      const response = await axios.delete(`http://localhost:8080/api/groups/${groupId}`);
      
      console.log("Delete response:", response.data);
      setSuccess("Group deleted successfully!");
      fetchGroups(); // Refresh list
    } catch (err) {
      console.error("Error deleting group:", err);
      
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You don't have authorization to delete this group.");
      } else {
        setError(err.response?.data?.message || "Error deleting group");
      }
    } finally {
      setLoading(false);
    }
  };

  const initiateEditGroup = (group) => {
    setEditGroupId(group.id || group.groupId);
    setEditGroupName(group.groupName);
    setShowEditGroup(true);
    setShowAddGroup(false);
    setError(null);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };
  
  return (
    <>
      <div className="page-header">
        <h1>Group Management</h1>
        <p>Create, edit, and manage your groups</p>
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

      {!showAddGroup && !showEditGroup && (
        <div className="dashboard-content">
          <div className="dashboard-header">
            {/* Total Groups Card */}
            <div className="stats-card">
              <div className="stats-card-content">
                <div className="card-title">Total Groups</div>
                <div className="card-value">{totalGroups}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>

            {/* Add Group Button */}
            <button 
              className="add-group-btn" 
              onClick={() => {
                setShowAddGroup(true);
                clearMessages();
              }}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              {loading ? "Loading..." : "Add New Group"}
            </button>
          </div>

          {/* Groups Table */}
          <div className="table-container">
            <table className="groups-table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Group Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="loading-cell">
                      <div className="loading-spinner"></div>
                      <span>Loading groups...</span>
                    </td>
                  </tr>
                ) : groups.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-cell">
                      <div className="empty-state">
                        <FontAwesomeIcon icon={faFolderOpen} className="empty-icon" />
                        <p>No groups found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  groups.map((group, index) => (
                    <tr key={group.id || group.groupId}>
                      <td>{index + 1}</td>
                      <td>{group.groupName || "Unnamed Group"}</td>
                      <td className="actions-cell">
                        <button
                          className="edit-btn"
                          onClick={() => initiateEditGroup(group)}
                          disabled={loading}
                          title="Edit Group"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteGroup(group.id || group.groupId)}
                          disabled={loading}
                          title="Delete Group"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
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

      {/* Add Group Form */}
      {showAddGroup && (
        <div className="group-form">
          <h3>Add New Group</h3>
          <div className="form-group">
            <label htmlFor="groupName">Group Name:</label>
            <input
              id="groupName"
              type="text"
              placeholder="Enter unique group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="button-group">
            <button 
              className="submit-btn"
              onClick={handleAddGroup}
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
                  Add Group
                </>
              )}
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowAddGroup(false);
                setNewGroupName("");
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

      {/* Edit Group Form */}
      {showEditGroup && (
        <div className="group-form">
          <h3>Edit Group</h3>
          <div className="form-group">
            <label htmlFor="editGroupName">Group Name:</label>
            <input
              id="editGroupName"
              type="text"
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="button-group">
            <button 
              className="submit-btn"
              onClick={handleEditGroup}
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
                setShowEditGroup(false);
                setEditGroupName("");
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

export default GroupManagement;