# Opdracht 5 — Ontwikkelproces

## Nevil's Gallery — Requirements, Design, Development, Testing & Deployment

---

## 1. Inleiding

Dit document beschrijft het ontwikkelproces van Nevil's Gallery conform de software development lifecycle (SDLC). Het project is uitgevoerd als schoolopdracht bij de Haagse Hogeschool en doorloopt de volledige cyclus: requirements, ontwerp, development, testen en deployment.

---

## 2. Requirements Fase

### 2.1 User Stories

#### Als kunstliefhebber (Marieke)
| ID   | User Story                                                              | Prioriteit |
|------|-------------------------------------------------------------------------|------------|
| US01 | Ik wil de meest beroemde schilderijen zien zodra ik de pagina open     | Must       |
| US02 | Ik wil de beschrijving van een schilderij kunnen lezen                 | Must       |
| US03 | Ik wil de collectie kunnen filteren op kunstenaar                      | Should     |
| US04 | Ik wil de collectie kunnen sorteren op ranking of titel                | Should     |

#### Als galerij-beheerder (David)
| ID   | User Story                                                              | Prioriteit |
|------|-------------------------------------------------------------------------|------------|
| US05 | Ik wil inloggen met een gebruikersnaam en wachtwoord                   | Must       |
| US06 | Ik wil een nieuw schilderij toevoegen met afbeelding en beschrijving   | Must       |
| US07 | Ik wil de gegevens van een bestaand schilderij kunnen aanpassen        | Must       |
| US08 | Ik wil een schilderij kunnen verwijderen                               | Must       |
| US09 | Ik wil de ranking van schilderijen kunnen aanpassen                    | Must       |
| US10 | Ik wil de dataset kunnen resetten naar de originele 20 schilderijen    | Should     |
| US11 | Ik wil niet per ongeluk een schilderij kunnen verwijderen              | Should     |

#### Als casual bezoeker (Lars)
| ID   | User Story                                                              | Prioriteit |
|------|-------------------------------------------------------------------------|------------|
| US12 | Ik wil de galerie bekijken zonder registratie                          | Must       |
| US13 | Ik wil de applicatie op mijn smartphone kunnen gebruiken               | Should     |

### 2.2 Functionele Requirements

| ID   | Requirement                                                           | Status |
|------|-----------------------------------------------------------------------|--------|
| FR01 | De homepagina toont de eerste 8 schilderijen op volgorde van ranking | ✅ |
| FR02 | Elk schilderij toont afbeelding, titel, kunstenaar en beschrijving   | ✅ |
| FR03 | De overzichtstabel ondersteunt sortering op alle kolommen            | ✅ |
| FR04 | De overzichtstabel ondersteunt filtering per kolom                   | ✅ |
| FR05 | Beheerders kunnen inloggen via een loginpagina                       | ✅ |
| FR06 | Beheerders kunnen een schilderij aanmaken via een formulier          | ✅ |
| FR07 | Beheerders kunnen een schilderij bewerken via een formulier          | ✅ |
| FR08 | Beheerders kunnen een schilderij verwijderen na bevestiging          | ✅ |
| FR09 | Bij rankingwijziging worden andere rankings automatisch bijgewerkt   | ✅ |
| FR10 | De dataset kan worden gereset via een knop                           | ✅ |
| FR11 | Een bevestigingsmodal verschijnt vóór verwijdering                   | ✅ |
| FR12 | De API retourneert JSON-responses                                     | ✅ |
| FR13 | De applicatie is toegankelijk via een publieke URL                   | ✅ |

### 2.3 Niet-functionele Requirements

| ID    | Requirement                                                           | Status |
|-------|-----------------------------------------------------------------------|--------|
| NFR01 | De API reageert binnen 2 seconden op een standaard GET-aanroep       | ✅ |
| NFR02 | De applicatie is beschikbaar op desktop en mobiel                    | ✅ |
| NFR03 | Gevoelige configuratie is niet zichtbaar in de broncode              | ✅ |
| NFR04 | De API is gedocumenteerd via Swagger/OpenAPI 3.0                     | ✅ |
| NFR05 | De backend is gedeployed op Azure App Service                        | ✅ |
| NFR06 | De frontend is gedeployed op Azure Static Web Apps                   | ✅ |
| NFR07 | Data wordt permanent opgeslagen in PostgreSQL (Neon)                 | ✅ |
| NFR08 | De codebase is onder versiebeheer met Git/GitHub                     | ✅ |

