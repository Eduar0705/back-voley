const express = require('express');
const router = express.Router();
const jugadoresController = require('../controllers/jugadores.controller');

router.get('/', jugadoresController.getJugadores);

module.exports = router;
