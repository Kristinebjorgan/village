import { sendApiRequest } from "./api.js";
import { getUsername } from "./config.js";

/**
 * Fetch and display user profile details.
 */
export async function initProfilePage() {
  const username = getUsername();
  if (!username) {
    console.error("Username not found in localStorage.");
    return;
  }

  try {
    console.log("Fetching profile for user:", username);

    // Fetch profile data
    const profile = await sendApiRequest(
      `/auction/profiles/${username}?_listings=true`,
      "GET"
    );

    // Display profile overview
    renderProfileOverview(profile.data);

    // Display user listings
    renderListings(profile.data.listings);
  } catch (error) {
    console.error("Error initializing profile page:", error.message);
    document.getElementById("profile-overview").innerHTML =
      "<p>Failed to load profile. Please try again later.</p>";
  }
}

/**
 * Fetch user credits independently.
 * @returns {Promise<number>} - Returns the user's credits.
 */
export async function fetchCredits() {
  const username = getUsername();
  if (!username) {
    console.error("Username not found in localStorage.");
    return 0; // Default to 0 if no username
  }

  try {
    const profile = await sendApiRequest(`/auction/profiles/${username}`, "GET");
    return profile.data.credits || 0;
  } catch (error) {
    console.error("Error fetching user credits:", error.message);
    return 0; // Return 0 on error
  }
}


/**
 * Render profile overview section.
 * @param {Object} profile - Profile data from the API.
 */
function renderProfileOverview(profile) {
  const avatar = document.getElementById("avatar");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const credits = document.getElementById("credits");
  const bio = document.getElementById("bio");

  avatar.src = profile.avatar?.url || "default-avatar.png";
  avatar.alt = profile.avatar?.alt || "User Avatar";
  username.textContent = profile.name || "Unknown User";
  email.textContent = `Email: ${profile.email || "N/A"}`;
  credits.textContent = `${profile.credits || 0} Credits`;
  bio.textContent = profile.bio || "No bio available.";
}

/**
 * Render user listings in the activity grid.
 * @param {Array} listings - Array of listing objects from the API.
 */
function renderListings(listings) {
  const grid = document.getElementById("activity-grid");
  grid.innerHTML = ""; // Clear existing content

  if (!listings || listings.length === 0) {
    grid.innerHTML = "<p>No listings to display.</p>";
    return;
  }

  listings.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "listing-card border p-4 rounded shadow";

    card.innerHTML = `
      <h2 class="text-lg font-bold">${listing.title}</h2>
      <p class="text-sm text-gray-600">${listing.description}</p>
      <p class="text-sm font-semibold">Bids: ${listing._count?.bids || 0}</p>
      <p class="text-sm">Ends: ${new Date(
        listing.endsAt
      ).toLocaleDateString()}</p>
    `;

    grid.appendChild(card);
  });
}

/**
 * Enable bio editing functionality.
 */
export function enableBioEditing() {
  const editBioButton = document.getElementById("edit-bio-btn");
  const bio = document.getElementById("bio");

  editBioButton.addEventListener("click", async () => {
    const newBio = prompt("Update your bio:", bio.textContent);
    if (!newBio) return;

    const username = getUsername();
    try {
      const response = await sendApiRequest(
        `/auction/profiles/${username}`,
        "PUT",
        { bio: newBio }
      );
      bio.textContent = response.data.bio || "No bio available.";
      alert("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error.message);
      alert("Failed to update bio. Please try again.");
    }
  });
}
