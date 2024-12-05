import { API_BASE_URL } from "./config.js";

// Categories
export function getCategoryButtons() {
  const categoryButtons = document.querySelectorAll(".category-btn");
  if (!categoryButtons.length) {
    console.warn("No category buttons found.");
    return;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      if (category) {
        console.log(`Redirecting to auction.html with category: ${category}`);
        window.location.href = `auction.html?category=${category}`;
      } else {
        console.warn("Category data missing for button:", button);
      }
    });
  });
}

//Credits
export async function fetchUserCredits() {
  const creditSpan = document.getElementById("creditBalance");

  if (!creditSpan) {
    console.error("Credit span element not found in the DOM.");
    return;
  }

  try {
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username"); // Get the stored username
    if (!token || !username) {
      console.error(
        "JWT token or username missing. User might not be logged in."
      );
      creditSpan.textContent = "0 Credits";
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/auction/profiles/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user profile. Status: ${response.status}`
      );
    }

    const profile = await response.json();
    const credits = profile.data.credits || 0; // Use 0 as a fallback

    // Update the UI
    creditSpan.textContent = `${credits} Credits`;
    console.log("User credits fetched successfully:", credits);
  } catch (error) {
    console.error("Error fetching user credits:", error);
    creditSpan.textContent = "Error";
  }
}


// Call this function after login or on page load
document.addEventListener("DOMContentLoaded", fetchUserCredits);

// Update credits dynamically after any action
export async function updateCreditsAfterAction() {
  await fetchUserCredits();
}
