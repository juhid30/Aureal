import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import animalRouter from "./routes/animal.routes.js";

app.use("/api/v1/animals", animalRouter);

export { app };
