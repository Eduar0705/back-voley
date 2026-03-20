const express = require('express');
const router = express.Router();
const juegosController = require('../controllers/juegos.controller');

router.get('/', juegosController.getJuegos);
router.post('/', juegosController.createJuego);
router.put('/:id', juegosController.updateJuego);
router.delete('/:id', juegosController.deleteJuego);

module.exports = router;
