// Import mongoose to use sessions & transactions
import mongoose from "mongoose";

// For hashing passwords securely
import bcrypt from "bcryptjs";

// For creating JWT tokens
import jwt from "jsonwebtoken";

// User model
import User from "../models/user.model.js";

// Environment variables
import {JWT_SECRET, JWT_EXPIRE} from "../config/env.js";

/**
 * =========================
 * SIGN UP CONTROLLER
 * =========================
 * Creates a new user
 * - checks if email already exists
 * - hashes password
 * - stores user in DB
 * - generates JWT token
 */
export const signUp = async (req, res, next) => {
  // 1️⃣ Start a MongoDB session (for transaction support)
  const session = await mongoose.startSession();

  // 2️⃣ Start transaction
  session.startTransaction();

  try {
    // 3️⃣ Extract data from request body
    const {name, email, password} = req.body;

    // 4️⃣ Check if user already exists (inside transaction)
    const existingUser = await User.findOne({email}).session(session);

    if (existingUser) {
      // Create custom error
      const error = new Error("User already exists with this email");
      error.statusCode = 409; // Conflict
      throw error;
    }

    // 5️⃣ Hash the password
    // saltRounds = 10 (industry standard)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6️⃣ Create user (array syntax is REQUIRED for transactions)
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      {session}
    );

    // 7️⃣ Generate JWT token
    const token = jwt.sign(
      {userId: newUser[0]._id}, // payload
      JWT_SECRET, // secret key
      {expiresIn: JWT_EXPIRE} // expiry time
    );

    // 8️⃣ Commit transaction (save changes permanently)
    await session.commitTransaction();

    // 9️⃣ End session
    session.endSession();

    // 🔟 Send response (ONLY ONCE)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser[0],
    });
  } catch (error) {
    // ❌ If anything fails, rollback all DB operations
    await session.abortTransaction();
    session.endSession();

    // Pass error to global error handler
    next(error);
  }
};

/**
 * =========================
 * SIGN IN CONTROLLER
 * =========================
 * (placeholder – logic will be added later)
 */
export const signIn = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    // Find user by email
    const user = await User.findOne({email});

    if (!user) {
      const error = new Error("User Not Found");
      error.statusCode = 404; // Unauthorized
      throw error;
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const token = jwt.sign(
      {userId: user._id}, // payload
      JWT_SECRET, // secret key
      {expiresIn: JWT_EXPIRE} // expiry time
    );
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================
 * SIGN OUT CONTROLLER
 * =========================
 * (placeholder – usually handled on frontend)
 *
 */
export const signOut = async (req, res, next) => {
  res.send("User Signed Out Successfully");
};
