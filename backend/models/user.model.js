// backend/models/user.model.js
// Sequelize-modeldefinitie voor de users tabel.
// Wordt gebruikt voor authenticatie; passwords zijn opgeslagen als bcrypt-hash.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    fname:    { type: DataTypes.STRING, allowNull: true },
    lname:    { type: DataTypes.STRING, allowNull: true },
    cname:    { type: DataTypes.STRING, allowNull: true },
    // Opgeslagen als string "true" / "false" (legacy schema)
    admin:    { type: DataTypes.STRING, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName:  'users',
    schema:     'schema_nevils_gallery',
    timestamps: false,
  });

  return User;
};
