const express = require('express');
const router = express.Router();
const controller = require('../controllers/exits-controller');
const authService = require('../services/auth-service');
const validationMiddleware = require('../middlewares/exits-middleware');  // Importando o middleware de validação

// Rotas para manipular as saídas
router.get('/', authService.isAdmin, controller.get);
router.get('/getById/:id', authService.isAdmin, controller.getById);
router.post('/', authService.isAdmin, validationMiddleware.validateExitData, controller.post);  // Middleware de validação antes do controlador
router.put('/update', authService.isAdmin, controller.put);
router.delete('/:id', authService.isAdmin, controller.delete);
router.get('/search/:title', authService.isAdmin, controller.getByTitle);

module.exports = router;
