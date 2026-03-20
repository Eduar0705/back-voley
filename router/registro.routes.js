const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registro.controller');
const upload = require('../middlewares/upload');

router.post('/', upload.single('logo'), registroController.registrarEquipo);
router.get('/equipos', registroController.getEquipos);

module.exports = router;
