


require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Initialize Express
const app = express();

// ====== Database Connection ======
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
connectDB();

// ====== Middleware ======
app.use(helmet());
app.use(cors({
  origin: 'https://gamechanger-flame.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====== Static Files ======
app.use(express.static(path.join(__dirname, 'public')));

// ====== Routes ======
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '🚀 API is running!',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Import your routes here
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/teams', require('./routes/createteam.routes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/staff', require('./routes/StaffRoutes'));
app.use('/api/teams', require('./routes/activityRoutes'));
app.use('/api/streams', require('./routes/streamRoutes'));

// ====== Global Error Handler ======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// ====== Server Start ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
