const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  type: { 
    type: String, 
    required: true 
  },  // 'logo' ou 'pdf'
  filePath: { 
    type: String,
     required: true 
    },  // Caminho do arquivo para visualizar no front
    name: { 
      type: String, 
      required: true 
    },  // Nome do arquivo para deletar da pasta
    imageUrl: {
      type: String,
      required: true
    },  // Link para visualizar o arquivo no front
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Image", schema); // Registro do modelo
