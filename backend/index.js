const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Connection = require('./database/db');
const Routes = require('./router/route');

dotenv.config();
const app = express();

const normalizeOrigin = (value = '') =>
  value.trim().replace(/\/$/, '').toLowerCase();

const configuredOrigins = (process.env.CLIENT_URL || process.env.CLIENT_URLS || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const fallbackOrigins = [
  normalizeOrigin('https://sudocart.netlify.app'),
  normalizeOrigin('http://localhost:3000')
];

const allowedOrigins = new Set([...configuredOrigins, ...fallbackOrigins]);

const corsOptions = {
  origin: function (origin, callback) {
    // Postman/server-to-server requests may not send origin
    if (!origin) return callback(null, true);

    const normalizedRequestOrigin = normalizeOrigin(origin);

    if (allowedOrigins.has(normalizedRequestOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// CORS should be applied before routes
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight for all routes
app.options(/.*/, cors(corsOptions));

Connection();

// Routes
app.use('/', Routes);

const cartRoutes = require('./router/cart-routes');
app.use('/', cartRoutes);

const watchlistRoutes = require('./router/watchlist');
app.use('/', watchlistRoutes);

const orderRoutes = require('./router/order');
app.use('/', orderRoutes);

const productRoutes = require('./router/product-routes');
app.use('/', productRoutes);

// Global error handler for CORS and other errors
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('Not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});