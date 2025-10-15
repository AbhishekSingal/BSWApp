//Node Modules Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

//Route Imports
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";

dotenv.config();

//Init App
const app = express();
app.use(cors());
app.use(express.json());

app.use("/images", (req, res, next) => {
  console.log("Image requested:", req.url, "at", new Date().toISOString());
  next(); // pass to static middleware
});

//Serve Images Locally on Dev , Later on Cloud during Production
app.use("/images", express.static(path.join(__dirname, "images")));

// Use th

//Use the Routes
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes); // <--- add this

//Start Listening to PORT 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//sudo npx nodemon
