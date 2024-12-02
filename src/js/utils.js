 // api.js
import { API_BASE_URL, API_KEY, getToken } from "./config.js";

export async function sendApiRequest(url, method, body = null) {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }

  return response.json();
}
