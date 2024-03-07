// Import required modules
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const db=require('./db_config/db');
const sellerRoutes=require('./routes/seller/sellerRoutes');

db.sync({alter:true})
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });
// Create an Express application
const app = express();
const port = process.env.PORT || 3000; // Port number for the server to listen on, defaults to 3000 if PORT is not specified in the .env file

// Middleware
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Middleware to handle CORS issues
app.use("/seller",sellerRoutes);


// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!'); // Respond with 'Hello World!' when someone accesses the root URL
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
