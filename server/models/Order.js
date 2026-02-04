const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    delivery_address: {
        type: String,
        required: true
    },
    delivery_date: {
        type: Date,
        required: true
    },
    payment_method: {
        type: String,
        required: true,
        enum: ['cash', 'card', 'gcash', 'paymaya']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
