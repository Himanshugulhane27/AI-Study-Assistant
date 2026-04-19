const express = require('express');
const adminController = require('../controllers/AdminController');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/users', adminAuth, (req, res) => adminController.getAllUsers(req, res));
router.get('/stats', adminAuth, (req, res) => adminController.getSystemStats(req, res));
router.delete('/users/:id', adminAuth, (req, res) => adminController.deleteUser(req, res));

module.exports = router;
