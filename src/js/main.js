import "./cloudinary.js"; // Import if necessary for forms or modals
import * as utils from "./utils.js"; // Import all functions from utils
import { initForms } from "./forms.js";
import * as listings from "./listings.js"; // Import all functions from listings
import * as modal from "./modal.js"; // Import everything from modal.js
import { logoutUser } from "./auth.js"; //

document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Initializing application...");
    initializeApplication();
    attachLogoutFunctionality();  // Initialize all application modules
    utils.getCategoryButtons(); // Attach functionality to category buttons
  } catch (error) {
    console.error("Initialization Error:", error);
  }
});

 // Attach logout functionality to the logout button
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

//initialize full app
function initializeApplication() {
  console.log("Initializing application modules...");

  // Initialize listings and form-related modules
  listings.initListings();
  initForms();
  initializeGlobalFeatures();

  // Dynamically load the modal HTML if it doesn't already exist
  ensureModalLoaded();

  // Attach modal functionality to the Add Listing button
  console.log("Attaching modal to Add Listing button...");
  modal.attachModalToButton("addListingBtn");
}

// Ensure the Add Listing Modal is loaded into the DOM
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

// Initialize global features (e.g., user authentication checks)
function initializeGlobalFeatures() {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    console.log("User session active.");
    utils.fetchUserCredits(); // Fetch and display credits dynamically
  } else {
    console.log("No user session found.");
  }
}
