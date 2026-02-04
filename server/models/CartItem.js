const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
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
        min: 1,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CartItem', cartItemSchema);
