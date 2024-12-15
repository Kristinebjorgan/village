import { setToken, setUsername, clearUserData } from "./api.js";
import { sendApiRequest } from "./api.js";

// Login User
export const loginUser = async (email, password) => {
  const payload = { email, password }; 

  try {
    const data = await sendApiRequest("/auth/login", "POST", payload);

    // AccessToken
    const accessToken = data?.data?.accessToken;
    if (!accessToken) {
      throw new Error("Login failed: Missing accessToken in response.");
    }

    // Save token and username to localStorage
    setToken(accessToken);
    setUsername(data.data.name);

    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};


//logout user
export function logoutUser() { 
  // Clear user data and ensure token is removed
  localStorage.removeItem("jwtToken"); 
  clearUserData();

  // Redirect after a slight delay to ensure cleanup
  setTimeout(() => {
    window.location.href = "/auth.html";
  }, 100); // 100ms delay
}

//Register User
export const registerUser = async (userData) => {
  const payload = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    bio: userData.bio || "",
    avatar: userData.avatar
      ? {
          url: userData.avatar.url,
          alt: userData.avatar.alt || "",
        }
      : null,
  };

  try {
    const data = await sendApiRequest("/auth/register", "POST", payload);
    alert("Registration successful! Redirecting to homepage...");
    window.location.href = "index.html"; // Redirect to index.html after successful registration
    return data; // Return registration response for further handling if needed
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
};