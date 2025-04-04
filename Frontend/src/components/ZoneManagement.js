import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faExclamationCircle,
  faCheckCircle,
  faPlusCircle,
  faEdit,
  faTrashAlt,
  faSave,
  faTimes,
  faSyncAlt,
  faFolderOpen,
  faMapMarkerAlt,
  faFilter,
  faBuilding,
  faTags,
  faLayerGroup,
  faUsers,
  faLink
} from "@fortawesome/free-solid-svg-icons";

const ZoneManagement = () => {
  const [zones, setZones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  
  const [newZoneName, setNewZoneName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [editZoneId, setEditZoneId] = useState(null);
  const [editZoneName, setEditZoneName] = useState("");
  const [editBrandId, setEditBrandId] = useState("");
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalZones, setTotalZones] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalChains, setTotalChains] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showEditZone, setShowEditZone] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filterBrandId, setFilterBrandId] = useState("");
  const [filterChainId, setFilterChainId] = useState("");
  const [filterGroupId, setFilterGroupId] = useState("");
  const [filteredZones, setFilteredZones] = useState([]);

  useEffect(() => {
    fetchZones();
    fetchBrands();
    fetchChains();
    fetchGroups();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [zones, filterBrandId, filterChainId, filterGroupId]);

  // Fetch All Zones
  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/zones");
      setZones(response.data);
      setFilteredZones(response.data);
      setTotalZones(response.data.length);
      console.log("Fetched zones:", response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching zones:", err);
      setError("Failed to load zones. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Brands for dropdown
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/brands");
      setBrands(response.data);
      setTotalBrands(response.data.length);
      console.log("Fetched brands:", response.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  // Fetch All Chains for filter
  const fetchChains = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/chains");
      setChains(response.data);
      setTotalChains(response.data.length);
      console.log("Fetched chains:", response.data);
    } catch (err) {
      console.error("Error fetching chains:", err);
    }
  };

  // Fetch All Groups for filter
  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/groups");
      setGroups(response.data);
      setTotalGroups(response.data.length);
      console.log("Fetched groups:", response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // Apply Filters
  const applyFilters = () => {
    let result = [...zones];
    
    if (filterBrandId) {
      result = result.filter(zone => zone.brand.brandId.toString() === filterBrandId);
    }
    
    if (filterChainId) {
      result = result.filter(zone => zone.brand.chain.chainId.toString() === filterChainId);
    }
    
    if (filterGroupId) {
      result = result.filter(zone => zone.brand.chain.group.groupId.toString() === filterGroupId);
    }
    
    setFilteredZones(result);
    setTotalZones(result.length);
  };

  // Reset Filters
  const resetFilters = () => {
    setFilterBrandId("");
    setFilterChainId("");
    setFilterGroupId("");
    setFilteredZones(zones);
    setTotalZones(zones.length);
  };

  // Add a New Zone
  const handleAddZone = async () => {
    if (!newZoneName.trim()) {
      setError("Zone name cannot be empty.");
      return;
    }

    if (!selectedBrandId) {
      setError("Please select a brand.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/api/zones", {
        zoneName: newZoneName
      }, {
        params: {
          brandId: selectedBrandId
        }
      });

      setZones([...zones, response.data]);
      setFilteredZones([...filteredZones, response.data]);
      setNewZoneName("");
      setSelectedBrandId("");
      setError(null);
      setSuccess("Zone added successfully!");
      setShowAddZone(false);
      fetchZones(); // Refresh the list to get accurate count
    } catch (error) {
      console.error("Error adding zone:", error);
      setError(error.response?.data?.error || "Failed to add zone.");
    } finally {
      setLoading(false);
    }
  };
  
  // Edit an Existing Zone
  const handleEditZone = async () => {
    if (!editZoneName.trim()) {
      setError("Zone name cannot be empty");
      return;
    }
    
    if (!editBrandId) {
      setError("Please select a brand");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:8080/api/zones/${editZoneId}`, {
        zoneName: editZoneName
      }, {
        params: {
          brandId: editBrandId
        }
      });
      
      console.log("Update response:", response.data);
      setEditZoneId(null);
      setEditZoneName("");
      setEditBrandId("");
      setError(null);
      setSuccess("Zone updated successfully!");
      setShowEditZone(false);
      fetchZones(); // Refresh list
    } catch (err) {
      console.error("Error updating zone:", err);
      setError(err.response?.data?.error || "Error updating zone");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Zone
  const handleDeleteZone = async (zoneId) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
  
    try {
      setLoading(true);
      console.log("Attempting to delete zone with ID:", zoneId);
      
      const response = await axios.delete(`http://localhost:8080/api/zones/${zoneId}`);
      
      console.log("Delete response:", response.data);
      setSuccess("Zone deleted successfully!");
      fetchZones(); // Refresh list
    } catch (err) {
      console.error("Error deleting zone:", err);
      
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You don't have authorization to delete this zone.");
      } else {
        setError(err.response?.data?.error || "Error deleting zone");
      }
    } finally {
      setLoading(false);
    }
  };

  const initiateEditZone = (zone) => {
    setEditZoneId(zone.zoneId);
    setEditZoneName(zone.zoneName);
    setEditBrandId(zone.brand.brandId.toString());
    setShowEditZone(true);
    setShowAddZone(false);
    setError(null);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };
  
  return (
    <>
      <div className="page-header">
        <h1>Zone Management</h1>
        <p>Create, edit, and manage your zones</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-danger">
          <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
          {error}
          <button className="close-btn" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <FontAwesomeIcon icon={faCheckCircle} className="alert-icon" />
          <span className="alert-message">{success}</span>
          <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      {!showAddZone && !showEditZone && (
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-container">
            {/* Total Groups Card */}
            <div className="stats-card">
              <div className="stats-card-content">
                <div className="card-title">Total Groups</div>
                <div className="card-value">{totalGroups}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>

            {/* Total Chains Card */}
            <div className="stats-card">
              <div className="stats-card-content">
                <div className="card-title">Total Chains</div>
                <div className="card-value">{totalChains}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faLink} />
              </div>
            </div>

            {/* Total Brands Card */}
            <div className="stats-card">
              <div className="stats-card-content">
                <div className="card-title">Total Brands</div>
                <div className="card-value">{totalBrands}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faTags} />
              </div>
            </div>

            {/* Total Zones Card */}
            <div className="stats-card">
              <div className="stats-card-content">
                <div className="card-title">Total Zones</div>
                <div className="card-value">{totalZones}</div>
              </div>
              <div className="stats-card-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
            </div>
          </div>

         

          {/* Filters */}
          <div className="filters-container">
            <div className="filter-header">
              <FontAwesomeIcon icon={faFilter} className="filter-icon" />
              <span>Filters</span>
            </div>
            <div className="filter-options">
              <div className="filter-item">
                <label htmlFor="filterGroup">Group:</label>
                <select
                  id="filterGroup"
                  value={filterGroupId}
                  onChange={(e) => setFilterGroupId(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Groups</option>
                  {groups.map(group => (
                    <option key={group.groupId} value={group.groupId}>{group.groupName}</option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <label htmlFor="filterChain">Company:</label>
                <select
                  id="filterChain"
                  value={filterChainId}
                  onChange={(e) => setFilterChainId(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Companies</option>
                  {chains.map(chain => (
                    <option key={chain.chainId} value={chain.chainId}>{chain.companyName}</option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <label htmlFor="filterBrand">Brand:</label>
                <select
                  id="filterBrand"
                  value={filterBrandId}
                  onChange={(e) => setFilterBrandId(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
                  ))}
                </select>
              </div>
              <button className="reset-filter-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>
        
           {/* Add Zone Button */}
           <button 
            className="add-group-btn" 
            onClick={() => {
              setShowAddZone(true);
              clearMessages();
            }}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            {loading ? "Loading..." : "Add New Zone"}
          </button>
          
          {/* Zones Table */}
          <div className="table-container">
            <table className="zone-table">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Zone Name</th>
                  <th>Brand</th>
                  <th>Company</th>
                  <th>Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-cell">
                      <div className="loading-spinner"></div>
                      <span>Loading zones...</span>
                    </td>
                  </tr>
                ) : filteredZones.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      <div className="empty-state">
                        <FontAwesomeIcon icon={faFolderOpen} className="empty-icon" />
                        <p>No zones found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredZones.map((zone, index) => (
                    <tr key={zone.zoneId}>
                      <td>{index + 1}</td>
                      <td>{zone.zoneName}</td>
                      <td>{zone.brand.brandName}</td>
                      <td>{zone.brand.chain.companyName}</td>
                      <td>{zone.brand.chain.group.groupName}</td>
                      <td className="actions-cell">
                        <button
                          className="edit-btn"
                          onClick={() => initiateEditZone(zone)}
                          disabled={loading}
                          title="Edit Zone"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteZone(zone.zoneId)}
                          disabled={loading}
                          title="Delete Zone"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Zone Form */}
      {showAddZone && (
        <div className="group-form">
          <h3>Add New Zone</h3>
          <div className="form-group">
            <label htmlFor="zoneName">Zone Name:</label>
            <input
              id="zoneName"
              type="text"
              placeholder="Enter zone name"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brandSelect">Select Brand:</label>
            <select
              id="brandSelect"
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="">-- Select Brand --</option>
              {brands.map(brand => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button 
              className="submit-btn"
              onClick={handleAddZone}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Add Zone
                </>
              )}
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowAddZone(false);
                setNewZoneName("");
                setSelectedBrandId("");
                clearMessages();
              }}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Zone Form */}
      {showEditZone && (
        <div className="group-form">
          <h3>Edit Zone</h3>
          <div className="form-group">
            <label htmlFor="editZoneName">Zone Name:</label>
            <input
              id="editZoneName"
              type="text"
              value={editZoneName}
              onChange={(e) => setEditZoneName(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editBrandSelect">Select Brand:</label>
            <select
              id="editBrandSelect"
              value={editBrandId}
              onChange={(e) => setEditBrandId(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="">-- Select Brand --</option>
              {brands.map(brand => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button 
              className="submit-btn"
              onClick={handleEditZone}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSyncAlt} />
                  Update
                </>
              )}
            </button>
            <button 
              className="cancel-btn"
              onClick={() => {
		setShowEditZone(false);
		setEditZoneName("");
		setEditBrandId("");
		clearMessages();
	      }}
	      disabled={loading}
	    >
	  <FontAwesomeIcon icon={faTimes} />
	  Cancel
	 </button>
	</div>
      </div>
    )}
  </>
 );
};

export default ZoneManagement;
