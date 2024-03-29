const Category = require('../../models/common/categoryModel');
const sendResponse = require('../../utils/sendResponse');
const generateSlug = require('../../utils/generateSlug');
const deleteImage = require('../../utils/deleteImage');
const fs = require('fs');
const path = require('path');
// Controller functions for category CRUD operations

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description,  parentId,sortValue,isFeatured,sideMenu } = req.body;
    let slug=generateSlug(name);
    // check if the category already exists of same slug, if have then add time
    const categorySlug = await Category.findOne({ where: { slug } });
    if(categorySlug){
      const time = new Date().getTime();
      slug=slug+"-"+time;
    }

    // if(req.file===undefined){
    //     return sendResponse(res, 400, false, 'Please upload an image', null);
    // }
    // const image ="/uploads/categories/"+ req.file.filename;
    // if there is image then set it otherwise do nothing
    let image;
    if(req.file){
      image ="/uploads/categories/"+ req.file.filename;
    }
    
    const createdBy = req.id; 
    const obj={}
    if(name){
      obj.name=name;
    }
    if(description){
      obj.description=description;
    }
    if(parentId){
      obj.parentId=parentId;
    }
    if(sortValue){
      obj.sortValue=sortValue;
    }
    if(isFeatured){
      obj.isFeatured=isFeatured;
    }
    if(sideMenu){
      obj.sideMenu=sideMenu;
    }
    obj.slug=slug;
    obj.image=image;
    obj.createdBy=createdBy;


    const category = await Category.create(obj);

    sendResponse(res, 201, true, 'Category created successfully', category);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, error.message, error);
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { pageNumber } = req.query;
    const page = pageNumber || 0;
    const limit = req.query.limit || 20;
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'slug', 'image', 'sortValue', 'status', 'parentId'],
      include: [
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name', 'slug','createdAt'],
          order: [[{ model: Category, as: 'children' }, 'createdAt', 'DESC']]
        }
      ],
      order: [[{model: Category, as: 'children'}, 'createdAt', 'DESC']],
        offset: 10 * page,
        limit: limit,
    });
    sendResponse(res, 200, true, 'Categories retrieved successfully', categories);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, error.message, null);
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
    sendResponse(res, 500, false, error.message, null);
  }
};

// Update category by ID
const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description,  parentId,sortValue,isFeatured,sideMenu } = req.body;
    
    let image;
    if(req.file){
      image ="/uploads/categories/"+ req.file.filename;
    }
    const updatedBy = req.id;
    const category = await Category.findByPk(id);
    if (!category) {
      return sendResponse(res, 404, false, 'Category not found', null);
    }
    const slug=generateSlug(name);
    // check if the category already exists of same slug, if have then add time
    const exists = await Category.findOne({ where: { slug } });
    if(exists){
      const time = new Date().getTime();
      slug=slug+"-"+time;
    }
    const obj={}
    
    if(name){
      obj.name=name;
    }
    if(slug){
      obj.slug=slug;
    }
    if(description){
      obj.description=description;
    }
    if(parentId && parentId!=null){
      obj.parentId=parentId;
    }
    if(sortValue){
      obj.sortValue=sortValue;
    }
    if(isFeatured){
      obj.isFeatured=isFeatured;
    }
    if(sideMenu){
      obj.sideMenu=sideMenu;
    }
    if(image){
      if (category.image) {
        deleteImage(category.image);
      }
      obj.image=image;
    }
    obj.updatedBy=updatedBy;
    const updatedCategory = await category.update(obj);
    sendResponse(res, 200, true, 'Category updated successfully', updatedCategory);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, error.message, null);
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
      console.log(imagePath)
      
      if (fs.existsSync(imagePath)) {
        
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
    sendResponse(res, 500, false, error.message, null);
  }
};

const getParentCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'slug', ],
      where: {
        parentId: null,
      },
    });
    sendResponse(res, 200, true, 'Categories retrieved successfully', categories);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, error.message, null);
  }
};

const getChildCategoriesByParentId = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'slug', 'image', 'sortValue', 'status', 'parentId'],
      where: {
        parentId: id,
      },
    });
    sendResponse(res, 200, true, 'Categories retrieved successfully', categories);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, error.message, null);
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getParentCategories,
  getChildCategoriesByParentId
};
