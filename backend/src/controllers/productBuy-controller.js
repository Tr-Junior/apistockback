'use strict';


const ValidationContract = require('../validators/validators');
const repository = require('../repositories/productBuy-repository');
const guid = require('guid');


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

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

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
        const searchTerm = req.body.title; // Assumindo que o termo de pesquisa é enviado no corpo da requisição com o campo "title"
        const data = await repository.getByTitle(searchTerm);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
};

exports.post = async (req, res, next) => {
    try {
        await repository.create({
            title: req.body.title,
            status: req.body.status,
        });

        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        const id = req.params.id || req.body.id;
        if (!id) {
            return res.status(400).send({ message: 'ID do produto é necessário.' });
        }

        const result = await repository.update(id, req.body);
        if (!result) {
            return res.status(404).send({ message: 'Produto não encontrado.' });
        }

        res.status(200).send({ message: 'Produto atualizado!' });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Falha ao processar a requisição.' });
    }
}

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