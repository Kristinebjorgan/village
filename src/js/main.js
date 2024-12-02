import { API_BASE_URL, API_KEY } from "./config.js"; // Configurations for API
import "./forms.js"; // Handles form-related interactions
import "./utils.js"; // Utilities for common functionality
import "./auth.js"; // Authentication logic
import "./cloudinary.js"; //Avatar upload logic from users own computer

/**
 * Logs the application initialization details.
 *
 * This ensures the application is correctly set up and ready to handle user actions.
 */
console.log("Application initialized!");

/**
 * DOMContentLoaded Event Listener
 *
 * Ensures that all DOM-related interactions are executed only after the document is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed.");

  // Global event listeners or app-wide initialization logic can go here.
  initializeGlobalFeatures();

  // Optional: Fetch any required data on app initialization
  // Example:
  // fetchInitialData();
});

/**
 * Global Feature Initialization
 *
 * Add any global functionality or listeners here. This might include handling
 * user sessions, fetching essential data, or setting up third-party integrations.
 */
function initializeGlobalFeatures() {
  console.log("Initializing global features...");

  // Check for user session
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    console.log("User is logged in. Token found:", authToken);
  } else {
    console.log("No user session found. User is not logged in.");
  }

  // Additional features can be initialized here if required.
}

/**
 * Fetch Initial Data
 *
 * Example function to fetch data that the app might need on load.
 * Uncomment and implement as needed.
 */
// async function fetchInitialData() {
//   try {
//     const response = await fetch(`${API_BASE_URL}/some-endpoint`, {
//       headers: {
//         "Content-Type": "application/json",
//         "X-Noroff-API-Key": API_KEY,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch initial data.");
//     }

//     const data = await response.json();
//     console.log("Initial data fetched successfully:", data);
//   } catch (error) {
//     console.error("Error fetching initial data:", error.message);
//   }
// }
