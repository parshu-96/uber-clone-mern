const http = require("http");
const app = require("./app");
const server = http.createServer(app); // Create an HTTP server using the Express app

const port = process.env.PORT || 3000; // Set the port to the value from environment variables or default to 3000

server.listen(port, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on port ${port}`); // Log the server start message
});
