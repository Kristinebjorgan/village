import { uploadFileToCloudinary } from "./cloudinary.js";
import { loginUser, registerUser } from "./auth.js";

let avatarURL = ""; // Global variable for avatar URL

/**
 * Initialize form-related event listeners
 */
export function initForms() {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const avatarUpload = document.getElementById("avatarUpload");

  // Validate DOM elements exist
  if (!loginTab || !signupTab || !loginForm || !signupForm) {
    console.warn("Missing form-related elements in DOM.");
    return;
  }

  console.log("Initializing form-related event listeners...");

  // Add listeners for tab switching
  loginTab.addEventListener("click", () => toggleForms("login"));
  signupTab.addEventListener("click", () => toggleForms("signup"));

  // Attach form-specific listeners
  signupForm?.addEventListener("submit", handleRegister);
  avatarUpload?.addEventListener("change", handleAvatarUpload);
  loginForm?.addEventListener("submit", handleLogin);
  console.log("Form listeners attached successfully.");
}

/**
 * Toggle between login and signup forms
 * @param {string} formType - The form to show ("login" or "signup")
 */
function toggleForms(formType) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (formType === "login") {
    loginForm?.classList.remove("hidden");
    signupForm?.classList.add("hidden");
  } else if (formType === "signup") {
    signupForm?.classList.remove("hidden");
    loginForm?.classList.add("hidden");
  }
}

/**
 * Handle login
 */
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginUsername")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  const loginError = document.getElementById("loginError");
  loginError.textContent = "";
  loginError.classList.add("hidden");

  if (!email || !password) {
    displayError("Please fill in both email and password.", loginError);
    return;
  }

  try {
    const userData = await loginUser(email, password);
    console.log("Login successful:", userData);
    alert("Login successful!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login failed:", error.message);
    displayError(error.message || "Login failed.", loginError);
  }
}

/**
 * Handle user registration
 */
async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("username")?.value.trim();
  const email = document.getElementById("registerEmail")?.value.trim();
  const password = document.getElementById("registerPassword")?.value.trim();
  const repeatPassword = document
    .getElementById("repeatPassword")
    ?.value.trim();
  const bio = document.getElementById("biography")?.value.trim();

  if (!username || !email || !password || !repeatPassword) {
    displayError("All fields are required.");
    return;
  }

  if (password !== repeatPassword) {
    displayError("Passwords do not match.");
    return;
  }

  if (password.length < 8) {
    displayError("Password must be at least 8 characters.");
    return;
  }

  if (!avatarURL) {
    displayError("Please upload an avatar.");
    return;
  }

  const userData = {
    name: username,
    email,
    password,
    bio: bio || "",
    avatar: {
      url: avatarURL,
      alt: `${username}'s avatar`,
    },
  };

  try {
    console.log("Registering user:", userData);
    const registeredUser = await registerUser(userData);
    console.log("User registered successfully:", registeredUser);
    alert("Registration successful! Redirecting to login...");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Registration failed:", error.message);
    displayError(error.message || "Registration failed.");
  }
}

async function handleAvatarUpload(event) {
  console.log("Avatar upload event triggered.");
  const file = event.target.files[0];
  if (!file) {
    console.error("No file selected.");
    return;
  }

  const avatarPreview = document.getElementById("avatarPreview");
  const avatarLabel = document.getElementById("avatarLabel"); // Reference the label directly

  try {
    avatarURL = await uploadFileToCloudinary(file); // Upload to Cloudinary
    console.log("File uploaded successfully. URL:", avatarURL);

    // Update the avatar preview image
    if (avatarPreview) {
      avatarPreview.src = avatarURL;
      avatarPreview.classList.remove("hidden"); // Show the preview image
      console.log("Avatar preview updated.");
    } else {
      console.error("Avatar preview element not found.");
    }

    // Hide the upload label
    if (avatarLabel) {
      avatarLabel.classList.add("hidden"); // Use Tailwind's `hidden` class
      console.log("Avatar upload label hidden.");
    }
  } catch (error) {
    console.error("Avatar upload failed:", error.message);
    displayError("Failed to upload avatar. Please try again.");
  }
}
// Submit the form
try {
  console.log("Registering user:", userData);
  const registeredUser = await registerUser(userData);
  console.log("User registered successfully:", registeredUser);

  // Redirect on successful registration
  alert("Registration successful! Redirecting to login...");
  window.location.href = "login.html";
} catch (error) {
  console.error("Registration failed:", error.message);
  displayError(error.message || "Registration failed.");
}

/**
 * Utility: Display error messages on forms or as alerts.
 */
export function displayError(message, errorElement = null) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  } else {
    alert(message);
  }
}
