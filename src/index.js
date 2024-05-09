import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    }); // error with application
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })

  .catch((error) => {
    console.log("Couldn't connect database");
  });
