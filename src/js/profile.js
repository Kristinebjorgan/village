import { API_BASE_URL } from "./config.js";

export async function initProfilePage() {
  try {
    console.log("Initializing Profile Page...");

    // Fetch profile data
    const profile = await fetchProfileData();

    // Render the profile overview
    renderProfileOverview(profile);

    // Render the initial activity grid (listings by default)
    renderListings(profile.listings);

    // Set up toggle functionality for listings and bids
    setupActivityToggle(profile);
  } catch (error) {
    console.error("Error initializing profile page:", error);
    document.getElementById("profile-overview").innerHTML =
      "<p>Failed to load profile. Please try again later.</p>";
  }
}

// Fetch profile data from the API
async function fetchProfileData() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("jwtToken");

  if (!username || !token) {
    throw new Error("User is not logged in or username is missing.");
  }

  const response = await fetch(
    `${API_BASE_URL}/auction/profiles/${username}?_listings=true&_wins=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch profile data. Status: ${response.status}`);
  }

  return await response.json();
}

// Render the profile overview section
function renderProfileOverview(profile) {
  const avatar = document.getElementById("avatar");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const credits = document.getElementById("credits");
  const bio = document.getElementById("bio");
  const editBioBtn = document.getElementById("edit-bio-btn");

  avatar.src = profile.avatar?.url || "default-avatar.png";
  username.textContent = profile.name || "Unknown User";
  email.textContent = `Email: ${profile.email || "N/A"}`;
  credits.textContent = `${profile.credits || 0} Credits`;
  bio.textContent = profile.bio || "No bio available.";

  // Add event listener for editing bio
  editBioBtn.addEventListener("click", () => {
    const newBio = prompt("Enter your new bio:");
    if (newBio) {
      updateProfileBio(newBio);
    }
  });
}

// Update the user's bio via the API
async function updateProfileBio(newBio) {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(
      `${API_BASE_URL}/auction/profiles/${username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: newBio }),
      }
    );

    if (response.ok) {
      document.getElementById("bio").textContent = newBio;
      console.log("Bio updated successfully!");
    } else {
      throw new Error(`Failed to update bio. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating bio:", error);
    alert("Failed to update bio. Please try again.");
  }
}

// Render the activity grid (listings or bids)
function renderListings(activity) {
  const grid = document.getElementById("activity-grid");
  grid.innerHTML = ""; // Clear existing content

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

// Set up toggle functionality for Listings and Bids
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
