const express = require("express");
const userRouter = express.Router();

const {
  currentUser,
  createUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  confirmPassword,varifyUserEmail
} = require("../controllers/userController");

userRouter.route("/current").get(currentUser);
userRouter.route("/").post(createUser);
userRouter.route("/logout").post(logout);
userRouter.route("/loginUser").post(loginUser);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword/:id/:token").get(resetPassword);
userRouter.route("/resetPassword/:id/:token").post(confirmPassword);
userRouter.route("/varifyUserEmail").post(varifyUserEmail);
// userRouter.route("/varifyUserEmail").get(varifyUserEmail);

module.exports = userRouter;
