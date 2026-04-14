# Opdracht 6 — Security Implementatie & Cloud Deployment

## Nevil's Gallery — Geïmplementeerde beveiliging, Heroku & Azure

---

## 1. Inleiding

Dit document beschrijft de geïmplementeerde securitymaatregelen en de cloud deployment van Nevil's Gallery. De applicatie is gedeployed op twee platforms: **Heroku** (backend) en **Netlify/Azure** (frontend). Security is geïmplementeerd op meerdere niveaus: code, configuratie en platform.

---

## 2. Geïmplementeerde Security Maatregelen

### 2.1 Omgevingsvariabelen & Geheimenbeheer

**Probleem:** Databasewachtwoorden en API-sleutels mogen niet in de broncode of Git-repository terechtkomen.

**Implementatie:**

```
backend/.env          ← Gevoelige data (staat NIET in Git)
backend/.env.example  ← Template voor andere ontwikkelaars (staat WEL in Git)
.gitignore            ← Sluit .env bestanden uit van Git
```

**Inhoud `.env.example`:**
```env
DB_HOST=your-server.postgres.database.azure.com
DB_PORT=5432
DB_USER=your_admin_user
DB_PASSWORD=your_password
DB_DATABASE=nevils_gallery
```

**Gebruik in code (`backend/server.js:6`):**
```javascript
require('dotenv').config();
// Hierna beschikbaar als process.env.DB_HOST etc.
```

**GitHub Secrets:** API-sleutels voor Heroku en Netlify zijn opgeslagen als GitHub Secrets, nooit als plaintext in YAML-bestanden.

---

### 2.2 SSL/TLS Verbindingen

**Backend naar Database (Heroku PostgreSQL):**
Geconfigureerd in `backend/config/database.js`:

```javascript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false  // Nodig voor Heroku self-signed certificates
  }
}
```

**Browser naar Backend:**
Heroku biedt automatisch SSL voor `*.herokuapp.com` subdomeinen. Alle productieverkeer loopt via HTTPS.

**Browser naar Frontend:**
Netlify biedt automatisch SSL voor alle gehoste sites.

---

### 2.3 UUID-validatie Middleware

**Locatie:** `backend/routes/painting.routes.js:22`

```javascript
const validateUUID = (req, res, next) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }
  next();
};
```

**Beveiligd tegen:** Path traversal, injection-pogingen via URL-parameters, ongeldige database queries.

---

### 2.4 SQL-injectie Preventie via Sequelize

**Primaire ORM-aanroepen** (automatisch parameterized):
```javascript
// painting.controller.js:18 — geen ruwe SQL, geen injectierisico
const paintings = await Painting.findAll({ order: [['ranking', 'ASC']] });
```

**Ruwe SQL-aanroepen** (handmatig parameterized via `replacements`):
```javascript
// painting.controller.js:61 — veilig via named replacements
await sequelize.query(
  `UPDATE schema_nevils_gallery.paintings
   SET ranking = CAST(ranking AS INTEGER) + 1
   WHERE ranking ~ '^[0-9]+$' AND CAST(ranking AS INTEGER) >= :newRanking`,
  { replacements: { newRanking } }
);
```

Sequelize vervangt `:newRanking` met een geparameteriseerde binding — gebruikersinvoer wordt nooit direct in SQL-strings geplakt.

---

### 2.5 Bestandsupload Beveiliging

**Locatie:** `backend/middleware/upload.js`

Multer is geconfigureerd om bestanden op te slaan in een vaste directory met een gegenereerde bestandsnaam:

```javascript
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  cb(null, `painting-${Date.now()}${ext}`);
}
```

**Beveiligd:** De oorspronkelijke bestandsnaam van de gebruiker wordt nooit gebruikt als opgeslagen bestandsnaam (voorkomt path traversal via `../` in bestandsnamen).

**Aanbevolen verbetering (gepland):**
```javascript
fileFilter: (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  cb(null, allowed.includes(file.mimetype));
}
```

