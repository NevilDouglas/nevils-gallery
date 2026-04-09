// backend/models/painting.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Painting = sequelize.define('Painting', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'id',
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'title',
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'artist',
    },
    ranking: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ranking',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },
  }, {
    tableName: 'paintings',
    schema: 'schema_nevils_gallery',
    timestamps: false,
  });

  return Painting;
};
