# Azure Deployment — Setup Handleiding

## Nevil's Gallery — Huidige Azure Configuratie

---

## Overzicht

De applicatie draait primair op Azure:

| Onderdeel  | Platform                     | URL                                                                                    |
|------------|------------------------------|----------------------------------------------------------------------------------------|
| Backend    | Azure App Service (Basic B1) | `https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net`      |
| Frontend   | Azure Static Web Apps (Free) | `https://zealous-cliff-06a306e03.7.azurestaticapps.net`                               |
| Database   | Neon PostgreSQL (cloud)      | `ep-*.neon.tech` — schema: `schema_nevils_gallery`                                   |

Als alternatieve deployment is ook Netlify/Heroku beschikbaar:

| Onderdeel  | URL                                                         |
|------------|-------------------------------------------------------------|
| Frontend   | `https://sparkling-kleicha-32eb8d.netlify.app`             |
| Backend    | `https://nevils-gallery-api-456cfdb93e97.herokuapp.com`    |

---

## Huidige Azure Configuratie

### Azure Abonnement & Resourcegroep

| Gegeven           | Waarde                       |
|-------------------|------------------------------|
| Abonnement        | `ITD_HBO-ICT-DevTest`        |
| Resourcegroep     | `rg-se-dt-s6-group3`         |
| Regio             | West Europe                  |

### App Service (Backend)

| Gegeven           | Waarde                                                                              |
|-------------------|-------------------------------------------------------------------------------------|
| Naam              | `nevils-gallery-api-2`                                                              |
| Plan              | Basic B1 (Linux)                                                                    |
| Runtime           | Node.js 20 LTS                                                                      |
| URL               | `https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net`   |
| Always On         | Uitgeschakeld (app slaapt na inactiviteit — bespaart credits)                       |
| Swagger/API Docs  | `/api-docs` op bovenstaande URL                                                     |

> **Let op:** De URL bevat een unieke hash (`-f4haftfbf2gheggu`) omdat de "Secure unique default hostname" instelling actief is op dit abonnement. De URL is dus niet `nevils-gallery-api-2.azurewebsites.net`.

### Static Web App (Frontend)

| Gegeven           | Waarde                                                   |
|-------------------|----------------------------------------------------------|
| Plan              | Free                                                     |
| URL               | `https://zealous-cliff-06a306e03.7.azurestaticapps.net` |
| Build output      | `frontend-react/dist/`                                   |

---

## Stap 1 — Azure App Service (Backend) aanmaken

### 1.1 Resource aanmaken

