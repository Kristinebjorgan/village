import { API_BASE_URL, API_KEY } from "./config.js";

// Global headers for all requests
const headers = {
  "Content-Type": "application/json",
  "X-Noroff-API-Key": API_KEY,
};

//Login user
export const loginUser = async (email, password) => {
  try {
    const payload = { email, password }; // Define payload
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { ...headers },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.accessToken); // Store token
    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { ...headers },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessages =
        errorData.errors?.map((err) => err.message).join(", ") ||
        errorData.message ||
        "Registration failed";
      throw new Error(errorMessages);
    }

    return await response.json();
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error;
  }
};
