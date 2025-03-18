import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTachometerAlt, 
  faUsers, 
  faLink, 
  faCopyright, 
  faMapMarkerAlt, 
  faCalculator, 
  faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/dashboard", icon: faTachometerAlt, label: "Dashboard" },
    { path: "/dashboard/groups", icon: faUsers, label: "Manage Groups" },
    { path: "/dashboard/chain", icon: faLink, label: "Manage Chain" },
    { path: "/dashboard/brands", icon: faCopyright, label: "Manage Brands" },
    { path: "/dashboard/subzones", icon: faMapMarkerAlt, label: "Manage SubZones" },
    { path: "/dashboard/estimate", icon: faCalculator, label: "Manage Estimate" },
    { path: "/dashboard/invoices", icon: faFileInvoice, label: "Manage Invoices" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>User Panel</h3>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link 
            to={item.path} 
            key={index} 
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={item.icon} className="menu-icon" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;