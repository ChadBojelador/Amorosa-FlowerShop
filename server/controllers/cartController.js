const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const BouquetVariant = require('../models/BouquetVariant');

// POST /cart/add - Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { bouquet_variant_id, quantity } = req.body;
        const userId = req.user.id; // Assumes authentication middleware sets req.user

        // Check if variant exists and has stock
        const variant = await BouquetVariant.findById(bouquet_variant_id);
        if (!variant) {
            return res.status(404).json({ message: 'Bouquet variant not found' });
        }
        if (variant.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Find or create cart for user
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
        }

        // Check if item already in cart
        let cartItem = await CartItem.findOne({ 
            cart_id: cart._id, 
            bouquet_variant_id 
        });

        if (cartItem) {
            // Update quantity
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = await CartItem.create({
                cart_id: cart._id,
                bouquet_variant_id,
                quantity
            });
        }

        res.status(201).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

// PUT /cart/update - Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { cart_item_id, quantity } = req.body;
        const userId = req.user.id;

        const cartItem = await CartItem.findById(cart_item_id).populate('cart_id');
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Verify cart belongs to user
        if (cartItem.cart_id.user_id.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check stock
        const variant = await BouquetVariant.findById(cartItem.bouquet_variant_id);
        if (variant.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json({ message: 'Cart updated', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
};

// DELETE /cart/remove/:itemId - Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

        const cartItem = await CartItem.findById(itemId).populate('cart_id');
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Verify cart belongs to user
        if (cartItem.cart_id.user_id.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await CartItem.findByIdAndDelete(itemId);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
};

// GET /cart - Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            return res.json({ cart: null, items: [] });
        }

        const cartItems = await CartItem.find({ cart_id: cart._id })
            .populate({
                path: 'bouquet_variant_id',
                populate: { path: 'bouquet_id' }
            });

        res.json({ cart, items: cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};
