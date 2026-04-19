# Opdracht 6 — Security Implementatie & Cloud Deployment

## Nevil's Gallery — Geïmplementeerde beveiliging & Azure Deployment

---

## 1. Inleiding

Dit document beschrijft de geïmplementeerde securitymaatregelen en de cloud deployment van Nevil's Gallery. De applicatie is primair gedeployed op **Azure** (backend op Azure App Service, frontend op Azure Static Web Apps). Als alternatieve deployment is ook een Netlify/Heroku omgeving beschikbaar. Security is geïmplementeerd op meerdere niveaus: code, configuratie en platform.

| Omgeving          | Frontend URL                                             | Backend URL                                                                          |
|-------------------|----------------------------------------------------------|--------------------------------------------------------------------------------------|
| **Azure (primair)** | https://zealous-cliff-06a306e03.7.azurestaticapps.net  | https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net       |
| **Netlify/Heroku** | https://sparkling-kleicha-32eb8d.netlify.app           | https://nevils-gallery-api-456cfdb93e97.herokuapp.com                               |

---

## 2. Geïmplementeerde Security Maatregelen

### 2.1 JWT-Authenticatie

**Locatie:** `backend/controllers/auth.controller.js`, `backend/middleware/auth.middleware.js`

De beheerfunctionaliteit (aanmaken, bewerken, verwijderen, resetten) is beveiligd achter JWT-authenticatie. Bezoekers kunnen de collectie lezen; beheerders moeten inloggen.

**Login-endpoint:**
```
POST /api/auth/login
Content-Type: application/json

{ "username": "admin@example.com", "password": "passwordadmin" }
```

**Token aanmaken (auth.controller.js):**
```javascript
const token = jwt.sign(
  { id: user.id, username: user.username, isAdmin },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);
```

**Token verifiëren (auth.middleware.js):**
```javascript
const token = req.headers['authorization']?.split(' ')[1];
req.user = jwt.verify(token, process.env.JWT_SECRET);
```

**Beveiligde endpoints:** `POST /api/paintings`, `PUT /api/paintings/:id`, `DELETE /api/paintings/:id`, `POST /api/paintings/reset`  
**Status:** ✅ Geïmplementeerd — OWASP A01 en A07 gemitigeerd

---

### 2.2 Wachtwoord-hashing met bcrypt

**Locatie:** `backend/controllers/auth.controller.js`

```javascript
const passwordMatch = await bcrypt.compare(password, user.password);
```

Wachtwoorden worden nooit in plaintext opgeslagen — alleen als bcrypt-hash (cost factor 10+).  
**Status:** ✅ Geïmplementeerd — OWASP A02 gemitigeerd

---

### 2.3 Omgevingsvariabelen & Geheimenbeheer

**Probleem:** Databasewachtwoorden, JWT-geheimen en API-sleutels mogen niet in de broncode of Git-repository terechtkomen.

**Implementatie:**

```
backend/.env          ← Gevoelige data (staat NIET in Git)
backend/.env.example  ← Template voor andere ontwikkelaars (staat WEL in Git)
.gitignore            ← Sluit .env bestanden uit van Git
```

**Productie (Azure):** Alle gevoelige configuratie staat in Azure App Service → Settings → Environment variables (App settings tab):

| Naam | Gebruik |
|------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string (met SSL) |
| `JWT_SECRET` | Geheim voor JWT-ondertekening |
| `NODE_ENV` | `production` |

**GitHub Secrets voor CI/CD:**

| Secret | Gebruikt door |
|--------|---------------|
| `AZURE_WEBAPP_NAME` | Azure App Service naam |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Azure deployment profiel |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Static Web Apps deployment |
| `VITE_API_BASE_URL_AZURE` | Backend-URL ingebakken in React-bundle |

**Status:** ✅ Geïmplementeerd — OWASP A05 gemitigeerd

---

### 2.4 SSL/TLS Verbindingen

**Backend naar Database (Neon PostgreSQL):**

```javascript
// backend/config/database.js
dialectOptions: {
  ssl: { require: true, rejectUnauthorized: false }
}
```

**Browser naar Backend:** Azure App Service biedt automatisch SSL voor `*.azurewebsites.net` subdomeinen.

**Browser naar Frontend:** Azure Static Web Apps biedt automatisch SSL voor alle gehoste sites.

**Status:** ✅ Geïmplementeerd — OWASP A02 gemitigeerd

---

### 2.5 UUID-validatie Middleware

**Locatie:** `backend/routes/painting.routes.js`

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
**Status:** ✅ Geïmplementeerd

---

### 2.6 SQL-injectie Preventie via Sequelize

**Primaire ORM-aanroepen** (automatisch parameterized):
```javascript
const paintings = await Painting.findAll({ order: [['ranking', 'ASC']] });
```

