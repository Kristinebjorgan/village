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

// Perform a search on the provided listings
export function performSearch(query, listings, displayListings) {
  console.log("Performing search for:", query);
  console.log("Listings provided to search:", listings);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredListings = listings.filter((listing) =>
    (listing.title || "").toLowerCase().includes(normalizedQuery)
  );

  console.log("Filtered Listings:", filteredListings);

  displayListings(filteredListings); // Pass the filtered results to be displayed
}

// Initialize the search bar
export function initSearchBar(listings, displayListings) {
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
    performSearch(query, listings, displayListings);
  });

  // Event listener for the Enter key in the search bar
  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const query = searchBar.value.trim();
      console.log("Enter key pressed with query:", query);
      performSearch(query, listings, displayListings);
    }
  });

  console.log("Search bar initialized successfully.");
}

// retry API request when failing
export async function retryApiRequest(apiCall, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      console.warn(`Retry ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("API request failed after retries");
}
