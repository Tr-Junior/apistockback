const axios = require("axios");

// Obtém a URL base da API do arquivo .env
const baseUrl = process.env.VIACEP_BASE_URL;

/**
 * Busca informações de um CEP usando a API pública dos Correios ou equivalente.
 * @param {string} cep
 * @returns {Promise<object>}
 */

const buscarCep = async (cep) => {
  try {
    // Faz a requisição à API
    const response = await axios.get(`${baseUrl}/${cep}/json/`);

    // Verifica se o CEP foi encontrado
    if (response.data.erro) {
      throw new Error("CEP não encontrado.");
    }

    // Retorna os dados formatados
    return {
      cep: cep,
      rua: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      estado: response.data.uf,
    };
  } catch (error) {
    // Erros de conexão ou de resposta
    if (error.response) {
      // Erros de resposta da API (ex.: 404 ou 500)
      throw new Error(`Erro na API de CEP: ${error.response.statusText || "Resposta inválida."}`);
    } else if (error.request) {
      // Erros de conexão ou falta de resposta
      throw new Error("Erro na comunicação com a API de CEP. Verifique sua conexão.");
    } else {
      // Outros erros
      throw new Error(error.message || "Erro desconhecido ao buscar informações do CEP.");
    }
  }
};


module.exports = buscarCep;