1. Ga naar [portal.azure.com](https://portal.azure.com)
2. Selecteer het abonnement `ITD_HBO-ICT-DevTest`
3. Zoek naar **App Services** → **+ Create**
4. Vul in:
   - **Resource group:** `rg-se-dt-s6-group3`
   - **Name:** bijv. `nevils-gallery-api-2`
   - **Runtime stack:** Node 20 LTS
   - **Operating System:** Linux
   - **Region:** West Europe
   - **Pricing plan:** Basic B1
5. Klik **Review + Create** → **Create**

### 1.2 Environment variables instellen

1. Ga naar de App Service → **Settings** → **Environment variables**
2. Klik op de **App settings** tab (NIET Connection strings)
3. Voeg de volgende variabelen toe:

| Naam | Waarde |
|------|--------|
| `DATABASE_URL` | Neon PostgreSQL connection string (`postgresql://...@ep-...neon.tech/neondb?sslmode=require`) |
| `JWT_SECRET` | Geheime string (gebruik dezelfde als in je lokale `.env`) |
| `NODE_ENV` | `production` |

> **Belangrijk:** Gebruik uitsluitend de **App settings** tab. De "Connection strings" tab prefixeert variabelen met `CUSTOMCONNSTR_`, waardoor `process.env.DATABASE_URL` in de code `undefined` is.

### 1.3 Always On uitschakelen

1. Ga naar de App Service → **Settings** → **Configuration** → **General settings**
2. Zet **Always On** op **Off**
3. Klik **Save**

Dit voorkomt onnodig creditverbruik wanneer de app niet actief gebruikt wordt.

### 1.4 Publish Profile ophalen

1. Ga naar de App Service → **Overview**
2. Klik op **Download publish profile**
3. Open het gedownloade `.PublishSettings` bestand in een teksteditor
4. Kopieer de volledige inhoud

### 1.5 GitHub Secrets toevoegen

Ga naar je GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret naam | Waarde |
|-------------|--------|
| `AZURE_WEBAPP_NAME` | `nevils-gallery-api-2` |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Volledige inhoud van het `.PublishSettings` bestand |

---

## Stap 2 — Azure Static Web Apps (Frontend) aanmaken

### 2.1 Resource aanmaken

1. Ga naar [portal.azure.com](https://portal.azure.com)
2. Zoek naar **Static Web Apps** → **+ Create**
3. Vul in:
   - **Resource group:** `rg-se-dt-s6-group3`
   - **Name:** bijv. `nevils-gallery-frontend`
   - **Plan type:** Free
   - **Region:** West Europe
   - **Source:** kies **Other** (deployment via GitHub Actions)
4. Klik **Review + Create** → **Create**

### 2.2 Deployment token ophalen

1. Ga naar de Static Web App → **Settings** → **Deployment token**
2. Kopieer de token

### 2.3 Backend URL bepalen

Na Stap 1 is de Azure backend bereikbaar op de URL uit het App Service overview (inclusief de unieke hash).

### 2.4 GitHub Secrets toevoegen

| Secret naam | Waarde |
|-------------|--------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | De deployment token uit stap 2.2 |
| `VITE_API_BASE_URL_AZURE` | Volledige backend URL, bijv. `https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net` (zonder trailing slash of spaties) |

---

## Stap 3 — Neon PostgreSQL Database

De database draait op [Neon](https://neon.tech) (gratis cloud PostgreSQL).

### 3.1 Database verbinden

De `DATABASE_URL` connection string uit het Neon dashboard ziet er zo uit:
```
postgresql://neondb_owner:<password>@ep-<hash>.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

Plak deze waarde in Azure App Settings als `DATABASE_URL`.

### 3.2 Schema en tabellen

Bij de eerste opstart maakt de backend automatisch het schema en de tabellen aan:
```javascript
await sequelize.query('CREATE SCHEMA IF NOT EXISTS schema_nevils_gallery');
await sequelize.sync({ alter: true });
```

### 3.3 Data controleren in Neon

1. Ga naar [neon.tech](https://neon.tech) → jouw project → **SQL Editor**
2. Voer uit:
```sql
SELECT COUNT(*) FROM schema_nevils_gallery.paintings;
SELECT COUNT(*) FROM schema_nevils_gallery.users;
```

Als de tabellen leeg zijn, gebruik de reset-endpoint (na inloggen) om de 20 originele schilderijen te herstellen.

---

## Stap 4 — Deployen via GitHub Actions

Na het instellen van alle secrets wordt deployment automatisch getriggerd door een push naar `main`.

**Handmatig triggeren:**
1. Ga naar GitHub repository → **Actions**
2. Kies de gewenste workflow (`Deploy Backend to Azure App Service` of `Deploy Frontend to Azure Static Web Apps`)
3. Klik **Run workflow** → **Run workflow**

**Automatisch triggeren:**
```bash
# Push met wijziging in backend/ triggert backend workflow
# Push met wijziging in frontend-react/ triggert frontend workflow
git push origin main
```

---

## Volledig overzicht GitHub Secrets

| Secret | Gebruikt door |
|--------|---------------|
| `AZURE_WEBAPP_NAME` | Azure App Service backend |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Azure App Service backend |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Static Web Apps frontend |
| `VITE_API_BASE_URL_AZURE` | Azure frontend → Azure backend URL |
| `HEROKU_API_KEY` | Heroku backend (alternatief) |
| `HEROKU_APP_NAME` | Heroku backend (alternatief) |
| `HEROKU_EMAIL` | Heroku backend (alternatief) |
| `NETLIFY_AUTH_TOKEN` | Netlify frontend (alternatief) |
| `NETLIFY_SITE_ID` | Netlify frontend (alternatief) |
| `VITE_API_BASE_URL` | Netlify frontend → Heroku backend (alternatief) |

---

## Veelgemaakte fouten

| Fout | Oorzaak | Oplossing |
|------|---------|-----------|
| App geeft 503/uitgeschakeld | Free tier (F1) CPU-limiet bereikt | Overschakelen naar Basic B1 plan |
| `DATABASE_URL` is `undefined` | Variabele staat in "Connection strings" tab | Verplaats naar "App settings" tab |
| Frontend toont lege array | `VITE_API_BASE_URL_AZURE` bevat trailing spatie of `https://` ontbreekt | Controleer de exacte waarde van het secret |
| MIME type fout voor `.js` bestanden | `staticwebapp.config.json` staat niet in `dist/` root | Zorg dat het bestand in `frontend-react/public/` staat zodat Vite het kopieert |
| Login geeft 401 | Verkeerd wachtwoord of lege users-tabel | Gebruik `passwordadmin`; controleer of de users-tabel gevuld is |
