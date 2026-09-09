const mongoose = require('mongoose');
const Categories = require('../schemas/Category');

const fs = require('fs');
let multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `\categoryImages`);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name + '.png');
  },
});
var upload = multer({ storage: storage }).single('image');

const { resourceError, serverError } = require('../helper/errorHandler');
const { success } = require('../helper/successHandler');
const NewServices = require('../schemas/NewServices');

exports.getCategories = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Categories.find();
      return success(res, categories);
    }
  } catch (error) {
    console.warn('DB query failed in getCategories:', error.message);
  }
  return success(res, []);
};

exports.addCategory = async (req, res) => {
  try {
    let categories = [];
    if (mongoose.connection.readyState === 1) {
      categories = await Categories.find();
    }
    if (
      categories.filter(
        (c) => c.name.toLowerCase() == req.body.name.toLowerCase(),
      ).length > 0
    ) {
      return resourceError(res, 'Category Already Exists.');
    } else {
      try {
        fs.writeFileSync(
          `./categoryImages/${req.body.name}.png`,
          req.file.buffer,
          'base64',
        );
        const Category = new Categories();
        Category.name = req.body.name;
        Category.id = req.body.name;
        const newCategory = await Category.save();
        return success(res, newCategory);
      } catch (e) {
        return serverError(res, e);
      }
    }
  } catch (error) {
    return serverError(res, error);
  }
};

exports.categoriesDashboard = async (req, res) => {
  try {
    let categories = [];
    let services = [];
    if (mongoose.connection.readyState === 1) {
      categories = await Categories.find();
      services = await NewServices.find();
    }
    let countCategories = {};
    let finalCategories = [];
    services.map((service) => {
      if (countCategories[service.type]) {
        countCategories[service.type] = countCategories[service.type] + 1;
      } else {
        countCategories[service.type] = 1;
      }
    });
    finalCategories = categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
        count: countCategories[category.id] || 0,
      };
    });
    return success(res, finalCategories);
  } catch (error) {
    return serverError(res, error);
  }
};
