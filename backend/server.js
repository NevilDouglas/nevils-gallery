// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const paintingRoutes = require('./routes/painting.routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('../frontend'));
app.use('/api/paintings', paintingRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Verbinding met database succesvol.');
    await sequelize.sync();
    console.log('🛠️ Tabellen gesynchroniseerd (veilige modus).');

    app.listen(PORT, () => {
      console.log(`🚀 Server gestart op http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Kan niet verbinden met of synchroniseren naar de database:', error);
    process.exit(1);
  }
})();
