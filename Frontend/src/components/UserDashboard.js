
// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { authHeader, API_URL } from "../services/authService";

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
//       const response = await fetch(`${API_URL}/user/profile`, {
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
//       const response = await fetch(`${API_URL}/user/profile/update`, {
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
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { authHeader } from "../services/authService";

const UserDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    createdAt: "",
    lastLogin: "",
    passwordUpdatedAt: "",
    loginCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
  });
  const [stats, setStats] = useState({
    daysActive: 0,
    totalLogins: 0,
  });
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Function to fetch user profile directly from the API
  const getUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err.message || "Failed to fetch user profile");
    }
  };

  // Function to update user profile
  const updateUserProfile = async (updatedData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/update`, {
        method: 'PUT',
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message || "Failed to update user profile");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      setUsingFallbackData(false);
      
      try {
        // First try to get data from the API
        const data = await getUserProfile();
        
        setUserProfile(data);
        setFormData({
          fullName: data.fullName || "",
        });
        
        // Calculate stats
        if (data.createdAt) {
          const createdDate = new Date(data.createdAt);
          const today = new Date();
          const diffTime = Math.abs(today - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setStats({
            daysActive: diffDays,
            totalLogins: data.loginCount || 0,
          });
        }
      } catch (err) {
        console.error("API Error:", err.message);
        
        // Fallback to using data from AuthContext if available
        if (currentUser) {
          setUsingFallbackData(true);
          setError("Failed to load user profile");
          
          const fallbackData = {
            fullName: currentUser.fullName || "User",
            email: currentUser.email || "",
            createdAt: currentUser.createdAt || new Date().toISOString(),
            lastLogin: currentUser.lastLogin || new Date().toISOString(),
            loginCount: currentUser.loginCount || 0
          };
          
          setUserProfile(fallbackData);
          setFormData({
            fullName: fallbackData.fullName,
          });
          
          // Calculate stats from fallback data
          const createdDate = new Date(fallbackData.createdAt);
          const today = new Date();
          const diffTime = Math.abs(today - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setStats({
            daysActive: diffDays,
            totalLogins: fallbackData.loginCount || 0,
          });
        } else {
          setError("Failed to load user profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const updatedProfile = await updateUserProfile(formData);
      setUserProfile({
        ...userProfile,
        ...updatedProfile,
      });
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="dashboard-container fade-in text-center">
        <div className="loading-spinner">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <h1 className="home-title">User Dashboard</h1>
      <p className="home-subtitle">
        Welcome back, {userProfile.fullName || "User"}! Manage your account details here.
      </p>
      
      {/* {usingFallbackData && error && <div className="alert alert-danger">{error}</div>} */}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Profile Information</h3>
          
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleEditMode}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="dashboard-info">
                <div className="info-item">
                  <div className="info-label">Full Name:</div>
                  <div className="info-value">{userProfile.fullName || "Not set"}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email:</div>
                  <div className="info-value">{userProfile.email || "Not available"}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Member Since:</div>
                  <div className="info-value">
                    {userProfile.createdAt 
                      ? new Date(userProfile.createdAt).toLocaleDateString() 
                      : 'N/A'}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Last Login:</div>
                  <div className="info-value">
                    {userProfile.lastLogin 
                      ? new Date(userProfile.lastLogin).toLocaleString() 
                      : 'N/A'}
                  </div>
                </div>
              </div>
              
              <button 
                className="btn btn-secondary" 
                onClick={toggleEditMode}
                style={{ marginTop: '15px' }}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
        
        <div className="dashboard-card">
          <h3>Account Statistics</h3>
          
          <div className="dashboard-info">
            <div className="info-item">
              <div className="info-label">Days Active:</div>
              <div className="info-value">{stats.daysActive}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Total Logins:</div>
              <div className="info-value">{stats.totalLogins}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Account Type:</div>
              <div className="info-value">
                <span className="badge badge-success">
                  {currentUser?.role === "ADMIN" ? "Administrator" : "Standard User"}
                </span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Status:</div>
              <div className="info-value">
                <span className="badge badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Security</h3>
          
          <div className="dashboard-info">
            <div className="info-item">
              <div className="info-label">Email:</div>
              <div className="info-value">
                <span className="badge badge-success">Verified</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Password:</div>
              <div className="info-value">
                Last changed: {userProfile.passwordUpdatedAt 
                  ? new Date(userProfile.passwordUpdatedAt).toLocaleDateString() 
                  : 'N/A'}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <a href="/forgot-password" className="btn btn-secondary">
              Change Password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;