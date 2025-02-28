'use strict';

const Supplier = require('../models/supplier');
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/product-repository');
const guid = require('guid');


exports.get = async (req, res) => {
    const { page = 1, limit = 50 } = req.query;

    try {
        const data = await repository.get(page, limit);
        const totalItems = await repository.getTotalItems(); 
        const totalPages = Math.ceil(totalItems / limit); 

        res.status(200).send({
            data, 
            totalItems, 
            totalPages,  
            currentPage: page, 
            perPage: limit  
        });
    } catch (e) {
        console.error('Erro ao processar a requisição:', e); 
        res.status(500).send({
            message: 'Falha ao processar a requisição',
            error: e.message 
        });
    }
};


exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.searchByTitle = async (req, res, next) => {
    try {
      const { title, page, limit } = req.body;
      
      const data = await repository.getByTitle(title, page, limit);
      res.status(200).send({
        products: data.products, // Produtos
        totalRecords: data.total, // Total de registros
      });
    } catch (e) {
      res.status(500).send({
        message: 'Falha ao processar a requisição',
      });
    }
  };
  
  

exports.post = async (req, res, next) => {
    try {
        let supplier;

        // Se o `supplier` for um ID (assumindo que seja um ObjectId válido), busca pelo ID
        if (req.body.supplier && typeof req.body.supplier === 'string' && req.body.supplier.match(/^[0-9a-fA-F]{24}$/)) {
            supplier = await Supplier.findById(req.body.supplier);
        } 

        // Se o `supplier` for um nome, verifica se o fornecedor já existe ou cria um novo
        if (!supplier && typeof req.body.supplier === 'string') {
            supplier = await Supplier.findOne({ name: req.body.supplier });

            if (!supplier) {
                supplier = new Supplier({ name: req.body.supplier });
                await supplier.save();
            }
        }

        if (!supplier) {
            return res.status(400).send({ message: 'Fornecedor inválido ou não encontrado' });
        }

       
        await repository.create({
            codigo: guid.raw().substring(0, 6),
            title: req.body.title,
            quantity: req.body.quantity,
            min_quantity: (req.body.quantity / 2),
            supplier: supplier._id,
            purchasePrice: req.body.purchasePrice,
            price: req.body.price,
        });

        res.status(201).send({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({
              message: 'Já existe um produto com este título.',
              field: error.keyValue,
            });
        
    }
    console.error(error);
    res.status(500).send({ message: 'Falha ao processar a requisição' });
}
};


exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({ message: 'Produto atualizado!' });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.updateByIdBody = async (req, res, next) => {
    try {
        const { id, supplier, ...productUpdates } = req.body; // Desestruturação para pegar o ID e outros dados do produto

        // Inicializa o objeto para armazenar as atualizações do produto
        const updates = { ...productUpdates };

        // Verifica se o nome do fornecedor foi passado em vez de um ID
        if (supplier && typeof supplier === 'string') {
            // Cria um novo fornecedor com o nome fornecido
            const newSupplier = new Supplier({ name: supplier });
            await newSupplier.save();

            // Atualiza o produto com o ID do novo fornecedor criado
            updates.supplier = newSupplier._id;
        } else if (supplier) {
            // Caso o supplier seja um ID válido, o atribui diretamente
            updates.supplier = supplier;
        }

        // Atualiza o produto no repositório com os novos dados
        await repository.update(id, updates);

        res.status(200).send({ message: 'Produto atualizado com sucesso!' });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: 'Falha ao processar a requisição',
        });
    }
};



exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id)
        res.status(200).send({
            message: 'Produto removido!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}