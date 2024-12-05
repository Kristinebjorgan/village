// api.js
import { API_BASE_URL, API_KEY } from "./config.js";
import { getToken } from "./config.js";

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
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
console.log("API Request Details:", {
  url: `${API_BASE_URL}${url}`,
  options,
});

const response = await fetch(`${API_BASE_URL}${url}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("API Request Error:", {
      message: error.message,
      url: `${API_BASE_URL}${url}`,
      method,
      body,
    });
    throw error;
  }
}
