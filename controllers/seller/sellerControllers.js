const Seller = require('../../models/seller/sellerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendResponse=require('../../utils/sendResponse');


const generateToken = (seller) => {
  return jwt.sign({ id: seller.id, phone: seller.phone }, process.env.JWT_SECRET, { expiresIn: '10d' });
};

const sellerController = {
  register: async (req, res) => {
    const { name, phone, password } = req.body;
    try {
      let seller = await Seller.findOne({ where: { phone } });
      if (seller) {
        return sendResponse(res, 400, 'Seller already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      seller = await Seller.create({ name, phone, password: hashedPassword });

      const token = generateToken(seller);

      return sendResponse(res, 201, 'Seller created', { token });
    } catch (error) {
      console.error('Error creating seller:', error);
        return sendResponse(res, 500, 'Internal server error');
    }
  },

  login: async (req, res) => {
    const { phone, password } = req.body;
    try {
      const seller = await Seller.findOne({ where: { phone } });
      if (!seller) {
        return sendResponse(res, 401, 'Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, seller.password);
      if (!isPasswordValid) {
        return sendResponse(res, 401, 'Invalid credentials');
      }

      const token = generateToken(seller);
      return sendResponse(res, 200, 'Login successful', { token });
    } catch (error) {
      console.error('Error logging in seller:', error);
      sendResponse(res, 500, 'Internal server error');
    }
  },

  getProfile: async (req, res) => {
    try {
      const seller = await Seller.findByPk(req.userId);
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      res.json(seller);
    } catch (error) {
      console.error('Error fetching seller profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = sellerController;
