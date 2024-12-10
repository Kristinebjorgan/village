 import { sendApiRequest } from "./api.js";
 import { getUsername } from "./config.js";

 // Fetch user profile data
async function fetchUserProfile() {
   const username = getUsername();
   const endpoint = `/auction/profiles/${username}`;
   return await sendApiRequest(endpoint, "GET");
 }

 // Fetch user listings
 async function fetchUserListings() {
   const username = getUsername();
   const endpoint = `/auction/profiles/${username}/listings`;
   return await sendApiRequest(endpoint, "GET");
 }

 // Fetch user bids
  async function fetchUserBids() {
   const username = getUsername();
   console.log("Retrieved username:", username); // Should not be null
   if (!username) {
     throw new Error("Username is not set. Ensure the user is logged in.");
   }
   const endpoint = `/auction/profiles/${username}/bids?_listings=true`;
   return await sendApiRequest(endpoint, "GET");
 }

 // Check if a listing is expired
  function isExpired(endsAt) {
   return new Date(endsAt) < new Date();
 }

 // Render profile page
 export async function renderProfilePage() {
   try {
     // Fetch data
     const [profileData, listings, bids] = await Promise.all([
       fetchUserProfile(),
       fetchUserListings(),
       fetchUserBids(),
     ]);

     // Render user info
     document.getElementById("userAvatar").src =
       profileData.data.avatar?.url || "https://via.placeholder.com/150";
     document.getElementById("userName").textContent = profileData.data.name;
     document.getElementById("userBio").textContent =
       profileData.data.bio || "No bio provided.";
     document.getElementById(
       "userCredits"
     ).textContent = `Credits: ${profileData.data.credits}`;

     // Render listings
     const listingsContainer = document.getElementById("listingsContainer");
     listings.data.forEach((listing) => {
       const isListingExpired = isExpired(listing.endsAt);
       listingsContainer.innerHTML += `
        <div class="p-4 border rounded-lg ${
          isListingExpired ? "bg-gray-100" : ""
        }">
          <h3 class="font-semibold">${listing.title}</h3>
          <p>${listing.description}</p>
          <p class="text-sm text-gray-600">Ends at: ${new Date(
            listing.endsAt
          ).toLocaleString()}</p>
        </div>`;
     });

     // Render bids
     const bidsContainer = document.getElementById("bidsContainer");
     bids.data.forEach((bid) => {
       const listing = bid.listing;
       bidsContainer.innerHTML += `
        <div class="p-4 border rounded-lg">
          <h3 class="font-semibold">Bid on: ${listing.title}</h3>
          <p>Bid Amount: ${bid.amount}</p>
          <p class="text-sm text-gray-600">Ends at: ${new Date(
            listing.endsAt
          ).toLocaleString()}</p>
        </div>`;
     });
   } catch (error) {
     console.error("Error rendering profile page:", error);
   }
 }

 // Initialize
 document.addEventListener("DOMContentLoaded", renderProfilePage);
