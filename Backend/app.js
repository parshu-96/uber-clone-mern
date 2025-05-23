const dotenv = require("dotenv"); // Import dotenv to load environment variables
dotenv.config(); // Load environment variables from .env file
const cors = require("cors"); // Import cors for Cross-Origin Resource Sharing
const express = require("express");
const app = express();
const connectDB = require("./db/db"); // Import the database connection function
const userRoutes = require("./routes/user.routes"); // Import user routes
const captainRoutes = require("./routes/captain.routes"); // Import captain routes
const cookieParser = require("cookie-parser"); // Import cookie-parser for parsing cookies
connectDB(); // Call the function to connect to the database

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies from request headers
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRoutes); // Use user routes for API version 1
app.use("/api/v1/captain", captainRoutes); // Use captain routes for API version 1
module.exports = app;
