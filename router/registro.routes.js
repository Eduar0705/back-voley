const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registro.controller');
const upload = require('../middlewares/upload');

router.post('/', upload.single('logo'), registroController.registrarEquipo);

module.exports = router;
