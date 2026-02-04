const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../midlleware/auth');

// POST /auth/register - Register new user
router.post('/register', authController.register);

// POST /auth/login - Login user
router.post('/login', authController.login);

// GET /auth/me - Get current user (requires auth)
router.get('/me', auth, authController.getMe);

module.exports = router;
