# Opdracht 4 — Security Maatregelen

## Nevil's Gallery — Risico-inventarisatie & Beveiligingsstrategie

---

## 1. Inleiding

Dit document beschrijft de securitymaatregelen voor Nevil's Gallery, gebaseerd op een systematische risico-inventarisatie. De maatregelen zijn ingedeeld naar type: **preventief** (voorkomen), **detectief** (opsporen), **correctief** (herstellen) en **reactief** (reageren). Zowel technische, menselijke als organisatorische aspecten worden behandeld.

De applicatie is een publiek toegankelijke webapplicatie waarbij de beheerfunctionaliteit (CRUD) is beveiligd achter JWT-authenticatie. Bezoekers kunnen de collectie alleen lezen; beheerders kunnen na inloggen mutaties uitvoeren.

---

## 2. Risico-inventarisatie

### 2.1 Dreigingsmodel — STRIDE

| Dreiging             | STRIDE Categorie     | Beschrijving                                              | Status |
|----------------------|----------------------|-----------------------------------------------------------|--------|
| SQL-injectie         | Tampering            | Kwaadaardige SQL in invoervelden                         | ✅ Gemitigeerd |
| Ongeautoriseerde CRUD| Elevation of Privilege | Onbevoegde aanmaken/bewerken/verwijderen van schilderijen | ✅ Gemitigeerd |
| Cross-Site Scripting | Tampering            | Kwaadaardige JavaScript in beschrijvingsteksten          | ⚠️ Deels |
| Onbeperkte uploads   | Denial of Service    | Grote of kwaadaardige bestanden uploaden                 | ⚠️ Deels |
| Geheimen in code     | Information Disclosure | Database-wachtwoord in versiebeheersysteem              | ✅ Gemitigeerd |
| Path Traversal       | Tampering/Disclosure | Bestanden buiten de uploadmap bereiken                   | ✅ Gemitigeerd |
| Denial of Service    | Denial of Service    | API overspoelen met verzoeken                            | ✅ Gemitigeerd |
| Onversleuteld verkeer| Information Disclosure | Data onderscheppen via HTTP                             | ✅ Gemitigeerd |
| Reset-misbruik       | Tampering            | Dataset resetten zonder autorisatie                      | ✅ Gemitigeerd |
| Verouderde packages  | Tampering            | Kwetsbaarheden in npm-afhankelijkheden                   | ❌ Gepland |
| Brute force login    | Elevation of Privilege | Herhaald raden van wachtwoorden                        | ✅ Gemitigeerd |

### 2.2 OWASP Top 10 Mapping

De OWASP Top 10 (2021) is een internationale standaard voor de meest kritieke webapplicatie-risico's. Hieronder de koppeling met Nevil's Gallery:

| OWASP Categorie | Omschrijving | Toepassing | Status |
|-----------------|--------------|------------|--------|
| A01: Broken Access Control | Onbevoegde toegang tot functionaliteit | CRUD-endpoints beveiligd met JWT | ✅ Gemitigeerd |
| A02: Cryptographic Failures | Gevoelige data onvoldoende versleuteld | Wachtwoorden gehashed met bcrypt, HTTPS verplicht | ✅ Gemitigeerd |
| A03: Injection | SQL/code-injectie via invoervelden | Sequelize ORM + parameterized queries | ✅ Gemitigeerd |
| A04: Insecure Design | Onveilig architectuurontwerp | UUID-validatie, bevestigingsmodal, beschermde initials | ✅ Gemitigeerd |
| A05: Security Misconfiguration | Onjuiste configuratie van platformen | Env vars, .env in .gitignore, Azure App Settings, Helmet.js | ✅ Gemitigeerd |
| A06: Vulnerable Components | Verouderde of kwetsbare afhankelijkheden | npm audit nog niet geautomatiseerd | ❌ Gepland |
| A07: Auth Failures | Zwakke of ontbrekende authenticatie | JWT met 8u vervaltijd, bcrypt voor wachtwoorden | ✅ Gemitigeerd |
| A08: Software Integrity Failures | Onbetrouwbare softwarecomponenten | GitHub Actions + bekende npm packages | ✅ Deels |
| A09: Logging & Monitoring Failures | Onvoldoende logging van fouten | console.error logging; geen extern systeem | ⚠️ Deels |
| A10: SSRF | Server-side request forgery | Niet van toepassing (geen externe HTTP calls vanuit backend) | N.v.t. |

### 2.3 Risicomatrix

