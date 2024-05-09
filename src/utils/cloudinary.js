import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resorce_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    //file uploaded successfully
    // console.log("File has been uploaded on Cloudiary", response.url);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove locally saved temporary file as the upload operation failed
    return null;
  }
};

const deleteFromCloudinary = async (filePublicUrl) => {
  try {
    if (!filePublicUrl) {
      return; // No need to delete if the URL is not provided
    }

    await cloudinary.uploader.destroy(filePublicUrl);
    console.log("File deleted from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
