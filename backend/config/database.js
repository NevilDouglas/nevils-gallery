// backend/config/database.js
// Databaseconfiguratie voor Nevil's Gallery.
// Maakt een Sequelize-instantie aan op basis van de beschikbare omgevingsvariabelen.
// Op Heroku wordt DATABASE_URL automatisch ingesteld door de Heroku Postgres add-on.
// Lokaal worden de losse DB_* variabelen gebruikt uit het .env bestand.

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DATABASE_URL
  // Productieomgeving (Heroku): gebruik de volledige connection string met SSL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Vereist voor Heroku's zelfondertekend SSL-certificaat
        },
      },
      define: { schema: 'schema_nevils_gallery' }, // Standaardschema voor alle modellen
    })
  // Lokale ontwikkelomgeving: gebruik losse verbindingsparameters uit .env
  : new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      define: { schema: 'schema_nevils_gallery' }, // Standaardschema voor alle modellen
    });

module.exports = sequelize;
