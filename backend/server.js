// backend/server.js
// Hoofdbestand van de Express-server voor Nevil's Gallery.
// Verantwoordelijk voor het opstarten van de server, verbinding met de database,
// het registreren van middleware en routes, en het serveren van statische bestanden.

require('dotenv').config(); // Laad omgevingsvariabelen uit .env
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { sequelize } = require('./models');
const paintingRoutes = require('./routes/painting.routes');
const authRoutes     = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Vertrouw de eerste proxy (Azure App Service / Heroku) voor correcte client-IP bij rate limiting
app.set('trust proxy', 1);

// --- Middleware ---
// Helmet met aangepaste CSP zodat Swagger UI blijft werken
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https://validator.swagger.io'],
    },
  },
}));
app.use(cors());           // Sta cross-origin verzoeken toe (nodig voor de frontend)
app.use(express.json());   // Parseer inkomende JSON request bodies

// Rate limiting: max 100 verzoeken per 15 minuten per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
});
app.use('/api/', limiter);

// --- Statische bestanden ---
app.use(express.static('public'));        // Serveer bestanden uit de public map (o.a. geüploade afbeeldingen)
app.use(express.static('../frontend'));   // Serveer de vanilla JS frontend (lokale ontwikkeling)

// --- API Routes ---
app.use('/api/auth',     authRoutes);      // Authenticatie-endpoints (login)
app.use('/api/paintings', paintingRoutes); // Alle schilderijen-endpoints

// --- Swagger UI ---
// Beschikbaar op /api-docs — toont de interactieve API-documentatie
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Database verbinding en server opstarten ---
(async () => {
  try {
    // Controleer of de databaseverbinding werkt
    await sequelize.authenticate();
    console.log('✅ Verbinding met database succesvol.');

    // Maak het schema aan als het nog niet bestaat (nodig op Heroku)
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS schema_nevils_gallery');

    // Synchroniseer de Sequelize modellen met de database.
    // alter: true voegt nieuwe kolommen toe aan bestaande tabellen zonder data te verliezen.
    await sequelize.sync({ alter: true });
    console.log('🛠️ Tabellen gesynchroniseerd (veilige modus).');

    // Start de HTTP-server
    app.listen(PORT, () => {
      console.log(`🚀 Server gestart op http://localhost:${PORT}`);
      console.log(`📖 API-documentatie beschikbaar op http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Kan niet verbinden met of synchroniseren naar de database:', error);
    process.exit(1); // Stop het proces bij een fatale fout
  }
})();