---

## 3. Design Fase

### 3.1 Technologiekeuzes

| Laag             | Technologie          | Motivatie                                                            |
|------------------|----------------------|----------------------------------------------------------------------|
| **Backend**      | Node.js + Express.js | JavaScript full-stack, lichtgewicht, opdrachtvereiste               |
| **Database**     | PostgreSQL (Neon)    | ACID-garanties, gratis cloud-tier, UUID-ondersteuning               |
| **ORM**          | Sequelize v6         | Abstractie over SQL, modelgedreven development                       |
| **Auth**         | JWT + bcryptjs       | Stateless tokens, veilige wachtwoord-opslag                         |
| **Bestandsupload** | Multer             | Industriestandaard voor multipart uploads in Express                |
| **API Docs**     | Swagger/OpenAPI 3.0  | Interactieve documentatie, opdrachtvereiste                         |
| **Frontend**     | React 18 + Vite      | Component-gebaseerd, snelle build, moderne DX                       |
| **Routing**      | React Router v6      | Client-side routing voor SPA                                         |
| **Deployment backend** | Azure App Service (Basic B1) | Betrouwbaar, geen dagelijkse CPU-limiet, Always On beschikbaar |
| **Deployment frontend** | Azure Static Web Apps | Gratis CDN, ingebouwde SPA-ondersteuning                 |
| **Database hosting** | Neon PostgreSQL | Gratis cloud PostgreSQL, geen server beheer                        |
| **Versiebeheer** | Git + GitHub         | Industriestandaard, gratis                                           |
| **CI/CD**        | GitHub Actions       | Geautomatiseerde deployment bij push naar `main`                    |

### 3.2 Architectuurkeuze

**Monorepo-structuur:** frontend en backend leven in dezelfde repository, maar worden onafhankelijk gedeployed.

**REST API** gekozen boven GraphQL — eenvoud voor een CRUD-applicatie, betere Swagger-compatibiliteit.

---

## 4. Development Fase

### 4.1 Ontwikkelingsvolgorde

```
1. Database schema ontwerp
   └── dump.sql, painting.model.js, user.model.js

2. Backend API (Express + Sequelize)
   └── server.js, routes, controllers, middleware

3. Authenticatie (JWT)
   └── auth.controller.js, auth.middleware.js, auth.routes.js

4. Vanilla JS Frontend (prototype)
   └── frontend/ (index.html, main_table.html, maintenance.html)

5. Swagger documentatie
   └── swagger.js, JSDoc annotaties in routes

6. React Frontend (productieversie)
   └── frontend-react/ (components, pages, hooks, loginpagina)

7. CI/CD & Deployment
   └── .github/workflows/, Azure App Service, Azure Static Web Apps
```

### 4.2 Git Workflow

**Branch strategie:** Directe commits naar `main`.  
**CI/CD triggers:** GitHub Actions geactiveerd bij pushes naar `main`:
- `backend/**` → deploy naar Azure App Service
- `frontend-react/**` → build + deploy naar Azure Static Web Apps

### 4.3 Codestructuur

```
nevils-gallery/
├── backend/
│   ├── config/database.js
│   ├── controllers/
│   │   ├── painting.controller.js
│   │   └── auth.controller.js
│   ├── middleware/
│   │   ├── upload.js
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── index.js
│   │   ├── painting.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── painting.routes.js
│   │   └── auth.routes.js
│   └── server.js
├── frontend-react/
│   ├── public/staticwebapp.config.json
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── pages/
├── docs/
└── .github/workflows/
    ├── deploy-backend-azure.yml     ← Azure App Service (primair)
    ├── deploy-frontend-azure.yml    ← Azure Static Web Apps (primair)
    ├── deploy-backend.yml           ← Heroku (alternatief)
    └── deploy-frontend.yml          ← Netlify (alternatief)
```

