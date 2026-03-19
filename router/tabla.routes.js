const express = require('express');
const router = express.Router();
const tablaController = require('../controllers/tabla.controller');

router.get('/', tablaController.getStandings);

module.exports = router;
