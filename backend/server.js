const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ message: '🌸 Bloom & Blossom API running', status: 'OK' }));

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌸 Server running on http://localhost:${PORT}`));
