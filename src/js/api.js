// Constants
export const API_BASE_URL = "https://v2.api.noroff.dev";
export const API_KEY = "04dfcfba-5d8b-491c-9ab1-962c4b746a47";
export const DEFAULT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia3Jpc3RpbmViam9yZ2FuIiwiZW1haWwiOiJrcmliam81MzY2MkBzdHVkLm5vcm9mZi5ubyIsImlhdCI6MTczMzkzODY1Mn0.WkApZAyVz86JSEtJbfzZlF2F6aGqMxpGhm3zkVSaiB4";

// Token Management
/**
 * Validate a JWT token
 * @param {string} token - The JWT token to validate
 * @returns {boolean} - Returns true if the token is valid, false otherwise
 */
export function isTokenValid(token) {
  console.log("Validating Token:", token);
  if (!token || typeof token !== "string" || !token.includes(".")) {
    console.warn("Invalid token: Token is malformed or missing.");
    return false;
  }

  try {
    const payloadPart = token.split(".")[1];
    const payload = JSON.parse(atob(payloadPart));
    console.log("Token Payload:", payload);
    if (!payload.exp) {
      console.warn("Invalid token: Missing expiration time.");
      return false;
    }
    const expiry = payload.exp * 1000;
    console.log("Token Expiry:", expiry, "Current Time:", Date.now());
    return Date.now() < expiry;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}


export function setToken(token) {
  try {
    localStorage.setItem("jwtToken", token);
    console.log("Token stored successfully:", token);
  } catch (error) {
    console.error("Failed to store token:", error);
  }
}

export function getApiKey() {
  return localStorage.getItem("apiKey") || API_KEY;
}

export function setApiKey(apiKey) {
  localStorage.setItem("apiKey", apiKey);
}

export function setUsername(username) {
  localStorage.setItem("username", username);
}

export function getUsername() {
  return localStorage.getItem("username");
}

export function clearUserData() {
  localStorage.clear();
}

//getToken
export function getToken() {
  return localStorage.getItem("jwtToken");
}

//Function for api request
export async function sendApiRequest(url, method, body = null) {
   const token = getToken() || DEFAULT_TOKEN;
   if (!getToken()) {
     console.warn("Using fallback token instead of the actual token.");
   }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      getToken() || 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia3Jpc3RpbmViam9yZ2FuIiwiZW1haWwiOiJrcmliam81MzY2MkBzdHVkLm5vcm9mZi5ubyIsImlhdCI6MTczMzkzODY1Mn0.WkApZAyVz86JSEtJbfzZlF2F6aGqMxpGhm3zkVSaiB4"
    }`,
    "X-Noroff-API-Key": getApiKey() || "04dfcfba-5d8b-491c-9ab1-962c4b746a47",
  };

  // Use a hardcoded URL for testing
  const apiUrl = `https://v2.api.noroff.dev${url}`; // Hardcoded base URL

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request Error:", {
      message: error.message,
      url: apiUrl,
      method,
      body,
    });
    throw error;
  }
}

// Function for GET requests
export async function fetchApi(url) {
  const token = getToken() || "";
  const apiKey = getApiKey() || "";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": apiKey,
  };

  // Construct the API URL and avoid duplicate slashes
  const apiUrl = new URL(url, API_BASE_URL).toString().replace(/([^:]\/)\/+/g, "$1");
  console.log("Final API URL:", apiUrl); // Log the final URL for debugging

  try {
    const response = await fetch(apiUrl, { method: "GET", headers });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.warn("Failed to parse error response as JSON. Falling back to text.");
        errorData = { message: await response.text() };
      }
      throw new Error(errorData.message || "An error occurred while fetching data");
    }

    const data = await response.json();
    console.log("Fetched Data:", data); // Log the fetched data for debugging
    return data;
  } catch (error) {
    console.error("Fetch API Error:", {
      message: error.message,
      url: apiUrl,
    });
    throw error;
  }
}

// Helper to construct query strings
export function buildQueryString(params = {}) {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}
