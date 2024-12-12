import "./cloudinary.js";
import * as utils from "./utils.js"; // Import all utility functions
import { initForms } from "./forms.js"; // Initialize forms for auth.html
import * as listings from "./listings.js"; // Import all functions from listings
import * as modal from "./modal.js"; // Import everything from modal.js
import { loginUser, logoutUser, registerUser } from "./auth.js"; // Import auth functionality
import { renderProfilePage } from "./profile.js"; // Import profile page functionality
import { fetchApi, getToken, setToken, setUsername, getUsername, isTokenValid } from "./api.js"; // Import authentication helpers
import { updateCreditBalance } from "./utils.js";

//credits
async function initializeUserCredits() {
  try {
    const username = getUsername();
    if (!username) {
      console.warn("No username found. Cannot fetch credits.");
      return;
    }

    const profileData = await fetchApi(`/auction/profiles/${username}`);
    const userData = profileData.data;

    // Update credit balance in the header
    updateCreditBalance(userData.credits);
  } catch (error) {
    console.error("Failed to initialize user credits:", error.message);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Initializing application...");

    // Validate token
    const token = getToken();
    if (!isTokenValid(token)) {
      console.warn("Token is invalid or missing.");
    } else {
      console.log("Token is valid. Proceeding with initialization...");
    }

    // Initialize authenticated pages
    initializePage();

    // Attach global features
    initializeGlobalFeatures();
  } catch (error) {
    console.error("Initialization Error:", error);
  }
});

/**
 * Helper function to check if the current page matches a specific name
 */
function isCurrentPage(pageName) {
  return window.location.pathname.includes(pageName);
}

/**
 * Initialize the authentication page (login/signup)
 */
function initializeAuthPage() {
  console.log("Initializing authentication page...");
  initForms(); // Initialize form-related listeners for auth.html
  console.log("Authentication page initialized successfully.");
}

// Initialize the appropriate page-specific functionality
function initializePage() {
  const currentPath = window.location.pathname;

  if (currentPath.includes("profile.html")) {
    console.log("Profile page detected. Rendering profile page...");
    try {
      renderProfilePage();
    } catch (error) {
      console.error("Error while rendering the profile page:", error);
    }
  } else if (currentPath.includes("index.html")) {
    console.log("Index page detected. Initializing homepage features...");

    // Ensure that the listings container exists before proceeding
    const listingsContainer = document.getElementById("listings-container");
    if (!listingsContainer) {
      console.error("Listings container not found. Skipping listing initialization.");
      return;
    }

    try {
      listings.fetchListingsAndDisplay(); // Load listings on the homepage
    } catch (error) {
      console.error("Error while fetching and displaying listings:", error);
    }
  } else if (currentPath.includes("auth.html")) {
    console.log("Authentication page detected. Initializing auth page...");
    try {
      initializeAuthPage();
    } catch (error) {
      console.error("Error while initializing authentication page:", error);
    }
  } else {
    console.log("No specific page detected, initializing default features...");
    // Placeholder for potential future functionality on generic or unmatched pages
  }
}


/**
 * Initialize global features shared across all pages
 */
function initializeGlobalFeatures() {
  console.log("Initializing global application features...");

  // Initialize forms
  initForms();

  // Attach logout functionality
  attachLogoutFunctionality();

  // Attach modal to the Add Listing button
  ensureModalLoaded();

  //Credits
  initializeUserCredits();

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

//add listings Modal
export function initializeModal() {
  const modal = document.getElementById("addListingModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (!modal || !closeModalBtn) {
    console.error("Modal or Close button not found.");
    return;
  }

  // Close modal on button click
  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal when clicking outside the modal content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Add other modal-specific behavior here, like form submission
}


/**
 * Dynamically load and initialize the modal if not present
 */
function ensureModalLoaded() {
  const modalElement = document.getElementById("addListingModal");
  if (!modalElement) {
    console.log("Adding modal to the DOM...");
    const modalHTML = modal.getAddListingModalHTML();
    const container = document.createElement("div");
    container.innerHTML = modalHTML;
    document.body.appendChild(container);

    // Initialize modal functionality after adding it to the DOM
  modal.initializeModal();
  document
    .getElementById("addListingForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Add Listing form submitted.");
      // Trigger fetch and display after successful submission
      await listings.fetchListingsAndDisplay();
    });

    // Attach the button to the modal functionality 
    modal.attachModalToButton("addListingBtn");
  } else {
    console.log("Modal already present in the DOM.");

    // Reattach modal functionality to the button
    modal.attachModalToButton("addListingBtn");
  }
}

/**
 * Save token and username to localStorage after login
 */
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginUsername")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();
  const loginError = document.getElementById("loginError");

  loginError.textContent = "";
  loginError.classList.add("hidden");

  if (!email || !password) {
    displayError("Please fill in both email and password.", loginError);
    return;
  }

  try {
    const data = await loginUser(email, password);

    // Save token and username to localStorage
    setToken(data.accessToken);
    setUsername(data.name);

    alert("Login successful!");
    window.location.href = "index.html";
  } catch (error) {
    displayError(error.message || "Login failed.", loginError);
  }
}

/**
 * Save token and username to localStorage after registration
 */
async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("username")?.value.trim();
  const email = document.getElementById("registerEmail")?.value.trim();
  const password = document.getElementById("registerPassword")?.value.trim();
  const repeatPassword = document
    .getElementById("repeatPassword")
    ?.value.trim();
  const bio = document.getElementById("biography")?.value.trim();
  const signupError = document.getElementById("loginError");

  signupError.textContent = "";

  // Validate inputs
  if (!username || !email || !password || !repeatPassword) {
    displayError("All fields are required.", signupError);
    return;
  }
  if (password !== repeatPassword) {
    displayError("Passwords do not match.", signupError);
    return;
  }

  const userData = {
    name: username,
    email,
    password,
    bio: bio || "",
  };

  try {
    const data = await registerUser(userData);

    // Save token and username to localStorage
    setToken(data.accessToken);
    setUsername(data.name);

    alert("Registration successful! Redirecting to login...");
    document.getElementById("loginTab").click();
  } catch (error) {
    displayError(error.message || "Registration failed.", signupError);
  }
}
