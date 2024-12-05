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
    console.log("Add Listing button clicked!"); // Debug log
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

  // Add submit listener to form (if needed)
  const addListingForm = document.getElementById("addListingForm");
  if (addListingForm) {
    addListingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      // Handle form submission logic here
      console.log("Add Listing Form submitted.");
      modal.classList.add("hidden"); // Hide modal after submission
    });
  }
}
