const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equipos.controller');
const upload = require('../middlewares/upload');

router.get('/:id', equiposController.getEquipo);
router.put('/:id', upload.single('logo'), equiposController.updateEquipo);
router.get('/:id/stats', equiposController.getEquipoStats);

module.exports = router;
