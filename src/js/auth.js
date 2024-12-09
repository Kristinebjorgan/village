import { API_BASE_URL, API_KEY } from "./config.js";
import { clearUserData } from "./config.js";

const headers = {
  "Content-Type": "application/json",
  "X-Noroff-API-Key": API_KEY,
};

// Centralized error handler
function handleError(response) {
  if (!response.ok) {
    throw new Error(response.statusText || "An error occurred");
  }
  return response.json();
}

// Login user
export const loginUser = async (email, password) => {
  try {
    const payload = { email, password };
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("jwtToken", data.accessToken);
      localStorage.setItem("username", data.name); // Save username
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Logout user
export function logoutUser() {
  console.log("Logging out the user...");

  // Clear user data and localStorage
  clearUserData();

  // Redirect to the login page
  window.location.href = "/auth.html"; // Adjust the path as needed
}


// Register user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("jwtToken", data.accessToken);
      localStorage.setItem("username", data.name); // Save username
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
};

