import {
  API_BASE_URL,
  API_KEY,
  clearUserData,
  clearUsername,
  getToken,
} from "./config.js";
import { sendApiRequest } from "./api.js";

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
export async function registerUser(userData) {
  const apiUrl = "https://v2.api.noroff.dev/auth/register";

  // Dynamically get token
  const accessToken = getToken();

  // Define headers locally
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY, // Use API key
  };

  // Add Authorization header only if accessToken is available
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    console.log("Sending registration data to API:", userData);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Registration Error:", errorData);
      throw new Error(errorData.message || "Failed to register user.");
    }

    const data = await response.json();
    console.log("User registered successfully:", data);

    return data;
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
}
