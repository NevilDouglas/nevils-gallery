# Opdracht 4 — Security Maatregelen

## Nevil's Gallery — Risico-inventarisatie & Beveiligingsstrategie

---

## 1. Inleiding

Dit document beschrijft de securitymaatregelen voor Nevil's Gallery, gebaseerd op een systematische risico-inventarisatie. De maatregelen zijn ingedeeld naar type: **preventief** (voorkomen), **detectief** (opsporen), **correctief** (herstellen) en **reactief** (reageren). Zowel technische, menselijke als organisatorische aspecten worden behandeld.

De applicatie is een publiek toegankelijke webapplicatie waarbij de beheerfunctionaliteit (CRUD) momenteel niet achter authenticatie zit. Dit is een bewuste tijdelijke keuze (zie opdracht 6 voor de implementatieplannen).

---

## 2. Risico-inventarisatie

### 2.1 Dreigingsmodel (STRIDE)

| Dreiging             | STRIDE Categorie     | Beschrijving                                              |
|----------------------|----------------------|-----------------------------------------------------------|
| SQL-injectie         | Tampering            | Kwaadaardige SQL in invoervelden                         |
| Ongeautoriseerde CRUD| Elevation of Privilege | Iedereen kan schilderijen aanmaken/bewerken/verwijderen |
| Cross-Site Scripting | Tampering            | Kwaadaardige JavaScript in beschrijvingsteksten          |
| Onbeperkte uploads   | Denial of Service    | Grote of kwaadaardige bestanden uploaden                 |
| Geheimen in code     | Information Disclosure | Database-wachtwoord in versiebeheersysteem              |
| Path Traversal       | Tampering/Disclosure | Bestanden buiten de uploadmap bereiken                   |
| Denial of Service    | Denial of Service    | API overspoelen met verzoeken                            |
| Onversleuteld verkeer| Information Disclosure | Data onderscheppen via HTTP                             |
| Reset-misbruik       | Tampering            | Dataset resetten zonder autorisatie                      |
| Verouderde packages  | Tampering            | Kwetsbaarheden in npm-afhankelijkheden                   |

### 2.2 Risicomarix

| Risico                  | Kans    | Impact  | Risicoscore | Prioriteit |
|-------------------------|---------|---------|-------------|------------|
| Ongeautoriseerde CRUD   | Hoog    | Hoog    | **Kritiek** | P1         |
| Reset-misbruik          | Hoog    | Hoog    | **Kritiek** | P1         |
| Onbeperkte uploads      | Middel  | Hoog    | **Hoog**    | P2         |
| Cross-Site Scripting    | Middel  | Middel  | **Middel**  | P2         |
| SQL-injectie            | Laag    | Hoog    | **Middel**  | P2         |
| Denial of Service       | Middel  | Middel  | **Middel**  | P3         |
| Path Traversal          | Laag    | Middel  | **Laag**    | P3         |
| Verouderde packages     | Middel  | Variabel | **Middel** | P3         |
| Onversleuteld verkeer   | Laag    | Hoog    | **Middel**  | P2         |
| Geheimen in code        | Laag    | Hoog    | **Middel**  | P2         |

---

## 3. Geïmplementeerde Maatregelen

### 3.1 Preventieve Maatregelen

#### M-P01: Omgevingsvariabelen voor gevoelige data
**Bestand:** `backend/.env` (niet in versiebeheersysteem)  
**Implementatie:** dotenv laadt wachtwoorden, databaseURL en andere geheimen uit `.env` bij serverstart.

```javascript
// backend/server.js:6
require('dotenv').config();
```

**Waarom:** Voorkomt dat databasewachtwoorden en API-sleutels in Git terechtkomen en openbaar worden.  
**Status:** ✅ Geïmplementeerd — `.env` staat in `.gitignore`

---

#### M-P02: UUID-validatie Middleware
**Bestand:** `backend/routes/painting.routes.js:22`  
**Implementatie:** Regex-validatie op elk `:id` URL-parameter vóór databaseaanroep.

```javascript
const validateUUID = (req, res, next) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }
  next();
};
```

**Waarom:** Voorkomt dat ongeldige invoer (bijv. SQL-fragmenten, padtraversal-pogingen) de databaselaag bereikt.  
**Status:** ✅ Geïmplementeerd

---

#### M-P03: Sequelize ORM (SQL-injectie preventie)
**Bestand:** `backend/models/painting.model.js`, `painting.controller.js`  
**Implementatie:** Alle databaseoperaties verlopen via Sequelize ORM (`findAll`, `findByPk`, `create`, `update`, `destroy`). Ruwe SQL-queries gebruiken `replacements` (parameterized).

