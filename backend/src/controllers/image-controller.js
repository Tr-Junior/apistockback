const imageRepository = require('../repositories/image-repository');
const path = require('path');
const fs = require('fs');
const uploadDir = require('../services/upload-config').uploadDir;

// Função para enviar imagem
exports.uploadImage = (type) => {
  return async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado!' });
      }

      const uploadPath = `/uploads/${req.file.filename}`;
      const imageUrl = `${req.protocol}://${req.get('host')}${uploadPath}`;
      console.log('Upload path:', uploadPath);

      // Verificar e deletar imagem antiga
      const oldImage = await imageRepository.getImageByType(type);
      if (oldImage && oldImage.filePath) {
        const oldImagePath = path.join(uploadDir, path.basename(oldImage.filePath));

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        await imageRepository.deleteImageByType(type);
      }

      // Salvar a nova imagem no banco com a URL completa
      const image = await imageRepository.createImage(type, uploadPath, req.file.filename, imageUrl);

      res.status(200).json({
        message: 'Imagem enviada com sucesso',
        image: {
          type: image.type,
          filePath: image.filePath,
          imageUrl: image.imageUrl
        }
      });

    } catch (error) {
      res.status(500).json({ message: 'Erro ao enviar a imagem', error: error.message });
    }
  };
};

// Função para atualizar imagem
exports.updateImage = (type) => {
  return async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado!' });
      }

      const uploadPath = `/uploads/${req.file.filename}`;
      const imageUrl = `${req.protocol}://${req.get('host')}${uploadPath}`;

      const oldImage = await imageRepository.getImageByType(type);
      if (oldImage) {
        const oldImagePath = path.join(uploadDir, path.basename(oldImage.filePath));

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        await imageRepository.updateImage(type, uploadPath, req.file.filename, imageUrl);

        return res.status(200).json({ 
          message: 'Imagem atualizada com sucesso!', 
          imageUrl: imageUrl 
        });
      } else {
        return res.status(404).json({ message: 'Imagem não encontrada para atualização' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar a imagem', error: error.message });
    }
  };
};

exports.getImageByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: 'Tipo de imagem é obrigatório' });
    }

    const image = await imageRepository.getImageByType(type);

    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    res.status(200).json({
      type: image.type,
      filePath: image.filePath,
      imageUrl: image.imageUrl,
      name: image.name,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar imagem', error: error.message });
  }
};
