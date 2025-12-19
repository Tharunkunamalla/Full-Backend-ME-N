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
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies default in express
app.use(express.urlencoded({extended: false})); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies --> saves users data in req.cookies
// app.use(arcjetMiddleware); // Arcjet Middleware
if (process.env.NODE_ENV === "production") {
  app.use(arcjetMiddleware);
}

// Use Routes
// ("/api/v1/users/sign-up");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

//middleware to handle errors
app.use(errormiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API!");
});

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