```javascript
// painting.controller.js:61 — parameterized raw query
await sequelize.query(
  `UPDATE schema_nevils_gallery.paintings
   SET ranking = CAST(ranking AS INTEGER) + 1
   WHERE ranking ~ '^[0-9]+$' AND CAST(ranking AS INTEGER) >= :newRanking`,
  { replacements: { newRanking } }
);
```

**Waarom:** Parameterized queries voorkomen SQL-injectie doordat gebruikersinvoer nooit direct in SQL-strings wordt geplakt.  
**Status:** ✅ Geïmplementeerd

---

#### M-P04: CORS Configuratie
**Bestand:** `backend/server.js:18`  
**Implementatie:** `cors()` middleware is ingeschakeld.

```javascript
app.use(cors());
```

**Huidige status:** CORS staat momenteel open (alle origins toegestaan). Dit is acceptabel voor een schoolproject met een bekende frontend-URL.  
**Verbeterpunt:** Beperk tot de Netlify-URL in productie:

```javascript
app.use(cors({ origin: 'https://sparkling-kleicha-32eb8d.netlify.app' }));
```

**Status:** ✅ Geïmplementeerd (open) — ⚠️ Verbetering aanbevolen

---

#### M-P05: HTTPS via Heroku
**Beschrijving:** Heroku biedt standaard SSL/TLS-terminatie voor alle `https://` subdomeinen. Verkeer tussen browser en server is versleuteld.  
**Status:** ✅ Geïmplementeerd (platformniveau)

---

#### M-P06: Bescherming van initiële afbeeldingen
**Bestand:** `backend/controllers/painting.controller.js:175`  
**Implementatie:** Bij verwijderen en bijwerken wordt gecontroleerd of de afbeelding uit de `/initials/` map komt. Zo ja, dan wordt de afbeelding nooit van de server verwijderd.

```javascript
if (painting.image && !painting.image.includes('/initials/')) {
    fs.unlinkSync(imagePath);
}
```

**Waarom:** Voorkomt onherstelbaar verlies van de originele collectieafbeeldingen.  
**Status:** ✅ Geïmplementeerd

---

#### M-P07: Bevestigingsmodal bij destructieve acties
**Bestand:** `frontend-react/src/components/maintenance/ActionModal.jsx`  
**Implementatie:** Vóór elke verwijderactie verschijnt een bevestigingspopup.  
**Waarom:** Voorkomt accidenteel verwijderen van schilderijen door beheerders.  
**Status:** ✅ Geïmplementeerd

---

### 3.2 Detectieve Maatregelen

#### M-D01: Serverconsole Logging
**Bestand:** `backend/controllers/painting.controller.js`  
**Implementatie:** Alle fouten worden gelogd via `console.error()` met context.

```javascript
console.error(`Fout bij bijwerken schilderij ${req.params.id}:`, error);
```

**Waarom:** Fouten en verdachte patronen worden zichtbaar in de Heroku-logs, wat forensisch onderzoek mogelijk maakt.  
**Status:** ✅ Geïmplementeerd (basis)  
**Verbeterpunt:** Integreer een gestructureerde logger (bijv. `winston`) of externe service (Papertrail).

---

#### M-D02: HTTP Statuscode Monitoring
**Beschrijving:** De Swagger UI geeft inzicht in de API-statusscodes. Heroku-logs tonen alle inkomende requests met statuscode.  
**Status:** ✅ Passief geïmplementeerd

---

### 3.3 Correctieve Maatregelen

#### M-C01: Reset-endpoint
**Endpoint:** `POST /api/paintings/reset`  
**Beschrijving:** Stelt de volledige dataset in één stap terug naar de originele 20 schilderijen. Verwijdert alle door gebruikers toegevoegde data.  
**Waarom:** Als de dataset beschadigd of vervuild raakt (bijv. door misbruik), kan deze direct worden hersteld.  
**Status:** ✅ Geïmplementeerd  
**Risico:** Dit endpoint is momenteel niet beveiligd — iedereen kan de dataset resetten.  
**Maatregel (gepland):** Endpoint alleen toegankelijk voor geauthenticeerde admins.

---

#### M-C02: Automatisch aanmaken van schema en tabellen
**Bestand:** `backend/server.js:40`  
**Implementatie:** Bij serverstart worden schema en tabellen automatisch aangemaakt als ze niet bestaan.

```javascript
await sequelize.query('CREATE SCHEMA IF NOT EXISTS schema_nevils_gallery');
await sequelize.sync();
```

