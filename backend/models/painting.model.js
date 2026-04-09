// backend/models/painting.model.js
// Sequelize-modeldefinitie voor een schilderij in de collectie.
// Dit model wordt gebruikt voor alle databaseoperaties op de 'paintings' tabel
// in het schema 'schema_nevils_gallery'.

const { DataTypes } = require('sequelize');

/**
 * Definieert het Painting-model voor Sequelize.
 * @param {import('sequelize').Sequelize} sequelize - De geconfigureerde Sequelize-instantie
 * @returns {import('sequelize').Model} Het geïnitialiseerde Painting-model
 */
module.exports = (sequelize) => {
  const Painting = sequelize.define('Painting', {
    // Unieke identifier als UUID (gegenereerd via randomUUID in de controller)
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'id',
    },
    // Relatief serverpad naar de afbeelding (bijv. /assets/img/...)
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image',
    },
    // Titel van het schilderij
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'title',
    },
    // Naam van de kunstenaar
    artist: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'artist',
    },
    // Rangschikking als string (numeriek vergeleken in raw queries)
    ranking: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ranking',
    },
    // Uitgebreide beschrijving van het schilderij
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
  }, {
    tableName: 'paintings',           // Naam van de databasetabel
    schema: 'schema_nevils_gallery',  // PostgreSQL-schema
    timestamps: false,                // Geen automatische createdAt/updatedAt kolommen
  });

  return Painting;
};
