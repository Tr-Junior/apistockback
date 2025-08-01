const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const imageController = require('../controllers/image-controller');
const authService = require('../services/auth-service');

// Rota para enviar a imagem da logo
router.post('/upload/logo',authService.authorize, uploadMiddleware, imageController.uploadImage('logo'));

// Rota para enviar a imagem para o PDF
router.post('/upload/pdf',authService.authorize, uploadMiddleware, imageController.uploadImage('pdf'));

// Rota para atualizar a imagem da logo
router.put('/update/logo',authService.authorize, uploadMiddleware, imageController.updateImage('logo'));

// Rota para atualizar a imagem do PDF
router.put('/update/pdf',authService.authorize, uploadMiddleware, imageController.updateImage('pdf'));

router.get('/image',authService.authorize, uploadMiddleware, imageController.getImageByType);

module.exports = router;
