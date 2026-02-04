const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../midlleware/auth');

// All cart routes require authentication
router.use(auth);

// POST /cart/add - Add item to cart
router.post('/add', cartController.addToCart);

// PUT /cart/update - Update cart item quantity
router.put('/update', cartController.updateCartItem);

// DELETE /cart/remove/:itemId - Remove item from cart
router.delete('/remove/:itemId', cartController.removeFromCart);

// GET /cart - Get user's cart
router.get('/', cartController.getCart);

module.exports = router;
