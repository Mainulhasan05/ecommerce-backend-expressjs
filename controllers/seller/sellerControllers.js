const Seller = require('../../models/seller/sellerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {trackActivity}=require('../trackActivityController');
const sendEmail = require('../../utils/sendEmail');
const sendDomainEmail = require('../../utils/sendDomainEmail');
const sendResponse=require('../../utils/sendResponse');


const generateToken = (seller) => {
  
  return jwt.sign({ id: seller.id, phone: seller.phone }, process.env.JWT_SECRET, { expiresIn: '10d' });
};

const sellerController = {
  register: async (req, res) => {
    const { name, phone, password } = req.body;
    if(!name||!phone||!password){
      return sendResponse(res, 400, false, 'All fields are required');
    }
    if(!/^\d+$/.test(phone)){
      return sendResponse(res, 400, false, 'Phone number must be digits');
    }
    if(name.length<3){
      return sendResponse(res, 400, false, 'Name must be at least 3 characters');
    }
    if(password.length<5){
      return sendResponse(res, 400, false, 'Password must be at least 5 characters');
    }
    if (phone.length !== 11) {
      return sendResponse(res, 400, false, 'Phone number must be 11 digits');
    }
    try {
      let seller = await Seller.findOne({ where: { phone } });
      if (seller) {
        return sendResponse(res, 400, false, 'Seller already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      seller = await Seller.create({ name, phone, password: hashedPassword });

      const token = generateToken(seller);
      trackActivity(seller.id,`Seller: ${name} joined the platform`);
      sendDomainEmail(process.env.SENDER_EMAIL2,'New Seller Registration',
      `<h2>New Seller Registration</h2>
      <p><strong>Id:</strong> ${seller?.id}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Registered At:</strong> ${new Date().toLocaleString()}</p>
      `);

      // await sendEmail(process.env.SENDER_EMAIL,'New Seller Registration',
      
      // `<h2>New Seller Registration</h2>
      // <p><strong>Name:</strong> ${name}</p>
      // <p><strong>Phone:</strong> ${phone}</p>
      // <p><strong>Registered At:</strong> ${new Date().toLocaleString()}</p>
      // `);
      return sendResponse(res, 201,true, 'Seller created', { token });
    } catch (error) {
      console.error('Error creating seller:', error);
        return sendResponse(res, 500,false, 'Internal server error');
    }
  },

  login: async (req, res) => {
    const { phone, password } = req.body;
    if(!phone||!password){
      return sendResponse(res, 400, false,'All fields are required');
    }
    if (phone.length !== 11) {
      return sendResponse(res, 400, false,'Phone number must be 11 digits');
    }
    if(password.length<5){
      return sendResponse(res, 400, false,'Password must be at least 5 characters');
    }
    try {
      const seller = await Seller.findOne({ where: { phone } });
      if (!seller) {
        return sendResponse(res, 401, false, 'Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, seller.password);
      if (!isPasswordValid) {
        return sendResponse(res, 401, false, 'Invalid credentials');
      }

      const token = generateToken(seller);
      return sendResponse(res, 200,true, 'Login successful', { token });
    } catch (error) {
      console.error('Error logging in seller:', error);
      sendResponse(res, 500,false, 'Internal server error');
    }
  },

  getProfile: async (req, res) => {
    try {
      const seller = await Seller.findByPk(req.id,{
        attributes: { exclude: ['password','activity','accountStatus'] }
      });
      
      if (!seller) {
        return sendResponse(res, 404, false, 'Seller not found');
      }
      sendResponse(res, 200, true, 'Seller profile retrieved successfully', seller);
    } catch (error) {
      console.error('Error fetching seller profile:', error);
      sendResponse(res, 500, false,'Internal server error');
    }
  },
  getRecentlyActiveSellers: async (req, res) => {
    try {
      const sellers = await Seller.findAll({
        attributes: ['id', 'name', 'last_seen'],
        order: [['last_seen', 'DESC']],
        limit: 10
      });
      sendResponse(res, 200, true, 'Recently active sellers retrieved successfully', sellers);
    } catch (error) {
      console.error('Error fetching recently active sellers:', error);
      sendResponse(res, 500, false,'Internal server error');
    }
  }
};

module.exports = sellerController;
