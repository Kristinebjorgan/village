import { sendApiRequest } from "./api.js";

export function getAddListingModalHTML() {
  return `
    <div id="addListingModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <form id="addListingForm">
          <h2 class="text-lg font-bold mb-4">Add a New Listing</h2>
          <div class="mb-4">
            <label for="title" class="block text-sm font-light">Title</label>
            <input id="title" class="w-full border rounded p-2" placeholder="Enter title" required />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-light">Description</label>
            <textarea id="description" class="w-full border rounded p-2" placeholder="Enter description" rows="4"></textarea>
          </div>
          <div class="mb-4">
            <label for="media" class="block text-sm font-light">Image URL</label>
            <input id="media" class="w-full border rounded p-2" placeholder="Enter image URL" />
          </div>
          <div class="mb-4">
            <label for="tags" class="block text-sm font-light">Tags (Comma-separated)</label>
            <input id="tags" class="w-full border rounded p-2" placeholder="e.g., household, sports" />
          </div>
          <div class="mb-4">
            <label for="deadline" class="block text-sm font-light">Deadline</label>
            <input id="deadline" type="date" class="w-full border rounded p-2" required />
          </div>
          <div class="flex justify-between">
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded">Add</button>
            <button type="button" id="closeModalBtn" class="bg-gray-300 px-4 py-2 rounded">Close</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function attachModalToButton(buttonId) {
  const addListingBtn = document.getElementById(buttonId);
  if (!addListingBtn) {
    console.warn(`Button with ID "${buttonId}" not found.`);
    return;
  }

  addListingBtn.addEventListener("click", () => {
    console.log("Add Listing button clicked!");
    const modal = document.getElementById("addListingModal");
    if (modal) {
      modal.classList.remove("hidden");
    } else {
      console.error("Add Listing Modal not found.");
    }
  });
}

export function initializeModal() {
  const modal = document.getElementById("addListingModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (!modal || !closeModalBtn) {
    console.error("Modal or Close button not found.");
    return;
  }

  // Close modal on button click
  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal when clicking outside the form
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Add submit listener to form
  const addListingForm = document.getElementById("addListingForm");
  if (addListingForm) {
    addListingForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Add Listing Form submitted.");

      // Gather form data
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const mediaInput = document.getElementById("media").value.trim();
      const tagsInput = document.getElementById("tags").value.trim();
      const deadline = document.getElementById("deadline").value;

      // Validate required fields
      if (!title || !deadline) {
        alert("Please fill in all required fields.");
        return;
      }

      // Prepare media array
      const media = mediaInput
        ? [{ url: mediaInput, alt: `${title} Image` }]
        : [];

      // Prepare tags array
      const tags = tagsInput
        ? tagsInput.split(",").map((tag) => tag.trim())
        : [];

      // Prepare the payload
      const payload = {
        title, // Required
        description: description || "No description provided.", // Optional
        tags: [...tags, "villageWebsite"], // Optional (add default tag)
        media, // Optional (array of objects)
        endsAt: new Date(deadline).toISOString(), // Required
      };

      console.log("Payload for API:", payload);

      try {
        // Send request to the API
        const data = await sendApiRequest("/auction/listings", "POST", payload);

        // Log the response for debugging
        console.log("API Response:", data);

        if (data && data.data) {
          alert(
            `Listing added successfully! ID: ${data.data.id}, Title: ${data.data.title}`
          );
          modal.classList.add("hidden");
          location.reload();
        } else {
          console.warn("Unexpected server response:", data);
          alert("Please verify if the listing was successfully added.");
        }
      } catch (error) {
        console.error("Error occurred while adding the listing:", error);
        alert(
          `Error: ${
            error.message || "Failed to add listing. Please try again."
          }`
        );
      }
    });
  }
}

