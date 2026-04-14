# Opdracht 5 — Ontwikkelproces

## Nevil's Gallery — Requirements, Design, Development, Testing & Deployment

---

## 1. Inleiding

Dit document beschrijft het ontwikkelproces van Nevil's Gallery conform de software development lifecycle (SDLC). Het project is uitgevoerd als schoolopdracht bij de Haagse Hogeschool en doorloopt de volledige cyclus: requirements, ontwerp, development, testen en deployment.

---

## 2. Requirements Fase

### 2.1 User Stories

User stories zijn geformuleerd vanuit de drie gedefinieerde persona's (zie Opdracht 1).

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
| US05 | Ik wil een nieuw schilderij toevoegen met afbeelding en beschrijving   | Must       |
| US06 | Ik wil de gegevens van een bestaand schilderij kunnen aanpassen        | Must       |
| US07 | Ik wil een schilderij kunnen verwijderen                               | Must       |
| US08 | Ik wil de ranking van schilderijen kunnen aanpassen                    | Must       |
| US09 | Ik wil de dataset kunnen resetten naar de originele 20 schilderijen    | Should     |
| US10 | Ik wil niet per ongeluk een schilderij kunnen verwijderen              | Should     |

#### Als casual bezoeker (Lars)
| ID   | User Story                                                              | Prioriteit |
|------|-------------------------------------------------------------------------|------------|
| US11 | Ik wil de galerie bekijken zonder registratie                          | Must       |
| US12 | Ik wil de applicatie op mijn smartphone kunnen gebruiken               | Should     |

### 2.2 Functionele Requirements

| ID   | Requirement                                                           | User Story |
|------|-----------------------------------------------------------------------|------------|
| FR01 | De homepagina toont de eerste 8 schilderijen op volgorde van ranking | US01       |
| FR02 | Elk schilderij toont afbeelding, titel, kunstenaar en beschrijving   | US02       |
| FR03 | De overzichtstabel ondersteunt sortering op alle kolommen            | US04       |
| FR04 | De overzichtstabel ondersteunt filtering per kolom                   | US03       |
| FR05 | Beheerders kunnen een schilderij aanmaken via een formulier          | US05       |
| FR06 | Beheerders kunnen een schilderij bewerken via een formulier          | US06       |
| FR07 | Beheerders kunnen een schilderij verwijderen na bevestiging          | US07       |
| FR08 | Bij rankingwijziging worden andere rankings automatisch bijgewerkt   | US08       |
| FR09 | De dataset kan worden gereset via een knop                           | US09       |
| FR10 | Een bevestigingsmodal verschijnt vóór verwijdering                   | US10       |
| FR11 | De API retourneert JSON-responses                                     | US05–09    |
| FR12 | De applicatie is toegankelijk via een publieke URL                   | US11, US12 |

### 2.3 Niet-functionele Requirements

| ID    | Requirement                                                           | Categorie      |
|-------|-----------------------------------------------------------------------|----------------|
| NFR01 | De API reageert binnen 2 seconden op een standaard GET-aanroep       | Performance    |
| NFR02 | De applicatie is beschikbaar op desktop en mobiel                    | Usability      |
| NFR03 | Gevoelige configuratie is niet zichtbaar in de broncode              | Security       |
| NFR04 | De API is gedocumenteerd via Swagger/OpenAPI 3.0                     | Maintainability|
| NFR05 | De backend is gedeployed op Heroku                                   | Deployment     |
| NFR06 | De frontend is gedeployed op Netlify / Azure Static Web Apps         | Deployment     |
| NFR07 | Data wordt permanent opgeslagen in PostgreSQL                        | Reliability    |
| NFR08 | De codebase is onder versiebeheer met Git/GitHub                     | Process        |

---

## 3. Design Fase

### 3.1 Technologiekeuzes

