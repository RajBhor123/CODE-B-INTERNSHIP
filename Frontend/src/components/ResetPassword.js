// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { resetPassword } from "../services/authService";

// const ResetPassword = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const token = new URLSearchParams(location.search).get("token");

//     try {
//       await resetPassword(token, newPassword);
//       setMessage("Password reset successfully. Redirecting to login...");
//       setTimeout(() => navigate("/login"), 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
//       {message && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {message}
//         </div>
//       )}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2" htmlFor="newPassword">
//             New Password
//           </label>
//           <input
//             type="password"
//             name="newPassword"
//             id="newPassword"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//         >
//           {loading ? "Loading..." : "Reset Password"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    
    if (!tokenParam) {
      setStatus("error");
      setMessage("Invalid reset link. Please request a new password reset.");
    } else {
      setToken(tokenParam);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setMessage("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, formData.password);
      setStatus("success");
      setMessage(
        "Password has been reset successfully! You will be redirected to the login page."
      );
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">Create a new password for your account</p>
        </div>
        
        <div className="auth-body">
          {status === "success" ? (
            <div className="alert alert-success">
              {message}
              <div className="mt-4">
                <div className="redirect-message">Redirecting to login page...</div>
              </div>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="alert alert-danger">
                  {message}
                </div>
              )}
              
              {!token ? (
                <div className="text-center">
                  <button 
                    onClick={() => navigate("/forgot-password")} 
                    className="btn btn-primary mt-4"
                  >
                    Request New Reset Link
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  
                  {/* <div className="form-group">
                    <div className="password-requirements">
                      <p className="requirement-title">Password must contain:</p>
                      <ul className="requirement-list">
                        <li>At least 8 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>
                  </div> */}
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                  >
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
        
        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;