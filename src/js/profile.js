import { fetchApi, getUsername } from "./api.js";

// Fetch user profile data
async function fetchUserProfile() {
  const username = getUsername();
  if (!username) throw new Error("Username is not set.");
  const endpoint = `/auction/profiles/${username}`;
  return await fetchApi(endpoint);
}

// Fetch user listings
async function fetchUserListings() {
  const username = getUsername();
  if (!username) throw new Error("Username is not set.");
  const endpoint = `/auction/profiles/${username}/listings`;
  return await fetchApi(endpoint);
}

// Fetch user bids
async function fetchUserBids() {
  const username = getUsername();
  if (!username) throw new Error("Username is not set.");
  const endpoint = `/auction/profiles/${username}/bids?_listings=true`;
  return await fetchApi(endpoint);
}

// Render profile page
export async function renderProfilePage() {
  const profileContainer = document.getElementById("profileContainer");
  if (!profileContainer) {
    console.warn(
      "Profile page elements not found. Skipping profile rendering."
    );
    return;
  }

  try {
    const [profileData, listings, bids] = await Promise.all([
      fetchUserProfile(),
      fetchUserListings(),
      fetchUserBids(),
    ]);

    document.getElementById("userAvatar").src =
      profileData.avatar?.url || "https://via.placeholder.com/150";
    document.getElementById("userName").textContent = profileData.name;
    document.getElementById("userBio").textContent =
      profileData.bio || "No bio provided.";
    document.getElementById(
      "userCredits"
    ).textContent = `Credits: ${profileData.credits}`;

    const listingsContainer = document.getElementById("listingsContainer");
    listings.forEach((listing) => {
      const isExpired = new Date(listing.endsAt) < new Date();
      listingsContainer.innerHTML += `
        <div class="p-4 border rounded-lg ${isExpired ? "bg-gray-100" : ""}">
          <h3>${listing.title}</h3>
          <p>${listing.description}</p>
          <p>Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>
        </div>`;
    });

    const bidsContainer = document.getElementById("bidsContainer");
    bids.forEach((bid) => {
      bidsContainer.innerHTML += `
        <div class="p-4 border rounded-lg">
          <h3>Bid on: ${bid.listing.title}</h3>
          <p>Bid Amount: ${bid.amount}</p>
        </div>`;
    });
  } catch (error) {
    console.error("Error rendering profile page:", error.message);
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes("profile.html")) {
    renderProfilePage();
  }
});
