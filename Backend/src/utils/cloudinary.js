import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file directly from memory to Cloudinary
const uploadOnCloudinary = async (fileBuffer, fileName) => {
  try {
    if (!fileBuffer) return null;

    // Upload file to Cloudinary using buffer
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream( {resource_type: "auto"},
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(fileBuffer);
    });

    // Return the uploaded file details
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from the Cloudinary URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // Delete the image from Cloudinary without path prefix
    const response = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image: ${publicId}`);
    return response;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
