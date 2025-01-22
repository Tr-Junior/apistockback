const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome da loja é obrigatório."],
    trim: true,
  },
  cnpj: {
    type: String,
    required: [true, "O CNPJ é obrigatório."],
    unique: true,
    match: [/^\d{14}$/, "O CNPJ deve conter exatamente 14 dígitos numéricos."],
  },
  address: {
    zip: {
      type: String,
      required: [true, "O CEP é obrigatório."],
      match: [/^\d{8}$/, "O CEP deve conter exatamente 8 dígitos numéricos."],
    },
    backYard: {
      type: String,
      required: false,
    },
    neighborhood: {
      type: String,
      required: false,
    },
    addressLine: {
      type: String,
      required: [true, "O número do endereço é obrigatório."],
    },
    addressLine2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
  },
  contact: {
    telephone: {
      type: String,
      required: [true, "O telefone é obrigatório."],
      match: [
        /^\d{10,11}$/,
        "O telefone deve conter 10 ou 11 dígitos, incluindo DDD.",
      ],
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório."],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "O email deve ser um endereço válido.",
      ],
    },
  },
  // dadosFiscais: {
  //   regimeTributario: {
  //     type: String,
  //     required: [true, "O regime tributário é obrigatório."],
  //     enum: ["Simples Nacional", "Lucro Presumido", "Lucro Real"],
  //   },
  //   inscricaoEstadual: {
  //     type: String,
  //     required: [true, "A inscrição estadual é obrigatória."],
  //     match: [/^\d{9,12}$/, "A inscrição estadual deve ter entre 9 e 12 dígitos."],
  //   },
  //   inscricaoMunicipal: {
  //     type: String,
  //     default: null,
  //   },
  // },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CompanyInfo", schema); // Registro do modelo
