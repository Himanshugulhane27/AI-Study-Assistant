const express = require('express');
const multer = require('multer');
const path = require('path');
const materialController = require('../controllers/MaterialController');
const { auth } = require('../middleware/auth');
const Validator = require('../middleware/Validator');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF and TXT files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', auth, (req, res) => materialController.getAll(req, res));
router.get('/:id', auth, (req, res) => materialController.getById(req, res));
router.post('/', auth, upload.single('file'), Validator.validateMaterial, (req, res) => materialController.create(req, res));
router.post('/:id/summary', auth, (req, res) => materialController.generateSummary(req, res));
router.post('/:id/ask', auth, Validator.validateQuestion, (req, res) => materialController.askQuestion(req, res));
router.delete('/:id', auth, (req, res) => materialController.delete(req, res));

module.exports = router;
