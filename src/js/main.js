import "./cloudinary.js";
import { initForms } from "./forms.js"; // Initialize forms for auth.html
import {
  displayListings,
  fetchListingsAndDisplay,
  initListings,
  placeBid,
  attachBidButton, clearOldBids,
} from "./listings.js";
import * as modal from "./modal.js"; // Import everything from modal.js
import { loginUser, logoutUser, registerUser } from "./auth.js"; // Import auth functionality
import { renderProfilePage, initializeAvatarUpdate } from "./profile.js"; // Import profile page functionality
import {
  fetchApi,
  getToken,
  setToken,
  setUsername,
  getUsername,
  isTokenValid,
} from "./api.js"; // Import authentication helpers
import {
  updateCreditBalance,
  getCategoryButtons,
  initSearchBar,
} from "./utils.js";

// Fetch and display user credits
async function initializeUserCredits() {
  try {
    const username = getUsername();
    if (!username) {
      console.warn(
        "[initializeUserCredits] No username found. Cannot fetch credits."
      );
      return;
    }
    console.log(
      "[initializeUserCredits] Fetching profile data for user credits..."
    );
    const profileData = await fetchApi(`/auction/profiles/${username}`);
    console.log("[initializeUserCredits] Profile data fetched:", profileData);
    const userData = profileData.data;
    updateCreditBalance(userData.credits);
  } catch (error) {
    console.error(
      "[initializeUserCredits] Failed to initialize user credits:",
      error.message
    );
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Initializing application...");

    // Handle Guest Mode
    const guestBtn = document.getElementById("guestBtn");
    if (guestBtn) {
      guestBtn.addEventListener("click", () => {
        console.log("Guest mode activated.");
        localStorage.setItem("isGuest", true); // Mark user as guest
        window.location.href = "index.html"; // Redirect to the index page
      });
    }

    // Validate token
    const token = getToken();
    if (!isTokenValid(token)) {
      console.warn("Token is invalid or missing.");
    } else {
      console.log("Token is valid. Proceeding with initialization...");
    }

    // Initialize profile features
    if (isCurrentPage("profile.html")) {
      renderProfilePage();
      initializeAvatarUpdate(); // Avatar functionality
    }

    // Initialize global features (e.g., forms, logout, modal, etc.)
    initializeGlobalFeatures();

    // Fetch all listings with bids
    const listingsWithBids = await fetchListingsWithBids();
    console.log("Fetched listings with bids:", listingsWithBids);

    // Display listings with their bids
    displayListings(listingsWithBids);
    clearOldBids();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});


/**
 * Fetch all listings and include their bids dynamically
 */
async function fetchListingsWithBids() {
  try {
    // Fetch all listings
    const listings = await fetchListings();
    console.log("Fetched listings:", listings);

    // Fetch bids for each listing
    const listingsWithBids = await Promise.all(
      listings.map(async (listing) => {
        try {
          const bids = await fetchBidsForListing(listing.id); // Fetch bids for the listing
          return { ...listing, bids }; // Merge listing with its bids
        } catch (error) {
          console.error(
            `Error fetching bids for listing ID ${listing.id}:`,
            error
          );
          return listing; // Return listing without bids if there's an error
        }
      })
    );

    return listingsWithBids; // Return listings enriched with bids
  } catch (error) {
    console.error("Error fetching listings with bids:", error);
    throw error; // Rethrow error for further handling
  }
}



function initializeGlobalFeatures() {
  console.log("Initializing global application features...");
  initForms();
  attachLogoutFunctionality();
  ensureModalLoaded();
  initializeUserCredits();
  getCategoryButtons();

  // Fetch and initialize listings
  fetchListingsAndDisplay()
    .then((fetchedListings) => {
      if (!fetchedListings || fetchedListings.length === 0) {
        console.warn(
          "No listings fetched. Search bar and display will remain inactive."
        );
      } else {
        console.log("Fetched Listings:", fetchedListings);

        // Initialize the search bar with fetched listings
        initSearchBar(fetchedListings, displayListings);

        // Display fetched listings on the page
        displayListings(fetchedListings);
      }
    })
    .catch((error) => {
      console.error("Error fetching listings:", error);
    });

  console.log("Global features initialized successfully.");
}

/**
 * Helper function to check if the current page matches a specific name
 */
function isCurrentPage(pageName) {
  return window.location.pathname.includes(pageName);
}

function initializePage() {
  const currentPath = window.location.pathname;

  console.log("Current Path:", currentPath);

  if (currentPath.includes("profile.html")) {
    console.log("Profile page detected. Rendering profile page...");
    try {
      renderProfilePage();
    } catch (error) {
      console.error("Error while rendering the profile page:", error);
    }
  } else if (currentPath.includes("auction.html")) {
    console.log("Auction page detected. Initializing auction listings...");
    try {
      initListings(); // Call directly imported function
    } catch (error) {
      console.error("Error while initializing auction listings:", error);
    }
  } else if (currentPath.includes("index.html")) {
    console.log(
      "Index page detected. Fetching and displaying homepage listings..."
    );
    try {
      fetchListingsAndDisplay(); // Call directly imported function
    } catch (error) {
      console.error(
        "Error while fetching or displaying homepage listings:",
        error
      );
    }
  } else if (currentPath.includes("auth.html")) {
    console.log("Authentication page detected. Initializing auth page...");
    try {
      initializeAuthPage();
    } catch (error) {
      console.error("Error while initializing authentication page:", error);
    }
  } else {
    console.log(
      "No specific page detected. No specific initialization required."
    );
  }
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
