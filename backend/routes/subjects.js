const express = require('express');
const subjectController = require('../controllers/SubjectController');
const { auth } = require('../middleware/auth');
const Validator = require('../middleware/Validator');
const router = express.Router();

router.get('/', auth, (req, res) => subjectController.getAll(req, res));
router.post('/', auth, Validator.validateSubject, (req, res) => subjectController.create(req, res));
router.put('/:id', auth, Validator.validateSubject, (req, res) => subjectController.update(req, res));
router.delete('/:id', auth, (req, res) => subjectController.delete(req, res));

module.exports = router;
