'use strict';

const ValidationContract = require('../validators/validators');

exports.validateExitData = (req, res, next) => {
  let contract = new ValidationContract();

  // Validação dos campos
  contract.hasMinLen(req.body.description, 3, 'O título deve ter pelo menos 3 caracteres');
  contract.hasMinLen(req.body.value, 1, 'O valor deve ser informado');
  contract.hasMinLen(req.body.formPaymentExit, 1, 'A forma de pagamento deve ser informada');
  contract.hasMinLen(req.body.date, 3, 'A data é requerida');

  // Se houver erros, retorna a resposta com os erros
  if (!contract.isValid()) {
    return res.status(400).send(contract.errors).end();  // Acesso a 'contract.errors' como uma propriedade
  }

  // Se a validação passou, continua para o próximo middleware ou controlador
  next();
};

