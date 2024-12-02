import { uploadFileToCloudinary } from "./cloudinary.js";
import { loginUser, registerUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const guestButton = document.getElementById("guestButton");
  const nextButton = document.getElementById("nextButton");
  const toggleButtons = document.querySelector(".flex.justify-between");
  const getToKnowForm = document.getElementById("getToKnowForm");
  const avatarInput = document.getElementById("avatarUpload"); // Avatar input
  let avatarURL = ""; // Store uploaded avatar URL

  // Helper: Toggle between forms
  const toggleForms = (formToShow, formToHide) => {
    formToShow.classList.remove("hidden");
    formToShow.classList.add("block");
    formToHide.classList.add("hidden");
    formToHide.classList.remove("block");
  };

  // Event Listeners for Switching
  loginTab?.addEventListener("click", () => {
    toggleForms(loginForm, signupForm);
    toggleButtons.classList.remove("hidden");
  });

  signupTab?.addEventListener("click", () => {
    toggleForms(signupForm, loginForm);
    toggleButtons.classList.remove("hidden");
  });

  // Guest Navigation
  guestButton?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Avatar Upload
  avatarInput?.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      avatarURL = await uploadFileToCloudinary(file); // Upload to Cloudinary
      console.log("Avatar uploaded successfully:", avatarURL);

      // Show avatar preview dynamically
      const previewImage = document.getElementById("avatarPreview");
      const uploadPlaceholder = avatarInput.closest("label"); // Get the label wrapping the placeholder

      if (previewImage) {
        previewImage.src = avatarURL; // Set the uploaded image URL
        previewImage.classList.remove("hidden"); // Show the avatar preview

        if (uploadPlaceholder) {
          uploadPlaceholder.classList.add("hidden"); // Hide the placeholder
        }
      } else {
        console.warn("Avatar preview element not found!");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error.message);
      alert("Failed to upload avatar. Please try again.");
      avatarURL = ""; // Reset avatar URL on failure
    }
  });

  // Log In button
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const errorContainer = document.getElementById("loginError");

    // Clear any previous error
    errorContainer.textContent = "";
    errorContainer.classList.add("hidden");

    if (!email || !password) {
      errorContainer.textContent = "Please fill in both email and password.";
      errorContainer.classList.remove("hidden");
      return;
    }

    try {
      const userData = await loginUser(email, password);
      console.log("Login successful:", userData);
      alert("Login successful!");
      window.location.href = "index.html"; // Redirect on success
    } catch (err) {
      console.error("Login failed:", err.message);
      errorContainer.textContent =
        err.message || "Login failed. Please check your credentials.";
      errorContainer.classList.remove("hidden");
    }
  });

  // Next Button (Signup)
nextButton?.addEventListener("click", async (event) => {
  event.preventDefault();

  // Validate fields before proceeding
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const repeatPassword = document.getElementById("repeatPassword").value.trim();
  const bio = document.getElementById("biography").value.trim();

  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return; // Stop further execution
  }

  if (password !== repeatPassword) {
    alert("Passwords do not match.");
    return; // Stop further execution
  }

  if (!username || !email) {
    alert("Username and email are required.");
    return; // Stop further execution
  }

  if (!avatarURL) {
    alert("Please upload an avatar.");
    return; // Stop further execution
  }

  // Collect registration data
  const userData = {
    name: document.getElementById("username").value.trim(),
    email: document.getElementById("registerEmail").value.trim(),
    password: password,
    bio: document.getElementById("biography").value.trim() || "",
    avatar: {
      url: avatarURL, // Ensure avatarURL is a valid string
    },
    venueManager: false,
  };

  console.log("Registering user:", userData);

  try {
    const registeredUser = await registerUser(userData);
    console.log("User registered successfully:", registeredUser);
    alert("Registration successful!");
  } catch (err) {
    console.error("Registration failed:", err.message);
    alert(err.message || "Registration failed. Please check your details.");
  }

  console.log("Registering user:", userData);

  try {
    const registeredUser = await registerUser(userData);
    console.log("User registered successfully:", registeredUser);
    alert("Registration successful!");
  } catch (err) {
    console.error("Registration failed:", err.message);
    alert(err.message || "Registration failed. Please check your details.");
  }
});
});
