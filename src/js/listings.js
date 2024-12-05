import { API_BASE_URL } from "./config.js";

let listings = []; // Global variable to store fetched listings

// Fetch all listings from the API
export async function fetchListings() {
  const container = document.getElementById("listings-container");
  if (!container) {
    console.warn("Skipping listings fetch: listings-container not found.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/listings`);
    listings = await response.json();
    displayListings(listings); // Display all listings
  } catch (error) {
    console.error("Failed to fetch listings:", error);
  }
}

// Fetch and filter listings by category
export function fetchListingsByCategory(category) {
  if (!listings.length) {
    console.warn("Listings not yet fetched. Fetching all listings first.");
    fetchListings().then(() => filterListingsByCategory(category));
    return;
  }

  filterListingsByCategory(category);
}

// Filter listings by category
export function filterListingsByCategory(category) {
  const filteredListings = listings.filter((listing) =>
    listing.tags.includes(category)
  );
  displayListings(filteredListings);
}

// Render multiple listings
export function displayListings(listingsToRender) {
  const container = document.getElementById("listings-container");

  if (!container) {
    console.error("Listings container not found.");
    return;
  }

  container.innerHTML = ""; // Clear container before rendering
  listingsToRender.forEach((listing) => displayListing(listing));
}

// Render a single listing
export function displayListing(listing) {
  const container = document.getElementById("listings-container");

  if (!container) {
    console.error("Listings container not found.");
    return;
  }

  const listingCard = `
    <div class="bg-white shadow-lg rounded-lg p-4">
      <img
        src="${listing.media[0] || "./media/placeholders/item-placeholder.png"}"
        alt="${listing.title}"
        class="h-32 w-full object-cover rounded-md mb-3"
      />
      <h3 class="text-lg font-semibold text-gray-800">${listing.title}</h3>
      <p class="text-sm text-gray-600">${listing.description}</p>
      <p class="text-sm text-gray-600">Ends: ${new Date(
        listing.endsAt
      ).toLocaleDateString()}</p>
      <button class="mt-3 w-full bg-primary hover:bg-primary-light text-white py-2 rounded-md text-sm transition-colors">
        Place Bid
      </button>
    </div>
  `;
  container.innerHTML += listingCard;
}

// Get query parameters from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Initialize the auction page
export function initAuctionPage() {
  const category = getQueryParam("category");
  console.log(`Category from query string: ${category}`);

  if (category) {
    fetchListingsByCategory(category); // Fetch listings for a specific category
  } else {
    fetchListings(); // Fetch all listings if no category is specified
  }
}

// Initialize category filtering
export function initCategoryFiltering() {
  const categoryButtons = document.querySelectorAll(".category-btn");

  if (!categoryButtons.length) {
    console.warn("No category buttons found.");
    return;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      if (category) {
        console.log(`Filtering by category: ${category}`);
        filterListingsByCategory(category);
      } else {
        console.warn("Category data missing for button:", button);
      }
    });
  });
}

// Initialize listings module
export function initListings() {
  const container = document.getElementById("listings-container");
  if (!container) {
    console.log(
      "Listings container not found. Skipping listings module initialization."
    );
    return;
  }

  fetchListings(); // Fetch all listings by default
  initCategoryFiltering(); // Initialize category filtering
}
