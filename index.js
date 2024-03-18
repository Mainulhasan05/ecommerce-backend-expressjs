
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db=require('./db_config/db');
const sellerRoutes=require('./routes/seller/sellerRoutes');
const categoryRoutes=require('./routes/seller/categoryRoutes');
const apiRoutes=require('./routes/api/apiRoutes');
require('./models/associations/ProductCategories');
require('./models/associations/ProductImages');
require('./models/associations/ProductAttributeValue');
require('./models/associations/OrderItemProduct');

db.sync({alter:false})
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); 
app.use(cors());
app.use("/seller",sellerRoutes);
app.use("/seller/category",categoryRoutes);
app.use("/api",apiRoutes);

// uploads folder accessible
app.use('/uploads', express.static('uploads'));
// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!'); // Respond with 'Hello World!' when someone accesses the root URL
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
