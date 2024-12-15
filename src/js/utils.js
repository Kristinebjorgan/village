import { fetchApi } from "./api.js";

// Hamburger menu toggle
export const setupCategoriesMenu = () => {
  const toggleBtn = document.getElementById("categoriesToggle"); // Hamburger button
  const closeBtn = document.getElementById("closeMenuButton"); // Close button
  const mobileMenu = document.getElementById("mobileMenu"); // Mobile menu container

  if (!toggleBtn || !closeBtn || !mobileMenu) {
    console.error("Menu toggle setup failed. Missing required elements.");
    return;
  }

  // Open mobile menu
  toggleBtn.addEventListener("click", () => {
    console.log("Hamburger menu clicked."); // Debug log
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("show");
    console.log("Classes on mobileMenu:", mobileMenu.classList);
  });

  // Close mobile menu
  closeBtn.addEventListener("click", () => {
    console.log("Close button clicked."); // Debug log
    mobileMenu.classList.add("hidden");
    mobileMenu.classList.remove("show");
    console.log("Classes on mobileMenu after close:", mobileMenu.classList);
  });
};

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

  const normalizedQuery = query.trim().toLowerCase();
  const filteredListings = listings.filter((listing) =>
    (listing.title || "").toLowerCase().includes(normalizedQuery)
  );
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


  // Event listener for the search button
  searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();
    performSearch(query, listings, displayListings);
  });

  // Event listener for the Enter key in the search bar
  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const query = searchBar.value.trim();
      performSearch(query, listings, displayListings);
    }
  });

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

