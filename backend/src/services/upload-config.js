const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Verificar e criar o diretório de uploads, caso não exista
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './src/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Usar o diretório absoluto
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Nome único para o arquivo
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Arquivo permitido
  } else {
    cb(new Error('Arquivo inválido! Apenas imagens são permitidas'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }  // Limite de tamanho (5MB)
});

module.exports = upload;
