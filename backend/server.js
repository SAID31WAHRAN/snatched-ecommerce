const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.raygy.mongodb.net/snatchedDB?retryWrites=true&w=majority&appName=cluster0`;

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('Welcome to the SNATCHED backend API!');
});

// Import Product Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Import Cart Routes
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//utiliser les nouvelles routes de commande
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);