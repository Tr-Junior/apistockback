'use strict';
const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
    return jwt.sign(data, process.env.SALT_KEY);
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, process.env.SALT_KEY);
    return data;
}

exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito'
        });
    } else {
        jwt.verify(token, process.env.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Expirado faça o login novamente'
                });
            } else {
                next();
            }
        });
    }
};

exports.isAdmin = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Token Inválido'
        });
    } else {
        jwt.verify(token, process.env.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Expirado faça o login novamente'
                });
            } else {
                if (decoded.roles == ('admin')) {
                    next();
                } else {
                    res.status(403).json({
                        message: 'Esta funcionalidade é restrita para administradores'
                    });
                }
            }
        });
    }
};