| Laag             | Technologie          | Motivatie                                                            |
|------------------|----------------------|----------------------------------------------------------------------|
| **Backend**      | Node.js + Express.js | JavaScript full-stack, lichtgewicht, opdrachtvereiste               |
| **Database**     | PostgreSQL           | ACID-garanties, gratis op Heroku, UUID-ondersteuning                |
| **ORM**          | Sequelize v6         | Abstractie over SQL, modelgedreven development                       |
| **Bestandsupload** | Multer             | Industriestandaard voor multipart uploads in Express                |
| **API Docs**     | Swagger/OpenAPI 3.0  | Interactieve documentatie, opdrachtvereiste                         |
| **Frontend**     | React 18 + Vite      | Component-gebaseerd, snelle build, moderne DX                       |
| **Routing**      | React Router v6      | Client-side routing voor SPA                                         |
| **Legacy frontend** | Vanilla JS        | Oorspronkelijk prototype, werkt lokaal zonder buildstap              |
| **Deployment backend** | Heroku        | Gratis PaaS, eenvoudige PostgreSQL add-on                           |
| **Deployment frontend** | Netlify      | Gratis CDN, eenvoudige GitHub Actions integratie                    |
| **Azure alt.**   | Azure Static Web Apps | Alternatieve frontend-deployment voor Azure-opdracht               |
| **Versiebeheer** | Git + GitHub         | Industriestandaard, gratis                                           |
| **CI/CD**        | GitHub Actions       | Geautomatiseerde deployment bij push naar `main`                    |
| **Omgevingsvariabelen** | dotenv      | Standaard voor Node.js configuratiebeheer                           |

### 3.2 Architectuurkeuze

**Monorepo-structuur** is gekozen: frontend en backend leven in dezelfde repository (`nevils-gallery/`), maar worden onafhankelijk gedeployed. Voordelen:
- Eén overzichtelijke repository voor het schoolproject.
- Eenvoudig om code te vergelijken en te linken.
- CI/CD-workflows worden geactiveerd op basis van gewijzigde paden.

**REST API** is gekozen boven GraphQL vanwege:
- Eenvoud voor een CRUD-applicatie.
- Betere compatibiliteit met Swagger/OpenAPI.
- Lagere leercurve.

### 3.3 Ontwerpdocumenten

| Document                              | Locatie                                      |
|---------------------------------------|----------------------------------------------|
| UX/UI ontwerp & persona's (5 E's)    | `docs/1_ux_ui_design.md`                    |
| Backend ontwerp & requirements        | `docs/2_backend_ontwerp.md`                 |
| ERD & API CRUD documentatie           | `docs/3_api_crud_documentatie.md`           |
| Security maatregelen                  | `docs/4_security_maatregelen.md`            |
| Swagger UI (live)                     | `/api-docs` op de backend-URL               |

---

## 4. Development Fase

### 4.1 Ontwikkelingsvolgorde

Het project is iteratief ontwikkeld in de volgende volgorde:

```
1. Database schema ontwerp
   └── dump.sql, painting.model.js

2. Backend API (Express + Sequelize)
   └── server.js, routes, controllers, middleware

3. Vanilla JS Frontend (prototype)
   └── frontend/ (index.html, main_table.html, maintenance.html)

4. Swagger documentatie
   └── swagger.js, JSDoc annotaties in routes

5. React Frontend (productieversie)
   └── frontend-react/ (components, pages, hooks)

6. CI/CD & Deployment
   └── .github/workflows/, Heroku, Netlify, Azure
```

### 4.2 Git Workflow

**Branch strategie:** Directe commits naar `main` (voor schoolproject acceptabel).  
**CI/CD triggers:** GitHub Actions wordt geactiveerd bij pushes naar `main` op specifieke paden:
- `backend/**` → deploy naar Heroku
- `frontend-react/**` → build + deploy naar Netlify

**Recente commits (voorbeelden):**
```
b4141d4  READ.me uitgebreid
acef6d4  Full commenting en Swagger-ready gemaakt
443567d  Edited image schaalbaar gemaakt
621fbd1  dump.sql toegevoegd aan de root
```

### 4.3 Codestructuur

```
nevils-gallery/
├── backend/
│   ├── config/database.js      # Sequelize + PostgreSQL configuratie
│   ├── controllers/            # Business logica (CRUD operaties)
│   ├── middleware/upload.js    # Multer bestandsupload
│   ├── models/                 # Sequelize datamodel
│   ├── routes/                 # Express routes + Swagger annotaties
│   ├── swagger.js              # OpenAPI spec configuratie
│   └── server.js               # App entry point
├── frontend/                   # Vanilla JS frontend (prototype)
├── frontend-react/             # React + Vite frontend (productie)
│   ├── src/api/                # API-aanroepen
│   ├── src/components/         # Herbruikbare UI-componenten
│   ├── src/hooks/              # Custom React hooks
│   └── src/pages/              # Pagina-componenten
└── docs/                       # Projectdocumentatie (opdrachten 1–7)
```

