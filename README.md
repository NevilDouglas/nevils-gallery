# Nevil's Gallery

Een full-stack webapplicatie voor het beheren en tonen van een schilderijencollectie. Gebouwd als schoolproject aan de Haagse Hogeschool.

**GitHub:** [github.com/NevilDouglas/nevils-gallery](https://github.com/NevilDouglas/nevils-gallery)

**Projectdocumentatie:** [docs/INDEX.md](docs/INDEX.md)

---

## Inhoudsopgave

- [Projectoverzicht](#projectoverzicht)
- [Live Demo](#live-demo)
- [Technologieën](#technologieën)
- [Projectstructuur](#projectstructuur)
- [Installatie (lokaal)](#installatie-lokaal)
- [Omgevingsvariabelen](#omgevingsvariabelen)
- [API-documentatie](#api-documentatie)
- [Deployment](#deployment)
- [Inloggegevens](#inloggegevens)

---

## Projectoverzicht

Nevil's Gallery biedt een overzicht van 20 beroemde schilderijen met de mogelijkheid om schilderijen toe te voegen, te bewerken en te verwijderen. De collectie kan altijd worden teruggezet naar de originele 20 meesterwerken via de resetfunctie. Beheerfunctionaliteit is beveiligd via JWT-authenticatie.

**Functionaliteiten:**
- Overzichtspagina met preview van de eerste 8 schilderijen
- Interactieve tabel met sortering, filtering per kolom en paginering
- Beheerpagina met volledige CRUD-functionaliteit en afbeeldinguploads (vereist login)
- Automatische rankingverschuiving bij toevoegen en bewerken
- JWT-gebaseerde authenticatie voor beheerders
- Interactieve API-documentatie via Swagger UI

---

## Live Demo

**Azure (primair):**

| Onderdeel | Platform | URL |
|-----------|----------|-----|
| Frontend | Azure Static Web Apps | https://zealous-cliff-06a306e03.7.azurestaticapps.net |
| Backend API | Azure App Service | https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net |
| Swagger UI | Azure App Service | https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net/api-docs |

**Netlify/Heroku (alternatief):**

| Onderdeel | Platform | URL |
|-----------|----------|-----|
| Frontend | Netlify | https://sparkling-kleicha-32eb8d.netlify.app |
| Backend API | Heroku | https://nevils-gallery-api-456cfdb93e97.herokuapp.com |
| Swagger UI | Heroku | https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs |

---

## Inloggegevens

De beheerpagina (Maintenance) is beveiligd met een login. Gebruik de volgende gegevens:

| Veld | Waarde |
|------|--------|
| **Gebruikersnaam** | `admin@example.com` |
| **Wachtwoord** | `passwordadmin` |

---

## Technologieën

| Laag | Technologie |
|---|---|
| Backend | Node.js, Express |
| Database | PostgreSQL (via Sequelize ORM, gehost op Neon) |
| Frontend | React (Vite) + Vanilla JavaScript |
| Bestandsuploads | Multer |
| Authenticatie | JWT (jsonwebtoken + bcryptjs) |
| API-documentatie | Swagger (swagger-jsdoc + swagger-ui-express) |
| Hosting backend | Azure App Service (Basic B1) |
| Hosting frontend | Azure Static Web Apps |
| Database hosting | Neon PostgreSQL (cloud) |

---

## Projectstructuur

```
nevils-gallery/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize databaseverbinding
│   ├── controllers/
│   │   ├── painting.controller.js  # Business-logica voor alle endpoints
│   │   └── auth.controller.js      # Login logica (JWT)
│   ├── middleware/
│   │   ├── upload.js            # Multer configuratie voor afbeeldinguploads
│   │   └── auth.middleware.js   # JWT verificatie middleware
│   ├── models/
│   │   ├── index.js             # Centraal exportpunt voor modellen
│   │   ├── painting.model.js    # Sequelize model voor schilderijen
│   │   └── user.model.js        # Sequelize model voor gebruikers
│   ├── routes/
│   │   ├── painting.routes.js   # API-routes met Swagger-annotaties
│   │   └── auth.routes.js       # Authenticatie routes
│   ├── public/
│   │   └── assets/img/          # Geüploade afbeeldingen
│   ├── server.js                # Express server + Swagger UI
│   ├── swagger.js               # OpenAPI 3.0 configuratie
│   └── package.json
│
├── frontend-react/
│   ├── public/
│   │   └── staticwebapp.config.json  # Azure SPA routing + MIME types
│   └── src/
│       ├── api/
│       │   ├── paintings.js     # Alle API-aanroepen
│       │   └── auth.js          # Login API-aanroep
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Nav.jsx
│       │   ├── Footer.jsx
│       │   └── maintenance/
│       │       ├── ActionModal.jsx
│       │       ├── PaintingCard.jsx
│       │       └── PaintingForm.jsx
│       ├── hooks/
│       │   └── useDateTime.js
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── MainTablePage.jsx
│       │   ├── MaintenancePage.jsx
│       │   ├── LoginPage.jsx
│       │   └── AboutPage.jsx
│       └── App.jsx
│
├── docs/                        # Projectdocumentatie (opdrachten 1-7)
│   ├── INDEX.md                 # Overzicht alle documenten
│   ├── 1_ux_ui_design.md
│   ├── 2_backend_ontwerp.md
│   ├── 3_api_crud_documentatie.md
│   ├── 4_security_maatregelen.md
│   ├── 5_ontwikkelproces.md
│   ├── 6_deployment_security.md
│   ├── 7_testplan.md
│   └── azure-setup.md
│
└── .github/
    └── workflows/
        ├── deploy-backend-azure.yml   # Auto-deploy backend naar Azure App Service (primair)
        ├── deploy-frontend-azure.yml  # Auto-deploy frontend naar Azure Static Web Apps (primair)
        ├── deploy-backend.yml         # Auto-deploy backend naar Heroku (alternatief)
        └── deploy-frontend.yml        # Auto-deploy frontend naar Netlify (alternatief)
```

---

## Installatie (lokaal)

### Vereisten
- Node.js 20+
- PostgreSQL 16+

### Backend

```bash
cd backend
npm install
```

Maak een `.env` bestand aan in de `backend/` map (zie [Omgevingsvariabelen](#omgevingsvariabelen)).

```bash
npm run dev
```

De server start op `http://localhost:4000`.

### Frontend (React)

```bash
cd frontend-react
npm install
npm run dev
```

De frontend start op `http://localhost:5173`.

---

## Omgevingsvariabelen

Maak een `.env` bestand aan in de `backend/` map op basis van `.env.example`:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=jouw-geheime-sleutel
NODE_ENV=development
```

Op Azure worden `DATABASE_URL`, `JWT_SECRET` en `NODE_ENV` ingesteld als App Settings in de Azure Portal.

---

## API-documentatie

De volledige interactieve API-documentatie is beschikbaar via Swagger UI:

- **Productie (Azure):** `https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net/api-docs`
- **Productie (Heroku):** `https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs`
- **Lokaal:** `http://localhost:4000/api-docs`

### Endpoints

| Methode | Pad | Beschrijving | Auth |
|---|---|---|---|
| `GET` | `/api/paintings` | Alle schilderijen ophalen (gesorteerd op ranking) | Nee |
| `GET` | `/api/paintings/:id` | Één schilderij ophalen via UUID | Nee |
| `POST` | `/api/paintings` | Nieuw schilderij toevoegen (multipart/form-data) | Ja |
| `PUT` | `/api/paintings/:id` | Schilderij bijwerken (multipart/form-data) | Ja |
| `DELETE` | `/api/paintings/:id` | Schilderij verwijderen | Ja |
| `POST` | `/api/paintings/reset` | Collectie resetten naar originele 20 schilderijen | Ja |
| `POST` | `/api/auth/login` | Inloggen — retourneert JWT-token | Nee |

---

## Deployment

De applicatie is beschikbaar op twee omgevingen:

**Azure (primair):**
- **Frontend:** [Azure Static Web Apps](https://zealous-cliff-06a306e03.7.azurestaticapps.net)
- **Backend:** [Azure App Service](https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net)

**Netlify/Heroku (alternatief):**
- **Frontend:** [Netlify](https://sparkling-kleicha-32eb8d.netlify.app)
- **Backend:** [Heroku](https://nevils-gallery-api-456cfdb93e97.herokuapp.com)

### Automatische deployment

Bij elke push naar de `main` branch worden frontend en backend automatisch gedeployed via GitHub Actions.

### GitHub Secrets vereist

| Secret | Beschrijving |
|---|---|
| `AZURE_WEBAPP_NAME` | Naam van de Azure App Service |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Publish profile van de Azure App Service |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token voor Azure Static Web Apps |
| `VITE_API_BASE_URL_AZURE` | Volledige URL van de Azure backend (met `https://`) |
