import { sendApiRequest } from "./api.js";
import { getUsername, clearUserData } from "./config.js";

// Fetch and display user credits
export async function fetchUserCredits() {
  const creditSpan = document.getElementById("creditBalance");
  if (!creditSpan) {
    console.error("Credit span element not found in the DOM.");
    return;
  }

  const username = getUsername();
  const token = getToken();

  if (!username || !token) {
    console.error("Username or token missing. Redirecting to login.");
    creditSpan.textContent = "Login required";
    clearUserData(); // Clear data and redirect
    window.location.href = "/auth.html";
    return;
  }

  try {
    console.log("Fetching profile data for user:", username);

    // Fetch profile data, including optional query parameters
    const profile = await sendApiRequest(
      `/auction/profiles/${username}?_listings=true&_wins=true`,
      "GET"
    );

    // Extract credits
    const credits = profile.credits || 0;
    creditSpan.textContent = `${credits} Credits`;
    console.log("Credits fetched successfully:", credits);

    return credits; // Return the fetched credits if needed elsewhere
  } catch (error) {
    console.error("Error fetching user credits:", error.message);
    creditSpan.textContent = "Error";
    if (error.message.includes("Unauthorized")) {
      clearUserData();
      window.location.href = "/auth.html"; // Redirect user to login
    }
  }
}

/**
 * Initialize the profile page
 */
export async function initProfilePage() {
  try {
    console.log("Initializing Profile Page...");

    const username = getUsername();
    if (!username) {
      throw new Error("User not logged in.");
    }

    const profile = await sendApiRequest(
      `/auction/profiles/${username}?_listings=true&_wins=true`,
      "GET"
    );

    renderProfileOverview(profile.data);
    renderListings(profile.data.listings);
    fetchUserCredits();
    setupActivityToggle(profile.data);
  } catch (error) {
    console.error("Error initializing profile page:", error.message);
    document.getElementById("profile-overview").innerHTML =
      "<p>Failed to load profile. Please try again later.</p>";
  }
}

/**
 * Render profile overview section
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
 * Render listings or bids
 */
function renderListings(activity) {
  const grid = document.getElementById("activity-grid");
  grid.innerHTML = ""; // Clear existing content

  if (!activity || activity.length === 0) {
    grid.innerHTML = "<p>No listings or bids to display.</p>";
    return;
  }

  activity.forEach((item) => {
    const card = document.createElement("div");
    card.className = "listing-card border p-4 rounded shadow";

    card.innerHTML = `
      <h2 class="text-lg font-bold">${item.title}</h2>
      <p class="text-sm text-gray-600">${item.description}</p>
      <p class="text-sm font-semibold">Bids: ${item._count?.bids || 0}</p>
      <p class="text-sm">Ends: ${new Date(item.endsAt).toLocaleDateString()}</p>
    `;

    grid.appendChild(card);
  });
}

/**
 * Setup activity toggle functionality
 */
function setupActivityToggle(profile) {
  const listingsButton = document.getElementById("view-listings");
  const bidsButton = document.getElementById("view-bids");

  listingsButton.addEventListener("click", () => {
    renderListings(profile.listings);
    listingsButton.classList.add("bg-primary", "text-white");
    bidsButton.classList.remove("bg-primary", "text-white");
  });

  bidsButton.addEventListener("click", () => {
    renderListings(profile.wins);
    bidsButton.classList.add("bg-primary", "text-white");
    listingsButton.classList.remove("bg-primary", "text-white");
  });
}