| Risico                  | Kans    | Impact  | Risicoscore | Prioriteit | Status |
|-------------------------|---------|---------|-------------|------------|--------|
| Ongeautoriseerde CRUD   | Laag    | Hoog    | **Middel**  | P1         | ✅ Opgelost |
| Reset-misbruik          | Laag    | Hoog    | **Middel**  | P1         | ✅ Opgelost |
| Brute force login       | Middel  | Hoog    | **Hoog**    | P1         | ✅ Opgelost |
| Onbeperkte uploads      | Middel  | Hoog    | **Hoog**    | P2         | ⚠️ Deels |
| Cross-Site Scripting    | Middel  | Middel  | **Middel**  | P2         | ⚠️ Deels |
| SQL-injectie            | Laag    | Hoog    | **Middel**  | P2         | ✅ Opgelost |
| Denial of Service       | Middel  | Middel  | **Middel**  | P3         | ✅ Opgelost |
| Verouderde packages     | Middel  | Variabel | **Middel** | P3         | ❌ Gepland |
| Onversleuteld verkeer   | Laag    | Hoog    | **Middel**  | P2         | ✅ Opgelost |
| Geheimen in code        | Laag    | Hoog    | **Middel**  | P2         | ✅ Opgelost |

---

## 3. Geïmplementeerde Maatregelen

### 3.1 Preventieve Maatregelen

#### M-P01: Omgevingsvariabelen voor gevoelige data
**Bestand:** `backend/.env` (niet in versiebeheersysteem)  
**Status:** ✅ Geïmplementeerd — `.env` staat in `.gitignore`, Azure App Settings voor productie

---

#### M-P02: UUID-validatie Middleware
**Bestand:** `backend/routes/painting.routes.js`

```javascript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
```

**Status:** ✅ Geïmplementeerd — voorkomt path traversal en injection via URL

---

#### M-P03: Sequelize ORM (SQL-injectie preventie)
**Implementatie:** Alle databaseoperaties via ORM + `replacements` voor ruwe queries.  
**Status:** ✅ Geïmplementeerd — OWASP A03 gemitigeerd

---

#### M-P04: JWT-Authenticatie
**Bestand:** `backend/controllers/auth.controller.js`, `backend/middleware/auth.middleware.js`

```javascript
// Login: token aanmaken
const token = jwt.sign(
  { id: user.id, username: user.username, isAdmin },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

// Middleware: token verifiëren
req.user = jwt.verify(token, process.env.JWT_SECRET);
```

**Beveiligde endpoints:** POST, PUT, DELETE `/api/paintings`, POST `/api/paintings/reset`  
**Status:** ✅ Geïmplementeerd — OWASP A01 en A07 gemitigeerd

---

#### M-P05: Wachtwoord-hashing met bcrypt
**Bestand:** `backend/controllers/auth.controller.js`

```javascript
const passwordMatch = await bcrypt.compare(password, user.password);
```

Wachtwoorden worden nooit in plaintext opgeslagen — alleen als bcrypt-hash (cost factor 10+).  
**Status:** ✅ Geïmplementeerd — OWASP A02 gemitigeerd

---

#### M-P06: CORS Configuratie
**Bestand:** `backend/server.js`

```javascript
app.use(cors());
```

CORS staat momenteel open (alle origins). Verbeterpunt: beperken tot bekende frontend-URL.  
**Status:** ✅ Geïmplementeerd (open) — ⚠️ verbetering aanbevolen

---

#### M-P07: Security Headers via Helmet.js
**Bestand:** `backend/server.js`

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https://validator.swagger.io'],
    },
  },
}));
```

Helmet voegt automatisch beveiligingsheaders toe: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy` en meer. De CSP is licht verruimd zodat Swagger UI blijft werken.  
**Status:** ✅ Geïmplementeerd — OWASP A05 gemitigeerd

---

#### M-P08: Rate Limiting via express-rate-limit
**Bestand:** `backend/server.js`

```javascript
app.set('trust proxy', 1); // Vertrouw Azure/Heroku reverse proxy voor correcte client-IP

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuten
  max: 100,                  // max 100 verzoeken per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
});
app.use('/api/', limiter);
```

Beperkt elk IP-adres tot 100 API-aanroepen per 15 minuten. `trust proxy: 1` is vereist op Azure en Heroku zodat het echte client-IP wordt gebruikt in plaats van het proxy-IP.  
**Status:** ✅ Geïmplementeerd — STRIDE DoS en brute force login gemitigeerd

---

#### M-P09: HTTPS via Azure
Azure App Service en Azure Static Web Apps bieden automatisch SSL/TLS-terminatie.  
**Status:** ✅ Geïmplementeerd — OWASP A02 gemitigeerd

---

