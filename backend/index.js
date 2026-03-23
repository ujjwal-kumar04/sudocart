const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Connection = require('./database/db');
const Routes = require('./router/route');

dotenv.config();
const app = express();

const normalizeOrigin = (value = '') => value.trim().replace(/\/$/, '').toLowerCase();

const configuredOrigins = (process.env.CLIENT_URL || process.env.CLIENT_URLS || '')
	.split(',')
	.map((origin) => normalizeOrigin(origin))
	.filter(Boolean);

// Keep production frontend as fallback so CORS is safe even when CLIENT_URL is missing/misconfigured.
const fallbackOrigins = [
	normalizeOrigin('https://shop-sudocart.vercel.app')
];

const allowedOrigins = new Set([...configuredOrigins, ...fallbackOrigins]);

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			return callback(null, true);
		}

		const normalizedRequestOrigin = normalizeOrigin(origin);
		if (allowedOrigins.has(normalizedRequestOrigin)) {
			return callback(null, true);
		}

		return callback(new Error(`Not allowed by CORS: ${origin}`));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

Connection();
app.use('/', Routes);
const cartRoutes = require('./router/cart-routes');
app.use("/", cartRoutes);
const watchlistRoutes = require('./router/watchlist');
app.use(watchlistRoutes);
const orderRoutes = require('./router/order');
app.use("/", orderRoutes);
const productRoutes = require('./router/product-routes');
app.use("/", productRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
