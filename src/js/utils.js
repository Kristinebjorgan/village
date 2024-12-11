import { API_BASE_URL } from "./api.js";

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

//Credit 
export function updateCreditBalance(credits) {
  const creditBalanceEl = document.getElementById("creditBalance");
  if (creditBalanceEl) {
    creditBalanceEl.textContent = `${credits || 0}`;
  } else {
    console.warn("Credit balance element not found in the DOM.");
  }
}

