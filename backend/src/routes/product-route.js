'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');
const authService = require('../services/auth-service');
const productMiddleware = require('../middlewares/product-middleware');

// Obter todos os produtos
router.get('/', authService.authorize, controller.get);

// Obter produto por ID
router.get('/getById/:id', 
  authService.authorize, 
  productMiddleware.validateMongoId, 
  controller.getById
);

// Criar novo produto
router.post('/', 
  authService.isAdmin, 
  productMiddleware.validateProductInput, 
  controller.post
);

// Atualizar produto por ID (corpo da requisição)
router.put('/updateBody', 
  authService.isAdmin, 
  productMiddleware.validateProductInput, 
  controller.updateByIdBody
);

// Deletar produto por ID
router.delete('/:id', 
  authService.isAdmin, 
  productMiddleware.validateMongoId, 
  productMiddleware.checkProductExists, 
  controller.delete
);

// Buscar produto por título
router.post('/search', authService.authorize, controller.searchByTitle);

module.exports = router;
