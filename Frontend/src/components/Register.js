// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { register } from "../services/authService";

// // // const Register = () => {
// // //   const [formData, setFormData] = useState({
// // //     fullName: "",
// // //     email: "",
// // //     passwordHash: "",
// // //     confirmPassword: "",
// // //     role: "USER"
// // //   });
// // //   const [error, setError] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [verificationMessage, setVerificationMessage] = useState("");
// // //   const navigate = useNavigate();

// // //   const handleChange = (e) => {
// // //     setFormData({
// // //       ...formData,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError("");
// // //     setVerificationMessage("");

// // //     if (formData.passwordHash !== formData.confirmPassword) {
// // //       setError("Passwords do not match");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     const { confirmPassword, ...registrationData } = formData;

// // //     try {
// // //       await register(registrationData);
// // //       setVerificationMessage(
// // //         "Registration successful. Please check your email to verify your account."
// // //       );
// // //     } catch (err) {
// // //       setError("Registration failed: " + err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
// // //       <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
// // //       {error && (
// // //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
// // //           {error}
// // //         </div>
// // //       )}
// // //       {verificationMessage && (
// // //         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
// // //           {verificationMessage}
// // //         </div>
// // //       )}
// // //       {!verificationMessage && (
// // //         <form onSubmit={handleSubmit}>
// // //           <div className="mb-4">
// // //             <label className="block text-gray-700 mb-2" htmlFor="fullName">
// // //               Full Name
// // //             </label>
// // //             <input
// // //               type="text"
// // //               name="fullName"
// // //               id="fullName"
// // //               value={formData.fullName}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
// // //             />
// // //           </div>
// // //           <div className="mb-4">
// // //             <label className="block text-gray-700 mb-2" htmlFor="email">
// // //               Email
// // //             </label>
// // //             <input
// // //               type="email"
// // //               name="email"
// // //               id="email"
// // //               value={formData.email}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
// // //             />
// // //           </div>
// // //           <div className="mb-4">
// // //             <label className="block text-gray-700 mb-2" htmlFor="passwordHash">
// // //               Password
// // //             </label>
// // //             <input
// // //               type="password"
// // //               name="passwordHash"
// // //               id="passwordHash"
// // //               value={formData.passwordHash}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
// // //             />
// // //           </div>
// // //           <div className="mb-6">
// // //             <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
// // //               Confirm Password
// // //             </label>
// // //             <input
// // //               type="password"
// // //               name="confirmPassword"
// // //               id="confirmPassword"
// // //               value={formData.confirmPassword}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
// // //             />
// // //           </div>
// // //           <div className="mb-6">
// // //             <label className="block text-gray-700 mb-2" htmlFor="role">
// // //               Role
// // //             </label>
// // //             <select
// // //               id="role"
// // //               name="role"
// // //               value={formData.role}
// // //               onChange={handleChange}
// // //               required
// // //               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
// // //             >
// // //               <option value="USER">User</option>
// // //               <option value="ADMIN">Admin</option>
// // //             </select>
// // //           </div>
// // //           <button
// // //             type="submit"
// // //             disabled={loading}
// // //             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// // //           >
// // //             {loading ? "Loading..." : "Register"}
// // //           </button>
// // //         </form>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Register;
// // import React, { useState } from "react";
// // import { Link } from "react-router-dom";
// // import { register } from "../services/authService";

// // const Register = () => {
// //   const [formData, setFormData] = useState({
// //     fullName: "",
// //     email: "",
// //     passwordHash: "",
// //     confirmPassword: "",
// //     role: "USER" // Default role
// //   });
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [verificationMessage, setVerificationMessage] = useState("");

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     setVerificationMessage("");

// //     // Validate passwords match
// //     if (formData.passwordHash !== formData.confirmPassword) {
// //       setError("Passwords do not match");
// //       setLoading(false);
// //       return;
// //     }

// //     // Create registration object (excluding confirmPassword)
// //     const { confirmPassword, ...registrationData } = formData;

// //     try {
// //       await register(registrationData);
// //       // Show verification message instead of immediately navigating
// //       setVerificationMessage(
// //         "Registration successful! Please check your email to verify your account."
// //       );
// //     } catch (err) {
// //       setError("Registration failed: " + err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="auth-container fade-in">
// //       <div className="auth-card">
// //         <div className="auth-header">
// //           <h2 className="auth-title">Create Account</h2>
// //           <p className="auth-subtitle">Join our secure platform</p>
// //         </div>
        
// //         <div className="auth-body">
// //           {error && (
// //             <div className="alert alert-danger">
// //               {error}
// //             </div>
// //           )}
          
// //           {verificationMessage ? (
// //             <div className="alert alert-success">
// //               {verificationMessage}
// //             </div>
// //           ) : (
// //             <form onSubmit={handleSubmit}>
// //               <div className="form-group">
// //                 <label className="form-label" htmlFor="fullName">
// //                   Full Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="fullName"
// //                   name="fullName"
// //                   value={formData.fullName}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   placeholder="Enter your full name"
// //                   required
// //                 />
// //               </div>
              
