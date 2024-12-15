import { fetchApi, sendApiRequest } from "./api.js";
import { retryApiRequest } from "./utils.js";


//Initialize listings module
export async function initListings() {
  const container = document.getElementById("listings-container");
  if (!container) {
    console.warn("Listings container not found. Skipping initialization.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  const allListings = await fetchListings(); // Fetch all listings once

  if (category) {
    const filteredListings = filterListingsByCategory(allListings, category); // Filter fetched listings
    displayListings(filteredListings); // Display filtered listings
  } else {
    displayListings(allListings); // Display all listings if no category
  }

  initCategoryFiltering(allListings); // Initialize category filtering
}

//Fetch all listings from api
export async function fetchListings() {
  try {
    const response = await fetchApi(
      "/auction/listings?_tag=villageWebsite&_active=true"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return []; // Return an empty array if an error occurs
  }
}
//Fetch and display with bids
export async function fetchListingsAndDisplay() {
  try {
    const response = await fetchApi(
      "/auction/listings?_tag=villageWebsite&_active=true"
    );
    const fetchedListings = response.data;

    // Render listings
    displayListings(fetchedListings);

    // Attach bid buttons after rendering
    fetchedListings.forEach((listing) => attachBidButton(listing.id));
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

//Store bid for viewving
export function initializeBids() {
  const allListings = document.querySelectorAll(".listing");
  allListings.forEach((listing) => {
    const listingId = listing.dataset.id;
    const savedBids = loadBidsFromLocalStorage(listingId);

    if (savedBids.length > 0) {
      const highestBidElement = document.getElementById(
        `highest-bid-${listingId}`
      );
      const highestBid = Math.max(...savedBids.map((bid) => bid.amount));
      highestBidElement.textContent = `Highest Bid: ${highestBid}`;
    }
  });
}

// generate listings card
function generateListingHTML(listing, isGuest = false) {
  const highestBid = listing.bids?.length
    ? Math.max(...listing.bids.map((bid) => bid.amount))
    : "No bids yet";

  const { id, title, description, endsAt, media } = listing;
  const imageUrl =
    media?.[0]?.url || "./media/placeholders/item-placeholder.png";
  const endDate = new Date(endsAt).toLocaleDateString();

  return `
    <div class="bg-white shadow rounded-lg overflow-hidden border border-gray-200" id="listing-${id}">
      <img src="${imageUrl}" alt="Listing Image" class="h-40 w-full object-cover" />
      <div class="p-4">
        <h3 class="text-lg font-bold text-gray-800 truncate">${title}</h3>
        <p class="text-sm text-gray-600 truncate">${description}</p>
        <p class="text-sm text-gray-600 mt-2">Ends: ${endDate}</p>
        <p class="text-sm font-bold text-primary mt-1" id="highest-bid-${id}">
          Highest Bid: ${highestBid}
        </p>
        ${
          isGuest
            ? `<p class="text-gray-500 text-sm mt-4">Log in to place a bid.</p>`
            : `
              <div class="mt-4">
                <input
                  type="number"
                  id="bidAmount-${id}"
                  class="w-full border rounded p-2 mb-2"
                  placeholder="Enter your bid amount"
                />
                <button
                  class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition bid-btn"
                  data-id="${id}"
                >
                  Bid
                </button>
              </div>
            `
        }
      </div>
    </div>
  `;
}

//clear old bids
export function clearOldBids() {
  const now = Date.now();
  const expirationTime = 24 * 60 * 60 * 1000; // 1 day

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("latestBid-")) {
      const bidData = JSON.parse(localStorage.getItem(key));
      if (now - bidData.timestamp > expirationTime) {
        localStorage.removeItem(key); // Remove expired bids
      }
    }
  });
}

/**
 * Filter listings by category
 */
export function filterListingsByCategory(listings, category) {
  if (!listings || !listings.length) {
    console.warn("No listings available to filter.");
    return [];
  }

  return listings.filter((listing) => listing.tags.includes(category));
}

/**
 * Initialize category filtering
 */
function initCategoryFiltering(allListings) {
  const categoryButtons = document.querySelectorAll(".category-btn");
  if (!categoryButtons.length) {
    console.warn("No category buttons found.");
    return;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      if (category) {
        const filteredListings = filterListingsByCategory(
          allListings,
          category
        );
        displayListings(filteredListings);

        // Attach bid button functionality to filtered listings
        filteredListings.forEach((listing) => attachBidButton(listing.id));
      } else {
        console.warn("Category data missing for button:", button);
      }
    });
  });
}

/**
 * Display multiple listings by rendering them to the DOM
 */
