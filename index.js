
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const db=require('./db_config/db');
const sellerRoutes=require('./routes/seller/sellerRoutes');
const categoryRoutes=require('./routes/seller/categoryRoutes');
const apiRoutes=require('./routes/api/apiRoutes');
require('./models/associations/ProductCategories');
require('./models/associations/ProductImages');
require('./models/associations/ProductAttributeValue');
require('./models/associations/OrderItemProduct');
require('./models/associations/ProductShop');

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

app.use('/uploads', express.static('uploads'));
// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!'); 
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
