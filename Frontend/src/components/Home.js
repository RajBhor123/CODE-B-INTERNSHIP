import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Users, FileText, Clock, ShieldCheck, CreditCard, UserCircle, ShieldAlert } from "lucide-react";

const Home = () => {
  return (
    <div className="home-container fade-in p-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="home-title text-4xl font-bold mb-4">Welcome to MIS & Invoicing System</h1>
        <p className="home-subtitle text-lg text-gray-600 max-w-3xl mx-auto">
          A comprehensive platform for managing client data, sales activities, and invoicing processes. 
          Streamline your workflow with our secure, role-based system designed for business efficiency.
        </p>
      </div>
      
      {/* Auth Sections */}
      <div className="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* User Section */}
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <UserCircle size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">User Access</h3>
          <p className="feature-text text-gray-600 mb-4">
            For sales team members and regular users. Access client management, invoicing, and payment tracking features based on your assigned role.
          </p>
          <div className="flex justify-center space-x-6">
            <Link 
              to="/login" 
              className="btn btn-primary px-8 py-3 rounded-md font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn btn-secondary px-8 py-3 rounded-md font-medium"
            >
              Register
            </Link>
          </div>
        </div>
        
        {/* Admin Section */}
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <ShieldAlert size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">Admin Portal</h3>
          <p className="feature-text text-gray-600 mb-4">
            For administrators and system managers. Complete system control with user management, advanced reporting, and configuration options.
          </p>
          <div className="flex justify-center space-x-6">
            <Link 
              to="/login" 
              className="btn btn-primary px-8 py-3 rounded-md font-medium"
            >
              Admin Login
            </Link>
            <Link 
              to="/register" 
              className="btn btn-secondary px-8 py-3 rounded-md font-medium"
            >
              Admin Register
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <ShieldCheck size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">Secure Authentication</h3>
          <p className="feature-text text-gray-600">
            Role-based access control with email verification ensures only authorized personnel can access sensitive data. Admin and Sales team roles with appropriate permissions.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <FileText size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">Invoice Management</h3>
          <p className="feature-text text-gray-600">
            Create, monitor, and update estimates and invoices linked to specific Chain IDs. GST-compliant invoicing with automated generation upon payment completion.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <CreditCard size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">Payment Tracking</h3>
          <p className="feature-text text-gray-600">
            Integrated payment monitoring with invoices, ensuring complete financial oversight. Track outstanding payments and view payment history at a glance.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <Users size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">Client Management</h3>
          <p className="feature-text text-gray-600">
            Centralized client database with detailed profiles and interaction history. Access critical client information instantly when needed.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <BarChart3 size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">Comprehensive Dashboard</h3>
          <p className="feature-text text-gray-600">
            Get key insights at a glance with our intuitive dashboard displaying important metrics, recent activities, and pending actions.
          </p>
        </div>
        
        <div className="feature-card bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="feature-icon text-blue-600 mb-4 flex justify-center">
            <Clock size={48} />
          </div>
          <h3 className="feature-title text-xl font-semibold mb-2 text-center">Automated Workflows</h3>
          <p className="feature-text text-gray-600">
            Save time with automated invoice generation, email notifications, and streamlined approval processes designed for maximum efficiency.
          </p>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>© 2025 MIS & Invoicing System. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;