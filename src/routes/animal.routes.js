import { Router } from "express";
import {
  addAnimalToDirec,
  deleteAnimalEntry,
  getAnimalDetails,
  updateEntry,
} from "../controllers/animals.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.route("/add-entry").post(upload.single("image"), addAnimalToDirec);
router.route("/get-details").get(getAnimalDetails);
router.route("/update-details").put(upload.single("image"), updateEntry);
router.route("/delete-entry").delete(deleteAnimalEntry);
export default router;
