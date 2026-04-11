const express = require('express');
const AuthController = require('../controllers/authController');
const verifyToken = require('../middleware/auth'); // Import middleware

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Endpoint Terproteksi (Hanya bisa diakses jika sudah login)
router.put('/update-profile', verifyToken, AuthController.updateProfile);
router.put('/change-password', verifyToken, AuthController.changePassword);

module.exports = router;