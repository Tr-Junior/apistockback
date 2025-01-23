const mongoose = require('mongoose');
const Image = mongoose.model('Image');

exports.createImage = async (type, filePath) => {
  const image = new Image({ type, filePath });
  await image.save();
  return image;
};



exports.updateImage = async (type, filePath) => {
  const updatedImage = await Image.findOneAndUpdate({ type }, { filePath }, { new: true });
  return updatedImage;
};

exports.deleteImageByType = async (type) => {
  const res = await Image.deleteOne({ type });
  return res;
};

exports.getImageByType = async (type) => {
  const query = type ? { type } : {};  // Se 'type' for passado, filtra pela propriedade 'type'
  const images = await Image.findOne(query);  // Faz a busca no banco com o filtro
  return images;
};


