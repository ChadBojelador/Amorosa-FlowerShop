const mongoose = require('mongoose');

const bouquetVariantSchema = new mongoose.Schema({
    bouquet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bouquet',
        required: true
    },
    color_name: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    extra_price: {
        type: Number,
        default: 0,
        min: 0
    },
    image_url: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BouquetVariant', bouquetVariantSchema);
