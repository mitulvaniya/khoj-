const mongoose = require('mongoose');
const Cities = require('../schemas/City');
const NewServices = require('../schemas/NewServices');

const { resourceError, serverError } = require('../helper/errorHandler');
const { success } = require('../helper/successHandler');

exports.getServices = async (req, res) => {
  let newSer = [];
  try {
    if (mongoose.connection.readyState === 1) {
      newSer = await NewServices.find();
    }
  } catch (error) {
    console.warn('DB disconnected or query failed in getServices:', error.message);
  }
  if (req.body) {
    if (req.body.category && req.body.category !== 'all') {
      newSer = newSer.filter((ser) => ser.type === req.body.category);
    }
    if (req.body.state && req.body.state !== 'all') {
      newSer = newSer.filter((ser) => ser.addressObj?.state === req.body.state);
    }
    if (req.body.city) {
      newSer = newSer.filter((ser) =>
        ser.addressObj?.newCity?.city
          ?.toLocaleLowerCase()
          .includes(req.body.city.toLocaleLowerCase()),
      );
    }
    if (req.body.name) {
      newSer = newSer.filter((ser) =>
        ser.name
          ?.toLocaleLowerCase()
          .includes(req.body.name.toLocaleLowerCase()),
      );
    }
    return success(res, newSer);
  } else {
    return success(res, newSer);
  }
};

exports.getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      const newSer = await NewServices.find();
      const ser = newSer.filter((service) => service.service_id === id || service._id.toString() === id);
      return success(res, ser);
    }
  } catch (error) {
    console.warn('DB query failed in getServiceById:', error.message);
  }
  return success(res, []);
};

exports.getServicesChart = async (req, res) => {
  const { id } = req.params;
  let countCategories = {};
  let finalCategories = [];
  try {
    if (mongoose.connection.readyState === 1) {
      const newSer = await NewServices.find();
      const city = await Cities.find();
      newSer.map((service) => {
        if (service.addressObj?.newCity?.city) {
          if (countCategories[service.addressObj.newCity.city]) {
            countCategories[service.addressObj.newCity.city] =
              countCategories[service.addressObj.newCity.city] + 1;
          } else {
            countCategories[service.addressObj.newCity.city] = 1;
          }
        }
      });
      finalCategories = city.map((category) => {
        return {
          id: category.id,
          name: category.city,
          count: countCategories[category.city] || 0,
        };
      });
    }
    return success(res, finalCategories);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.addService = async (req, res) => {
  try {
    const service = new NewServices(req.body);
    const s = await service.save();
    return success(res, s);
  } catch (e) {
    return resourceError(res, e);
  }
};
