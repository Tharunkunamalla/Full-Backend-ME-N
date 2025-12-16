import express from "express";
import {PORT} from "./config/env.js";

// Routes
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectDB from "./database/mongodb.js";
import errormiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies default in express
app.use(express.urlencoded({extended: false})); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies --> saves users data in req.cookies
app.use(arcjetMiddleware); // Arcjet Middleware

// Use Routes
// ("/api/v1/users/sign-up");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

//middleware to handle errors
app.use(errormiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectDB();
});
export default app;
