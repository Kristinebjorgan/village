import "./cloudinary.js";
import { initForms } from "./forms.js"; // Initialize forms for auth.html
import {
  displayListings,
  fetchListingsAndDisplay,
  fetchListings,
  initListings,
  placeBid,
  attachBidButton,
  clearOldBids,
  loadBidsFromLocalStorage,
  fetchBidsForListing,
  initializeBids,
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
  initSearchBar, setupCategoriesMenu, 
} from "./utils.js";
import {
  populateCarousel,
  populatePopularCategories,
  populateHowItWorksSection,
  initializeIndexPage,
} from "./index.js";

//Initialize page
function initializePage() {
  const currentPath = window.location.pathname;

  console.log("Current Path:", currentPath);

  if (currentPath.includes("profile.html")) {
    console.log("Profile page detected. Rendering profile page...");
    renderProfilePage();
    initializeAvatarUpdate(); // Avatar functionality
  } else if (currentPath.includes("auction.html")) {
    console.log("Auction page detected. Initializing auction listings...");
    initListings();
  } else if (currentPath.includes("index.html")) {
    console.log("Index page detected. Initializing index page...");
    initializeIndexPage(); // All index-related functionality
  } else {
    console.log(
      "No specific page detected. No specific initialization required."
    );
  }
}

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
    const profileData = await fetchApi(`/auction/profiles/${username}`);
    const userData = profileData.data;
    updateCreditBalance(userData.credits);
  } catch (error) {
    console.error(
      "[initializeUserCredits] Failed to initialize user credits:",
      error.message
    );
  }
}

//Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  try {
    initializePage();

    // Handle Guest Mode
    const guestBtn = document.getElementById("guestBtn");
    if (guestBtn) {
      guestBtn.addEventListener("click", () => {
        localStorage.setItem("isGuest", true); 
        window.location.href = "index.html"; 
      });
    }

    //mobile menu toggle
    setupCategoriesMenu();

    // Initialize global features (e.g., forms, logout, modal, etc.)
    initializeGlobalFeatures();

    // Fetch all listings with bids
    const listingsWithBids = await fetchListingsWithBids();

    // Initialize bids after displaying listings
    initializeBids();

    // Display listings with their bids
    displayListings(listingsWithBids);
    clearOldBids();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});


//fetch all listings with bids
async function fetchListingsWithBids() {
  try {
    // Fetch all listings
    const listings = await fetchListings();

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

// global features
function initializeGlobalFeatures() {
  console.log("Initializing global features...");

  // Initialize forms, logout, modal, and user credits
  initForms();
  attachLogoutFunctionality();
  ensureModalLoaded();
  initializeUserCredits();
  getCategoryButtons();

  // Fetch listings and handle them
  fetchListingsAndDisplay()
    .then((fetchedListings) => {
      if (!fetchedListings || fetchedListings.length === 0) {
        console.warn("No listings fetched. Display and search bar are inactive.");
      } else {
        console.log("Fetched listings successfully:", fetchedListings);

        // Initialize search bar functionality
        initSearchBar(fetchedListings, displayListings);

        // Display listings dynamically
        displayListings(fetchedListings);
      }
    })
    .catch((error) => {
      console.error("Error fetching or displaying listings:", error);
    });
}


//Check curent page
function isCurrentPage(pageName) {
  return window.location.pathname.includes(pageName);
}


//Logout
function attachLogoutFunctionality() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
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
}

//dynamically load modal
function ensureModalLoaded() {
  const modalElement = document.getElementById("addListingModal");
  if (!modalElement) {
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
        await listings.fetchListingsAndDisplay();
      });

    // Attach the button to the modal functionality
    modal.attachModalToButton("addListingBtn");
  } else {

    // Reattach modal functionality to the button
    modal.attachModalToButton("addListingBtn");
  }
}
