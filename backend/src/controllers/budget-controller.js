
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/budget-repository');
const entrance = require('../repositories/entrance-repository');
const product = require('../repositories/product-repository')
const guid = require('guid');
const authService = require('../services/auth-service');
const Product = require('../models/product');
const Budget = require('../models/budget');



exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}


exports.post = async (req, res, next) => {
    try {
        const { client, budget, total } = req.body;

        // Verifica se já existe um orçamento com o mesmo nome do cliente
        let existingBudget = await Budget.findOne({ client });

        if (existingBudget) {
            // Itera sobre os novos itens do orçamento
            for (const newItem of budget.items) {
                // Verifica se o item já existe no orçamento com base no ID do produto
                const existingItemIndex = existingBudget.budget.items.findIndex(item => item.product.toString() === newItem.product.toString());

                if (existingItemIndex !== -1) {
                    // Se o item já existir, atualiza a quantidade
                    existingBudget.budget.items[existingItemIndex].quantity += newItem.quantity;
                } else {
                    // Se o item não existir, adiciona-o aos itens existentes
                    existingBudget.budget.items.push(newItem);
                }
            }

            // Atualiza o total do orçamento
            existingBudget.budget.total += budget.total;
            await existingBudget.save();

            return res.status(200).send({
                message: 'Orçamento atualizado com sucesso'
            });
        } else {
            // Cria um novo orçamento
            const number = guid.raw().substring(0, 6);

            await repository.create({
                client,
                number,
                budget,
                total
            });

            return res.status(201).send({
                message: 'Orçamento criado com sucesso'
            });
        }
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.updateClientName(req.body.id, req.body);
        res.status(200).send({ message: 'Nome do cliente atualizado!' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

// Excluir um item do orçamento
exports.removeItemFromBudget = async (req, res, next) => {
    try {
        const { id, itemId, quantityToRemove } = req.body;

        if (!id || !itemId || quantityToRemove <= 0) {
            return res.status(400).send({ message: 'ID do orçamento, ID do item e uma quantidade válida são necessários.' });
        }

        const updatedBudget = await repository.removeItemQuantityFromBudget(id, itemId, quantityToRemove);

        res.status(200).send({ message: 'Quantidade removida do item no orçamento!', updatedBudget });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição',
            error: e.message
        });
    }
};




exports.delete = async (req, res, next) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);

        res.status(200).send({
            message: 'Orçamento Deletado!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};
  