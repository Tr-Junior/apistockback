const Image = require('../models/image');

exports.createImage = async (type, filePath, name, imageUrl) => {
  const image = new Image({ type, filePath, name, imageUrl });
  await image.save();
  return image;
};

exports.updateImage = async (type, filePath, name, imageUrl) => {
  return await Image.findOneAndUpdate(
    { type },
    { filePath, name, imageUrl },
    { new: true }
  );
};


exports.deleteImageByType = async (type) => {
  return await Image.deleteOne({ type });
};

exports.getImageByType = async (type) => {
  return await Image.findOne({ type });
};
