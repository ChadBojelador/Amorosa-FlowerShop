const express = require('express');
const router = express.Router();
const bouquetController = require('../controllers/bouquetController');

// GET /bouquets - Get all bouquets
router.get('/', bouquetController.getAllBouquets);

// GET /bouquets/:id - Get single bouquet
router.get('/:id', bouquetController.getBouquetById);

// GET /bouquets/:id/variants - Get bouquet variants (colors)
router.get('/:id/variants', bouquetController.getBouquetVariants);

module.exports = router;
