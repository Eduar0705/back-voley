const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registro.controller');

router.post('/', registroController.registrarEquipo);

module.exports = router;
