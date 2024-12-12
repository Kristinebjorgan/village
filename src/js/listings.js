import { fetchApi, sendApiRequest } from "./api.js";

let listings = []; // Global variable to store fetched listings

/**
 * Initialize the listings module
 */
export async function initListings() {
  console.log("Initializing listings...");
  const container = document.getElementById("listings-container");
  if (!container) {
    console.warn("Listings container not found. Skipping initialization.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  if (category) {
    console.log(`Filtering listings by category: ${category}`);
    const allListings = await fetchListingsAndDisplay(); // Fetch all listings first
    filterListingsByCategory(allListings, category); // Pass fetched listings and category
  } else {
    await fetchListingsAndDisplay(); // Default behavior
  }

  initCategoryFiltering(); // Still initialize filtering buttons
}


/**
 * Fetch all listings from the API
 */
export async function fetchListings() {
  try {
    console.log("Fetching all listings...");
    const response = await fetchApi(
      "/auction/listings?_tag=villageWebsite&_active=true"
    );
    console.log("Fetched Listings:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return []; // Return an empty array if an error occurs
  }
}

/**
 * Display multiple listings by rendering them to the DOM
 */
export function displayListings(listingsToRender) {
  const container = document.getElementById("listings-container");
  if (!container) {
    console.error("Listings container not found in the DOM.");
    return; // Exit early if no container found
  }

  // Clear existing content
  container.innerHTML = "";

  if (!listingsToRender || listingsToRender.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 p-4">
        <p>No listings available. Try a different search or category.</p>
      </div>
    `;
    return; // Exit early if no listings to display
  }

  // Render each listing
  listingsToRender.forEach((listing) => {
    try {
      const listingHTML = generateListingHTML(listing);
      container.innerHTML += listingHTML;
    } catch (error) {
      console.error("Error rendering listing:", listing, error);
    }
  });
}


/**
 * Fetch listings from the API and update the global listings variable
 */
export async function fetchListingsAndDisplay() {
  try {
    console.log("Fetching all listings...");
    const response = await fetchApi(
      "/auction/listings?_tag=villageWebsite&_active=true"
    );
    const fetchedListings = response.data; // Assign fetched listings to a variable
    console.log("Fetched Listings:", fetchedListings);
    displayListings(fetchedListings); // Pass fetchedListings directly
    return fetchedListings; // Return fetched listings if needed elsewhere
  } catch (error) {
    console.error("Error fetching listings:", error);
    return []; // Return an empty array on error
  }
}


/**
 * Filter listings by category
 */
export function filterListingsByCategory(listings, category) {
  if (!listings || !listings.length) {
    console.warn("Listings not yet fetched. Fetching all listings first...");
    return;
  }

  const filteredListings = listings.filter((listing) =>
    listing.tags.includes(category)
  );

  // Pass filtered listings to displayListings
  displayListings(filteredListings);
}

function generateListingHTML(listing) {
  const highestBid =
    listing.bids?.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : "No bids yet";

  return `
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
        <div class="mt-4">
          <input
            type="number"
            id="bidAmount-${listing.id}"
            class="w-full border rounded p-2 mb-2"
            placeholder="Enter your bid amount"
          />
          <button
            class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition bid-btn"
            data-id="${listing.id}"
          >
            Bid
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Attach functionality to the Bid button
 */
function attachBidButton(listingId) {
  const bidButton = document.querySelector(`.bid-btn[data-id="${listingId}"]`);

  if (bidButton) {
    bidButton.addEventListener("click", async () => {
      const bidAmountInput = document.getElementById(`bidAmount-${listingId}`);
      const bidAmount = parseFloat(bidAmountInput.value);

      if (!bidAmount || bidAmount <= 0) {
        alert("Please enter a valid bid amount.");
        return;
      }

      try {
        // Submit the bid to the API
        const response = await sendApiRequest(
          `/auction/listings/${listingId}/bids`,
          "POST",
          {
            amount: bidAmount,
          }
        );

        console.log("Bid successfully placed:", response);

        // Provide feedback to the user
        alert(`Your bid of ${bidAmount} has been placed successfully!`);
        bidAmountInput.value = ""; // Clear the input field
        fetchListingsAndDisplay(); // Refresh listings to show updated bids
      } catch (error) {
        console.error("Failed to place bid:", error);
        alert("Failed to place bid. Please try again.");
      }
    });
  } else {
    console.warn(`Bid button for listing ${listingId} not found.`);
  }
}

/**
 * Initialize category filtering
 */
function initCategoryFiltering() {
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
