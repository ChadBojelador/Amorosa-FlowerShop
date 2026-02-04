const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../midlleware/auth');
const adminAuth = require('../midlleware/adminAuth');

// All order routes require authentication
router.use(auth);

// POST /checkout - Create order from cart
router.post('/checkout', orderController.checkout);

// GET /orders - Get user's orders
router.get('/', orderController.getUserOrders);

// GET /orders/:id - Get single order with items
router.get('/:id', orderController.getOrderById);

// PUT /admin/orders/:id/status - Update order status (admin only)
router.put('/admin/:id/status', adminAuth, orderController.updateOrderStatus);

module.exports = router;