#### M-P10: Bescherming van initiële afbeeldingen

```javascript
if (painting.image && !painting.image.includes('/initials/')) {
    fs.unlinkSync(imagePath);
}
```

**Status:** ✅ Geïmplementeerd

---

#### M-P11: Bevestigingsmodal bij destructieve acties
**Bestand:** `frontend-react/src/components/maintenance/ActionModal.jsx`  
**Status:** ✅ Geïmplementeerd

---

### 3.2 Detectieve Maatregelen

#### M-D01: Serverconsole Logging
```javascript
console.error(`Fout bij bijwerken schilderij ${req.params.id}:`, error);
```
**Status:** ✅ Geïmplementeerd (basis) — OWASP A09 deels gemitigeerd

---

#### M-D02: Azure Log Stream
Azure App Service biedt een live log stream via de Azure Portal (Settings → Log stream).  
**Status:** ✅ Beschikbaar op platformniveau

---

### 3.3 Correctieve Maatregelen

#### M-C01: Reset-endpoint (beveiligd)
**Endpoint:** `POST /api/paintings/reset` (vereist JWT)  
**Status:** ✅ Geïmplementeerd en beveiligd

---

#### M-C02: Automatisch aanmaken van schema en tabellen

```javascript
await sequelize.query('CREATE SCHEMA IF NOT EXISTS schema_nevils_gallery');
await sequelize.sync({ alter: true });
```

**Status:** ✅ Geïmplementeerd — app herstelt zichzelf na herstart

---

### 3.4 Reactieve Maatregelen

#### M-R01: Gestructureerde Foutresponses
```json
{ "error": "Beschrijving van de fout" }
```
**Status:** ✅ Geïmplementeerd

---

#### M-R02: Process Exit bij Database-initalisatiefout

```javascript
process.exit(1); // Azure herstart de container automatisch
```

**Status:** ✅ Geïmplementeerd

---

## 4. Geplande Maatregelen

| ID     | Maatregel                            | Type        | OWASP/STRIDE         | Prioriteit |
|--------|--------------------------------------|-------------|----------------------|------------|
| PM-01  | Rate limiting (express-rate-limit)   | Preventief  | STRIDE DoS, A07      | ✅ Geïmplementeerd |
| PM-02  | Inputvalidatie (Joi / express-validator) | Preventief | OWASP A03, A04      | P2         |
| PM-03  | Security headers (Helmet.js)         | Preventief  | OWASP A05            | ✅ Geïmplementeerd |
| PM-04  | CORS beperken tot bekende origins    | Preventief  | OWASP A05            | P2         |
| PM-05  | Bestandstypevalidatie uploads        | Preventief  | STRIDE DoS           | P2         |
| PM-06  | npm audit in CI/CD pipeline          | Detectief   | OWASP A06            | P3         |
| PM-07  | Gestructureerde logging (winston)    | Detectief   | OWASP A09            | P3         |
| PM-08  | Backup-strategie database            | Correctief  | Dataverlies          | P2         |
| PM-09  | Refresh tokens                       | Preventief  | OWASP A07            | P3         |

---

## 5. Menselijke & Organisatorische Aspecten

### 5.1 Beleidsmatig
- **Geheimenbeheer:** Alle gevoelige configuratie staat in `.env` (lokaal) of Azure App Settings (productie). Nooit in Git.
- **Versiebeheer:** Git + GitHub. Branch-protectieregel op `main` aanbevolen.
- **CI/CD beveiliging:** GitHub Secrets bevatten alle deployment-sleutels. Niet zichtbaar in de repository.

### 5.2 Menselijk
- **Login vereist voor beheer:** Beheerders moeten inloggen voor CRUD-operaties. Hierdoor is accidenteel misbruik door bezoekers onmogelijk.
- **Bevestigingsmodal:** Vermindert menselijke fouten bij het verwijderen van schilderijen.
- **Documentatie:** Dit document en de Swagger UI verlagen de drempel voor veilig gebruik van de API.

---

## 6. Privacy (AVG/GDPR)

**Huidige situatie:** De `users`-tabel slaat naam, gebruikersnaam en bcrypt-gehashed wachtwoord op. Serverlogboeken op Azure bevatten IP-adressen van bezoekers.

**Geïmplementeerde maatregelen:**
- Wachtwoorden worden nooit in plaintext opgeslagen (bcrypt).
- Geen persoonsgegevens van bezoekers worden opgeslagen.

**Aanbevelingen:**
- Bewaartermijn van logboeken instellen in Azure.
- Privacy-verklaring toevoegen bij uitbreiding met gebruikersregistratie.
