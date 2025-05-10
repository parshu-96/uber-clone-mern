const { response } = require("../app");
const userModel = require("../models/user.model");
const userService = require("../services/user.service"); // Import the user service
const { validationResult } = require("express-validator"); // Import validationResult from express-validator
const blacklistTokenModel = require("../models/blacklisttoken.model"); // Import the blacklist token model

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req); // Validate the request body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
  }

  const { fullName, email, password } = req.body; // Destructure the request body
  const isUserAlreadyExists = await userModel.findOne({ email }); // Check if the user already exists
  if (isUserAlreadyExists) {  
    return res.status(409).json({ message: "User already exists" }); // Return an error if the user already exists
  }
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
  res.cookie("token", token);
  res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {
  const user = req.user; // Get the user from the request object
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" }); // Return an error if the user is not found
  }

  res.status(200).json({ user }); // Return the user profile in the response
}


module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies.token|| req.headers.authorization.split(" ")[1]; // Get the token from the request headers or cookies
  await blacklistTokenModel.create({ token }); // Blacklist the token
  res.clearCookie("token"); // Clear the token cookie
  
  res.status(200).json({ message: "Logged out successfully" }); // Return a success message
}