import { fetchApi, sendApiRequest } from "./api.js";

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
    console.log("Fetched Listings:", fetchedListings);

    // Display listings
    displayListings(fetchedListings);

    // Attach bid button functionality
    fetchedListings.forEach((listing) => attachBidButton(listing.id));

    return fetchedListings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}



function generateListingHTML(listing) {
  const highestBid =
    listing.bids?.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : "No bids yet";

const listingHTML = `
  <div class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
    <img
      src="${
        listing.media[0]?.url || "./media/placeholders/item-placeholder.png"
      }"
      alt="${listing.media[0]?.alt || "Listing Image"}"
      class="h-40 w-full object-cover"
    />
    <div class="p-4">
      <h3 class="text-lg font-bold text-gray-800 truncate">${listing.title}</h3>
      <p class="text-sm text-gray-600 truncate">${listing.description}</p>
      <p class="text-sm text-gray-600 mt-2">Ends: ${new Date(
        listing.endsAt
      ).toLocaleDateString()}</p>
      <p class="text-sm font-bold text-primary mt-1">Highest Bid: ${
        listing.bids?.length > 0
          ? Math.max(...listing.bids.map((bid) => bid.amount))
          : "No bids yet"
      }</p>
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


  // Return the HTML so it can be rendered
  return listingHTML;
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
 * Place a bid on a listing
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
    return response.data; // Return the updated listing or bid confirmation
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
  console.log(`Attempting to attach bid button for listing ID: ${listingId}`);
  const bidButton = document.querySelector(`.bid-btn[data-id="${listingId}"]`);
  if (!bidButton) {
    console.warn(`Bid button for listing ${listingId} not found. DOM state:`);
    console.log(document.getElementById("listings-container").innerHTML);
    return;
  }

  bidButton.addEventListener("click", async () => {
    console.log(`Bid button clicked for listing ID: ${listingId}`);
    const bidAmountInput = document.getElementById(`bidAmount-${listingId}`);
    const bidAmount = parseFloat(bidAmountInput.value);

    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      const updatedListing = await placeBid(listingId, bidAmount);
      console.log("Bid successful:", updatedListing);

      // Clear input field and refresh the UI
      bidAmountInput.value = "";
      const updatedListings = await fetchListings(); // Refresh listings
      displayListings(updatedListings); // Display updated listings
    } catch (error) {
      console.error("Error handling bid:", error);
    }
  });
}

