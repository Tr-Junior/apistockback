'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/budget-controller');
const authService = require('../services/auth-service');
const budgetMiddleware = require('../middlewares/budget-middleware');

// Criar um novo orçamento (autenticado e validado)
router.post('/',
    authService.authorize,
    budgetMiddleware.validateBudgetInput,
    controller.post
);

// Obter todos os orçamentos (autenticado)
router.get('/',
    authService.authorize,
    controller.get
);

// Deletar um orçamento por ID (apenas Admins)
router.delete('/:id',
    authService.isAdmin,
    budgetMiddleware.validateMongoId,
    budgetMiddleware.checkBudgetExists,
    controller.delete
);

// Atualizar o nome do cliente (apenas Admins)
router.put('/update-client-name',
    authService.isAdmin,
    controller.put
);

// Remover um item do orçamento (apenas Admins)
router.put('/remove-item',
    authService.isAdmin,
    controller.removeItemFromBudget
);

module.exports = router;
