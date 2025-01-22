const repository = require("../repositories/companyInfo-repository");

const validateCnpj = async (cnpj) => {
  const existingCompany = await repository.getByField("cnpj", cnpj);
  if (existingCompany) {
    throw new Error("O CNPJ já está cadastrado.");
  }
};

exports.validateCompanyInfo = async (req, res, next) => {
  try {
    const { name, cnpj, address, contact } = req.body;

    // Verifica se o nome e o CNPJ estão presentes
    if (!name) {
      throw new Error("O nome da loja é obrigatório.");
    }
    if (!cnpj) {
      throw new Error("O CNPJ é obrigatório.");
    }

    // Valida o CNPJ
    if (!/^\d{14}$/.test(cnpj)) {
      throw new Error("O CNPJ deve conter exatamente 14 dígitos numéricos.");
    }

    // Verifica se o CNPJ já existe no banco
    await validateCnpj(cnpj);

    // Verifica a presença e a formatação do endereço
    if (!address || !address.zip) {
      throw new Error("O CEP é obrigatório.");
    }
    if (!/^\d{8}$/.test(address.zip)) {
      throw new Error("O CEP deve conter exatamente 8 dígitos numéricos.");
    }

    // Verifica os contatos
    if (!contact || !contact.telephone || !contact.email) {
      throw new Error("Telefone e email são obrigatórios.");
    }
    if (!/^\d{10,11}$/.test(contact.telephone)) {
      throw new Error("O telefone deve conter 10 ou 11 dígitos, incluindo DDD.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      throw new Error("O email deve ser um endereço válido.");
    }

    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
