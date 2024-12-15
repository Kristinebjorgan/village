import { fetchApi } from "./api.js";
import { fetchListings } from "./listings.js";

export async function populateCarousel() {
  try {
    const listings = await fetchApi(
      "/auction/listings?_tag=villageWebsite&_active=true"
    );
    const carouselContainer = document.getElementById("carousel");

    if (!listings.data || listings.data.length === 0) {
      carouselContainer.innerHTML = "<p>No recent listings available.</p>";
      return;
    }

    carouselContainer.innerHTML = ""; // Clear the container
    listings.data.forEach((listing) => {
      const carouselItem = document.createElement("a"); // Use <a> to make it clickable
      carouselItem.classList.add(
        "carousel-item",
        "transform",
        "transition",
        "hover:scale-105",
        "duration-200",
        "block"
      );
carouselItem.href = "auction.html";
      carouselItem.innerHTML = `
        <img
          src="${
            listing.media?.[0]?.url ||
            "./media/placeholders/item-placeholder.png"
          }"
          alt="${listing.title}"
          class="w-full h-64 object-cover rounded-lg"
        />
        <div class="text-center mt-2">
          <h3 class="text-lg font-normal text-center tracking-min">${
            listing.title
          }</h3>
          <p class="text-sm text-gray-600">${
            listing.description || "No description available."
          }</p>
        </div>
      `;
      carouselContainer.appendChild(carouselItem);
    });
  } catch (error) {
    console.error("Error populating carousel:", error);
    document.getElementById("carousel").innerHTML =
      "<p>Failed to load recent listings. Please try again later.</p>";
  }
}


export function populatePopularCategories() {
  const categories = [
    {
      title: "Household",
      icon: "./media/icons/house.png",
      category: "household",
    },
    {
      title: "Cooking",
      icon: "./media/icons/homemade.png",
      category: "homemade",
    },
    {
      title: "Handcraft",
      icon: "./media/icons/needle.png",
      category: "handcraft",
    },
    { title: "Sports", icon: "./media/icons/sports.png", category: "sports" },
  ];

  // Target only the grid container
  const categoriesGrid = document.getElementById("popCategoriesGrid");
  categoriesGrid.innerHTML = ""; // Clear only the grid content

  categories.forEach((category) => {
    const categoryCard = document.createElement("div");
    categoryCard.classList.add(
      "category-card",
      "p-4",
      "rounded-lg",
      "shadow-lg"
    );
    categoryCard.innerHTML = `
      <button
        onclick="window.location.href='auction.html?category=${category.category}'"
        class="group text-center w-full"
      >
        <img
          src="${category.icon}"
          alt="${category.title} Icon"
          class="h-24 w-24 mx-auto group-hover:scale-105 transition-transform"
        />
        <h3 class="mt-2 text-lg font-medium">${category.title}</h3>
      </button>
    `;
    categoriesGrid.appendChild(categoryCard);
  });
}

export async function populateHowItWorksSection() {
  const howItWorksContent = document.getElementById("howItWorks");

  try {
    // Fetch the about.html file
    const response = await fetch("about.html");
    if (!response.ok) {
      throw new Error(`Failed to fetch about.html: ${response.statusText}`);
    }

    // Extract and insert content
    const htmlText = await response.text();
    const sectionStart = htmlText.indexOf('<section id="howItWorks"');
    const sectionEnd = htmlText.indexOf("</section>", sectionStart) + 10;
    const howItWorksHTML = htmlText.slice(sectionStart, sectionEnd);

    // Populate
    howItWorksContent.innerHTML = howItWorksHTML;
  } catch (error) {
    console.error("Error fetching How It Works section:", error);
    howItWorksContent.innerHTML = `
      <h3 class="text-xl font-semibold mb-2">How It Works</h3>
      <p class="text-gray-600">
        Village connects people in your community. Create listings, offer services, or bid on help needed.
        It’s a place to bring people together.
      </p>
    `;
  }
}


export async function initializeIndexPage() {
  try {
    await populateCarousel();
    populatePopularCategories();
    populateHowItWorksSection();
  } catch (error) {
    console.error("Error initializing index page:", error);
  }
}
