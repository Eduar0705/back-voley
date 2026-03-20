const express = require('express');
const router = express.Router();
const jugadoresController = require('../controllers/jugadores.controller');

router.get('/', jugadoresController.getJugadores);
router.get('/equipo/:equipo_id', jugadoresController.getJugadoresByEquipo);
router.post('/', jugadoresController.addJugador);
router.put('/:id', jugadoresController.updateJugador);
router.delete('/:id', jugadoresController.deleteJugador);

module.exports = router;
