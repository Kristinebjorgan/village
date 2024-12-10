import "./cloudinary.js";
import * as utils from "./utils.js"; // Import all utility functions
import { initForms } from "./forms.js";
import * as listings from "./listings.js"; // Import all functions from listings
import * as modal from "./modal.js"; // Import everything from modal.js
import { logoutUser } from "./auth.js"; // Import logout functionality
import { getToken, getUsername, clearUserData } from "./config.js";
import { fetchUserCredits, initProfilePage } from "./profile.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Initializing application...");

    // Check if we are on the profile page
    const isProfilePage = window.location.pathname.includes("profile.html");

    if (isProfilePage) {
      console.log("Profile page detected. Initializing profile features...");
      initProfilePage(); // Initialize profile page-specific modules
    }

    // Initialize global features and modules
    initializeApplication();

    // Attach logout functionality globally
    attachLogoutFunctionality();

    // Additional utilities (if needed globally)
    utils.getCategoryButtons();
  } catch (error) {
    console.error("Initialization Error:", error);
  }
});

/**
 * Main application initializer
 */
function initializeApplication() {
  console.log("Initializing application modules...");

  // Initialize forms and other features
  initForms();
  console.log("Forms initialized successfully.");

  // Initialize listings and forms (common to all pages)
  listings.initListings();

  // Initialize global features (like user authentication checks)
  //   initializeGlobalFeatures();

  // Ensure modal is dynamically loaded and attached
  ensureModalLoaded();

  // Attach modal functionality to the Add Listing button
  console.log("Attaching modal to Add Listing button...");
  modal.attachModalToButton("addListingBtn");
}

/**
 * Attach logout functionality to the logout button
 */
function attachLogoutFunctionality() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    console.log("Attaching logout functionality...");
    logoutBtn.addEventListener("click", () => {
      console.log("Logout button clicked.");
      logoutUser();
    });
  } else {
    console.warn("Logout button not found in the DOM.");
  }
}

/**
 * Dynamically load and initialize the modal if not present
 */
function ensureModalLoaded() {
  if (!document.getElementById("addListingModal")) {
    console.log("Modal not found. Adding it to the DOM...");
    const modalHTML = modal.getAddListingModalHTML();
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Initialize modal functionality after appending to the DOM
    modal.initializeModal();
  } else {
    console.log("Modal already present in the DOM.");
  }
}

/**
 * Initialize global features (e.g., user authentication checks)
 */
// function initializeGlobalFeatures() {
//   const token = getToken();
//   const username = getUsername();

//   // Check if the current page is the authentication page
//   const isAuthPage = window.location.pathname.includes("auth.html");

//   console.log("Checking user authentication...");
//   if (isAuthPage) {
//     console.log("Authentication not required on this page.");
//     return; // Skip authentication checks on the login page
//   }

//   // Debugging token and username
//   console.log("Token:", token);
//   console.log("Username:", username);

//   if (token && username) {
//     console.log("User session active:", { username });
//   } else {
//     console.warn("No user session found. Clearing user data and redirecting...");
//     clearUserData();
//     window.location.href = "/auth.html"; // Redirect to login page
//   }
// }
