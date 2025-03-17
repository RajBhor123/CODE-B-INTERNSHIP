// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { authHeader } from "../services/authService";

// const UserDashboard = () => {
//   const { currentUser } = useContext(AuthContext);
//   const [userProfile, setUserProfile] = useState({
//     fullName: "",
//     email: "",
//     createdAt: "",
//     lastLogin: "",
//     passwordUpdatedAt: "",
//     loginCount: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//   });
//   const [stats, setStats] = useState({
//     daysActive: 0,
//     totalLogins: 0,
//   });
//   const [usingFallbackData, setUsingFallbackData] = useState(false);

//   // Function to fetch user profile directly from the API
//   const getUserProfile = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
//         headers: {
//           ...authHeader(),
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (err) {
//       throw new Error(err.message || "Failed to fetch user profile");
//     }
//   };

//   // Function to update user profile
//   const updateUserProfile = async (updatedData) => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/update`, {
//         method: 'PUT',
//         headers: {
//           ...authHeader(),
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (err) {
//       throw new Error(err.message || "Failed to update user profile");
//     }
//   };

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       setLoading(true);
//       setError("");
//       setUsingFallbackData(false);
      
//       try {
//         // First try to get data from the API
//         const data = await getUserProfile();
        
//         setUserProfile(data);
//         setFormData({
//           fullName: data.fullName || "",
//         });
        
//         // Calculate stats
//         if (data.createdAt) {
//           const createdDate = new Date(data.createdAt);
//           const today = new Date();
//           const diffTime = Math.abs(today - createdDate);
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//           setStats({
//             daysActive: diffDays,
//             totalLogins: data.loginCount || 0,
//           });
//         }
//       } catch (err) {
//         console.error("API Error:", err.message);
        
//         // Fallback to using data from AuthContext if available
//         if (currentUser) {
//           setUsingFallbackData(true);
//           setError("Failed to load user profile");
          
//           const fallbackData = {
//             fullName: currentUser.fullName || "User",
//             email: currentUser.email || "",
//             createdAt: currentUser.createdAt || new Date().toISOString(),
//             lastLogin: currentUser.lastLogin || new Date().toISOString(),
//             loginCount: currentUser.loginCount || 0
//           };
          
//           setUserProfile(fallbackData);
//           setFormData({
//             fullName: fallbackData.fullName,
//           });
          
//           // Calculate stats from fallback data
//           const createdDate = new Date(fallbackData.createdAt);
//           const today = new Date();
//           const diffTime = Math.abs(today - createdDate);
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//           setStats({
//             daysActive: diffDays,
//             totalLogins: fallbackData.loginCount || 0,
//           });
//         } else {
//           setError("Failed to load user profile");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [currentUser]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
    
//     try {
//       const updatedProfile = await updateUserProfile(formData);
//       setUserProfile({
//         ...userProfile,
//         ...updatedProfile,
//       });
//       setSuccess("Profile updated successfully!");
//       setEditMode(false);
//     } catch (err) {
//       setError("Failed to update profile: " + err.message);
//     }
//   };

//   const toggleEditMode = () => {
//     setEditMode(!editMode);
//     setError("");
//     setSuccess("");
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-container fade-in text-center">
//         <div className="loading-spinner">Loading user data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container fade-in">
//       <h1 className="home-title">User Dashboard</h1>
//       <p className="home-subtitle">
//         Welcome back, {userProfile.fullName || "User"}! Manage your account details here.
//       </p>
      
//       {/* {usingFallbackData && error && <div className="alert alert-danger">{error}</div>} */}
//       {success && <div className="alert alert-success">{success}</div>}
      
//       <div className="dashboard-grid">
//         <div className="dashboard-card">
//           <h3>Profile Information</h3>
          
//           {editMode ? (
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label className="form-label" htmlFor="fullName">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="fullName"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <button type="submit" className="btn btn-primary">
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={toggleEditMode}
//                   style={{ marginLeft: '10px' }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <>
//               <div className="dashboard-info">
//                 <div className="info-item">
//                   <div className="info-label">Full Name:</div>
//                   <div className="info-value">{userProfile.fullName || "Not set"}</div>
//                 </div>
//                 <div className="info-item">
//                   <div className="info-label">Email:</div>
//                   <div className="info-value">{userProfile.email || "Not available"}</div>
//                 </div>
//                 <div className="info-item">
//                   <div className="info-label">Member Since:</div>
//                   <div className="info-value">
//                     {userProfile.createdAt 
//                       ? new Date(userProfile.createdAt).toLocaleDateString() 
//                       : 'N/A'}
//                   </div>
//                 </div>
//                 <div className="info-item">
//                   <div className="info-label">Last Login:</div>
//                   <div className="info-value">
//                     {userProfile.lastLogin 
//                       ? new Date(userProfile.lastLogin).toLocaleString() 
//                       : 'N/A'}
//                   </div>
//                 </div>
//               </div>
              
//               <button 
//                 className="btn btn-secondary" 
//                 onClick={toggleEditMode}
//                 style={{ marginTop: '15px' }}
//               >
//                 Edit Profile
//               </button>
//             </>
//           )}
//         </div>
        
//         <div className="dashboard-card">
//           <h3>Account Statistics</h3>
          
//           <div className="dashboard-info">
//             <div className="info-item">
//               <div className="info-label">Days Active:</div>
//               <div className="info-value">{stats.daysActive}</div>
//             </div>
//             <div className="info-item">
//               <div className="info-label">Total Logins:</div>
//               <div className="info-value">{stats.totalLogins}</div>
//             </div>
//             <div className="info-item">
//               <div className="info-label">Account Type:</div>
//               <div className="info-value">
//                 <span className="badge badge-success">
//                   {currentUser?.role === "ADMIN" ? "Administrator" : "Standard User"}
//                 </span>
//               </div>
//             </div>
//             <div className="info-item">
//               <div className="info-label">Status:</div>
//               <div className="info-value">
//                 <span className="badge badge-success">Active</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="dashboard-card">
//           <h3>Security</h3>
          
//           <div className="dashboard-info">
//             <div className="info-item">
//               <div className="info-label">Email:</div>
//               <div className="info-value">
//                 <span className="badge badge-success">Verified</span>
//               </div>
//             </div>
//             <div className="info-item">
//               <div className="info-label">Password:</div>
//               <div className="info-value">
//                 Last changed: {userProfile.passwordUpdatedAt 
//                   ? new Date(userProfile.passwordUpdatedAt).toLocaleDateString() 
//                   : 'N/A'}
//               </div>
//             </div>
//           </div>
          
//           <div style={{ marginTop: '15px' }}>
//             <a href="/forgot-password" className="btn btn-secondary">
//               Change Password
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";

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
      // Fixed API endpoint to match the backend
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
      
      // Fixed API endpoint to match the backend
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
    <div className="dashboard-container">
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="menu-item">Dashboard</div>
          <div className="menu-item active">Manage Groups</div>
          <div className="menu-item">Manage Chain</div>
          <div className="menu-item">Manage Brands</div>
          <div className="menu-item">Manage SubZones</div>
          <div className="menu-item">Manage Estimate</div>
          <div className="menu-item">Manage Invoices</div>
        </div>

        {/* Main Content Area */}
        <div className="content-area">
          {/* Messages */}
          {error && (
            <div className="alert alert-danger">
              {error}
              <button className="close-btn" onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              {success}
              <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
            </div>
          )}

          {!showAddGroup && !showEditGroup && (
            <>
              {/* Total Groups Card */}
              <div className="stats-card">
                <div className="card-title">Total Groups</div>
                <div className="card-value">{totalGroups}</div>
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
                {loading ? "Loading..." : "Add Group"}
              </button>

              {/* Groups Table */}
              <table className="groups-table">
                <thead>
                  <tr>
                    <th>Sr.No</th>
                    <th>Group Name</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="loading-cell">Loading groups...</td>
                    </tr>
                  ) : groups.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-cell">No groups found</td>
                    </tr>
                  ) : (
                    groups.map((group, index) => (
                      <tr key={group.id || group.groupId}>
                        <td>{index + 1}</td>
                        <td>{group.groupName || "Unnamed Group"}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => initiateEditGroup(group)}
                            disabled={loading}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDeleteGroup(group.id || group.groupId)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Add Group Form */}
          {showAddGroup && (
            <div className="group-form">
              <h3>Enter Group Name:</h3>
              <input
                type="text"
                placeholder="Enter Unique Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="form-input"
                disabled={loading}
              />
              <div className="button-group">
                <button 
                  className="submit-btn"
                  onClick={handleAddGroup}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Group"}
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
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Group Form */}
          {showEditGroup && (
            <div className="group-form">
              <h3>Edit Group Name:</h3>
              <input
                type="text"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                className="form-input"
                disabled={loading}
              />
              <div className="button-group">
                <button 
                  className="submit-btn"
                  onClick={handleEditGroup}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
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
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          font-family: Arial, sans-serif;
          width: 100%;
        }

        .main-content {
          display: flex;
        }

        .sidebar {
          width: 200px;
          padding: 1rem 0;
          background-color: #f8f8f8;
        }

        .menu-item {
          padding: 0.7rem 1rem;
          color: #0066cc;
          cursor: pointer;
        }

        .menu-item.active {
          font-weight: bold;
          background-color: #f0f0f0;
        }

        .content-area {
          flex: 1;
          padding: 1rem;
        }

        .stats-card {
          background-color: #dc3545;
          color: white;
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1rem;
          width: 150px;
          text-align: center;
        }

        .card-title {
          font-weight: bold;
        }

        .card-value {
          font-size: 2rem;
          margin-top: 0.5rem;
        }

        .add-group-btn {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .add-group-btn:disabled {
          background-color: #94d3a2;
          cursor: not-allowed;
        }

        .groups-table {
          width: 100%;
          border-collapse: collapse;
        }

        .groups-table th, .groups-table td {
          padding: 0.7rem;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .loading-cell, .empty-cell {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .edit-btn {
          background-color: #ffc107;
          color: black;
          border: none;
          padding: 0.3rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .edit-btn:disabled {
          background-color: #ffe7a0;
          cursor: not-allowed;
        }

        .delete-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 0.3rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .delete-btn:disabled {
          background-color: #f1aeb5;
          cursor: not-allowed;
        }

        .group-form {
          max-width: 500px;
          padding: 1.5rem;
          background-color: #f8f8f8;
          border-radius: 5px;
        }

        .form-input {
          width: 100%;
          padding: 0.7rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .form-input:disabled {
          background-color: #f9f9f9;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .submit-btn {
          background-color: #0d6efd;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .submit-btn:disabled {
          background-color: #9ec5fe;
          cursor: not-allowed;
        }

        .cancel-btn {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .cancel-btn:disabled {
          background-color: #ced4da;
          cursor: not-allowed;
        }

        .alert {
          padding: 0.75rem 1.25rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          position: relative;
        }

        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        .alert-success {
          color: #155724;
          background-color: #d4edda;
          border-color: #c3e6cb;
        }

        .close-btn {
          position: absolute;
          right: 10px;
          top: 10px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
          padding: 0;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default GroupManagement;