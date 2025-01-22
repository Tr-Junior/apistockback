'use strict';


const ValidationContract = require('../validators/validators');
const repository = require('../repositories/exits-repository');
const azure = require('azure-storage');
const guid = require('guid');



exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}


exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.getByTitle = async (req, res, next) => {
    try {
        const data = await repository.getByTitle(req.params.description);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    try {
      await repository.create({
        description: req.body.description,
        value: req.body.value,
        formPaymentExit: req.body.formPaymentExit,
        date: req.body.date
      });
      res.status(201).send({
        message: 'Saída cadastrada com sucesso!'
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
        await repository.update(req.body.id, req.body);
        res.status(200).send({ message: 'Saída atualizada!' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id)
        res.status(200).send({
            message: 'Saía Removida!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}