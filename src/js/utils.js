import { fetchApi } from "./api.js";

// Categories
export function getCategoryButtons() {
  const categoryButtons = document.querySelectorAll(".category-btn");
  if (!categoryButtons.length) {
    console.warn("No category buttons found.");
    return;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      if (category) {
        console.log(`Redirecting to auction.html with category: ${category}`);
        window.location.href = `auction.html?category=${category}`;
      } else {
        console.warn("Category data missing for button:", button);
      }
    });
  });
}

// Credit
export function updateCreditBalance(credits) {
  const creditBalanceEl = document.getElementById("creditBalance");
  if (creditBalanceEl) {
    creditBalanceEl.textContent = `${credits || 0}`;
  } else {
    console.warn("Credit balance element not found in the DOM.");
  }
}

// Search functionality
export function performSearch(query, listings = [], displayListing) {
  if (!listings || !Array.isArray(listings)) {
    console.error("Invalid listings provided for search:", listings);
    return;
  }

  console.log("Performing search for:", query);
  console.log("Listings before filtering:", listings);

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(query.toLowerCase())
  );

  console.log("Filtered Listings:", filteredListings);

  const container = document.getElementById("listings-container");
  if (!container) {
    console.error("Listings container not found in DOM.");
    return;
  }

  // Clear previous listings
  container.innerHTML = "";

  if (filteredListings.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 p-4">
        <p>No listings match your search. Try another keyword.</p>
      </div>
    `;
    return;
  }

  // Display filtered listings
  filteredListings.forEach((listing) => displayListing(listing));
}

// Initialize the search bar
export function initSearchBar(listings, displayListing) {
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.getElementById("search-button");

  if (!searchBar || !searchButton) {
    console.warn("Search bar or button not found in DOM.");
    return;
  }

  console.log("Initializing Search Bar with Listings:", listings);

  // Event listener for the search button
  searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();
    console.log("Search button clicked with query:", query);
    performSearch(query, listings, displayListing);
  });

  // Event listener for the Enter key in the search bar
  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const query = searchBar.value.trim();
      console.log("Enter key pressed with query:", query);
      performSearch(query, listings, displayListing);
    }
  });

  console.log("Search bar initialized successfully.");
}
