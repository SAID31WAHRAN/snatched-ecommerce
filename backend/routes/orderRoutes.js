const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const router = express.Router();

// Créer une nouvelle commande à partir du panier
router.post('/:userId/create', async (req, res) => {
  try {
    // Assurer que userId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userId = req.params.userId;

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Panier vide ou non trouvé' });
    }

    // Calculer le montant total de la commande
    let totalAmount = 0;
    cart.products.forEach((product) => {
      totalAmount += product.productId.price * product.quantity;
    });

    // Déterminer la date de livraison estimée (ajouter 5 jours à la date actuelle)
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate);
    deliveryDate.setDate(currentDate.getDate() + 5);

    // Créer la commande
    const newOrder = new Order({
      userId: userId,
      products: cart.products,
      totalAmount: totalAmount,
      deliveryDate: deliveryDate // Ajouter la date de livraison estimée
    });

    const savedOrder = await newOrder.save();

    // Vider le panier après création de la commande
    cart.products = [];
    await cart.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour le statut d'une commande
router.put('/:orderId/status', async (req, res) => {
  try {
    // Assurer que orderId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const orderId = req.params.orderId;
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtenir toutes les commandes d'un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    // Assurer que userId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userId = req.params.userId;
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Aucune commande trouvée pour cet utilisateur.' });
    }

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Suppression d'une commande par ID
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    // Suppression de la commande en utilisant l'ID
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir les commandes d'un utilisateur par ID
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Rechercher toutes les commandes associées à un utilisateur
    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Aucune commande trouvée pour cet utilisateur' });
    }

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Marquer un produit comme retourné dans une commande
router.post('/:orderId/return', async (req, res) => {
  try {
    // Assurer que orderId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const orderId = req.params.orderId;
    const { productId, quantity } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    // Vérifier si le produit fait partie de la commande
    const productIndex = order.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Produit non trouvé dans la commande.' });
    }

    // Ajouter le produit à la liste des produits retournés
    if (!order.returnedProducts) {
      order.returnedProducts = [];
    }
    order.returnedProducts.push({ productId, quantity });

    // Réduire la quantité ou supprimer le produit de la commande
    if (order.products[productIndex].quantity > quantity) {
      order.products[productIndex].quantity -= quantity;
    } else {
      order.products.splice(productIndex, 1);
    }

    // Gérer le remboursement (logique de remboursement simplifiée)
    const productPrice = order.products[productIndex]?.productId?.price || 0;
    const refundAmount = productPrice * quantity;
    order.totalAmount -= refundAmount;

    // Sauvegarder la commande mise à jour
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;