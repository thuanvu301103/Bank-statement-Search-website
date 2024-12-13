const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// Routes
router.get('/', queryController.search);

module.exports = router;