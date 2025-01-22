/**
 * Valida se o CEP possui 8 dígitos numéricos.
 * @param {string} cep
 * @returns {boolean}
 */
const validarCep = (cep) => {
  const regexCep = /^[0-9]{8}$/; // Verifica se o CEP contém exatamente 8 dígitos
  return regexCep.test(cep);
};

// Exporta a função corretamente
module.exports = validarCep;
