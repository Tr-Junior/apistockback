const repository = require("../repositories/companyInfo-repository");

exports.createCompanyInfo = async (req, res, next) => {

  try {
    // Criação do registro de CompanyInfo com as informações fornecidas
   const companyInfo = await repository.create({
      name: req.body.name,
      cnpj: req.body.cnpj,
      address: req.body.address,
      contact: req.body.contact
    });

    // Responde com o registro criado
    res.status(201).json(companyInfo);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para obter todos os registros de CompanyInfo.
 */
exports.getAllCompanyInfo = async (req, res, next) => {
    try {
      var data = await repository.get();
      res.status(200).send(data);
    } catch (e) {
      console.error('Erro ao buscar CompanyInfo:', e);
      res.status(500).send({
        message: 'Falha ao processar a requisição'
      });
    }
  };
  

/**
 * Controlador para obter um registro de CompanyInfo pelo ID.
 */
exports.getCompanyInfoById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const companyInfo = await repository.getById(id);

    if (!companyInfo) {
      return res.status(404).json({ message: "CompanyInfo não encontrado." });
    }

    res.status(200).json(companyInfo);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para atualizar um registro de CompanyInfo pelo ID.
 */
/**
 * Atualiza um registro de CompanyInfo pelo ID.
 * @param {string} id ID do CompanyInfo.
 * @param {Object} data Dados a serem atualizados.
 * @returns {Promise<void>}
 */
exports.updateCompanyInfo = async (req, res, next) => {
  try {
      await repository.update(req.params.id, req.body);
      res.status(200).send({ message: 'CompanyInfo atualizado com sucesso!' });
  } catch (error) {
      console.error('Erro ao atualizar CompanyInfo:', error);
      res.status(500).send({
          message: 'Falha ao processar a requisição.'
      });
  }
};


/**
 * Controlador para excluir um registro de CompanyInfo pelo ID.
 */
exports.deleteCompanyInfo = async (req, res, next) => {
  const { id } = req.params;

  try {
    await repository.delete(id);
    res.status(200).json({ message: "CompanyInfo deletado com sucesso." });
  } catch (error) {
    next(error);
  }
};

