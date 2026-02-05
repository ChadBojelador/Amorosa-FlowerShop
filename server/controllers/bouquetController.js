const Bouquet = require('../models/Bouquet');
const BouquetVariant = require('../models/BouquetVariant');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

exports.upload = upload;

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'amorosa/bouquets',
                transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        
        const readableStream = Readable.from(buffer);
        readableStream.pipe(uploadStream);
    });
};

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

// POST /bouquets - Create new bouquet (Admin only)
exports.createBouquet = async (req, res) => {
    try {
        const { name, description, base_price, category, is_available } = req.body;
        
        const bouquetData = {
            name,
            description,
            base_price: parseFloat(base_price),
            category,
            is_available: is_available === 'true' || is_available === true
        };

        // Upload image to Cloudinary if provided
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            bouquetData.image_url = result.secure_url;
        }

        const bouquet = new Bouquet(bouquetData);
        await bouquet.save();
        
        res.status(201).json(bouquet);
    } catch (error) {
        res.status(400).json({ message: 'Error creating bouquet', error: error.message });
    }
};

// PUT /bouquets/:id - Update bouquet (Admin only)
exports.updateBouquet = async (req, res) => {
    try {
        const { name, description, base_price, category, is_available } = req.body;
        
        const updateData = {
            name,
            description,
            base_price: parseFloat(base_price),
            category,
            is_available: is_available === 'true' || is_available === true
        };

        // Upload image to Cloudinary if provided
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            updateData.image_url = result.secure_url;
        }

        const bouquet = await Bouquet.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!bouquet) {
            return res.status(404).json({ message: 'Bouquet not found' });
        }

        res.json(bouquet);
    } catch (error) {
        res.status(400).json({ message: 'Error updating bouquet', error: error.message });
    }
};

// DELETE /bouquets/:id - Delete bouquet (Admin only)
exports.deleteBouquet = async (req, res) => {
    try {
        const bouquet = await Bouquet.findByIdAndDelete(req.params.id);
        
        if (!bouquet) {
            return res.status(404).json({ message: 'Bouquet not found' });
        }

        // Also delete associated variants
        await BouquetVariant.deleteMany({ bouquet_id: req.params.id });

        res.json({ message: 'Bouquet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bouquet', error: error.message });
    }
};
