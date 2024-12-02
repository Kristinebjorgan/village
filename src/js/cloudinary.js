const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dbjbheduy/upload";
const CLOUDINARY_PRESET = "village_avatars";

export async function uploadFileToCloudinary(file) {
  console.log("Starting Cloudinary upload..."); // Debug

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  try {
    console.log("Sending file to Cloudinary..."); // Debug
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary Error Response:", errorData); // Debug
      throw new Error("Failed to upload image to Cloudinary.");
    }

    const data = await response.json();
    console.log("Cloudinary response data:", data); // Debug
    return data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message); // Debug
    throw error;
  }
}
