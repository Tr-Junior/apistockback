const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');
const customerMiddleware = require('../middlewares/customer-middleware');

// Rotas protegidas para administração
router.post('/', authService.isAdmin, customerMiddleware.validateCustomerData, controller.post);
router.get('/', authService.isAdmin, controller.get);
router.get('/check-username/:name', authService.isAdmin, controller.getByName);

// Rotas de autenticação
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);
router.get('/getById/:id', authService.authorize, controller.getById);
router.put('/update-password', authService.authorize, controller.updatePassword);
router.post('/validate-password', controller.validatePassword);

// Rota para atualizar credenciais do admin após o primeiro login
router.post('/update-admin', authService.authorize, controller.updateAdminCredentials);

module.exports = router;
