const express = require('express');
const router = express.Router();
const partidosController = require('../controllers/partidos.controller');

router.get('/', partidosController.getPartidos);
router.post('/', partidosController.createPartido);
router.put('/:id', partidosController.updatePartido);
router.delete('/:id', partidosController.deletePartido);

module.exports = router;
