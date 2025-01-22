const upload = require('../services/upload-config'); // Importa o upload configurado no arquivo upload.js

const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Erro no middleware de upload:', err.message);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Erro no upload: ${err.message}` });
      }
      return res.status(500).json({ message: `Erro desconhecido: ${err.message}` });
    }
    next();
  });
};

module.exports = uploadMiddleware;