// //               <div className="form-group">
// //                 <label className="form-label" htmlFor="email">
// //                   Email Address
// //                 </label>
// //                 <input
// //                   type="email"
// //                   id="email"
// //                   name="email"
// //                   value={formData.email}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   placeholder="Enter your email"
// //                   required
// //                 />
// //               </div>
              
// //               <div className="form-group">
// //                 <label className="form-label" htmlFor="passwordHash">
// //                   Password
// //                 </label>
// //                 <input
// //                   type="password"
// //                   id="passwordHash"
// //                   name="passwordHash"
// //                   value={formData.passwordHash}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   placeholder="Create a password"
// //                   required
// //                 />
// //               </div>
              
// //               <div className="form-group">
// //                 <label className="form-label" htmlFor="confirmPassword">
// //                   Confirm Password
// //                 </label>
// //                 <input
// //                   type="password"
// //                   id="confirmPassword"
// //                   name="confirmPassword"
// //                   value={formData.confirmPassword}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   placeholder="Confirm your password"
// //                   required
// //                 />
// //               </div>
              
// //               {/* <div className="form-group">
// //                 <div className="password-requirements">
// //                   <p className="requirement-title">Password must contain:</p>
// //                   <ul className="requirement-list">
// //                     <li>At least 8 characters</li>
// //                     <li>At least one uppercase letter</li>
// //                     <li>At least one number</li>
// //                     <li>At least one special character</li>
// //                   </ul>
// //                 </div>
// //               </div> */}
              
// //               <button
// //                 type="submit"
// //                 className="btn btn-primary btn-block"
// //                 disabled={loading}
// //               >
// //                 {loading ? "Creating Account..." : "Create Account"}
// //               </button>
// //             </form>
// //           )}
// //         </div>
        
// //         <div className="auth-footer">
// //           Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Register;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { register } from "../services/authService";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     passwordHash: "",
//     confirmPassword: "",
//     role: "USER"
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [verificationMessage, setVerificationMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setVerificationMessage("");

//     if (formData.passwordHash !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     const { confirmPassword, ...registrationData } = formData;

//     try {
//       await register(registrationData);
//       setVerificationMessage(
//         "Registration successful. Please check your email to verify your account."
//       );
//     } catch (err) {
//       setError("Registration failed: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container fade-in max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <div className="auth-header">
//         <h2 className="text-2xl font-bold mb-2 text-center auth-title">Create Account</h2>
//         <p className="auth-subtitle text-gray-600 text-center mb-6">Join our secure platform</p>
//       </div>
      
//       {error && (
//         <div className="alert alert-danger bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {verificationMessage && (
//         <div className="alert alert-success bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {verificationMessage}
//         </div>
//       )}
      
//       {!verificationMessage && (
//         <form onSubmit={handleSubmit} className="auth-body">
//           <div className="form-group mb-4">
//             <label className="block text-gray-700 mb-2 form-label" htmlFor="fullName">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="fullName"
//               id="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               required
//               className="form-control w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//             />
//           </div>
          
//           <div className="form-group mb-4">
//             <label className="block text-gray-700 mb-2 form-label" htmlFor="email">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//               className="form-control w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//             />
//           </div>
          
//           <div className="form-group mb-4">
//             <label className="block text-gray-700 mb-2 form-label" htmlFor="passwordHash">
//               Password
//             </label>
//             <input
//               type="password"
//               name="passwordHash"
//               id="passwordHash"
//               value={formData.passwordHash}
//               onChange={handleChange}
//               placeholder="Create a password"
//               required
//               className="form-control w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//             />
//           </div>
          
//           <div className="form-group mb-6">
//             <label className="block text-gray-700 mb-2 form-label" htmlFor="confirmPassword">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               name="confirmPassword"
//               id="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm your password"
//               required
//               className="form-control w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//             />
//           </div>
          
//           <div className="form-group mb-6">
//             <label className="block text-gray-700 mb-2 form-label" htmlFor="role">
//               Role
//             </label>
//             <select
//               id="role"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               required
//               className="form-control w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//             >
//               <option value="USER">User</option>
//               <option value="ADMIN">Admin</option>
//             </select>
//           </div>
          
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn btn-primary btn-block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>
//         </form>
//       )}
      
//       <div className="auth-footer text-center mt-6 text-gray-600">
//         Already have an account? <a href="/login" className="auth-link text-blue-500 hover:text-blue-700">Sign In</a>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    role: "USER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationMessage("");

    if (formData.passwordHash !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registrationData } = formData;

    try {
      await register(registrationData);
      setVerificationMessage(
        "Registration successful. Please check your email to verify your account."
      );
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join our secure platform</p>
        </div>
        
        <div className="auth-body">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          {verificationMessage && (
            <div className="alert alert-success">
              {verificationMessage}
            </div>
          )}
          
          {!verificationMessage && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="passwordHash">
                  Password
                </label>
                <input
                  type="password"
                  name="passwordHash"
                  id="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="form-control form-select"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;