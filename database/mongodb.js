import mongoose from "mongoose";

import {DB_URI, NODE_ENV} from "../config/env.js";

if (!DB_URI) {
  throw new Error("DB_URI is not defined in environment variables");
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`Connected to database in ${NODE_ENV} mode`);

    if (NODE_ENV !== "test") {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
