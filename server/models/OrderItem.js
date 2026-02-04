const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    bouquet_variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BouquetVariant',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price_each: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
