'use strict';

const mongoose = require('mongoose');
const ValidationContract = require('../validators/validators');
const Product = require('../models/product');

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
 * Middleware para validar a entrada de dados ao criar ou atualizar produtos.
 */
exports.validateProductInput = (req, res, next) => {
    const contract = new ValidationContract();
  
    // Validação de título apenas se ele for fornecido
    if (req.body.title) {
      contract.isRequired(req.body.title, 'O título do produto é obrigatório.');
    }
  
    // Validação de quantidade, preço de compra e preço do produto
    if (req.body.quantity !== undefined) {
      contract.isNumber(req.body.quantity, 'A quantidade deve ser um número.');
    }
  
    if (req.body.purchasePrice !== undefined) {
      contract.isNumber(req.body.purchasePrice, 'O preço de compra deve ser um número.');
    }
  
    if (req.body.price !== undefined) {
      contract.isNumber(req.body.price, 'O preço do produto deve ser um número.');
    }
  
    // Se a validação falhar, retorna os erros
    if (!contract.isValid()) {
      return res.status(400).send({
        errors: contract.errors,
      });
    }
  
    next();
  };
  

/**
 * Middleware para verificar se o produto existe antes de atualizar ou excluir.
 */
exports.checkProductExists = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: 'Produto não encontrado.' });
    }

    // Anexa o produto no `req` para uso posterior, se necessário.
    req.product = product;
    next();
  } catch (error) {
    res.status(500).send({
      message: 'Erro ao buscar o produto.',
      error: error.message,
    });
  }
};
