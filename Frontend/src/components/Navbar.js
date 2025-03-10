// // Navbar.js - Updated to show links based on user role
// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const Navbar = () => {
//   const { currentUser, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // Function to check if user has admin role
//   const isAdmin = () => {
//     if (!currentUser || !currentUser.role) return false;
//     return currentUser.role.includes("ADMIN");
//   };

//   return (
//     <nav className="bg-gray-800 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/home" className="text-xl font-bold">
//           Auth Demo
//         </Link>
//         <div className="flex space-x-4">
//           {currentUser ? (
//             <>
//               <Link to="/dashboard" className="hover:text-gray-300">
//                 Dashboard
//               </Link>
//               {isAdmin() && (
//                 <Link to="/admin" className="hover:text-gray-300">
//                   Admin
//                 </Link>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="hover:text-gray-300"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-gray-300">
//                 Login
//               </Link>
//               <Link to="/register" className="hover:text-gray-300">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Function to check if user has admin role
  const isAdmin = () => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.includes("ADMIN");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/home" className="navbar-brand">
          Auth Demo
        </Link>
        <div className="navbar-links">
          {currentUser ? (
            <>
              {/* <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link> */}
              {isAdmin() && (
                <Link to="/admin" className="navbar-link">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="navbar-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