---

### 2.6 Bescherming Initiële Afbeeldingen

```javascript
// painting.controller.js:175
if (painting.image && !painting.image.includes('/initials/')) {
    const imagePath = path.join(__dirname, '..', 'public', painting.image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}
```

Afbeeldingen in `/initials/` worden nooit verwijderd, zelfs niet bij delete- of update-operaties. Dit garandeert dat de originele dataset altijd herstelbaar is.

---

### 2.7 CORS Configuratie

```javascript
// backend/server.js:18
app.use(cors());
```

CORS is ingeschakeld zodat de React-frontend op Netlify de API kan aanroepen. Voor productie is het aanbevolen dit te beperken:

```javascript
// Aanbevolen productieconfiguratie
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'https://sparkling-kleicha-32eb8d.netlify.app'
}));
```

---

### 2.8 Process Isolation & Crash Recovery

```javascript
// backend/server.js:53
} catch (error) {
    console.error('❌ Kan niet verbinden met of synchroniseren naar de database:', error);
    process.exit(1);
}
```

Bij een fatale opstartfout stopt het Node.js-proces. Heroku detecteert dit en herstart de dyno automatisch. Dit voorkomt dat een half-geïnitialiseerde server requests verwerkt.

---

## 3. Heroku Deployment

### 3.1 Overzicht

| Attribuut        | Waarde                                                        |
|------------------|---------------------------------------------------------------|
| Platform         | Heroku (PaaS)                                                 |
| Runtime          | Node.js buildpack                                             |
| Database         | Heroku PostgreSQL (add-on)                                    |
| Productie-URL    | `https://nevils-gallery-api-456cfdb93e97.herokuapp.com`      |
| API Docs         | `https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs` |

### 3.2 CI/CD Pipeline (deploy-backend.yml)

```yaml
name: Deploy Backend to Heroku

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "backend"
```

**Stappen:**
1. Push naar `main` (met wijzigingen in `backend/`)
2. GitHub Actions checkout de repository
3. `heroku-deploy` actie deployt de `backend/` submap als Heroku-app
4. Heroku detecteert Node.js via `package.json` en installeert afhankelijkheden
5. Heroku start de server via `npm start` (`node server.js`)

### 3.3 Environment Variables op Heroku

Op Heroku worden de volgende Config Vars ingesteld (via Heroku Dashboard of CLI):

```
DATABASE_URL     = postgres://...  (automatisch gezet door PostgreSQL add-on)
NODE_ENV         = production
PORT             = (automatisch gezet door Heroku)
```

De `backend/config/database.js` detecteert `DATABASE_URL` voor Heroku en gebruikt `ssl: true`:

```javascript
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
    })
  : new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      { host: process.env.DB_HOST, port: process.env.DB_PORT, dialect: 'postgres' }
    );
```

### 3.4 Heroku Opstartproces

Bij elke deployment:
1. Heroku installeert npm packages (`npm ci`)
2. `server.js` wordt uitgevoerd (`npm start`)
3. `sequelize.authenticate()` verifieert de databaseverbinding
4. `CREATE SCHEMA IF NOT EXISTS` maakt het schema aan
5. `sequelize.sync()` synchroniseert de modellen (tabel wordt aangemaakt indien afwezig)
6. HTTP-server luistert op `process.env.PORT`

---

## 4. Netlify Frontend Deployment

### 4.1 Overzicht

| Attribuut        | Waarde                                                |
|------------------|-------------------------------------------------------|
| Platform         | Netlify (CDN/PaaS)                                   |
| Framework        | React 18 + Vite                                       |
| Productie-URL    | `https://sparkling-kleicha-32eb8d.netlify.app/`      |
| Build output     | `frontend-react/dist/`                                |

### 4.2 CI/CD Pipeline (deploy-frontend.yml)

