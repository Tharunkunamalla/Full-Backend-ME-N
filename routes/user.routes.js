// import {Router} from "express";

// const userRouter = Router();

// userRouter.get("/", (req, res) => {
//   res.send({title: "Get All Users"});
// });

// userRouter.get("/:id", (req, res) => {
//   res.send({title: "Get All User Details"});
// });
// userRouter.post("/", (req, res) => {
//   res.send({title: "User Created"});
// });
// userRouter.put("/:id", (req, res) => {
//   res.send({title: "User Updated"});
// });
// userRouter.delete("/:id", (req, res) => {
//   res.send({title: "User Deleted.."});
// });

// export default userRouter;

import {Router} from "express";
import {getUsers, getUserById} from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
//Path: /api/v1/users/:id
//Path: /api/v1/users/693dbae381425fec271f8cd9 - get user by id
userRouter.get("/:id", authorize, getUserById);

userRouter.post("/", (req, res) => {
  res.send({title: "User Created"});
});
userRouter.put("/:id", (req, res) => {
  res.send({title: "User Updated"});
});
userRouter.delete("/:id", (req, res) => {
  res.send({title: "User Deleted.."});
});

export default userRouter;
