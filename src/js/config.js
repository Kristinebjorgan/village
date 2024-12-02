// config.js
export const API_BASE_URL = "https://v2.api.noroff.dev";
export const API_KEY = "36955f43-828f-4a15-b535-932e5b6484db";

// Retrieve Token
export function getToken() {
  return localStorage.getItem("jwtToken");
}

// Save Token
export function setToken(token) {
  localStorage.setItem("jwtToken", token);
}

// Clear Token (Logout)
export function clearToken() {
  localStorage.removeItem("jwtToken");
}