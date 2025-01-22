
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/entrance-repository')
const guid = require('guid');
const authService = require('../services/auth-service');



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

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id)
        res.status(200).send({
            message: 'Produto removido!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.deleteByCode = async (req, res, next) => {
    try {
        await repository.deleteByCode(req.params.code)
        res.status(200).send({
            message: 'Produto removido!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}