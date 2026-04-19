const express = require('express');
const authController = require('../controllers/AuthController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', auth, (req, res) => authController.getProfile(req, res));

module.exports = router;
