const Bouquet = require('../models/Bouquet');
const BouquetVariant = require('../models/BouquetVariant');

// GET /bouquets - Get all bouquets
exports.getAllBouquets = async (req, res) => {
    try {
        const bouquets = await Bouquet.find({ is_available: true });
        res.json(bouquets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bouquets', error: error.message });
    }
};

// GET /bouquets/:id - Get single bouquet
exports.getBouquetById = async (req, res) => {
    try {
        const bouquet = await Bouquet.findById(req.params.id);
        if (!bouquet) {
            return res.status(404).json({ message: 'Bouquet not found' });
        }
        res.json(bouquet);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bouquet', error: error.message });
    }
};

// GET /bouquets/:id/variants - Get bouquet variants (colors)
exports.getBouquetVariants = async (req, res) => {
    try {
        const variants = await BouquetVariant.find({ bouquet_id: req.params.id })
            .populate('bouquet_id');
        res.json(variants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching variants', error: error.message });
    }
};
