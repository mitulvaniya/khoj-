const Cities = require('../schemas/City');
const { resourceError, serverError } = require('../helper/errorHandler');
const { success } = require('../helper/successHandler');

const DEFAULT_CITIES = [
  { id: '1', city: 'Ankleshwar', state: 'Gujarat', country: 'India', pincode: '393002' },
  { id: '2', city: 'Bharuch', state: 'Gujarat', country: 'India', pincode: '392001' },
  { id: '3', city: 'Surat', state: 'Gujarat', country: 'India', pincode: '395007' },
  { id: '4', city: 'Vadodara', state: 'Gujarat', country: 'India', pincode: '390001' },
  { id: '5', city: 'Ahmedabad', state: 'Gujarat', country: 'India', pincode: '380001' },
  { id: '6', city: 'Navsari', state: 'Gujarat', country: 'India', pincode: '396445' },
  { id: '7', city: 'Vapi', state: 'Gujarat', country: 'India', pincode: '396191' },
  { id: '8', city: 'Mumbai', state: 'Maharashtra', country: 'India', pincode: '400001' },
  { id: '9', city: 'Pune', state: 'Maharashtra', country: 'India', pincode: '411001' },
  { id: '10', city: 'Delhi', state: 'Delhi', country: 'India', pincode: '110001' },
  { id: '11', city: 'Bangalore', state: 'Karnataka', country: 'India', pincode: '560001' }
];

const mongoose = require('mongoose');

exports.getAllCity = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const city = await Cities.find();
      if (city && city.length > 0) {
        return success(res, city);
      }
    }
  } catch (e) {
    // Fallback to default cities
  }
  return success(res, DEFAULT_CITIES);
};

