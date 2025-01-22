'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/auth-service');
const orderMiddleware = require('../middlewares/order-middleware');

// Criar novo pedido
router.post(
  '/',
  authService.authorize,
  orderMiddleware.validateOrderInput,
  controller.post
);

// Obter todos os pedidos
router.get('/', authService.authorize, controller.get);

// Obter pedidos por intervalo de datas
router.post('/sales', authService.authorize, controller.getSales);

// Excluir pedido por ID
router.delete(
  '/:id',
  authService.isAdmin,
  orderMiddleware.validateMongoId,
  orderMiddleware.checkOrderExists,
  controller.delete
);

// Excluir pedido por código
router.delete(
  '/deleteByCode/:code',
  authService.isAdmin,
  controller.deleteByCode
);

module.exports = router;
