// animal:

// name
// species
// Habitat
// Diet
// Conservation Status
// image

import mongoose, { Schema } from "mongoose";
const animalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  habitat: {
    type: String,
  },
  diet: {
    type: String,
  },
  behavior: {
    type: String,
  },
  conservationStatus: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
});
export const Animal = mongoose.model("Animal", animalSchema);
