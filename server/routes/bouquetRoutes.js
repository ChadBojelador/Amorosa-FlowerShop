const express = require('express');
const router = express.Router();
const bouquetController = require('../controllers/bouquetController');
const auth = require('../midlleware/auth');
const adminAuth = require('../midlleware/adminAuth');

// GET /bouquets - Get all bouquets
router.get('/', bouquetController.getAllBouquets);

// GET /bouquets/:id - Get single bouquet
router.get('/:id', bouquetController.getBouquetById);

// GET /bouquets/:id/variants - Get bouquet variants (colors)
router.get('/:id/variants', bouquetController.getBouquetVariants);

// POST /bouquets - Create new bouquet (Admin only)
router.post('/', auth, adminAuth, bouquetController.upload.single('image'), bouquetController.createBouquet);

// PUT /bouquets/:id - Update bouquet (Admin only)
router.put('/:id', auth, adminAuth, bouquetController.upload.single('image'), bouquetController.updateBouquet);

// DELETE /bouquets/:id - Delete bouquet (Admin only)
router.delete('/:id', auth, adminAuth, bouquetController.deleteBouquet);

module.exports = router;
