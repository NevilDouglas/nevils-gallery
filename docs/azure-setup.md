# Azure Deployment — Setup Handleiding

## Overzicht

De applicatie draait op twee platforms tegelijk:

| Onderdeel | Heroku (bestaand) | Azure (nieuw) |
|-----------|-------------------|----------------|
| Backend   | `nevils-gallery-api-*.herokuapp.com` | Azure App Service |
| Frontend  | `sparkling-kleicha-32eb8d.netlify.app` | Azure Static Web Apps |

---

## Stap 1 — Azure App Service (Backend)

### 1.1 Resource aanmaken
1. Ga naar [portal.azure.com](https://portal.azure.com)
2. Zoek naar **App Services** → **+ Create**
3. Vul in:
   - **Resource group:** maak een nieuwe aan, bijv. `nevils-gallery-rg`
   - **Name:** bijv. `nevils-gallery-api` (bepaalt je URL)
   - **Runtime stack:** Node 20 LTS
   - **Operating System:** Linux
   - **Region:** West Europe
4. Klik **Review + Create** → **Create**

### 1.2 Environment variables instellen
1. Ga naar de App Service → **Settings** → **Environment variables**
2. Voeg toe (equivalent aan je lokale `.env`):

| Naam | Waarde |
|------|--------|
| `DATABASE_URL` | PostgreSQL connection string (Heroku of Azure PostgreSQL) |
| `JWT_SECRET` | Zelfde waarde als in je lokale `.env` |
| `NODE_ENV` | `production` |

> **Tip:** Je kunt dezelfde Heroku PostgreSQL database gebruiken voor beide deployments, of een aparte Azure Database for PostgreSQL aanmaken.

### 1.3 Publish Profile ophalen
1. Ga naar de App Service → **Overview**
2. Klik op **Download publish profile**
3. Open het gedownloade `.PublishSettings` bestand in een teksteditor
4. Kopieer de volledige inhoud

### 1.4 GitHub Secret toevoegen
Ga naar je GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret naam | Waarde |
|-------------|--------|
| `AZURE_WEBAPP_NAME` | De naam van je App Service (bijv. `nevils-gallery-api`) |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | De volledige inhoud van het `.PublishSettings` bestand |

---

## Stap 2 — Azure Static Web Apps (Frontend)

### 2.1 Resource aanmaken
1. Ga naar [portal.azure.com](https://portal.azure.com)
2. Zoek naar **Static Web Apps** → **+ Create**
3. Vul in:
   - **Resource group:** `nevils-gallery-rg` (zelfde als hierboven)
   - **Name:** bijv. `nevils-gallery-frontend`
   - **Plan type:** Free
   - **Region:** West Europe
   - **Source:** kies **Other** (want we deployen via GitHub Actions zelf)
4. Klik **Review + Create** → **Create**

### 2.2 Deployment token ophalen
1. Ga naar de Static Web App → **Settings** → **Deployment token**
2. Kopieer de token

### 2.3 Backend URL bepalen
Na Stap 1 is de Azure backend bereikbaar op:
```
https://<AZURE_WEBAPP_NAME>.azurewebsites.net
```

### 2.4 GitHub Secrets toevoegen

| Secret naam | Waarde |
|-------------|--------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | De deployment token uit stap 2.2 |
| `VITE_API_BASE_URL_AZURE` | `https://<AZURE_WEBAPP_NAME>.azurewebsites.net` |

---

## Stap 3 — Deployen

Na het instellen van alle secrets, trigger je de deployment door een push naar `main` te doen met een wijziging in `backend/` of `frontend-react/`:

```bash
git add .
git commit -m "trigger azure deployment"
git push
```

GitHub Actions start nu automatisch beide Azure-workflows naast de bestaande Heroku/Netlify-workflows.

---

## Volledig overzicht GitHub Secrets

| Secret | Gebruikt door |
|--------|---------------|
| `HEROKU_API_KEY` | Heroku backend |
| `HEROKU_APP_NAME` | Heroku backend |
| `HEROKU_EMAIL` | Heroku backend |
| `NETLIFY_AUTH_TOKEN` | Netlify frontend |
| `NETLIFY_SITE_ID` | Netlify frontend |
| `VITE_API_BASE_URL` | Netlify frontend (→ Heroku backend) |
| `AZURE_WEBAPP_NAME` | Azure App Service |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Azure App Service |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Static Web Apps |
| `VITE_API_BASE_URL_AZURE` | Azure Static Web Apps (→ Azure backend) |
