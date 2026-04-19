# Nevil's Gallery — Projectdocumentatie Index

## Haagse Hogeschool | Software-project | Nevil Douglas

> Deze documentatie is bijgewerkt voor de **herkansing** en beschrijft de huidige staat van de applicatie inclusief Azure-deployment, Heroku/Netlify-deployment en JWT-authenticatie.

---

## Overzicht Documenten

| #  | Document                                              | Bestand                        | Opdracht onderwerp                                          |
|----|-------------------------------------------------------|--------------------------------|-------------------------------------------------------------|
| 1  | [UX/UI Design — 5 E's & Persona's](1_ux_ui_design.md) | `1_ux_ui_design.md`           | UX/UI designprincipes, persona's, gebruikersgerichtheid    |
| 2  | [Backend Ontwerp](2_backend_ontwerp.md)               | `2_backend_ontwerp.md`         | Requirements (MoSCoW), API-ontwerp, datamodel, Swagger     |
| 3  | [API CRUD Documentatie & ERD](3_api_crud_documentatie.md) | `3_api_crud_documentatie.md` | ERD-diagram, CRUD-endpoints volledig gedocumenteerd        |
| 4  | [Security Maatregelen](4_security_maatregelen.md)    | `4_security_maatregelen.md`    | STRIDE + OWASP risico-inventarisatie, preventief/detectief/correctief |
| 5  | [Ontwikkelproces](5_ontwikkelproces.md)              | `5_ontwikkelproces.md`         | SDLC-cyclus, technologiekeuzes, versiebeheer, CI/CD       |
| 6  | [Deployment & Security Implementatie](6_deployment_security.md) | `6_deployment_security.md` | Azure App Service, Azure Static Web Apps, Heroku, Netlify, JWT-authenticatie |
| 7  | [Testplan & Testcases](7_testplan.md)                | `7_testplan.md`                | Handmatige tests, frontend + backend + Azure productie     |
| —  | [Azure Setup Handleiding](azure-setup.md)            | `azure-setup.md`               | Stap-voor-stap handleiding Azure deployment                |
| —  | [Heroku & Netlify Setup Handleiding](heroku-netlify-setup.md) | `heroku-netlify-setup.md` | Stap-voor-stap handleiding Heroku/Netlify deployment  |

---

## Applicatie Links

**Azure (primair):**

| Resource              | URL                                                                                                          |
|-----------------------|--------------------------------------------------------------------------------------------------------------|
| Frontend (Azure)      | https://zealous-cliff-06a306e03.7.azurestaticapps.net                                                       |
| Backend API (Azure)   | https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net/api/paintings                 |
| Swagger / API Docs    | https://nevils-gallery-api-2-f4haftfbf2gheggu.westeurope-01.azurewebsites.net/api-docs                     |

**Netlify/Heroku (alternatief):**

| Resource              | URL                                                                                                          |
|-----------------------|--------------------------------------------------------------------------------------------------------------|
| Frontend (Netlify)    | https://sparkling-kleicha-32eb8d.netlify.app                                                                |
| Backend API (Heroku)  | https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api/paintings                                         |
| Swagger / API Docs    | https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api-docs                                              |

| Resource              | URL                                                                                                          |
|-----------------------|--------------------------------------------------------------------------------------------------------------|
| GitHub Repository     | https://github.com/NevilDouglas/nevils-gallery                                                              |

---

## Inloggegevens (Maintenance pagina)

| Veld | Waarde |
|------|--------|
| Gebruikersnaam | `admin@example.com` |
| Wachtwoord | `passwordadmin` |

---

## Tech Stack Samenvatting

```
Backend:    Node.js 20 + Express.js 4 + Sequelize 6 + PostgreSQL (Neon)
Frontend:   React 18 + React Router 6 + Vite 5
Database:   Neon PostgreSQL (cloud), schema: schema_nevils_gallery
Auth:       JWT (jsonwebtoken + bcryptjs)
Docs:       OpenAPI 3.0 / Swagger UI
Deployment: Azure App Service (backend) + Azure Static Web Apps (frontend)
CI/CD:      GitHub Actions
```
