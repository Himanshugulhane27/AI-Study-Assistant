const express = require('express');
const quizController = require('../controllers/QuizController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/generate/:materialId', auth, (req, res) => quizController.generate(req, res));
router.get('/', auth, (req, res) => quizController.getAll(req, res));
router.get('/:id', auth, (req, res) => quizController.getById(req, res));
router.post('/:id/submit', auth, (req, res) => quizController.submit(req, res));
router.delete('/:id', auth, (req, res) => quizController.delete(req, res));

module.exports = router;