**Waarom:** De applicatie herstelt zichzelf na een eventuele databasereset of migratie naar een nieuwe database.  
**Status:** ✅ Geïmplementeerd

---

### 3.4 Reactieve Maatregelen

#### M-R01: Gestructureerde Foutresponses
**Beschrijving:** Alle API-foutresponses gebruiken een consistent formaat:
```json
{ "error": "Beschrijving van de fout" }
```
**Waarom:** Consistent foutformaat maakt geautomatiseerde foutafhandeling en monitoring eenvoudiger.  
**Status:** ✅ Geïmplementeerd

---

#### M-R02: Process Exit bij Database-initalisatiefout
**Bestand:** `backend/server.js:53`

```javascript
} catch (error) {
    console.error('❌ Kan niet verbinden met of synchroniseren naar de database:', error);
    process.exit(1);
}
```

**Waarom:** Als de database niet bereikbaar is bij serverstart, stopt het proces direct. Heroku herstart het proces automatisch, waarna een nieuwe verbindingspoging wordt gedaan.  
**Status:** ✅ Geïmplementeerd

---

## 4. Geplande Maatregelen (nog te implementeren)

| ID     | Maatregel                            | Type        | Risico Adresseert              | Prioriteit |
|--------|--------------------------------------|-------------|--------------------------------|------------|
| PM-01  | Gebruikersauthenticatie (JWT/sessie) | Preventief  | Ongeautoriseerde CRUD, Reset   | P1         |
| PM-02  | Inputvalidatie (Joi / express-validator) | Preventief | XSS, ongeldige data          | P2         |
| PM-03  | Rate limiting (express-rate-limit)   | Preventief  | DoS, brute force               | P2         |
| PM-04  | Security headers (Helmet.js)         | Preventief  | XSS, clickjacking, MIME sniff  | P2         |
| PM-05  | CORS beperken tot bekende origins    | Preventief  | CSRF                           | P2         |
| PM-06  | Bestandstypevalidatie uploads        | Preventief  | Malware-uploads                | P2         |
| PM-07  | Bestandsgrootte limiet uploads       | Preventief  | DoS via grote bestanden        | P3         |
| PM-08  | Gestructureerde logging (winston)    | Detectief   | Betere foutopsporing           | P3         |
| PM-09  | npm audit in CI/CD pipeline          | Detectief   | Kwetsbare afhankelijkheden     | P3         |
| PM-10  | Backup-strategie database            | Correctief  | Dataverlies                    | P2         |

---

## 5. Menselijke & Organisatorische Aspecten

### 5.1 Beleidsmatig
- **Geheimenbeheer:** Alle gevoelige configuratie is opgeslagen in `.env` en nooit gecommit naar Git. Het `.env.example` bestand dient als documentatie voor andere ontwikkelaars.
- **Versiebeheer:** De applicatie gebruikt Git met GitHub als centrale repository. Directe pushes naar `main` zijn mogelijk — een branch-protectieregel is aanbevolen.
- **CI/CD beveiliging:** GitHub Secrets bevatten de Heroku API-sleutel en Netlify-tokens. Deze zijn niet zichtbaar in de repository.

### 5.2 Menselijk
- **Bevestigingsmodal:** Vermindert menselijke fouten bij het verwijderen van schilderijen.
- **Reset-knop:** Geeft beheerders een vangnet bij fouten, maar vormt ook een risico als de knop door onbevoegden wordt gebruikt.
- **Documentatie:** Dit document en de Swagger UI verlagen de drempel voor veilig gebruik van de API.

### 5.3 Technisch (samenvatting)
Zie paragraaf 3 voor de geïmplementeerde technische maatregelen en paragraaf 4 voor de geplande uitbreidingen.

---

## 6. Privacy (AVG/GDPR)

**Huidige situatie:** De applicatie slaat geen persoonsgegevens op van bezoekers. De `paintings`-tabel bevat uitsluitend kunstgerelateerde data.

**Aandachtspunten:**
- De `users`-tabel in `dump.sql` bevat velden voor naam, gebruikersnaam en wachtwoord. Als deze tabel in gebruik wordt genomen, gelden AVG-verplichtingen.
- Geüploade afbeeldingen bevatten mogelijk persoonsgevoelige data (foto's van personen). Momenteel geen beperking op uploadinhoud.
- Serverlogboeken op Heroku bevatten IP-adressen van bezoekers (maximale bewaartermijn: 1500 regels / 7 dagen op gratis plan).

**Aanbeveling:** Bij activering van gebruikersauthenticatie: wachtwoorden hashen met bcrypt (minimaal 12 rondes), nooit plaintext opslaan.
