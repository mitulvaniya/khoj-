const config = {};

const isDevelopment = process.env.NODE_ENV === 'development';

config.PORT = process.env.PORT || 5000;
config.API_VERSION = process.env.API_VERSION || '/v1';
config.NODE_ENV = process.env.NODE_ENV || 'development';
config.DB_STRING = process.env.DB_STRING || 'mongodb://127.0.0.1:27017/khoj';
config.SECREATE = process.env.SECREATE || 'development';

module.exports = { config };
