const express = require('express');
const router = express.Router();
const juegosController = require('../controllers/juegos.controller');

router.get('/', juegosController.getJuegos);

module.exports = router;
