import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      maxLength: [50, "User Name cannot exceed 50 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      minLength: [5, "Email should be at least 5 characters"],
      maxLength: [255, "Email cannot exceed 255 characters"],
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be at least 6 characters"],
      trim: true,
    },
  },
  {timestamps: true} // Automatically manage createdAt and updatedAt fields
);
const User = mongoose.model("User", userSchema);

export default User;
