import { uploadFileToCloudinary } from "./cloudinary.js";
import { loginUser, registerUser } from "./auth.js";

export function initForms() {
  // DOM Elements
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const guestButton = document.getElementById("searchAsGuest");
  const nextButton = document.getElementById("nextButton");
  const modal = document.getElementById("authModal");
  const avatarInput = document.getElementById("avatarUpload");
  const avatarPreview = document.getElementById("avatarPreview");
  const loginError = document.getElementById("loginError");
  let avatarURL = "";

  // Ensure required elements exist
  if (!modal || !loginForm || !signupForm) {
    console.warn("Required modal elements are missing in the DOM.");
    return;
  }

  // Helper: Toggle Forms
  const toggleForms = (formToShow, formToHide) => {
    formToShow.classList.remove("hidden");
    formToHide.classList.add("hidden");
  };

  // Event: Switch to Login Form
  loginTab?.addEventListener("click", () => {
    toggleForms(loginForm, signupForm);
  });

  // Event: Switch to Signup Form
  signupTab?.addEventListener("click", () => {
    toggleForms(signupForm, loginForm);
  });

  // Event: Guest Navigation
  guestButton?.addEventListener("click", () => {
    console.log("Proceeding as a guest...");
    window.location.href = "index.html"; // Redirect to the main page
  });

  // Event: Avatar Upload
  avatarInput?.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      avatarURL = await uploadFileToCloudinary(file);
      console.log("Avatar uploaded successfully:", avatarURL);

      // Update avatar preview
      if (avatarPreview) {
        avatarPreview.src = avatarURL;
        avatarPreview.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error.message);
      alert("Failed to upload avatar. Please try again.");
      avatarURL = ""; // Reset on failure
    }
  });

  // Event: Login Form Submission
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginUsername")?.value.trim();
    const password = document.getElementById("loginPassword")?.value.trim();

    // Clear previous error
    loginError.textContent = "";
    loginError.classList.add("hidden");

    if (!email || !password) {
      loginError.textContent = "Please fill in both email and password.";
      loginError.classList.remove("hidden");
      return;
    }

    try {
      const userData = await loginUser(email, password);
      console.log("Login successful:", userData);
      alert("Login successful!");
      window.location.href = "index.html"; // Redirect on success
    } catch (error) {
      console.error("Login failed:", error.message);
      loginError.textContent =
        error.message || "Login failed. Please try again.";
      loginError.classList.remove("hidden");
    }
  });

  // Event: Signup Form Submission
  nextButton?.addEventListener("click", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPassword")?.value.trim();
    const repeatPassword = document
      .getElementById("repeatPassword")
      ?.value.trim();
    const bio = document.getElementById("biography")?.value.trim();

    // Validate inputs
    if (!username || !email || !password || !repeatPassword) {
      alert("All fields are required.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (password !== repeatPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!avatarURL) {
      alert("Please upload an avatar.");
      return;
    }

    const userData = {
      name: username,
      email,
      password,
      bio: bio || "",
      avatar: avatarURL,
    };

    try {
      const registeredUser = await registerUser(userData);
      console.log("User registered successfully:", registeredUser);
      alert("Registration successful!");
      window.location.href = "index.html"; // Redirect on success
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert(error.message || "Registration failed. Please check your details.");
    }
  });

  // Show the modal on page load
  const showModal = () => {
    modal?.classList.remove("hidden");
  };

  // Automatically show the modal when the page loads
  showModal();
}
