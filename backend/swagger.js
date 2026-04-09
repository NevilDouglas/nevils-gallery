// backend/swagger.js
// Configuratie voor de Swagger/OpenAPI documentatie van de Nevil's Gallery API.
// swagger-jsdoc leest de @swagger JSDoc-annotaties uit de routebestanden
// en genereert automatisch een OpenAPI 3.0 spec-object.

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Nevil's Gallery API",
      version: '1.0.0',
      description:
        'REST API voor het beheren van de schilderijencollectie van Nevil\'s Gallery. ' +
        'Ondersteunt volledige CRUD-operaties, bestandsuploads en dataset-reset.',
    },
    servers: [
      {
        // Productie-URL op Heroku
        url: 'https://nevils-gallery-api-456cfdb93e97.herokuapp.com',
        description: 'Productieserver (Heroku)',
      },
      {
        // Lokale ontwikkelserver
        url: 'http://localhost:4000',
        description: 'Lokale ontwikkelserver',
      },
    ],
    components: {
      schemas: {
        // Schema-definitie voor een schilderij-object
        Painting: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unieke identifier (UUID v4)',
              example: '671fa6fd-da4a-4d28-b4f4-065e7500ece7',
            },
            title: {
              type: 'string',
              description: 'Titel van het schilderij',
              example: 'The Mona Lisa',
            },
            artist: {
              type: 'string',
              description: 'Naam van de kunstenaar',
              example: 'Leonardo da Vinci',
            },
            ranking: {
              type: 'string',
              description: 'Rangschikking van het schilderij (numerieke string)',
              example: '1',
            },
            description: {
              type: 'string',
              description: 'Beschrijving van het schilderij',
              example: 'Het beroemdste schilderij ter wereld...',
            },
            image: {
              type: 'string',
              description: 'Relatief pad naar de afbeelding op de server',
              example: '/assets/img/initials/The_Mona_Lisa.jpg',
            },
          },
        },
        // Schema voor foutmeldingen
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Foutomschrijving',
              example: 'Painting not found',
            },
          },
        },
      },
    },
  },
  // Paden naar bestanden met @swagger JSDoc-annotaties
  apis: ['./routes/*.js'],
};

// Genereer het OpenAPI-spec object op basis van bovenstaande opties
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
