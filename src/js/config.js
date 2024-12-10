// Constants
export const API_BASE_URL = "https://v2.api.noroff.dev/auction/";
export const API_KEY = "36955f43-828f-4a15-b535-932e5b6484db";

// Token Management
export function getToken() {
  return localStorage.getItem("jwtToken");
}

export function setToken(token) {
  localStorage.setItem("jwtToken", token);
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