**Ruwe SQL-aanroepen** (handmatig parameterized via `replacements`):
```javascript
await sequelize.query(
  `UPDATE schema_nevils_gallery.paintings
   SET ranking = CAST(ranking AS INTEGER) + 1
   WHERE ranking ~ '^[0-9]+$' AND CAST(ranking AS INTEGER) >= :newRanking`,
  { replacements: { newRanking } }
);
```

**Status:** ✅ Geïmplementeerd — OWASP A03 gemitigeerd

---

### 2.7 Bestandsupload Beveiliging

**Locatie:** `backend/middleware/upload.js`

```javascript
filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  cb(null, `painting-${Date.now()}${ext}`);
}
```

De oorspronkelijke bestandsnaam van de gebruiker wordt nooit gebruikt (voorkomt path traversal via `../` in bestandsnamen).

**Aanbevolen verbetering (gepland):**
```javascript
fileFilter: (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  cb(null, allowed.includes(file.mimetype));
}
```

**Status:** ✅ Deels geïmplementeerd — bestandstypevalidatie gepland

---

### 2.8 Bescherming Initiële Afbeeldingen

```javascript
// painting.controller.js
if (painting.image && !painting.image.includes('/initials/')) {
    const imagePath = path.join(__dirname, '..', 'public', painting.image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}
```

Afbeeldingen in `/initials/` worden nooit verwijderd, zelfs niet bij delete- of update-operaties.  
**Status:** ✅ Geïmplementeerd

---

### 2.9 CORS Configuratie

```javascript
// backend/server.js
app.use(cors());
```

CORS is open ingesteld zodat zowel de Azure als Netlify frontend de API kan aanroepen. Voor productie is het aanbevolen dit te beperken:

```javascript
app.use(cors({
  origin: [
    'https://zealous-cliff-06a306e03.7.azurestaticapps.net',
    'https://sparkling-kleicha-32eb8d.netlify.app'
  ]
}));
```

**Status:** ✅ Geïmplementeerd (open) — ⚠️ beperking aanbevolen

---

### 2.10 Process Isolation & Crash Recovery

```javascript
// backend/server.js
} catch (error) {
    console.error('❌ Kan niet verbinden met of synchroniseren naar de database:', error);
    process.exit(1);
}
```

Bij een fatale opstartfout stopt het Node.js-proces. Azure App Service detecteert dit en herstart de container automatisch.  
**Status:** ✅ Geïmplementeerd

---

## 3. Azure App Service Deployment (Backend)

### 3.1 Overzicht

| Attribuut           | Waarde                                                                                   |
|---------------------|------------------------------------------------------------------------------------------|
| **Platform**        | Azure App Service (Basic B1)                                                             |
| **Runtime**         | Node.js 20 LTS (Linux)                                                                   |
| **Database**        | Neon PostgreSQL (cloud, `schema_nevils_gallery`)                                         |
| **Abonnement**      | `ITD_HBO-ICT-DevTest` (schoolabonnement)                                                 |
| **Resourcegroep**   | `rg-se-dt-s6-group3`                                                                     |
| **Productie-URL**   | `https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net`         |
| **API Docs**        | `https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net/api-docs`|
| **Always On**       | Uitgeschakeld (app slaapt na inactiviteit — bespaart credits)                            |

### 3.2 CI/CD Pipeline (deploy-backend-azure.yml)

```yaml
name: Deploy Backend to Azure App Service

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend-azure.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./backend
```

### 3.3 Environment Variables (Azure App Settings)

Alle gevoelige configuratie staat in Azure Portal → App Service → Settings → Environment variables → **App settings** tab:

| Naam | Waarde |
|------|--------|
| `DATABASE_URL` | `postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Willekeurige geheime string |
| `NODE_ENV` | `production` |

> **Belangrijk:** Gebruik de **App settings** tab, niet de Connection strings tab. De Connection strings tab prefixeert variabelen met `CUSTOMCONNSTR_`, waardoor `process.env.DATABASE_URL` undefined is.

### 3.4 Opstartproces

Bij elke deployment:
1. Azure installeert npm packages (`npm ci`)
2. `server.js` wordt uitgevoerd (`npm start`)
3. `sequelize.authenticate()` verifieert de databaseverbinding met Neon
4. `CREATE SCHEMA IF NOT EXISTS schema_nevils_gallery` maakt het schema aan
5. `sequelize.sync({ alter: true })` synchroniseert de modellen
6. HTTP-server luistert op `process.env.PORT`

---

## 4. Azure Static Web Apps Deployment (Frontend)

### 4.1 Overzicht

| Attribuut        | Waarde                                                   |
|------------------|----------------------------------------------------------|
| **Platform**     | Azure Static Web Apps (Free tier)                        |
| **Framework**    | React 18 + Vite 5                                        |
| **Productie-URL**| `https://zealous-cliff-06a306e03.7.azurestaticapps.net` |
| **Build output** | `frontend-react/dist/`                                   |

