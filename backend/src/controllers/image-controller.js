const repository = require('../repositories/image-repository');
const path = require('path');
const fs = require('fs');

// Função para enviar imagem
exports.uploadImage = (type) => {
  return async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado!' });
      }

      // Deletar a imagem antiga, se existir
      const oldImage = await repository.getImageByType(type);
      if (oldImage) {
        // Excluir o arquivo antigo do diretório
        fs.unlinkSync(path.join(process.env.UPLOAD_DIR, oldImage.filePath));
        await repository.deleteImageByType(type);
      }

      // Criar nova imagem
      const image = await repository.createImage(type, req.file.filename);

      // Gerar a URL da imagem
      const imageUrl = `${process.env.BASE_URL}/image/image?type=${type}`; // Ajuste conforme sua configuração

      res.status(200).json({
        message: 'Imagem enviada com sucesso',
        image: {
          fileName: req.file.filename,
          url: imageUrl, // Adicionando a URL da imagem
        },
      });
    } catch (error) {
      console.error('Erro ao processar upload:', error);
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

      const oldImage = await repository.getImageByType(type);
      if (oldImage) {
        // Excluir o arquivo antigo
        fs.unlinkSync(path.join(process.env.UPLOAD_DIR, oldImage.filePath));
        await repository.updateImage(type, req.file.filename);

        // Gerar a URL da imagem
        const imageUrl = `${process.env.BASE_URL}/image/image?type=${type}`;

        return res.status(200).json({
          message: 'Imagem atualizada com sucesso!',
          image: { fileName: req.file.filename, url: imageUrl },
        });
      } else {
        return res.status(404).json({ message: 'Imagem não encontrada para atualização' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar a imagem', error: error.message });
    }
  };
};

// Função para obter imagem
exports.get = async (req, res, next) => {
  try {
    const { type } = req.query; // Obtém o parâmetro 'type' da query string (ex: /image?type=pdf)
    const data = await repository.get(type); // Chama o repositório passando o tipo
    res.status(200).send(data); // Retorna os dados encontrados
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar a requisição',
      error: e.message,
    });
  }
};
