const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const BouquetVariant = require('../models/BouquetVariant');
const Bouquet = require('../models/Bouquet');

// POST /checkout - Create order from cart
exports.checkout = async (req, res) => {
    try {
        const { delivery_address, delivery_date, payment_method } = req.body;
        const userId = req.user.id;

        // Get user's cart
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const cartItems = await CartItem.find({ cart_id: cart._id })
            .populate('bouquet_variant_id');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total and check stock
        let totalPrice = 0;
        for (const item of cartItems) {
            const variant = item.bouquet_variant_id;
            const bouquet = await Bouquet.findById(variant.bouquet_id);
            
            if (variant.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${bouquet.name} - ${variant.color_name}` 
                });
            }

            const itemPrice = (bouquet.base_price + variant.extra_price) * item.quantity;
            totalPrice += itemPrice;
        }

        // Create order
        const order = await Order.create({
            user_id: userId,
            total_price: totalPrice,
            delivery_address,
            delivery_date,
            payment_method,
            status: 'pending'
        });

        // Create order items and update stock
        for (const item of cartItems) {
            const variant = item.bouquet_variant_id;
            const bouquet = await Bouquet.findById(variant.bouquet_id);
            const priceEach = bouquet.base_price + variant.extra_price;

            await OrderItem.create({
                order_id: order._id,
                bouquet_variant_id: variant._id,
                quantity: item.quantity,
                price_each: priceEach
            });

            // Reduce stock
            variant.stock -= item.quantity;
            await variant.save();
        }

        // Clear cart
        await CartItem.deleteMany({ cart_id: cart._id });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error processing checkout', error: error.message });
    }
};

// GET /orders - Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user_id: userId })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// GET /orders/:id - Get single order with items
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user (or user is admin)
        if (order.user_id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const orderItems = await OrderItem.find({ order_id: order._id })
            .populate({
                path: 'bouquet_variant_id',
                populate: { path: 'bouquet_id' }
            });

        res.json({ order, items: orderItems });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// PUT /admin/orders/:id/status - Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};
