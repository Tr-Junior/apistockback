'use strict';

const mongoose = require('mongoose');
const ValidationContract = require('../validators/validators');
const Budget = mongoose.model('Budget');

/**
 * Middleware para validar IDs de MongoDB.
 */
exports.validateMongoId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'ID inválido.' });
  }
  next();
};

/**
 * Middleware para validar a entrada de dados ao criar ou atualizar orçamento.
 */
exports.validateBudgetInput = (req, res, next) => {
  const contract = new ValidationContract();

  contract.isRequired(req.body.client, 'O nome do cliente é obrigatório.');
  contract.isArray(req.body.budget?.items, 'Os itens do orçamento devem ser um array.');
  contract.isGreaterThan(req.body.budget?.items?.length || 0, 0, 'O orçamento deve conter ao menos um item.');
  contract.isNumber(req.body.budget?.total, 'O total do orçamento deve ser um número.');

  if (!contract.isValid()) {
    return res.status(400).send({
      errors: contract.errors(),
    });
  }

  next();
};

/**
 * Middleware para verificar se o orçamento existe.
 */
exports.checkBudgetExists = async (req, res, next) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).send({ message: 'Orçamento não encontrado.' });
    }

    // Armazena o orçamento no `req` para uso posterior.
    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).send({
      message: 'Erro ao buscar o orçamento.',
      error: error.message,
    });
  }
};


