import { fetchApi, sendApiRequest } from "./api.js";
import { retryApiRequest } from "./utils.js";


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

  const allListings = await fetchListings(); // Fetch all listings once

  if (category) {
    console.log(`Filtering listings by category: ${category}`);
    const filteredListings = filterListingsByCategory(allListings, category); // Filter fetched listings
    displayListings(filteredListings); // Display filtered listings
  } else {
    displayListings(allListings); // Display all listings if no category
  }

  initCategoryFiltering(allListings); // Initialize category filtering
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
 * Fetch listings from the API and display them with bid functionality
 */
export async function fetchListingsAndDisplay() {
  try {
    console.log("Fetching all listings...");
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


// generate listings card
export function generateListingHTML(listing) {
  // Check for locally stored bid
  const storedBid = JSON.parse(localStorage.getItem(`latestBid-${listing.id}`));

  // Determine the highest bid
  const highestBid = storedBid
    ? Math.max(
        storedBid.amount,
        ...(listing.bids?.map((bid) => bid.amount) || [])
      )
    : listing.bids?.length
    ? Math.max(...listing.bids.map((bid) => bid.amount))
    : "No bids yet";

  const { id, title, description, endsAt, media } = listing;
  const imageUrl =
    media?.[0]?.url || "./media/placeholders/item-placeholder.png";
  const imageAlt = media?.[0]?.alt || "Listing Image";
  const endDate = new Date(endsAt).toLocaleDateString();

  return `
    <div class="bg-white shadow rounded-lg overflow-hidden border border-gray-200" id="listing-${id}">
      <img src="${imageUrl}" alt="${imageAlt}" class="h-40 w-full object-cover" />
      <div class="p-4">
        <h3 class="text-lg font-bold text-gray-800 truncate">${title}</h3>
        <p class="text-sm text-gray-600 truncate">${description}</p>
        <p class="text-sm text-gray-600 mt-2">Ends: ${endDate}</p>
        <p class="text-sm font-bold text-primary mt-1" id="highest-bid-${id}">
          Highest Bid: ${highestBid}
        </p>
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
        console.log(`Filtering by category: ${category}`);
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

  // Render each listing and attach bid button functionality
  listingsToRender.forEach((listing) => {
    try {
      const listingHTML = generateListingHTML(listing);
      container.innerHTML += listingHTML;

      // Attach bid button functionality for this listing
      const bidButton = document.querySelector(`.bid-btn[data-id="${listing.id}"]`);
      if (bidButton) {
        bidButton.addEventListener("click", async () => {
          console.log(`Bid button clicked for listing ID: ${listing.id}`);
          const bidAmountInput = document.getElementById(`bidAmount-${listing.id}`);
          const bidAmount = parseFloat(bidAmountInput.value);

          if (!bidAmount || bidAmount <= 0) {
            alert("Please enter a valid bid amount.");
            return;
          }

          try {
            const updatedListing = await placeBid(listing.id, bidAmount);
            console.log("Bid successful:", updatedListing);

            // Clear input field and refresh the UI
            bidAmountInput.value = "";
            fetchListingsAndDisplay(); // Refresh listings
          } catch (error) {
            console.error("Error handling bid:", error);
          }
        });
      }
    } catch (error) {
      console.error("Error rendering listing:", listing, error);
    }
  });
}

/**
 * Fetch a specific listing by ID
 */
async function fetchListingById(listingId) {
  try {
    const response = await fetchApi(`/auction/listings/${listingId}?_bids=true`); 
    console.log("Fetched latest listing with bids:", response.data); // Log the latest listing data
    return response.data; // Return the fetched listing with bids
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error; // Throw the error to handle it appropriately
  }
}

/**
 * Fetch all bids for a specific listing
 */
export async function fetchBidsForListing(listingId) {
  try {
    const response = await fetchApi(`/auction/listings/${listingId}?_bids=true`);
    console.log("Fetched listing with bids:", response.data);
    return response.data.bids || []; // Return bids array or an empty array
  } catch (error) {
    console.error("Error fetching bids for listing:", error);
    throw error;
  }
}

/**
 * Place a bid
 */
export async function placeBid(listingId, amount) {
  try {
    console.log(`Placing bid of ${amount} on listing ${listingId}...`);

    const response = await sendApiRequest(
      `/auction/listings/${listingId}/bids`,
      "POST",
      { amount }
    );

    console.log("Bid placed successfully:", response);
    alert(`Your bid of ${amount} has been placed successfully!`);

    // Save the latest bid to localStorage
    localStorage.setItem(
      `latestBid-${listingId}`,
      JSON.stringify({
        amount,
        timestamp: Date.now(),
      })
    );

    // Fetch the latest bids after placing a bid (optional)
    const updatedBids = await fetchBidsForListing(listingId);
    return updatedBids; // Return updated bids
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("Failed to place the bid. Please try again.");
    throw error;
  }
}

/**
 * Attach functionality to the Bid button
 */
export function attachBidButton(listingId) {
  console.log(`Attaching bid button for listing ID: ${listingId}`);
  const bidButton = document.querySelector(`.bid-btn[data-id="${listingId}"]`);
  if (!bidButton) {
    console.warn(`Bid button for listing ${listingId} not found.`);
    return;
  }

  bidButton.addEventListener("click", async () => {
    console.log(`Bid button clicked for listing ID: ${listingId}`);
    const bidAmountInput = document.getElementById(`bidAmount-${listingId}`);
    const bidAmount = parseFloat(bidAmountInput.value);

    // Validate bid amount
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      // Fetch the current listing with bids to get the latest highest bid
      const currentListing = await fetchListingById(listingId);
      const currentHighest =
        currentListing.bids?.length > 0
          ? Math.max(...currentListing.bids.map((bid) => bid.amount))
          : 0;

      // Validate the bid amount against the current highest bid
      if (bidAmount <= currentHighest) {
        alert(
          `Your bid must be higher than the current highest bid of ${currentHighest}.`
        );
        return;
      }

      // Place the bid and fetch updated bids
      const updatedBids = await placeBid(listingId, bidAmount);
      console.log("Updated bids after placing bid:", updatedBids);

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
