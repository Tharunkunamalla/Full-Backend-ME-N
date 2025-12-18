import {Router} from "express";
import {createSubscription} from "../controllers/subscription.controller.js";
import authorize from "../middleware/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({title: "Get all Subscriptions"});
});

subscriptionRouter.get("/:id", (req, res) => {
  res.send({title: "Get Subscription Details"});
});

// subscriptionRouter.post("/", authorize, (req, res) => {
//   res.send({title: "Subscription Created"});
// });

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
  res.send({title: "Subscription Updated"});
});
subscriptionRouter.delete("/:id", (req, res) => {
  res.send({title: "Subscription Deleted"});
});
subscriptionRouter.get("/user/:id", (req, res) => {
  res.send({title: "Get all users Subscriptions"});
});
subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({title: "Subscription Canceled"});
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({title: "Get Upcoming Renewals"});
});

export default subscriptionRouter;