---

## 5. Testing Fase

> *Gedetailleerde testdocumentatie: zie Opdracht 7 (`docs/7_testplan.md`)*

**Uitgevoerde tests:**
- Handmatige API-tests via Swagger UI (`/api-docs`)
- Handmatige frontend-tests in Chrome/Edge (desktop)
- Functionele CRUD-tests via de beheerpagina
- Verificatie van ranking-shift logica

**Testgap (nog te vullen):**
- Geautomatiseerde unit tests (Jest/Vitest)
- Geautomatiseerde integratietests
- End-to-end tests (bijv. Playwright/Cypress)
- Load/performance tests

---

## 6. Deployment Fase

### 6.1 Omgevingen

| Omgeving  | Backend URL                                                        | Frontend URL                                         |
|-----------|--------------------------------------------------------------------|------------------------------------------------------|
| Productie | `https://nevils-gallery-api-456cfdb93e97.herokuapp.com`          | `https://sparkling-kleicha-32eb8d.netlify.app/`     |
| Lokaal    | `http://localhost:4000`                                            | `http://localhost:5173` (Vite dev server)            |

### 6.2 Deployment Pipeline

```
Developer pushes naar main
          │
          ├─ backend/** gewijzigd?
          │   └── GitHub Actions: deploy-backend.yml
          │         ├── checkout
          │         └── heroku-deploy (akhileshns/heroku-deploy@v3.13.15)
          │               └── Heroku App (Node.js buildpack)
          │
          └─ frontend-react/** gewijzigd?
              └── GitHub Actions: deploy-frontend.yml
                    ├── checkout
                    ├── npm ci
                    ├── npm run build (Vite, met VITE_API_BASE_URL secret)
                    └── Netlify CLI deploy (dist/)
```

### 6.3 Vereiste GitHub Secrets

| Secret               | Gebruik                                              |
|----------------------|------------------------------------------------------|
| `HEROKU_API_KEY`     | Authenticatie met Heroku API                        |
| `HEROKU_APP_NAME`    | Naam van de Heroku-applicatie                       |
| `HEROKU_EMAIL`       | E-mailadres gekoppeld aan Heroku-account            |
| `NETLIFY_AUTH_TOKEN` | Authenticatie met Netlify API                       |
| `NETLIFY_SITE_ID`    | Identifier van de Netlify-site                      |
| `VITE_API_BASE_URL`  | Backend-URL, ingebakken in de React-bundle tijdens build |

### 6.4 Azure Static Web Apps

Het bestand `frontend-react/staticwebapp.config.json` configureert fallback routing voor de React SPA op Azure:
```json
{
  "routes": [
    { "route": "/*", "serve": "/index.html", "statusCode": 200 }
  ]
}
```
Dit zorgt ervoor dat directe URL-navigatie (bijv. naar `/maintenance`) correct werkt in de SPA zonder 404.

---

## 7. Feedback & Iteraties

### 7.1 Procesverbeteringen
- **Vanilla JS → React:** Op basis van de behoefte aan een meer onderhoudbare frontend is de vanilla JS-versie vervangen door een React/Vite-versie met component-gebaseerde architectuur.
- **Hardcoded URL → Omgevingsvariabele:** De API-URL in de frontend is gemigreerd van hardcoded `localhost:4000` (in `frontend/js/api.js`) naar een Vite-omgevingsvariabele (`VITE_API_BASE_URL` in `frontend-react/src/api/paintings.js`), zodat productie en ontwikkeling verschillende backends kunnen aanspreken.
- **Code commentaren & Swagger:** Op basis van feedbackrondes zijn alle backend-bestanden volledig voorzien van JSDoc-commentaren en Swagger-annotaties.
- **dump.sql toegevoegd:** Na initiële deployment is het volledige databaseschema gedocumenteerd in `dump.sql` voor reproduceerbaarheid.

### 7.2 Nog te verbeteren
- Gebruikersauthenticatie implementeren (zie Opdracht 6)
- Geautomatiseerde testcoverage toevoegen (zie Opdracht 7)
- Branch-protectieregel op `main` instellen in GitHub
- CORS beperken tot bekende origins in productie
