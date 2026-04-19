const express = require('express');
const progressController = require('../controllers/ProgressController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, (req, res) => progressController.getAll(req, res));
router.get('/stats', auth, (req, res) => progressController.getStats(req, res));
router.put('/:materialId', auth, (req, res) => progressController.updateStatus(req, res));

module.exports = router;
