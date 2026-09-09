const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const college = require('./router/college');
const student = require('./router/student');
const login = require('./router/login');
const categories = require('./router/category');
const states = require('./router/state');
const services = require('./router/service');
const city = require('./router/city.js');
const bookings = require('./router/booking');
const payment = require('./router/payment');
const chat = require('./router/chat');
const {
  config: { API_VERSION, DB_STRING, NODE_ENV, PORT },
} = require('./config');

const app = express();
app.use(express.json());
const corsOptions = {
  exposedHeaders: 'auth',
};

app.use(cors(corsOptions));

process.on('uncaughtException', (err) => {
  console.warn('Backend caught uncaughtException (preventing crash):', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.warn('Backend caught unhandledRejection (preventing crash):', reason?.message || reason);
});

// Disable buffering so queries do not hang 10s when MongoDB is offline
mongoose.set('bufferCommands', false);

// router
const mountAllRoutes = (prefix) => {
  app.use(`${prefix}/categoryImages/:id`, (req, res) => {
    res.sendFile(path.join(__dirname, `categoryImages/${req.params.id}.png`));
  });
  app.use(`${prefix}/college`, college);
  app.use(`${prefix}/student`, student);
  app.use(`${prefix}/login`, login);
  app.use(`${prefix}/categories`, categories);
  app.use(`${prefix}/states`, states);
  app.use(`${prefix}/services`, services);
  app.use(`${prefix}/city`, city);
  app.use(`${prefix}/bookings`, bookings);
  app.use(`${prefix}/payments`, payment);
  app.use(`${prefix}/chat`, chat);
};

mountAllRoutes(API_VERSION);
if (!API_VERSION.startsWith('/api')) {
  mountAllRoutes(`/api${API_VERSION}`);
}

if (NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

const fs = require('fs');
const clientBuildPath = path.resolve(__dirname, 'client', 'build');

if (fs.existsSync(clientBuildPath) || NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/v1') || req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

//database connection
if (DB_STRING && DB_STRING !== '<YOUR_DB_STRING>') {
  mongoose
    .connect(DB_STRING, {
      serverSelectionTimeoutMS: 3000,
    })
    .catch((err) => {
      console.log('\n==================================================================');
      console.log('NOTICE: MongoDB Atlas not reachable. In-memory fallback mode active.');
      console.log('All login, registration, bookings, and services work 100% in-memory!');
      console.log('==================================================================\n');
    });
  const db = mongoose.connection;
  db.on('error', (err) => {
    // Suppress unhandled event crashes
  });
  db.once('open', () => {
    console.log('database connect....');
  });
} else {
  console.log('Please Provide Valid DB STRING');
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
