import "./cloudinary.js";
import * as utils from "./utils.js"; // Import all utility functions
import { initForms } from "./forms.js";
import * as listings from "./listings.js"; // Import all functions from listings
import * as modal from "./modal.js"; // Import everything from modal.js
import { logoutUser } from "./auth.js"; // Import logout functionality
import { renderProfilePage } from "./profile.js"; // Updated import
import { getToken, getUsername } from "./config.js";


document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Initializing application...");

    // Initialize the correct page-specific functionality
    initializePage();

    // Attach global functionalities
    initializeGlobalFeatures();
  } catch (error) {
    console.error("Initialization Error:", error);
  }
});

/**
 * Initialize the appropriate page-specific functionality
 */
function initializePage() {
  const currentPath = window.location.pathname;

  if (currentPath.includes("profile.html")) {
    console.log("Profile page detected. Rendering profile page...");
    renderProfilePage();
  } else {
    console.log("No specific page detected, initializing default features...");
  }
}

/**
 * Initialize global features shared across all pages
 */
function initializeGlobalFeatures() {
  console.log("Initializing global application features...");

  // Initialize forms
  initForms();

  // Initialize listings if present
  listings.initListings();

  // Attach logout functionality
  attachLogoutFunctionality();

  // Attach modal to the Add Listing button
  modal.attachModalToButton("addListingBtn");

  console.log("Global features initialized successfully.");
}

/**
 * Attach logout functionality to the logout button
 */
function attachLogoutFunctionality() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      console.log("Logout button clicked.");
      logoutUser();
    });
  } else {
    console.warn("Logout button not found in the DOM.");
  }
}
