// import React from "react";

// const Home = () => {
//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h1 className="text-4xl font-bold mb-6 text-center">
//         Welcome to Auth Demo
//       </h1>
//       <p className="text-lg mb-6 text-center">
//         This is a demo application showcasing authentication with Spring Boot
//         and React.
//       </p>
//     </div>
//   );
// };

// export default Home;
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container fade-in">
      <h1 className="home-title">Welcome to Auth Demo</h1>
      <p className="home-subtitle">
        A secure authentication system showcasing the integration between Spring Boot and React,
        featuring role-based authorization, email verification, and password reset functionality.
      </p>
      
      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Secure Authentication</h3>
          <p className="feature-text">
            Industry-standard JWT-based authentication system with secure password storage and protection against common vulnerabilities.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3 className="feature-title">Role-Based Access</h3>
          <p className="feature-text">
            Different access levels for users and administrators, ensuring proper authorization and data protection.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">✉️</div>
          <h3 className="feature-title">Email Verification</h3>
          <p className="feature-text">
            Enhanced security with email verification process to confirm user identity and prevent fraud.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link to="/register" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
