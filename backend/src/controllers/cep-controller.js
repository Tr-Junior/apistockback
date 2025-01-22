const buscarCep = require("../services/cep-service"); // Certifique-se de usar o caminho correto
const validarCep = require("../validators/cepValidator"); // Certifique-se de usar o caminho correto

/**
 * Controlador para consultar informações de um CEP.
 */
const consultarCep = async (req, res, next) => {
  const { cep } = req.body;

  try {
    // Valida o CEP
    if (!validarCep(cep)) {
      const error = new Error("CEP inválido. Deve conter 8 dígitos numéricos.");
      error.statusCode = 400;
      throw error; // Lança o erro para ser capturado
    }

    // Busca o CEP na API
    const resultado = await buscarCep(cep);
    return res.status(200).json(resultado);
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro
  }
};

module.exports = { consultarCep };
