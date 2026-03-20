const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equipos.controller');
const upload = require('../middlewares/upload');

router.get('/standings', equiposController.getStandings);
router.get('/:id', equiposController.getEquipo);
router.put('/:id', upload.single('logo'), equiposController.updateEquipo);
router.get('/:id/stats', equiposController.getEquipoStats);
router.delete('/:id', equiposController.deleteEquipo);

module.exports = router;
