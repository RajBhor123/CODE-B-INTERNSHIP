// src/services/userService.js

// Define API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Helper function to get auth token from storage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  return user?.token;
};

// Helper function for API requests
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      // Auto logout if 401 Unauthorized returned from API
      localStorage.removeItem("authUser");
      window.location.href = "/login";
    }
    
    const error = (data && data.message) || response.statusText;
    return Promise.reject(new Error(error));
  }
  
  return data;
};

// Get current user profile
export const getUserProfile = async () => {
  const token = getAuthToken();
  
  if (!token) {
    return Promise.reject(new Error("No authentication token found"));
  }
  
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  return handleResponse(response);
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const token = getAuthToken();
  
  if (!token) {
    return Promise.reject(new Error("No authentication token found"));
  }
  
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  
  return handleResponse(response);
};

// Change password
export const changePassword = async (passwordData) => {
  const token = getAuthToken();
  
  if (!token) {
    return Promise.reject(new Error("No authentication token found"));
  }
  
  const response = await fetch(`${API_URL}/users/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });
  
  return handleResponse(response);
};