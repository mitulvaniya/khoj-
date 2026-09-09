const mongoose = require('mongoose');
const States = require('../schemas/State');
const { resourceError, serverError } = require('../helper/errorHandler');
const { success } = require('../helper/successHandler');

exports.getstates = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const states = await States.find();
      return success(res, states);
    }
  } catch (error) {
    console.warn('DB query failed in getstates:', error.message);
  }
  return success(res, []);
};
