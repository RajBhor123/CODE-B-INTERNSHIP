// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { login } from "../services/authService";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { setCurrentUser } = useContext(AuthContext);

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

//     try {
//       const data = await login(formData);
//       setCurrentUser({
//         token: data.token,
//         role: data.role,
//         email: data.email,
//       });

//       if (data.role === "ADMIN" || data.role === "ROLE_ADMIN") {
//         navigate("/admin");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2" htmlFor="email">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             id="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             id="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
//         >
//           {loading ? "Loading..." : "Login"}
//         </button>

//         <div className="text-center">
//           <Link
//             to="/forgot-password"
//             className="text-blue-500 hover:text-blue-700"
//           >
//             Forgot Password?
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

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

    try {
      const data = await login(formData);
      setCurrentUser({
        token: data.token,
        role: data.role,
        email: data.email,
      });

      // Redirect based on role
      if (data.role === "ADMIN" || data.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to access your account</p>
        </div>
        
        <div className="auth-body">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="form-group">
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
