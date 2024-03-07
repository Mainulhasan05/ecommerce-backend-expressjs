const Product = require('../../models/common/productModel');
const Inventory = require('../../models/seller/inventoryModel');

const productController = {
  createProduct: async (req, res) => {
    const { name, description, price, quantity, categoryId } = req.body;
    const sellerId = req.id; // Assuming sellerId is available in req.id

    try {
      // Create the product
      const newProduct = await Product.create({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        categoryId: categoryId,
        sellerId: sellerId
      });

      // Automatically add an entry to the inventory table with the initial quantity
      await Inventory.create({
        productId: newProduct.id,
        quantity: quantity,
        
      });

      res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ success: false, message: 'Failed to create product' });
    }
  },

  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, quantity, categoryId } = req.body;
    const sellerId = req.id; // Assuming sellerId is available in req.id

    try {
      // Check if the product exists and belongs to the seller
      const existingProduct = await Product.findOne({ where: { id: productId, sellerId: sellerId } });
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: 'Product not found or you do not have permission to update it' });
      }

      // Update the product
      await existingProduct.update({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        categoryId: categoryId
      });

      // Synchronize with the inventory table
      const inventoryEntry = await Inventory.findOne({ where: { productId: productId } });
      if (inventoryEntry) {
        inventoryEntry.quantity = quantity;
        await inventoryEntry.save();
      }

      res.status(200).json({ success: true, message: 'Product updated successfully', product: existingProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, message: 'Failed to update product' });
    }
  },

  deleteProduct: async (req, res) => {
    const productId = req.params.id;
    const sellerId = req.id; // Assuming sellerId is available in req.id

    try {
      // Check if the product exists and belongs to the seller
      const existingProduct = await Product.findOne({ where: { id: productId, sellerId: sellerId } });
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: 'Product not found or you do not have permission to delete it' });
      }

      // Soft delete the product
      await existingProduct.destroy();

      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
  },

  getProduct: async (req, res) => {
    const productId = req.params.id;
    const sellerId = req.id; // Assuming sellerId is available in req.id

    try {
      // Retrieve the product
      const product = await Product.findOne({ where: { id: productId, sellerId: sellerId } });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found or you do not have permission to access it' });
      }

      res.status(200).json({ success: true, product: product });
    } catch (error) {
      console.error('Error retrieving product:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve product' });
    }
  }
};

module.exports = productController;
