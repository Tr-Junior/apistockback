'use strict';

const ValidationContract = require('../validators/validators');
const repository = require('../repositories/productBuy-repository');

exports.validateProductData = (req, res, next) => {
    let contract = new ValidationContract();

    // Validação do título
    contract.hasMinLen(req.body.title, 3, 'O título deve ter pelo menos 3 caracteres');
    
    if (!contract.isValid()) {
        return res.status(400).send(contract.errors()).end();
    }

    // Se a validação passou, continue com o próximo middleware ou controlador
    next();
};

// Middleware para verificar se o produto com o mesmo título já existe
exports.checkIfProductExists = async (req, res, next) => {
    const existingProduct = await repository.findByTitle(req.body.title);
    if (existingProduct) {
        return res.status(400).send({ message: 'Um produto com o mesmo nome já existe.' });
    }
    next();
};
