const Category = require('../../models/common/categoryModel');
const sendResponse = require('../../utils/sendResponse');
const generateSlug = require('../../utils/generateSlug');
const fs = require('fs');
const path = require('path');
// Controller functions for category CRUD operations

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description,  parentId } = req.body;
    const slug=generateSlug(name);
    if(req.file===undefined){
        return sendResponse(res, 400, false, 'Please upload an image', null);
    }
    const image ="/uploads/categories/"+ req.file.filename;
    
    const createdBy = req.id; 

    const category = await Category.create({
      name,
        slug,
      description,
      image,
      createdBy,
      parentId
    });

    sendResponse(res, 201, true, 'Category created successfully', category);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error', null);
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { pageNumber } = req.params;
    const page = pageNumber || 0;
    const categories = await Category.findAll({
        offset: 10 * page,
        limit: 10,
        order: [['createdAt', 'DESC']]
        
    });
    sendResponse(res, 200, true, 'Categories retrieved successfully', categories);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error', null);
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (category) {
      sendResponse(res, 200, true, 'Category retrieved successfully', category);
    } else {
      sendResponse(res, 404, false, 'Category not found', null);
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error', null);
  }
};

// Update category by ID
const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCategory = await Category.update(req.body, {
      where: { id }
    });
    if (updatedCategory[0] === 1) {
      sendResponse(res, 200, true, 'Category updated successfully', null);
    } else {
      sendResponse(res, 404, false, 'Category not found', null);
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error', null);
  }
};

// Delete category by ID
const deleteCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the category from the database to get the image file name
    const category = await Category.findByPk(id);
    if (!category) {
      return sendResponse(res, 404, false, 'Category not found', null);
    }

    // Check if the category has an image
    if (category.image) {
      

      const imagePath = path.join(__dirname,"../../",category.image);
      
      // Check if the image file exists
      if (fs.existsSync(imagePath)) {
        // Delete the image file from the folder
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the category from the database
    const deletedCategoryCount = await Category.destroy({ where: { id } });
    if (deletedCategoryCount === 1) {
      sendResponse(res, 200, true, 'Category deleted successfully', null);
    } else {
      sendResponse(res, 404, false, 'Category not found', null);
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error', null);
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
