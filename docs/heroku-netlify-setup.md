# Heroku & Netlify Deployment — Setup Handleiding

## Nevil's Gallery — Alternatieve Deployment Configuratie

---

## Overzicht

De applicatie is als alternatief ook beschikbaar op Heroku (backend) en Netlify (frontend), naast de primaire Azure-omgeving. Beide platforms delen dezelfde Neon PostgreSQL database.

| Onderdeel  | Platform      | URL                                                              |
|------------|---------------|------------------------------------------------------------------|
| Backend    | Heroku        | `https://nevils-gallery-api-456cfdb93e97.herokuapp.com`         |
| Frontend   | Netlify       | `https://sparkling-kleicha-32eb8d.netlify.app`                  |
| Swagger    | Heroku        | `https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs`|
| Database   | Neon PostgreSQL (cloud) | Dezelfde als Azure — `schema_nevils_gallery`          |

---

## Stap 1 — Heroku (Backend) opzetten

### 1.1 Account & app aanmaken

1. Maak een account aan op [heroku.com](https://www.heroku.com) (gratis Eco plan is voldoende)
2. Installeer de [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) en log in:
   ```bash
   heroku login
   ```
3. Maak een nieuwe app aan:
   ```bash
   heroku create nevils-gallery-api
   ```
   Of gebruik de [Heroku dashboard](https://dashboard.heroku.com) → **New** → **Create new app**

### 1.2 Environment variables instellen

1. Ga naar [dashboard.heroku.com](https://dashboard.heroku.com) → jouw app → **Settings** → **Reveal Config Vars**
2. Voeg de volgende variabelen toe:

| Naam | Waarde |
|------|--------|
| `DATABASE_URL` | Neon PostgreSQL connection string (`postgresql://...@ep-...neon.tech/neondb?sslmode=require`) |
| `JWT_SECRET` | Geheime string (gebruik dezelfde als in je lokale `.env`) |
| `NODE_ENV` | `production` |

Of via de Heroku CLI:
```bash
heroku config:set DATABASE_URL="postgresql://..." --app nevils-gallery-api
heroku config:set JWT_SECRET="jouw-geheime-sleutel" --app nevils-gallery-api
heroku config:set NODE_ENV=production --app nevils-gallery-api
```

> **Let op:** Heroku voegt zelf geen prefixes toe aan variabelen, dus `process.env.DATABASE_URL` werkt direct.

### 1.3 API key ophalen

1. Ga naar [dashboard.heroku.com](https://dashboard.heroku.com) → **Account settings** → **API Key** → **Reveal**
2. Kopieer de API key

### 1.4 GitHub Secrets toevoegen

Ga naar je GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret naam | Waarde |
|-------------|--------|
| `HEROKU_API_KEY` | De API key uit stap 1.3 |
| `HEROKU_APP_NAME` | Naam van je Heroku app (bijv. `nevils-gallery-api`) |
| `HEROKU_EMAIL` | Het e-mailadres van je Heroku account |

---

## Stap 2 — Netlify (Frontend) opzetten

### 2.1 Account & site aanmaken

1. Maak een account aan op [netlify.com](https://www.netlify.com)
2. Ga naar **Sites** → **Add new site** → **Deploy manually** (de eerste deploy gaat via GitHub Actions)

### 2.2 Site ID ophalen

1. Ga naar je site in het Netlify dashboard → **Site configuration** → **General**
2. Kopieer de **Site ID** (een UUID-achtige string)

### 2.3 Auth token ophalen

1. Ga naar [app.netlify.com/user/applications](https://app.netlify.com/user/applications)
2. Klik op **New access token** → geef het een naam → kopieer de token

### 2.4 Backend URL bepalen

Na Stap 1 is de Heroku backend bereikbaar op de URL uit het Heroku dashboard. De URL heeft de vorm:
```
https://<app-naam>-<hash>.herokuapp.com
```

### 2.5 GitHub Secrets toevoegen

| Secret naam | Waarde |
|-------------|--------|
| `NETLIFY_AUTH_TOKEN` | De access token uit stap 2.3 |
| `NETLIFY_SITE_ID` | De site ID uit stap 2.2 |
| `VITE_API_BASE_URL` | Volledige Heroku backend URL, bijv. `https://nevils-gallery-api-456cfdb93e97.herokuapp.com` (zonder trailing slash) |

---

## Stap 3 — Neon PostgreSQL Database

Heroku/Netlify gebruiken **dezelfde** Neon database als Azure. Er hoeft niets apart opgezet te worden.

Zie de [Azure Setup Handleiding](azure-setup.md#stap-3--neon-postgresql-database) voor details over de database configuratie en het controleren van de data.

---

## Stap 4 — Deployen via GitHub Actions

De CI/CD pipelines worden automatisch getriggerd bij een push naar `main`.

### Backend (deploy-backend.yml)

```yaml
name: Deploy Backend

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
      - uses: actions/checkout@v4
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: backend
```

### Frontend (deploy-frontend.yml)

```yaml
name: Deploy Frontend

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Build
        working-directory: frontend-react
        run: npm ci && npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=frontend-react/dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Sleutelpunten:**
- `VITE_API_BASE_URL` wordt als build-time omgevingsvariabele meegegeven aan Vite — de Heroku backend-URL is ingebakken in de React-bundle.
- De frontend-build (`npm run build`) gebeurt in de GitHub Actions runner, niet door Netlify zelf.

**Handmatig triggeren:**
1. Ga naar GitHub repository → **Actions**
2. Kies `Deploy Backend` of `Deploy Frontend`
3. Klik **Run workflow** → **Run workflow**

---

## Volledig overzicht GitHub Secrets (Heroku/Netlify)

| Secret | Gebruikt door |
|--------|---------------|
| `HEROKU_API_KEY` | Heroku backend deployment |
| `HEROKU_APP_NAME` | Heroku backend deployment |
| `HEROKU_EMAIL` | Heroku backend deployment |
| `NETLIFY_AUTH_TOKEN` | Netlify frontend deployment |
| `NETLIFY_SITE_ID` | Netlify frontend deployment |
| `VITE_API_BASE_URL` | Netlify frontend → Heroku backend URL |

---

## Veelgemaakte fouten

| Fout | Oorzaak | Oplossing |
|------|---------|-----------|
| App slaapt na 30 minuten | Heroku Eco dynos slapen na inactiviteit | Eerste request na slaapperiode duurt ~10-30 seconden — dit is normaal gedrag |
| `DATABASE_URL` is `undefined` | Config var niet ingesteld in Heroku dashboard | Controleer via `heroku config --app <naam>` |
| Frontend toont lege array | `VITE_API_BASE_URL` onjuist of ontbreekt trailing slash | Controleer de exacte waarde van het secret — geen trailing slash |
| Deploy mislukt (401 Unauthorized) | `HEROKU_API_KEY` verlopen of onjuist | Genereer een nieuwe API key in Heroku Account settings |
| Netlify deploy mislukt | `NETLIFY_AUTH_TOKEN` of `NETLIFY_SITE_ID` onjuist | Controleer de waarden in het Netlify dashboard |
