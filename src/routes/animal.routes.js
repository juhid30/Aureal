import { Router } from "express";
import { addAnimalToDirec } from "../controllers/animals.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.route("/add-animal").post(
  upload.single({
    name: "image",
  }),
  addAnimalToDirec
);

export default router;
