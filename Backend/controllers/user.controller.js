const { response } = require("../app");
const userModel = require("../models/user.model");
const userService = require("../services/user.service"); // Import the user service
const { validationResult } = require("express-validator"); // Import validationResult from express-validator

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req); // Validate the request body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
  }

  const { fullName, email, password } = req.body; // Destructure the request body
  const hashedPassword = await userModel.hashPassword(password); // Hash the password
  const user = await userService.createUser({
    // Create a new user
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
  });
  const token = await user.generateAuthToken(); // Generate a token for the user

  res.status(201).json({ token, user });
  // res.status(201).json({ user }); // Return the user in the response
};

module.exports.loginUser = async (req, res, next) => {
  console.log("Login user controller called"); // Log the request for debugging
  const errors = validationResult(req); // Validate the request body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
  }

  const { email, password } = req.body; // Destructure the request body
  const user = await userModel.findOne({email}).select('+password'); // Find the user by email

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" }); // Return an error if the user is not found
  }

  const isMatch = await user.comparePassword(password); // Compare the password with the hashed password

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" }); // Return an error if the password does not match
  }

  const token = await user.generateAuthToken(); // Generate a token for the user

  res.status(200).json({ token, user });
}
