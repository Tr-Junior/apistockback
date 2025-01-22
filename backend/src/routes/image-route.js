const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const imageController = require('../controllers/image-controller');

// Rota para enviar a imagem da logo
router.post('/upload/logo', uploadMiddleware, imageController.uploadImage('logo'));

// Rota para enviar a imagem para o PDF
router.post('/upload/pdf', uploadMiddleware, imageController.uploadImage('pdf'));

// Rota para atualizar a imagem da logo
router.put('/update/logo', uploadMiddleware, imageController.updateImage('logo'));

// Rota para atualizar a imagem do PDF
router.put('/update/pdf', uploadMiddleware, imageController.updateImage('pdf'));

router.get('/image', imageController.get);

module.exports = router;
