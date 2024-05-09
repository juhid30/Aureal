import { asyncHandler } from "../utils/asyncHandler.js";
import { Animal } from "../models/animals.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addAnimalToDirec = asyncHandler(async (req, res) => {
  const { name, species, habitat, diet, behavior, conservationStatus } =
    req.body;

  //all parameters should be present
  if (
    [name, species, habitat, diet, behavior, conservationStatus].some(
      (field) => {
        field?.trim() === "";
      }
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check if animal already exists in the directory
  const existingAnimal = await Animal.findOne({ name: name });

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

  //All parameters checked, create the user

  const animal = await Animal.create({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    species,
    habitat,
    diet,
    behavior,
    conservationStatus,
    image: imageOnCloud.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, user, "Animal added to directory successfully"));
});

export { addAnimalToDirec };