---

## 5. Testing Fase

> *Gedetailleerde testdocumentatie: zie Opdracht 7 (`docs/7_testplan.md`)*

**Uitgevoerde tests:**
- Handmatige API-tests via Swagger UI (`/api-docs`)
- Handmatige frontend-tests in Chrome (desktop + mobile emulatie)
- Functionele CRUD-tests via de beheerpagina (inclusief login)
- Verificatie van ranking-shift logica
- Integratietests op Azure-productieomgeving

---

## 6. Deployment Fase

### 6.1 Omgevingen

| Omgeving  | Backend URL | Frontend URL |
|-----------|-------------|--------------|
| Azure (productie) | `https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net` | `https://zealous-cliff-06a306e03.7.azurestaticapps.net` |
| Netlify (alternatief) | `https://nevils-gallery-api-456cfdb93e97.herokuapp.com` | `https://sparkling-kleicha-32eb8d.netlify.app` |
| Lokaal    | `http://localhost:4000` | `http://localhost:5173` |

### 6.2 Deployment Pipeline (Azure)

```
Developer pushes naar main
          │
          ├─ backend/** gewijzigd?
          │   └── GitHub Actions: deploy-backend-azure.yml
          │         ├── checkout
          │         ├── npm ci
          │         └── azure/webapps-deploy@v2
          │               └── Azure App Service (Basic B1)
          │
          └─ frontend-react/** gewijzigd?
              └── GitHub Actions: deploy-frontend-azure.yml
                    ├── checkout
                    ├── npm ci + npm run build (met VITE_API_BASE_URL_AZURE)
                    └── Azure/static-web-apps-deploy@v1
                          └── Azure Static Web Apps
```

### 6.3 Vereiste GitHub Secrets

| Secret | Gebruik |
|--------|---------|
| `AZURE_WEBAPP_NAME` | Naam Azure App Service |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Publish profile Azure App Service |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token Azure Static Web Apps |
| `VITE_API_BASE_URL_AZURE` | Backend-URL ingebakken in React-bundle |

### 6.4 Azure Configuratie

**App Service:** Basic B1 plan, Always On uitgeschakeld (app slaapt na inactiviteit — bespaart credits).  
**Database:** Neon PostgreSQL (cloud), verbonden via `DATABASE_URL` in Azure App Settings.  
**MIME types:** `staticwebapp.config.json` in `frontend-react/public/` configureert correcte MIME types voor JavaScript-bestanden en SPA-routing fallback.

---

## 7. Feedback & Iteraties

### 7.1 Procesverbeteringen
- **Free tier → Basic B1:** Azure Free tier (F1) heeft een limiet van 60 CPU-minuten per dag. Overgezet naar Basic B1 binnen de schoolsubscriptie (`ITD_HBO-ICT-DevTest`, resourcegroep `rg-se-dt-s6-group3`) om betrouwbare uptime te garanderen.
- **Heroku → Azure:** Backend gemigreerd van Heroku naar Azure App Service voor betere integratie met de schoolomgeving.
- **Neon database:** Database gemigreerd naar Neon PostgreSQL cloud voor onafhankelijkheid van platform-specifieke add-ons.
- **Authenticatie geïmplementeerd:** JWT-login toegevoegd zodat de beheerpagina beveiligd is.
- **MIME type fix:** `staticwebapp.config.json` verplaatst naar `public/` zodat Vite het automatisch naar `dist/` kopieert.
- **Rate limiting toegevoegd:** `express-rate-limit` geïmplementeerd (max 100 verzoeken per 15 minuten per IP) als bescherming tegen brute force en DoS-aanvallen.
- **Security headers toegevoegd:** `helmet` geïmplementeerd voor automatische beveiligingsheaders (CSP, X-Frame-Options, HSTS, etc.).

### 7.2 Nog te verbeteren
- CORS beperken tot bekende origins
- Geautomatiseerde testcoverage toevoegen
- npm audit integreren in CI/CD pipeline
