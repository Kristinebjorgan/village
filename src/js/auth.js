import {
  API_BASE_URL,
  API_KEY,
  clearUserData,
  clearUsername,
  getToken,
  setToken,
} from "./config.js";
import { sendApiRequest } from "./api.js";

// Centralized error handler
function handleError(response) {
  if (!response.ok) {
    throw new Error(response.statusText || "An error occurred");
  }
  return response.json();
}

export const loginUser = async (email, password) => {
  try {
    const payload = { email, password };
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("API Response for Login:", data);

    if (response.ok) {
      console.log("Setting accessToken in localStorage:", data.accessToken);
      setToken(data.accessToken); // Use the correct function
      setUsername(data.name); // Set the username
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
export async function registerUser(userData) {
  const apiUrl = "https://v2.api.noroff.dev/auth/register";

  try {
    console.log("Sending registration data to API:", userData);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Registration error details:", errorData);
      throw new Error(errorData.errors?.[0] || "Registration failed.");
    }

    const data = await response.json();
    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
}

