# 👑 Nevil's Final Gallery

Een full-stack webapplicatie voor het beheren en tonen van een schilderijencollectie. Gebouwd als schoolproject aan de Haagse Hogeschool.

**GitHub:** [github.com/NevilDouglas/nevils-gallery](https://github.com/NevilDouglas/nevils-gallery)

---

## Inhoudsopgave

- [Projectoverzicht](#projectoverzicht)
- [Technologieën](#technologieën)
- [Projectstructuur](#projectstructuur)
- [Installatie (lokaal)](#installatie-lokaal)
- [Omgevingsvariabelen](#omgevingsvariabelen)
- [API-documentatie](#api-documentatie)
- [Deployment](#deployment)

---

## Projectoverzicht

Nevil's Final Gallery biedt een overzicht van 20 beroemde schilderijen met de mogelijkheid om schilderijen toe te voegen, te bewerken en te verwijderen. De collectie kan altijd worden teruggezet naar de originele 20 meesterwerken via de resetfunctie.

**Functionaliteiten:**
- Overzichtspagina met preview van de eerste 8 schilderijen
- Interactieve tabel met sortering, filtering per kolom en paginering
- Beheerpagina met volledige CRUD-functionaliteit en afbeeldinguploads
- Automatische rankingverschuiving bij toevoegen en bewerken
- Interactieve API-documentatie via Swagger UI

---

## Technologieën

| Laag | Technologie |
|---|---|
| Backend | Node.js, Express |
| Database | PostgreSQL (via Sequelize ORM) |
| Frontend | React (Vite) + Vanilla JavaScript |
| Bestandsuploads | Multer |
| API-documentatie | Swagger (swagger-jsdoc + swagger-ui-express) |
| Hosting backend | Heroku |
| Hosting frontend | Netlify |
| Database hosting | Heroku PostgreSQL |

---

## Projectstructuur

```
nevils-gallery/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize databaseverbinding
│   ├── controllers/
│   │   └── painting.controller.js  # Business-logica voor alle endpoints
│   ├── middleware/
│   │   └── upload.js            # Multer configuratie voor afbeeldinguploads
│   ├── models/
│   │   ├── index.js             # Centraal exportpunt voor modellen
│   │   └── painting.model.js    # Sequelize model voor schilderijen
│   ├── routes/
│   │   └── painting.routes.js   # API-routes met Swagger-annotaties
│   ├── public/
│   │   └── assets/img/          # Geüploade afbeeldingen
│   ├── server.js                # Express server + Swagger UI
│   ├── swagger.js               # OpenAPI 3.0 configuratie
│   └── package.json
│
├── frontend-react/
│   └── src/
│       ├── api/
│       │   └── paintings.js     # Alle API-aanroepen
│       ├── components/
│       │   ├── Layout.jsx       # Gedeelde layout (nav + footer)
│       │   ├── Nav.jsx
│       │   ├── Footer.jsx
│       │   └── maintenance/
│       │       ├── ActionModal.jsx
│       │       ├── PaintingCard.jsx
│       │       └── PaintingForm.jsx
│       ├── hooks/
│       │   └── useDateTime.js   # Hook voor live datum/tijd
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── MainTablePage.jsx
│       │   ├── MaintenancePage.jsx
│       │   └── AboutPage.jsx
│       └── App.jsx
│
├── frontend/                    # Vanilla JavaScript frontend (alternatief)
│   ├── js/
│   │   ├── api.js
│   │   ├── index.js
│   │   ├── main_table.js
│   │   ├── maintenance.js
│   │   ├── updateDateTime.js
│   │   └── nav-highlight.js
│   ├── index.html
│   ├── main_table.html
│   ├── maintenance.html
│   └── about.html
│
└── .github/
    └── workflows/
        ├── deploy-backend.yml   # Auto-deploy backend naar Heroku
        └── deploy-frontend.yml  # Auto-deploy frontend naar Netlify
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
DB_HOST=localhost
DB_PORT=5432
DB_USER=jouw_gebruikersnaam
DB_PASSWORD=jouw_wachtwoord
DB_DATABASE=db_nevils_gallery
```

Op Heroku wordt `DATABASE_URL` automatisch ingesteld door de Postgres add-on.

---

## API-documentatie

De volledige interactieve API-documentatie is beschikbaar via Swagger UI:

- **Productie:** `https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs`
- **Lokaal:** `http://localhost:4000/api-docs`

### Endpoints

| Methode | Pad | Beschrijving |
|---|---|---|
| `GET` | `/api/paintings` | Alle schilderijen ophalen (gesorteerd op ranking) |
| `GET` | `/api/paintings/:id` | Één schilderij ophalen via UUID |
| `POST` | `/api/paintings` | Nieuw schilderij toevoegen (multipart/form-data) |
| `PUT` | `/api/paintings/:id` | Schilderij bijwerken (multipart/form-data) |
| `DELETE` | `/api/paintings/:id` | Schilderij verwijderen |
| `POST` | `/api/paintings/reset` | Collectie resetten naar originele 20 schilderijen |

---

## Deployment

De applicatie is live op:

- **Frontend:** [Netlify](https://sparkling-kleicha-32eb8d.netlify.app/)
- **Backend:** [Heroku](https://nevils-gallery-api-456cfdb93e97.herokuapp.com)

### Automatische deployment

Bij elke push naar de `main` branch worden frontend en backend automatisch gedeployed via GitHub Actions.

### GitHub Secrets vereist

| Secret | Beschrijving |
|---|---|
| `HEROKU_API_KEY` | Heroku API-sleutel |
| `HEROKU_APP_NAME` | Naam van de Heroku app |
| `HEROKU_EMAIL` | Heroku e-mailadres |
| `NETLIFY_AUTH_TOKEN` | Netlify persoonlijk toegangstoken |
| `NETLIFY_SITE_ID` | Netlify site-ID |
| `VITE_API_BASE_URL` | Volledige URL van de backend op Heroku |