```yaml
name: Deploy Frontend to Netlify

on:
  push:
    branches: [main]
    paths:
      - 'frontend-react/**'
      - '.github/workflows/deploy-frontend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '20' }
      - name: Install & Build
        working-directory: frontend-react
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        run: |
          npm ci
          npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: frontend-react/dist
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Sleutelpunt:** `VITE_API_BASE_URL` wordt als build-time omgevingsvariabele meegegeven. Vite bakt deze waarde in de JavaScript-bundle in (`import.meta.env.VITE_API_BASE_URL`). De productie-URL van de Heroku-backend is zo nooit hardcoded in de broncode.

---

## 5. Azure Static Web Apps Deployment

### 5.1 Configuratie

**Bestand:** `frontend-react/staticwebapp.config.json`

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*"]
  }
}
```

**Doel:** Zorgt voor correcte SPA-routing op Azure. Directe URL-navigatie (bijv. `https://myapp.azurestaticapps.net/maintenance`) levert altijd `index.html`, waarna React Router de routing overneemt. Bestanden in `/assets/` (JS, CSS, afbeeldingen) worden niet herschreven.

### 5.2 Deployment Stappen (handmatig)

```bash
# 1. Build de React-app
cd frontend-react
VITE_API_BASE_URL=https://nevils-gallery-api-456cfdb93e97.herokuapp.com npm run build

# 2. Deploy via Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli
swa deploy ./dist --env production
```

Of via Azure Portal: koppel de GitHub-repository en wijs `frontend-react/dist` aan als output directory.

---

## 6. Security Deployment Checklist

| Maatregel                          | Status    | Bewijs                                    |
|------------------------------------|-----------|-------------------------------------------|
| .env in .gitignore                 | ✅ Gereed | `.gitignore` regel: `.env`               |
| DATABASE_URL als Heroku Config Var | ✅ Gereed | `config/database.js` detecteert env var  |
| GitHub Secrets voor CI/CD          | ✅ Gereed | `deploy-backend.yml` gebruikt `secrets.` |
| HTTPS op Heroku backend            | ✅ Gereed | Automatisch via `*.herokuapp.com`         |
| HTTPS op Netlify frontend          | ✅ Gereed | Automatisch via Netlify CDN               |
| SSL op PostgreSQL verbinding       | ✅ Gereed | `rejectUnauthorized: false` in config     |
| UUID-validatie middleware          | ✅ Gereed | `painting.routes.js:22`                  |
| Parameterized SQL queries          | ✅ Gereed | Sequelize ORM + `replacements`           |
| Veilige bestandsnamen (Multer)     | ✅ Gereed | `painting-{timestamp}{ext}`              |
| Bescherming /initials/ bestanden   | ✅ Gereed | `!painting.image.includes('/initials/')` |
| Bevestigingsmodal bij delete       | ✅ Gereed | `ActionModal.jsx`                        |
| Gebruikersauthenticatie            | ❌ Gepland | Nog niet geïmplementeerd                 |
| Rate limiting                      | ❌ Gepland | Nog niet geïmplementeerd                 |
| Helmet.js security headers         | ❌ Gepland | Nog niet geïmplementeerd                 |
| CORS beperken tot bekende origins  | ⚠️ Deels  | Open CORS, beperking aanbevolen          |
| Bestandstypevalidatie uploads      | ⚠️ Deels  | Multer filtert nog niet op MIME-type     |

---

## 7. Monitoring & Observability

**Heroku Logs:**
```bash
heroku logs --tail --app nevils-gallery-api-456cfdb93e97
```

De backend logt:
- ✅ Verbindingsstatus bij opstarten
- ✅ Fouten in alle controller-functies (`console.error`)
- ✅ Ranking-shift operaties (`console.log`)
- ✅ Reset-voortgang

**Aanbevolen toevoeging:**
```javascript
// Iedere request loggen (morgan middleware)
const morgan = require('morgan');
app.use(morgan('combined'));
```
