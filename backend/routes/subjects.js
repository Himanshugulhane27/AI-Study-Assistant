const express = require('express');
const subjectController = require('../controllers/SubjectController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, (req, res) => subjectController.getAll(req, res));
router.post('/', auth, (req, res) => subjectController.create(req, res));
router.put('/:id', auth, (req, res) => subjectController.update(req, res));
router.delete('/:id', auth, (req, res) => subjectController.delete(req, res));

module.exports = router;
