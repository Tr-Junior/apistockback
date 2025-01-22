'use strict';

const mongoose = require('mongoose');
const ValidationContract = require('../validators/validators');
const Order = require('../models/order');

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
 * Middleware para validar a entrada de dados ao criar pedidos.
 */

exports.validateOrderInput = (req, res, next) => {
  const contract = new ValidationContract();

  // Validação de itens da venda
  if (!req.body.sale || !Array.isArray(req.body.sale.items) || req.body.sale.items.length === 0) {
    return res.status(400).send({ message: 'A venda deve conter pelo menos um item.' });
  }

  for (const item of req.body.sale.items) {
    contract.isRequired(item.product, 'O ID do produto é obrigatório para cada item.');
    if (item.product && !mongoose.Types.ObjectId.isValid(item.product)) {
      return res.status(400).send({
        message: `ID do produto inválido para o item: ${item.title || 'sem título'}.`,
      });
    }
    contract.isRequired(item.title, 'O título do produto é obrigatório para cada item.');
    contract.isString(item.title, 'O título do produto deve ser uma string.');
    contract.isRequired(item.quantity, 'A quantidade é obrigatória para cada item.');
    contract.isNumber(item.quantity, 'A quantidade deve ser um número.');
    contract.isRequired(item.price, 'O preço é obrigatório para cada item.');
    contract.isNumber(item.price, 'O preço deve ser um número.');
  }

  // Validação de total da venda
  contract.isRequired(req.body.sale.total, 'O total da venda é obrigatório.');
  contract.isNumber(req.body.sale.total, 'O total da venda deve ser um número.');

  // Validação de desconto
  if (req.body.sale.discount !== undefined) {
    contract.isNumber(req.body.sale.discount, 'O desconto deve ser um número.');
  }

  // Validação de forma de pagamento
  contract.isRequired(req.body.sale.formPayment, 'A forma de pagamento é obrigatória.');
  contract.isString(req.body.sale.formPayment, 'A forma de pagamento deve ser uma string.');

  // Retornar erros, se existirem
  if (!contract.isValid()) {
    return res.status(400).send({
      message: 'Erro de validação nos dados da requisição.',
      errors: contract.errors(),
    });
  }

  next();
};


/**
 * Middleware para verificar se o pedido existe antes de realizar operações.
 */
exports.checkOrderExists = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).send({ message: 'Pedido não encontrado.' });
    }

    // Anexa o pedido ao `req` para uso posterior, se necessário.
    req.order = order;
    next();
  } catch (error) {
    res.status(500).send({
      message: 'Erro ao buscar o pedido.',
      error: error.message,
    });
  }
};

