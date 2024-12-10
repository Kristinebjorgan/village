import {
  API_BASE_URL,
  API_KEY,
  clearUserData,
  clearUsername,
  getToken,
  setToken,
  setUsername,
  getUsername,
} from "./config.js";
import { sendApiRequest } from "./api.js";

// Centralized error handler
function handleError(response) {
  if (!response.ok) {
    throw new Error(response.statusText || "An error occurred");
  }
  return response.json();
}

//Login user
 export const loginUser = async (email, password) => {
   try {
     const payload = { email, password };
     const response = await fetch(`https://v2.api.noroff.dev/auth/login`, {
       // Full API URL
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
       console.error("Login failed with message:", data.message);
       throw new Error(data.message || "Login failed.");
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
    console.log(
      "Sending registration data to API:",
      JSON.stringify(userData, null, 2)
    );

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "Full API Error Details:",
        JSON.stringify(errorData, null, 2)
      );
      throw new Error(errorData.errors?.[0]?.message || "Registration failed.");
    }

    const data = await response.json();
    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
}
