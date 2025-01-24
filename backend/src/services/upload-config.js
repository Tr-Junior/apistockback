const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definição do diretório de uploads
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './src/uploads');

// Verifica e cria a pasta se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Diretório absoluto para armazenar os arquivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Garante um nome único
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Arquivo inválido! Apenas imagens são permitidas'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }  // Limite de tamanho: 10MB
});

module.exports = upload;
module.exports.uploadDir = uploadDir;
