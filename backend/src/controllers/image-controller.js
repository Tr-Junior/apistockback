const imageRepository = require('../repositories/image-repository');
const path = require('path');
const fs = require('fs');

// Função para enviar imagem
const uploadImage = (type) => {
  return async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado!' });
      }

      const uploadPath = `/uploads/${req.file.filename}`;
      console.log('Upload path:', uploadPath);

      // Deletar a imagem antiga, se existir
      const oldImage = await imageRepository.getImageByType(type);
      if (oldImage && oldImage.filePath) {
        fs.unlinkSync(path.resolve(oldImage.filePath));
        await imageRepository.deleteImageByType(type);
      }

      // Criar nova imagem com caminho absoluto
      const image = await imageRepository.createImage(type, uploadPath);
      res.status(200).json({
        message: 'Imagem enviada com sucesso',
        image: {
          type: image.type,
          // Corrigindo a URL para não duplicar localhost
          filePath: `${req.protocol}://${req.get('host')}${image.filePath.startsWith('/') ? image.filePath : '/' + image.filePath}`,
        }
      });
      
      
      
    } catch (error) {
      res.status(500).json({ message: 'Erro ao enviar a imagem', error: error.message });
    }
  };
};

// Função para atualizar imagem
const updateImage = (type) => {
  return async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado!' });
      }

      const oldImage = await imageRepository.getImageByType(type);
      if (oldImage) {
        // Excluir o arquivo antigo
        fs.unlinkSync(path.join(process.env.UPLOAD_DIR, oldImage.filePath));
        await imageRepository.updateImage(type, req.file.filename);
        return res.status(200).json({ message: 'Imagem atualizada com sucesso!' });
      } else {
        return res.status(404).json({ message: 'Imagem não encontrada para atualização' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar a imagem', error: error.message });
    }
  };
};

module.exports = {
  uploadImage,
  updateImage
};