const mongoose = require('mongoose');
const CompanyInfo = mongoose.model('CompanyInfo');


/**
 * Obtém todos os registros de CompanyInfo.
 * @returns {Promise<Array>} Lista de CompanyInfo.
 */
exports.get = async () => {
    try {
      const res = await CompanyInfo.find({}).sort({ nome: 1 }); // Ordenação alfabética por 'nome'
      return res;
    } catch (error) {
      console.error('Erro ao buscar CompanyInfo:', error);
      throw error;
    }
  };
  

/**
 * Obtém um registro de CompanyInfo pelo ID.
 * @param {string} id
 * @returns {Promise<Object>} CompanyInfo encontrado.
 */
exports.getById = async (id) => {
    try {
        const res = await CompanyInfo.findById(id);
        return res;
    } catch (error) {
        console.error('Erro ao buscar CompanyInfo por ID:', error);
        throw error;
    }
};

/**
 * Cria um novo registro de CompanyInfo no banco de dados.
 * @param {Object} dados Dados de CompanyInfo a serem salvos.
 * @returns {Promise<Object>} CompanyInfo criado.
 */
exports.create = async (dados) => {
    try {
        const companyInfo = new CompanyInfo(dados);
        await companyInfo.save();
        return companyInfo;
    } catch (error) {
        console.error('Erro ao criar CompanyInfo:', error);
        throw error;
    }
};

/**
 * Atualiza um registro de CompanyInfo pelo ID.
 * @param {string} id ID do CompanyInfo.
 * @param {Object} data Dados a serem atualizados.
 * @returns {Promise<void>}
 */
exports.update = async (id, data) => {
    await CompanyInfo.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            contact: data.contact,
        }
    });
};



/**
 * Deleta um registro de CompanyInfo pelo ID.
 * @param {string} id
 */
exports.delete = async (id) => {
    try {
        await CompanyInfo.findByIdAndDelete(id);
    } catch (error) {
        console.error('Erro ao deletar CompanyInfo:', error);
        throw error;
    }
};

  /**
 * Obtém um registro de CompanyInfo com base em um campo específico.
 * @param {string} field Nome do campo.
 * @param {string} value Valor do campo.
 * @returns {Promise<Object>} Empresa encontrada.
 */
exports.getByField = async (field, value) => {
    try {
      const query = {};
      query[field] = value;
      const company = await CompanyInfo.findOne(query);
      return company;
    } catch (error) {
      throw new Error('Erro ao buscar pelo campo: ' + error.message);
    }
  };
  
