// backend/models/index.js
// Centraal exportpunt voor alle Sequelize-modellen.
// Initialiseert de databaseverbinding en laadt het Painting-model.
// Alle andere modules importeren modellen via dit bestand.

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Laad de modellen en initialiseer ze met de databaseverbinding
const PaintingModel = require('./painting.model');
const UserModel     = require('./user.model');

const Painting = PaintingModel(sequelize);
const User     = UserModel(sequelize);

module.exports = {
  Sequelize, // Sequelize-klasse (voor DataTypes, Op, etc.)
  sequelize, // Geconfigureerde databaseverbinding
  Painting,  // Schilderijen-model
  User,      // Gebruikers-model (authenticatie)
};