### 4.2 CI/CD Pipeline (deploy-frontend-azure.yml)

```yaml
name: Deploy Frontend to Azure Static Web Apps

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - 'frontend-react/**'
      - '.github/workflows/deploy-frontend-azure.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install & Build
        working-directory: frontend-react
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL_AZURE }}
        run: |
          npm ci
          npm run build
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: frontend-react/dist
          output_location: ""
          skip_app_build: true
```

**Sleutelpunten:**
- `VITE_API_BASE_URL` wordt als build-time omgevingsvariabele meegegeven aan Vite — de backend-URL is ingebakken in de JavaScript-bundle.
- `skip_app_build: true` — Vite build wordt in een aparte stap gedaan zodat de env var correct wordt meegegeven.
- `app_location: frontend-react/dist` — de al gebouwde dist-map wordt direct gedeployed.

### 4.3 SPA-routing & MIME Type Configuratie

**Bestand:** `frontend-react/public/staticwebapp.config.json`

```json
{
  "mimeTypes": {
    ".js": "application/javascript",
    ".mjs": "application/javascript"
  },
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

**Doel:** Zorgt voor correcte MIME types voor JavaScript-bestanden en SPA-routing. Directe URL-navigatie (bijv. `/maintenance`) levert altijd `index.html`, waarna React Router de routing overneemt.

**Locatie:** In `public/` zodat Vite het automatisch naar `dist/` kopieert bij elke build.

---

## 5. Alternatieve Deployment (Netlify/Heroku)

De applicatie is ook beschikbaar via de originele Heroku/Netlify omgeving:

| Onderdeel | URL |
|-----------|-----|
| Frontend (Netlify) | https://sparkling-kleicha-32eb8d.netlify.app |
| Backend (Heroku)   | https://nevils-gallery-api-456cfdb93e97.herokuapp.com |
| API Docs (Heroku)  | https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs |

Deze omgeving draait op dezelfde codebase en dezelfde Neon PostgreSQL database.

---

## 6. Security Deployment Checklist

| Maatregel                              | Status       | Bewijs                                            |
|----------------------------------------|--------------|---------------------------------------------------|
| .env in .gitignore                     | ✅ Gereed    | `.gitignore` regel: `.env`                       |
| DATABASE_URL als Azure App Setting     | ✅ Gereed    | `config/database.js` detecteert `DATABASE_URL`   |
| JWT_SECRET als Azure App Setting       | ✅ Gereed    | `auth.controller.js` gebruikt `process.env.JWT_SECRET` |
| GitHub Secrets voor CI/CD              | ✅ Gereed    | Workflows gebruiken `${{ secrets.* }}`           |
| HTTPS op Azure backend                 | ✅ Gereed    | Automatisch via Azure App Service                 |
| HTTPS op Azure frontend                | ✅ Gereed    | Automatisch via Azure Static Web Apps CDN         |
| SSL op PostgreSQL verbinding (Neon)    | ✅ Gereed    | `sslmode=require` in DATABASE_URL                 |
| JWT-authenticatie voor CRUD            | ✅ Gereed    | `auth.middleware.js` op alle muterende endpoints  |
| Wachtwoord-hashing (bcrypt)            | ✅ Gereed    | `bcrypt.compare()` in `auth.controller.js`       |
| UUID-validatie middleware              | ✅ Gereed    | `painting.routes.js`                             |
| Parameterized SQL queries              | ✅ Gereed    | Sequelize ORM + `replacements`                   |
| Veilige bestandsnamen (Multer)         | ✅ Gereed    | `painting-{timestamp}{ext}`                      |
| Bescherming /initials/ bestanden       | ✅ Gereed    | `!painting.image.includes('/initials/')`         |
| Bevestigingsmodal bij delete           | ✅ Gereed    | `ActionModal.jsx`                                |
| CORS beperken tot bekende origins      | ⚠️ Gepland   | Open CORS, beperking aanbevolen                   |
| Rate limiting (express-rate-limit)     | ✅ Gereed    | `app.use('/api/', limiter)` in `server.js`        |
| Helmet.js security headers             | ✅ Gereed    | `app.use(helmet(...))` in `server.js`             |
| Bestandstypevalidatie uploads          | ⚠️ Deels     | Multer filtert nog niet op MIME-type              |

---

## 7. Monitoring & Observability

**Azure Log Stream:**
Azure App Service biedt een live log stream via de Azure Portal: App Service → Monitoring → Log stream.

De backend logt:
- ✅ Verbindingsstatus bij opstarten (database connectie)
- ✅ Fouten in alle controller-functies (`console.error`)
- ✅ Ranking-shift operaties (`console.log`)
- ✅ Reset-voortgang

**Aanbevolen toevoeging:**
```javascript
// Iedere request loggen (morgan middleware)
const morgan = require('morgan');
app.use(morgan('combined'));
```
