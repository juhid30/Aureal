import { asyncHandler } from "../utils/asyncHandler.js";
import { Animal } from "../models/animals.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
const addAnimalToDirec = asyncHandler(async (req, res) => {
  const { name, species, habitat, diet, behavior, conservationStatus } =
    req.body;
  console.log(req.body);
  //all parameters should be present
  if (
    [name, species, habitat, diet, behavior, conservationStatus].some(
      (field) => field == null || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //check if animal already exists in the directory
  const existingAnimal = await Animal.findOne({ name: name.toLowerCase(0) });
  if (existingAnimal) {
    throw new ApiError(409, "Animal already exists in the directory");
  }
  //upload image to Cloudinary
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is missing");
  }

  const imageOnCloud = await uploadOnCloudinary(imageLocalPath);
  if (!imageOnCloud) {
    throw new ApiError(400, "Error while uploading image to cloudinary");
  }

  //All parameters checked, create the animal field

  const animal = await Animal.create({
    name: name.toLowerCase(),
    species,
    habitat,
    diet,
    behavior,
    conservationStatus,
    image: imageOnCloud.url,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(200, animal, "Animal added to directory successfully")
    );
});

const getAnimalDetails = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name and species are required");
  }

  const existingAnimalEntry = await Animal.findOne({
    name: name.toLowerCase(),
  });
  if (!existingAnimalEntry) {
    throw new ApiError(404, "Entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        existingAnimalEntry,
        "Animal details fetched successfully"
      )
    );
});

const updateEntry = asyncHandler(async (req, res) => {
  const { name, species, habitat, diet, behavior, conservationStatus } =
    req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const existingAnimalEntry = await Animal.findOne({
    name: name.toLowerCase(),
  });

  if (!existingAnimalEntry) {
    throw new ApiError(404, "No such entry found");
  }
  const oldImageUrl = existingAnimalEntry.image;
  if (oldImageUrl) {
    try {
      console.log(oldImageUrl);
      await deleteFromCloudinary(oldImageUrl);

      console.log("Old image deleted from Cloudinary");
    } catch (error) {
      console.error("Error deleting old image from Cloudinary:", error);
    }
  }
  const newImageLocalPath = req.file?.path;
  let newImageCloudUrl;
  if (newImageLocalPath) {
    newImageCloudUrl = await uploadOnCloudinary(newImageLocalPath);
  }
  const updateFields = {};
  if (species) updateFields.species = species;
  if (habitat) updateFields.habitat = habitat;
  if (diet) updateFields.diet = diet;
  if (behavior) updateFields.behavior = behavior;
  if (conservationStatus) updateFields.conservationStatus = conservationStatus;
  if (newImageLocalPath) {
    updateFields.image = newImageCloudUrl.url;
  }

  const updatedAnimalEntry = await Animal.findOneAndUpdate(
    { name: name.toLowerCase() },
    {
      $set: updateFields,
    },
    { new: true }
  );
  if (!updatedAnimalEntry) {
    throw new ApiError(404, "Animal entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAnimalEntry,
        "Animal entry updated successfully"
      )
    );
});

const deleteAnimalEntry = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "Name is missing");
  }
  const deletedEntry = await Animal.findOneAndDelete({
    name: name.toLowerCase(),
  });

  if (!deletedEntry) {
    throw new ApiError(404, "Entry not found");
  }
  await deleteFromCloudinary(deletedEntry.image);
  return res
    .status(200)
    .json(new ApiResponse(200, deletedEntry, "Entry discarded"));
});

export { addAnimalToDirec, getAnimalDetails, updateEntry, deleteAnimalEntry };
