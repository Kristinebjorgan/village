// Constants
export const API_BASE_URL = "https://v2.api.noroff.dev/auction/";
export const API_KEY = "36955f43-828f-4a15-b535-932e5b6484db";

// Token Management
export function setToken(token) {
  console.log("Setting token:", token); // Debugging
  localStorage.setItem("jwtToken", token);
  console.log("Token set in localStorage.");
}

export function getToken() {
  const token = localStorage.getItem("jwtToken");
  console.log("Retrieved token:", token); // Debugging
  return token;
}

export function clearToken() {
  localStorage.removeItem("jwtToken");
}

// Username Management
export function getUsername() {
  return localStorage.getItem("username");
}

export function setUsername(username) {
  localStorage.setItem("username", username);
}

export function clearUsername() {
  localStorage.removeItem("username");
}

// Clear All User Data
export function clearUserData() {
  console.log("Clearing user data...");
  clearToken();
  clearUsername();
}
