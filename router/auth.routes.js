const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.put('/update-clave/:id', authController.updateClave);

module.exports = router;
