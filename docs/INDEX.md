# Nevil's Gallery — Projectdocumentatie Index

## Haagse Hogeschool | Software-project | Nevil Douglas

---

## Overzicht Documenten

| #  | Document                                              | Bestand                        | Opdracht onderwerp                                          |
|----|-------------------------------------------------------|--------------------------------|-------------------------------------------------------------|
| 1  | [UX/UI Design — 5 E's & Persona's](1_ux_ui_design.md) | `1_ux_ui_design.md`           | UX/UI designprincipes, persona's, gebruikersgerichtheid    |
| 2  | [Backend Ontwerp](2_backend_ontwerp.md)               | `2_backend_ontwerp.md`         | Requirements (MoSCoW), API-ontwerp, datamodel, Swagger     |
| 3  | [API CRUD Documentatie & ERD](3_api_crud_documentatie.md) | `3_api_crud_documentatie.md` | ERD-diagram, CRUD-endpoints volledig gedocumenteerd        |
| 4  | [Security Maatregelen](4_security_maatregelen.md)    | `4_security_maatregelen.md`    | Risico-inventarisatie, preventief/detectief/correctief     |
| 5  | [Ontwikkelproces](5_ontwikkelproces.md)              | `5_ontwikkelproces.md`         | SDLC-cyclus, technologiekeuzes, versiebeheer, CI/CD       |
| 6  | [Deployment & Security Implementatie](6_deployment_security.md) | `6_deployment_security.md` | Heroku, Azure, SSL, implementeerde beveiligingscode |
| 7  | [Testplan & Testcases](7_testplan.md)                | `7_testplan.md`                | Handmatige en automatische tests, frontend + backend       |

---

## Applicatie Links

| Resource              | URL                                                                     |
|-----------------------|-------------------------------------------------------------------------|
| Frontend (productie)  | https://sparkling-kleicha-32eb8d.netlify.app/                          |
| Backend API           | https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api/paintings    |
| Swagger / API Docs    | https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs         |
| GitHub Repository     | (zie projectinstellingen)                                               |

---

## Tech Stack Samenvatting

```
Backend:    Node.js 20 + Express.js 4 + Sequelize 6 + PostgreSQL
Frontend:   React 18 + React Router 6 + Vite 5
Database:   PostgreSQL (Heroku add-on), schema: schema_nevils_gallery
Docs:       OpenAPI 3.0 / Swagger UI
Deployment: Heroku (backend) + Netlify (frontend) + Azure Static Web Apps (alt.)
CI/CD:      GitHub Actions
```
