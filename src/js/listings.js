import { API_BASE_URL } from "./config.js";

let listings = []; // Global variable to store fetched listings

// Initialize the listings module
export function initListings() {
  const container = document.getElementById("listings-container");
  if (!container) {
    console.warn("Listings container not found. Skipping initialization.");
    return;
  }

  fetchListings(); // Fetch all listings by default
  initCategoryFiltering(); // Initialize category filtering
}

//Fetch listings
export async function fetchListings() {
  const container = document.getElementById("listings-container");
  if (!container) {
    console.warn("Skipping listings fetch: listings-container not found.");
    return;
  }

  try {
    console.log("Fetching listings with 'villageWebsite' tag...");

    // Fetch listings with the specific unique tag and only active ones
    const response = await fetch(
      `${API_BASE_URL}/auction/listings?_tag=villageWebsite&_active=true`
    );
    console.log("API Response Status:", response.status);

    const result = await response.json();
    console.log("Filtered listings fetched from API:", result.data);

    // Update global listings variable and display filtered listings
    listings = result.data || [];
    displayListings(listings);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
  }
}


// Filter listings by category
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

  console.log("Rendering listings:", listingsToRender); // Debug listings to render
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

  console.log("Rendering single listing:", listing); // Debug each listing
  const highestBid =
    listing.bids?.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : "No bids yet";

  const listingCard = `
    <div class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <img
        src="${
          listing.media[0]?.url || "./media/placeholders/item-placeholder.png"
        }"
        alt="${listing.media[0]?.alt || "Listing Image"}"
        class="h-40 w-full object-cover"
      />
      <div class="p-4">
        <h3 class="text-lg font-bold text-gray-800 truncate">${
          listing.title
        }</h3>
        <p class="text-sm text-gray-600 truncate">${listing.description}</p>
        <p class="text-sm text-gray-600 mt-2">Ends: ${new Date(
          listing.endsAt
        ).toLocaleDateString()}</p>
        <p class="text-sm font-bold text-primary mt-1">Highest Bid: ${highestBid}</p>
        <button
          class="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition place-bid-btn"
          data-id="${listing.id}"
        >
          Place Bid
        </button>
      </div>
    </div>
  `;

  container.innerHTML += listingCard;
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
