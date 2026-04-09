const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const PaintingModel = require('./painting.model');
const Painting = PaintingModel(sequelize);

module.exports = {
  Sequelize,
  sequelize,
  Painting,
};