export function displayListings(listingsToRender) {
  const container = document.getElementById("listings-container");

  if (!container) {
    console.error("Listings container not found in the DOM.");
    return;
  }

  container.innerHTML = ""; // Clear existing content

  if (!listingsToRender || listingsToRender.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 p-4">
        <p>No listings available. Try a different search or category.</p>
      </div>`;
    return;
  }

  listingsToRender.forEach((listing) => {
    try {
      // Generate the HTML and append it to the container
      const listingHTML = generateListingHTML(listing);
      container.innerHTML += listingHTML;
    } catch (error) {
      console.error("Error rendering listing:", listing, error);
    }
  });

  // Attach bid button functionality after rendering
  listingsToRender.forEach((listing) => {
    const bidButton = document.querySelector(
      `.bid-btn[data-id="${listing.id}"]`
    );
    if (bidButton) {
      bidButton.addEventListener("click", () => handleBid(listing.id));
    }
  });
}

async function handleBid(listingId) {
  const bidAmountInput = document.getElementById(`bidAmount-${listingId}`);
  const bidAmount = parseFloat(bidAmountInput.value);

  if (!bidAmount || bidAmount <= 0) {
    alert("Please enter a valid bid amount.");
    return;
  }

  try {
    console.log(`Placing bid of ${bidAmount} on listing ID: ${listingId}`);
    const updatedBids = await placeBid(listingId, bidAmount);

    // Update the UI with the new highest bid
    const highestBidElement = document.getElementById(
      `highest-bid-${listingId}`
    );
    const newHighestBid = Math.max(...updatedBids.map((bid) => bid.amount));
    highestBidElement.textContent = `Highest Bid: ${newHighestBid}`;

    // Clear the input field
    bidAmountInput.value = "";
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("Failed to place the bid. Please try again.");
  }
}


/**
 * Fetch a specific listing by ID
 */
async function fetchListingById(listingId) {
  try {
    const response = await fetchApi(`/auction/listings/${listingId}?_bids=true`); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error; 
  }
}

//fetch all bids for speicfic listing
export async function fetchBidsForListing(listingId) {
  try {
    const response = await fetchApi(`/auction/listings/${listingId}?_bids=true`);
    return response.data.bids || []; 
  } catch (error) {
    console.error("Error fetching bids for listing:", error);
    throw error;
  }
}

//Place a bid
export async function placeBid(listingId, amount) {
  try {
    const response = await sendApiRequest(
      `/auction/listings/${listingId}/bids`,
      "POST",
      { amount }
    );
    alert(`Your bid of ${amount} has been placed successfully!`);

    // Fetch updated bids from the server
    const updatedBids = await fetchBidsForListing(listingId);

    // Merge with localStorage bids (if they exist)
    const storedBids = loadBidsFromLocalStorage(listingId);
    const mergedBids = [...storedBids, ...updatedBids];

    // Save merged bids to localStorage
    saveBidsToLocalStorage(listingId, mergedBids);

    return updatedBids; // Return updated bids
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("Failed to place the bid. Please try again.");
    throw error;
  }
}

//Bid button functionality
export function attachBidButton(listingId) {
  const bidButton = document.querySelector(`.bid-btn[data-id="${listingId}"]`);
  if (!bidButton) {
    console.warn(`Bid button for listing ${listingId} not found.`);
    return;
  }

  bidButton.addEventListener("click", async () => {
    const isGuest = localStorage.getItem("isGuest") === "true";
    if (isGuest) {
      alert("Log in to place a bid.");
      return;
    }

    const bidAmountInput = document.getElementById(`bidAmount-${listingId}`);
    const bidAmount = parseFloat(bidAmountInput.value);

    // Validate bid amount
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      // Fetch the current listing with bids to get the latest highest bid
      const currentHighest = Math.max(
        ...(loadBidsFromLocalStorage(listingId).map((bid) => bid.amount) || [0])
      );

      if (bidAmount <= currentHighest) {
        alert(
          `Your bid must be higher than the current highest bid of ${currentHighest}.`
        );
        return;
      }

      // Place the bid and fetch updated bids
      const updatedBids = await placeBid(listingId, bidAmount);

      // Dynamically update the "Highest Bid" in the UI
      const highestBidElement = document.getElementById(
        `highest-bid-${listingId}`
      );
      const newHighestBid =
        updatedBids.length > 0
          ? Math.max(...updatedBids.map((bid) => bid.amount))
          : "No bids yet";
      highestBidElement.textContent = `Highest Bid: ${newHighestBid}`;

      // Clear the input field
      bidAmountInput.value = "";
    } catch (error) {
      console.error("Error handling bid:", error);

      // Handle cases where the user tries to bid more than once
      if (error.message.includes("already placed")) {
        alert("You cannot place multiple bids on the same listing.");
      }
    }
  });
}


//Save bids to localStorage
function saveBidsToLocalStorage(listingId, bids) {
  const storedBids = JSON.parse(localStorage.getItem("bids")) || {};
  storedBids[listingId] = bids;
  localStorage.setItem("bids", JSON.stringify(storedBids));
}

export function loadBidsFromLocalStorage(listingId) {
  const storedBids = JSON.parse(localStorage.getItem("bids")) || {};
  return storedBids[listingId] || [];
}
