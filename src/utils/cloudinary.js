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
    // Check if filePublicUrl is provided
    if (!filePublicUrl) {
      console.log("No file URL provided. Skipping deletion.");
      return;
    }
    console.log(filePublicUrl);
    const publicId = extractPublicId(filePublicUrl);
    console.log(publicId);
    // Delete file from Cloudinary using public ID
    const deletionResult = await cloudinary.uploader.destroy(publicId);
    console.log("File deletion result:", deletionResult);

    // Check if deletion was successful
    if (deletionResult.result === "ok") {
      console.log("File deleted successfully from Cloudinary");
    } else {
      console.error("Error deleting file from Cloudinary:", deletionResult);
      throw new Error("File deletion failed");
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw error;
  }
};
const extractPublicId = (filePublicUrl) => {
  const parts = filePublicUrl.split("/");
  const filename = parts.pop().split(".")[0];
  return filename;
};

export { uploadOnCloudinary, deleteFromCloudinary };
