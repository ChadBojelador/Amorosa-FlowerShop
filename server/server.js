const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const bouquetRoutes = require('./routes/bouquetRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// MongoDB connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/bouquets', bouquetRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/checkout', orderRoutes);
app.use('/admin/orders', orderRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Amorosa API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})