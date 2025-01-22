const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  type: { 
    type: String, 
    required: true 
  },  // 'logo' ou 'pdf'
  filePath: { 
    type: String,
     required: true 
    },  // Caminho do arquivo
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Image", schema); // Registro do modelo
