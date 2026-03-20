const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);
router.get('/admins', authController.getAdmins);
router.post('/admins', authController.createAdmin);
router.put('/admins/:id', authController.updateAdmin);
router.delete('/admins/:id', authController.deleteAdmin);
router.put('/update-clave/:id', authController.updateClave);

module.exports = router;
