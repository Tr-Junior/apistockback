const ValidationContract = require('../validators/validators');
const repository = require('../repositories/customer-repository');

exports.validateCustomerData = async (req, res, next) => {
  const { name, password, pass, roles } = req.body;
  let contract = new ValidationContract();

  contract.hasMinLen(name, 3, 'O nome deve ter pelo menos 3 caracteres.');
  
  contract.hasMinLen(password, 6, 'A senha deve ter pelo menos 6 caracteres.');

  const userExists = await repository.checkUsernameExists(name);
  if (userExists) {
    contract.errors.push({ message: 'O nome de usuário já está em uso.' });
  }

  if (!contract.isValid()) {
    return res.status(400).send(contract.errors).end();
  }
  next();
};
