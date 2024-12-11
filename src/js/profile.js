import { fetchApi, sendApiRequest, getUsername } from "./api.js";


// Fetch user profile data
async function fetchUserProfile() {
  const username = getUsername();
  if (!username) throw new Error("Username is not set.");
  return await fetchApi(`/auction/profiles/${username}`);
}

// Fetch user listings
async function fetchUserListings() {
  const username = getUsername();
  if (!username) throw new Error("Username is not set.");
  return await fetchApi(`/auction/profiles/${username}/listings`);
}

// Fetch user wins
async function fetchUserWins() {
  const username = getUsername();
  if (!username) throw new Error("Username is not set.");
  return await fetchApi(`/auction/profiles/${username}/wins`);
}

// Update user profile (bio, avatar, banner)
async function updateUserProfile(updateData) {
  const username = getUsername();
  if (!username) throw new Error("Username is not set.");
  return await sendApiRequest(`/auction/profiles/${username}`, "PUT", updateData);
}

function renderUserProfile(profileData) {
  const userData = profileData.data; // Extract the data property

  const avatarEl = document.getElementById("userAvatar");
  const nameEl = document.getElementById("userName");
  const bioEl = document.getElementById("userBio");
  const creditsEl = document.getElementById("userCredits");

  avatarEl.src = userData.avatar?.url || "https://via.placeholder.com/150";
  avatarEl.alt = userData.avatar?.alt || "User Avatar";
  nameEl.textContent = userData.name || "Unknown User";
  bioEl.textContent = userData.bio || "No bio provided.";
  creditsEl.textContent = `Credits: ${userData.credits || 0}`;
}

function renderUserListings(listings) {
  const listingsData = listings.data || []; // Safely extract data property
  const listingsContainer = document.getElementById("listingsContainer");
  listingsContainer.innerHTML = "";

  if (!listingsData.length) {
    listingsContainer.innerHTML = "<p>No listings found.</p>";
    return;
  }

  listingsData.forEach((listing) => {
    const card = document.createElement("div");
    card.className = `p-4 border rounded-lg ${
      new Date(listing.endsAt) < Date.now() ? "bg-gray-100" : ""
    }`;
    card.innerHTML = `
      <h3 class="font-semibold">${listing.title}</h3>
      <p>${listing.description || "No description available."}</p>
      <p>Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>`;
    listingsContainer.appendChild(card);
  });
}

function renderUserWins(wins) {
  const winsData = wins.data || []; // Safely extract data property
  const winsContainer = document.getElementById("winsContainer");
  winsContainer.innerHTML = "";

  if (!winsData.length) {
    winsContainer.innerHTML = "<p>No wins found.</p>";
    return;
  }

  winsData.forEach((win) => {
    const card = document.createElement("div");
    card.className = `p-4 border rounded-lg`;
    card.innerHTML = `
      <h3 class="font-semibold">${win.title}</h3>
      <p>${win.description || "No description available."}</p>`;
    winsContainer.appendChild(card);
  });
}


// Edit and Update Bio
async function handleEditBio() {
  const bioInput = document.getElementById("editBioInput");
  const newBio = bioInput.value.trim();

  if (!newBio) {
    alert("Bio cannot be empty!");
    return;
  }

  try {
    const updatedProfile = await updateUserProfile({ bio: newBio });
    alert("Bio updated successfully!");
    renderUserProfile(updatedProfile); // Update profile info on the page
  } catch (error) {
    console.error("Failed to update bio:", error.message);
    alert("Failed to update bio. Please try again.");
  }
}

// Attach event listener for saving bio
document.getElementById("saveBioButton")?.addEventListener("click", handleEditBio);

// Render Entire Profile Page
export async function renderProfilePage() {
  try {
    // Fetch all required data
    const [profileData, listings, wins] = await Promise.all([
      fetchUserProfile(),
      fetchUserListings(),
      fetchUserWins(),
    ]);

    // Render data
    renderUserProfile(profileData);
    renderUserListings(listings);
    renderUserWins(wins);
  } catch (error) {
    console.error("Error rendering profile page:", error.message);

    const mainContainer = document.querySelector("main");
    mainContainer.innerHTML = `<p class="text-red-500">Failed to load profile: ${error.message}</p>`;
  }
}
