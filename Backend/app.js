const dotenv = require('dotenv'); // Import dotenv to load environment variables    
dotenv.config(); // Load environment variables from .env file
const cors = require('cors'); // Import cors for Cross-Origin Resource Sharing

const express=require("express");
const app = express();
app.use(cors()); // Enable CORS for all routes

app.get("/", (req, res) => {
    res.send("Hello World!");
})

module.exports = app;   

