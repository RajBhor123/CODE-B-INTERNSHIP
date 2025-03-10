// // // UserDashboard.js - Updated to use real user data
// // import React, { useState, useEffect, useContext } from "react";
// // import { authHeader, API_URL } from "../services/authService";
// // import { AuthContext } from "../context/AuthContext";

// // const UserDashboard = () => {
// //   const [userData, setUserData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const { currentUser } = useContext(AuthContext);

// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         // Try to fetch from API
// //         const response = await fetch(`${API_URL}/user/profile`, {
// //           headers: {
// //             ...authHeader(),
// //             "Content-Type": "application/json",
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error("Failed to fetch user data");
// //         }

// //         const data = await response.json();
// //         setUserData(data);
// //       } catch (err) {
// //         setError(err.message);
// //         // Use data from auth context as fallback
// //         if (currentUser) {
// //           setUserData({
// //             email: currentUser.email,
// //             role: currentUser.role,
// //             fullName: "User"  // We don't have this in the context
// //           });
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUserData();
// //   }, [currentUser]);

// //   if (loading) {
// //     return <div className="text-center mt-10">Loading...</div>;
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
// //       <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
// //       {error && (
// //         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
// //           {error} (Using available user data)
// //         </div>
// //       )}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div className="p-4 border rounded-lg">
// //           <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
// //           <p>
// //             <strong>Email:</strong> {userData?.email}
// //           </p>
// //           <p>
// //             <strong>Role:</strong> {userData?.role?.replace("ROLE_", "")}
// //           </p>
// //           {userData?.fullName && (
// //             <p>
// //               <strong>Name:</strong> {userData.fullName}
// //             </p>
// //           )}
// //         </div>
// //         <div className="p-4 border rounded-lg">
// //           <h3 className="text-lg font-semibold mb-2">Account Status</h3>
// //           <p>
// //             <strong>Status:</strong> Active
// //           </p>
// //           <p>
// //             <strong>Account Type:</strong> {userData?.role?.includes("ADMIN") ? "Administrator" : "Regular User"}
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserDashboard;
// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { getUserProfile, updateUserProfile } from "../services/userService";

// const UserDashboard = () => {
//   const { currentUser } = useContext(AuthContext);
//   const [userProfile, setUserProfile] = useState({
//     fullName: "",
//     email: "",
//     createdAt: "",
//     lastLogin: "",
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

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await getUserProfile();
//         setUserProfile(data);
//         setFormData({
//           fullName: data.fullName,
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
//         setError("Failed to load user profile: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

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
//       await updateUserProfile(formData);
//       setUserProfile({
//         ...userProfile,
//         ...formData,
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
//         Welcome back, {userProfile.fullName}! Manage your account details here.
//       </p>
      
//       {error && <div className="alert alert-danger">{error}</div>}
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
//                   <div className="info-value">{userProfile.fullName}</div>
//                 </div>
//                 <div className="info-item">
//                   <div className="info-label">Email:</div>
//                   <div className="info-value">{userProfile.email}</div>
//                 </div>
//                 <div className="info-item">
//                   <div className="info-label">Member Since:</div>
//                   <div className="info-value">
//                     {new Date(userProfile.createdAt).toLocaleDateString()}
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
import { authHeader, API_URL } from "../services/authService";

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
      const response = await fetch(`${API_URL}/user/profile`, {
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
      const response = await fetch(`${API_URL}/user/profile/update`, {
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