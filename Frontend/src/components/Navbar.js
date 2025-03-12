
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
        <Link to="/home" className="navbar-brand"><img
            src="/logo.jpg"
            alt="MIS Logo"
            className="navbar-logo"
          />
        MIS
        </Link>
        <div className="navbar-links">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
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
