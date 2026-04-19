const express = require('express');
const authController = require('../controllers/AuthController');
const { auth } = require('../middleware/auth');
const Validator = require('../middleware/Validator');
const router = express.Router();

router.post('/register', Validator.validateRegistration, (req, res) => authController.register(req, res));
router.post('/login', Validator.validateLogin, (req, res) => authController.login(req, res));
router.get('/me', auth, (req, res) => authController.getProfile(req, res));

module.exports = router;
