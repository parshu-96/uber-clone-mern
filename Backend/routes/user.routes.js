const express = require("express");
const router = express.Router(); // Create a new router instance
const userController = require("../controllers/user.controller"); // Import the user controller
const { body } = require("express-validator"); // Import validationResult from express-validator
const authMiddleware = require("../middlewares/auth.middleware"); // Import the authentication middleware

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email is required"), // Validate that email is a valid email address
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("Name is required and it must be at least 3 Chars long"), // Validate that name is not empty
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"), // Validate that password is at least 6 characters long
  ],
  userController.registerUser
); // Register a new user

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is required"), // Validate that email is a valid email address
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"), // Validate that password is at least 6 characters long
  ],
  userController.loginUser
); // Login a user

router.get("/profile",authMiddleware.authUser, userController.getUserProfile); // Get user profile

router.get("/logout", authMiddleware.authUser, userController.logoutUser); // Logout a user
module.exports = router;
