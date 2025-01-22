'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/productBuy-controller');
const authService = require('../services/auth-service');
const productBuyMiddleware = require('../middlewares/productBuy-middleware');

router.get('/', authService.authorize, controller.get);
router.post('/', authService.isAdmin, productBuyMiddleware.validateProductData, productBuyMiddleware.checkIfProductExists, controller.post);
router.put('/update', authService.isAdmin, productBuyMiddleware.validateProductData, controller.put);
router.delete('/:id', authService.isAdmin, controller.delete);
router.post('/search', authService.authorize, controller.searchByTitle);

module.exports = router;
