// models/Order.js 
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        returnStatus: { // Nouveau champ pour suivre le statut de retour du produit
          type: String,
          enum: ['Not Returned', 'Requested', 'Approved', 'Rejected', 'Returned'],
          default: 'Not Returned'
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
      default: 'Pending'
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    deliveryDate: { // Nouveau champ
      type: Date
    }
  });
  
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

