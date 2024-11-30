import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB via Mongoose"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

export default mongoose;

// Tried a new way to connect no luck
