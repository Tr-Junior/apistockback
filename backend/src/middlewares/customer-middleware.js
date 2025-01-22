const ValidationContract = require('../validators/validators');
const repository = require('../repositories/customer-repository');

exports.validateCustomerData = async (req, res, next) => {
  const { name, password, pass, roles } = req.body;
  let contract = new ValidationContract();

  // Verifica se o nome tem pelo menos 3 caracteres
  contract.hasMinLen(name, 3, 'O nome deve ter pelo menos 3 caracteres.');
  
  // Verifica se a senha tem pelo menos 6 caracteres
  contract.hasMinLen(password, 6, 'A senha deve ter pelo menos 6 caracteres.');

  // Verifica se a senha de confirmação tem pelo menos 6 caracteres
  contract.hasMinLen(pass, 6, 'A confirmação da senha deve ter pelo menos 6 caracteres.');

  // Verifica se o nome de usuário já existe
  const userExists = await repository.checkUsernameExists(name);
  if (userExists) {
    contract.errors.push({ message: 'O nome de usuário já está em uso.' });
  }

  // Se houver erros de validação, envia os erros para a resposta
  if (!contract.isValid()) {
    return res.status(400).send(contract.errors).end();  // Correção aqui
  }

  // Se os dados forem válidos, segue para o próximo middleware ou controlador
  next();
};
