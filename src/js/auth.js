import { API_BASE_URL, API_KEY } from "./config.js";

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
      headers: { ...headers },
      body: JSON.stringify(payload),
    });
    const data = await handleError(response);
    localStorage.setItem("authToken", data.accessToken);
    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { ...headers },
      body: JSON.stringify(userData),
    });
    return await handleError(response);
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
};
