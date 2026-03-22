const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Connection = require('./database/db');
const Routes = require('./router/route');

dotenv.config();
const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true
}));
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
