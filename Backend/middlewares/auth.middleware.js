const userModel = require("../models/user.model"); // Import the user model
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation
const blacklistTokenModel = require("../models/blacklisttoken.model"); // Import the blacklist token model

module.exports.authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" }); // Return an error if the token is not provided
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token }); // Check if the token is blacklisted
    if (isBlacklisted) {
        return res.status(401).json({ error: "Unauthorized" }); // Return an error if the token is blacklisted
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = await userModel.findById(decoded._id); // Find the user by ID from the token
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" }); // Return an error if the user is not found
        }
        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" }); // Return an error if the token is invalid
    }   

}