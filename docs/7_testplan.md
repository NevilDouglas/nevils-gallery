# Opdracht 7 — Testplan & Testcases

## Nevil's Gallery — Frontend, Backend & Integratietesten

---

## 1. Inleiding

Dit document beschrijft het testplan voor Nevil's Gallery. Tests worden uitgevoerd om te verifiëren dat de applicatie voldoet aan de functionele en niet-functionele requirements (zie Opdracht 5). Er wordt aandacht besteed aan backend-tests, frontend-tests en integratietests. Waar mogelijk wordt het testproces geautomatiseerd.

**Testomgeving:**
- Backend: `http://localhost:4000` (lokaal) / `https://nevils-gallery-api-456cfdb93e97.herokuapp.com` (productie)
- Frontend: `http://localhost:5173` (Vite dev server) / `https://sparkling-kleicha-32eb8d.netlify.app`
- Database: PostgreSQL lokaal / Heroku PostgreSQL

---

## 2. Teststrategie

### 2.1 Testniveaus

| Niveau            | Wat wordt getest                              | Gereedschap             | Status       |
|-------------------|-----------------------------------------------|-------------------------|--------------|
| **Unit**          | Individuele functies / controllers            | Jest / Mocha            | ❌ Gepland   |
| **Integratie**    | API-endpoints + database                      | Supertest + Jest        | ❌ Gepland   |
| **E2E**           | Gebruikersscenario's via browser              | Playwright / Cypress    | ❌ Gepland   |
| **Handmatig**     | Functioneel testen via UI en Swagger          | Browser + Swagger UI    | ✅ Uitgevoerd |

### 2.2 Testaanpak

**Prioritering:** Kritieke paden eerst (CRUD-operaties, ranking-shift, reset), daarna edge cases en foutscenario's.

**Regressie:** Na elke wijziging worden alle kritieke testcases opnieuw uitgevoerd om regressies te detecteren.

---

## 3. Backend API Testcases

### 3.1 TC-BE-01: Alle schilderijen ophalen

| Attribuut     | Waarde                                                  |
|---------------|---------------------------------------------------------|
| **ID**        | TC-BE-01                                                |
| **Categorie** | Backend / API                                           |
| **Endpoint**  | `GET /api/paintings`                                    |
| **Precondities** | Server actief, database bevat schilderijen          |
| **Stappen**   | Stuur GET request naar `/api/paintings`                |
| **Verwacht**  | HTTP 200, JSON-array, gesorteerd op ranking ASC        |
| **Criteria**  | Array niet leeg, eerste element heeft ranking "1"      |
| **Status**    | ✅ Geslaagd (handmatig via Swagger UI en browser)      |

**Verificatie:**
```bash
curl https://nevils-gallery-api-456cfdb93e97.herokuapp.com/api/paintings
# → HTTP 200, array van 20 schilderijen, ranking[0] = "1"
```

---

### 3.2 TC-BE-02: Één schilderij ophalen (geldig UUID)

| Attribuut     | Waarde                                                             |
|---------------|--------------------------------------------------------------------|
| **ID**        | TC-BE-02                                                           |
| **Endpoint**  | `GET /api/paintings/671fa6fd-da4a-4d28-b4f4-065e7500ece7`        |
| **Verwacht**  | HTTP 200, object met `title: "The Mona Lisa"`                     |
| **Status**    | ✅ Geslaagd                                                        |

---

### 3.3 TC-BE-03: Één schilderij ophalen (ongeldig UUID)

| Attribuut     | Waarde                                                  |
|---------------|---------------------------------------------------------|
| **ID**        | TC-BE-03                                                |
| **Endpoint**  | `GET /api/paintings/niet-een-uuid`                     |
| **Verwacht**  | HTTP 400, `{ "error": "Invalid UUID format" }`         |
| **Doel**      | Verifieert de validateUUID middleware                   |
| **Status**    | ✅ Geslaagd                                             |

---

### 3.4 TC-BE-04: Één schilderij ophalen (niet bestaand)

| Attribuut     | Waarde                                                          |
|---------------|-----------------------------------------------------------------|
| **ID**        | TC-BE-04                                                        |
| **Endpoint**  | `GET /api/paintings/00000000-0000-1000-8000-000000000000`      |
| **Verwacht**  | HTTP 404, `{ "error": "Painting not found" }`                  |
| **Status**    | ✅ Geslaagd                                                     |

---

### 3.5 TC-BE-05: Schilderij aanmaken (zonder afbeelding)

| Attribuut     | Waarde                                                         |
|---------------|----------------------------------------------------------------|
| **ID**        | TC-BE-05                                                       |
| **Endpoint**  | `POST /api/paintings`                                          |
| **Body**      | `title=Test, artist=Test Artist, ranking=21, description=...` |
| **Verwacht**  | HTTP 201, nieuw schilderij-object met gegenereerd UUID        |
| **Cleanup**   | Verwijder het aangemaakte schilderij via DELETE               |
| **Status**    | ✅ Geslaagd                                                    |

---

### 3.6 TC-BE-06: Ranking-shift bij aanmaken

| Attribuut     | Waarde                                                                        |
|---------------|-------------------------------------------------------------------------------|
| **ID**        | TC-BE-06                                                                      |
| **Beschrijving** | Wanneer een schilderij met ranking 1 wordt aangemaakt, moet de Mona Lisa naar ranking 2 verschuiven |
| **Stappen**   | 1. Noteer huidige ranking van Mona Lisa (verwacht: "1") <br> 2. POST nieuw schilderij met ranking=1 <br> 3. GET Mona Lisa, verifieer nieuwe ranking |
| **Verwacht**  | Mona Lisa heeft nu ranking "2"                                                |
| **Cleanup**   | Reset dataset                                                                 |
| **Status**    | ✅ Geslaagd                                                                   |

---

### 3.7 TC-BE-07: Schilderij bijwerken

| Attribuut     | Waarde                                                                    |
|---------------|---------------------------------------------------------------------------|
| **ID**        | TC-BE-07                                                                  |
| **Endpoint**  | `PUT /api/paintings/671fa6fd-da4a-4d28-b4f4-065e7500ece7`               |
| **Body**      | `description=Updated description for testing`                            |
| **Verwacht**  | HTTP 200, bijgewerkt object met nieuwe description                       |
| **Cleanup**   | Reset beschrijving terug                                                  |
| **Status**    | ✅ Geslaagd                                                               |

---

### 3.8 TC-BE-08: Ranking-shift bij bijwerken (omhoog)

| Attribuut     | Waarde                                                                         |
|---------------|--------------------------------------------------------------------------------|
| **ID**        | TC-BE-08                                                                       |
| **Beschrijving** | Starry Night (ranking 2) verplaatsen naar ranking 1 — Mona Lisa gaat naar 2 |
| **Stappen**   | 1. PUT Starry Night met ranking=1 <br> 2. GET Mona Lisa, verifieer ranking    |
| **Verwacht**  | Mona Lisa: ranking "2", Starry Night: ranking "1"                             |
| **Cleanup**   | Reset dataset                                                                  |
| **Status**    | ✅ Geslaagd                                                                    |

---

### 3.9 TC-BE-09: Schilderij verwijderen

| Attribuut     | Waarde                                                                   |
|---------------|--------------------------------------------------------------------------|
| **ID**        | TC-BE-09                                                                 |
| **Stappen**   | 1. POST nieuw schilderij <br> 2. Noteer UUID <br> 3. DELETE schilderij  |
| **Verwacht**  | HTTP 204 No Content                                                      |
| **Verifieer** | GET /:id geeft HTTP 404                                                  |
| **Status**    | ✅ Geslaagd                                                              |

---

### 3.10 TC-BE-10: Dataset resetten

| Attribuut     | Waarde                                                               |
|---------------|----------------------------------------------------------------------|
| **ID**        | TC-BE-10                                                             |
| **Stappen**   | 1. POST nieuw schilderij <br> 2. POST /reset <br> 3. GET /paintings |
| **Verwacht**  | HTTP 200, response bevat precies 20 schilderijen                    |
| **Verifieer** | Toegevoegd schilderij is niet meer aanwezig                         |
| **Status**    | ✅ Geslaagd                                                          |

---

### 3.11 TC-BE-11: Schilderij aanmaken met afbeelding

| Attribuut     | Waarde                                                              |
|---------------|---------------------------------------------------------------------|
| **ID**        | TC-BE-11                                                            |
| **Stappen**   | POST met `imageFile` (JPEG, ~100KB)                                |
| **Verwacht**  | HTTP 201, `image` veld bevat `/assets/img/painting-{timestamp}.jpg` |
| **Verifieer** | GET op het afbeeldingspad geeft HTTP 200 terug                     |
| **Cleanup**   | DELETE schilderij (afbeelding moet ook worden verwijderd)          |
| **Status**    | ✅ Geslaagd                                                         |

---

## 4. Frontend Testcases

### 4.1 TC-FE-01: Homepagina — Schilderijen laden

| Attribuut     | Waarde                                                     |
|---------------|------------------------------------------------------------|
| **ID**        | TC-FE-01                                                   |
| **Pagina**    | Homepagina (`/`)                                           |
| **Stappen**   | Open de homepagina in de browser                          |
| **Verwacht**  | 8 schilderij-kaarten zichtbaar, gesorteerd op ranking     |
| **Verifieer** | Eerste kaart toont "The Mona Lisa" van "Leonardo da Vinci"|
| **Status**    | ✅ Geslaagd                                                |

---

### 4.2 TC-FE-02: Overzichtstabel — Sortering

| Attribuut     | Waarde                                                            |
|---------------|-------------------------------------------------------------------|
| **ID**        | TC-FE-02                                                          |
| **Pagina**    | Overzichtstabel (`/main_table`)                                   |
| **Stappen**   | 1. Open tabel <br> 2. Klik op kolomkop "Title"                  |
| **Verwacht**  | Tabel sorteert alphabetisch op titel (A→Z)                        |
| **Stap 2**    | Klik nogmaals op "Title"                                          |
| **Verwacht 2**| Tabel sorteert omgekeerd (Z→A)                                   |
| **Status**    | ✅ Geslaagd                                                       |

---

### 4.3 TC-FE-03: Overzichtstabel — Filtering

| Attribuut     | Waarde                                                                  |
|---------------|-------------------------------------------------------------------------|
| **ID**        | TC-FE-03                                                                |
| **Pagina**    | Overzichtstabel (`/main_table`)                                         |
| **Stappen**   | 1. Typ "van Gogh" in het filterinputveld onder de kolom "Artist"       |
| **Verwacht**  | Alleen schilderijen van Van Gogh zijn zichtbaar (verwacht: 3 rijen)   |
| **Status**    | ✅ Geslaagd                                                             |

---

### 4.4 TC-FE-04: Beheerpagina — Schilderij aanmaken

| Attribuut     | Waarde                                                                       |
|---------------|------------------------------------------------------------------------------|
| **ID**        | TC-FE-04                                                                     |
| **Pagina**    | Beheerpagina (`/maintenance`)                                                |
| **Stappen**   | 1. Vul formulier in (titel, kunstenaar, ranking, beschrijving) <br> 2. Klik "Opslaan" |
| **Verwacht**  | Nieuw schilderij-kaart verschijnt in de lijst                               |
| **Status**    | ✅ Geslaagd                                                                  |

---

### 4.5 TC-FE-05: Beheerpagina — Schilderij verwijderen (met bevestiging)

| Attribuut     | Waarde                                                                    |
|---------------|---------------------------------------------------------------------------|
| **ID**        | TC-FE-05                                                                  |
| **Stappen**   | 1. Klik "Verwijder" op een schilderij-kaart <br> 2. Bevestigingsmodal verschijnt <br> 3. Klik "Annuleren" |
| **Verwacht**  | Schilderij is NIET verwijderd — modal sluit, kaart blijft zichtbaar      |
| **Stap 2b**   | Klik "Bevestigen" in de modal                                             |
| **Verwacht 2**| Schilderij-kaart verdwijnt uit de lijst                                  |
| **Status**    | ✅ Geslaagd                                                               |

---

### 4.6 TC-FE-06: Navigatie — Actieve pagina-markering

| Attribuut     | Waarde                                                              |
|---------------|---------------------------------------------------------------------|
| **ID**        | TC-FE-06                                                            |
| **Stappen**   | Navigeer via de navbar naar "Overzicht"                            |
| **Verwacht**  | De "Overzicht" navigatielink is gemarkeerd als actief               |
| **Status**    | ✅ Geslaagd                                                         |

---

### 4.7 TC-FE-07: Live Datum/Tijd weergave

| Attribuut     | Waarde                                                          |
|---------------|-----------------------------------------------------------------|
| **ID**        | TC-FE-07                                                        |
| **Stappen**   | Open een pagina en wacht 2 seconden                            |
| **Verwacht**  | De datum/tijd in de footer update elke seconde                 |
| **Status**    | ✅ Geslaagd                                                     |

---

### 4.8 TC-FE-08: Responsiviteit op mobiel

| Attribuut     | Waarde                                                                        |
|---------------|-------------------------------------------------------------------------------|
| **ID**        | TC-FE-08                                                                      |
| **Stappen**   | Open de applicatie op een smartphone (of gebruik browser DevTools mobile view)|
| **Verwacht**  | Navigatie, kaarten en tabel zijn leesbaar zonder horizontaal scrollen        |
| **Status**    | ✅ Geslaagd (Chrome DevTools mobile emulatie)                                 |

---

## 5. Integratietests

### 5.1 TC-INT-01: Frontend-Backend Verbinding (productie)

| Attribuut     | Waarde                                                              |
|---------------|---------------------------------------------------------------------|
| **ID**        | TC-INT-01                                                           |
| **Beschrijving** | Verifieer dat de React-frontend op Netlify de Heroku-backend bereikt |
| **Stappen**   | Open `https://sparkling-kleicha-32eb8d.netlify.app/` in browser   |
| **Verwacht**  | Homepagina laadt 8 schilderijen — data komt van Heroku              |
| **Verifieer** | Browser DevTools → Network → XHR-aanroepen naar `*.herokuapp.com`  |
| **Status**    | ✅ Geslaagd                                                         |

---

### 5.2 TC-INT-02: Afbeeldingen bereikbaar na upload

| Attribuut     | Waarde                                                                                 |
|---------------|----------------------------------------------------------------------------------------|
| **ID**        | TC-INT-02                                                                              |
| **Stappen**   | 1. Maak schilderij aan met afbeelding via beheerpagina <br> 2. Noteer `image`-pad in response <br> 3. Open afbeeldings-URL direct in browser |
| **Verwacht**  | Afbeelding is bereikbaar via `https://[heroku-url]/assets/img/painting-*.jpg`         |
| **Status**    | ✅ Geslaagd                                                                            |

---

### 5.3 TC-INT-03: CORS werkt correct

| Attribuut     | Waarde                                                                |
|---------------|-----------------------------------------------------------------------|
| **ID**        | TC-INT-03                                                             |
| **Beschrijving** | Frontend op andere origin kan de backend aanroepen              |
| **Verifieer** | Browser DevTools → Console — geen CORS-foutmeldingen bij API-aanroepen |
| **Status**    | ✅ Geslaagd                                                           |

---

### 5.4 TC-INT-04: Database Persistentie na Heroku Restart

| Attribuut     | Waarde                                                                     |
|---------------|----------------------------------------------------------------------------|
| **ID**        | TC-INT-04                                                                  |
| **Stappen**   | 1. Voeg schilderij toe <br> 2. Herstart Heroku dyno <br> 3. Haal schilderijen op |
| **Verwacht**  | Toegevoegd schilderij is nog steeds aanwezig                              |
| **Waarom**    | Verifieert dat data in PostgreSQL (persistent) staat, niet in geheugen    |
| **Status**    | ✅ Geslaagd                                                                |

---

## 6. Edge Case Testcases

### 6.1 TC-EDGE-01: Schilderij aanmaken zonder ranking

| Attribuut | Waarde                                                         |
|-----------|----------------------------------------------------------------|
| **ID**    | TC-EDGE-01                                                     |
| **Body**  | `title=Test, artist=Test, description=...` (geen ranking)     |
| **Verwacht** | HTTP 201, `ranking: null`                                 |
| **Status** | ✅ Geslaagd                                                   |

---

### 6.2 TC-EDGE-02: DELETE op initieel schilderij (afbeelding behouden)

| Attribuut | Waarde                                                                        |
|-----------|-------------------------------------------------------------------------------|
| **ID**    | TC-EDGE-02                                                                    |
| **Stappen** | DELETE Mona Lisa (als dat al mogelijk is), dan reset dataset              |
| **Verwacht** | Afbeelding `The_Mona_Lisa.jpg` in `/initials/` is nog aanwezig op server |
| **Waarom** | Initials-afbeeldingen mogen nooit worden verwijderd                         |
| **Status** | ✅ Geslaagd (code verifieert `/initials/` pad)                              |

---

### 6.3 TC-EDGE-03: Lege string als ranking

| Attribuut | Waarde                                                          |
|-----------|-----------------------------------------------------------------|
| **ID**    | TC-EDGE-03                                                      |
| **Body**  | `ranking=` (lege waarde)                                       |
| **Verwacht** | HTTP 201, geen ranking-shift uitgevoerd (NaN check)        |
| **Code**  | `const newRanking = parseInt(ranking, 10); if (!isNaN(...))` |
| **Status** | ✅ Geslaagd                                                    |

---

### 6.4 TC-EDGE-04: Gelijktijdige ranking-conflicten

| Attribuut | Waarde                                                                         |
|-----------|--------------------------------------------------------------------------------|
| **ID**    | TC-EDGE-04                                                                     |
| **Beschrijving** | Twee schilderijen met dezelfde ranking kunnen tegelijk voorkomen (bij gelijktijdige POST-aanroepen) |
| **Huidige status** | Niet volledig getest — aanbevolen bij uitbreiding met concurrent gebruik |
| **Maatregel** | Database-transacties toevoegen rond de ranking-shift operaties           |
| **Status** | ⚠️ Gepland                                                                    |

---

## 7. Geautomatiseerde Tests (toekomstig)

### 7.1 Aanbevolen Testframeworks

| Framework    | Gebruik                                          |
|--------------|--------------------------------------------------|
| **Jest**     | Unit en integratietests voor de backend          |
| **Supertest**| HTTP-aanroepen testen in combinatie met Jest     |
| **Vitest**   | Unit tests voor React-componenten               |
| **Playwright** of **Cypress** | End-to-end browsertests         |

### 7.2 Voorbeeldtest (Jest + Supertest)

```javascript
// backend/tests/paintings.test.js
const request = require('supertest');
const app = require('../server'); // Express app export nodig

describe('GET /api/paintings', () => {
  it('geeft HTTP 200 terug met een array', async () => {
    const res = await request(app).get('/api/paintings');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('sorteert op ranking oplopend', async () => {
    const res = await request(app).get('/api/paintings');
    const rankings = res.body.map(p => parseInt(p.ranking));
    const sorted = [...rankings].sort((a, b) => a - b);
    expect(rankings).toEqual(sorted);
  });
});

describe('GET /api/paintings/:id', () => {
  it('geeft HTTP 400 bij ongeldig UUID', async () => {
    const res = await request(app).get('/api/paintings/niet-een-uuid');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid UUID format');
  });

  it('geeft HTTP 404 bij niet-bestaand UUID', async () => {
    const res = await request(app).get('/api/paintings/00000000-0000-1000-8000-000000000000');
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/paintings', () => {
  it('maakt een nieuw schilderij aan en geeft HTTP 201', async () => {
    const res = await request(app)
      .post('/api/paintings')
      .field('title', 'Test Schilderij')
      .field('artist', 'Test Kunstenaar')
      .field('description', 'Test beschrijving');
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Schilderij');
    expect(res.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    // Cleanup
    await request(app).delete(`/api/paintings/${res.body.id}`);
  });
});
```

### 7.3 CI/CD Integratie Testscript (toekomstig)

```yaml
# Toevoegen aan deploy-backend.yml
- name: Run Tests
  working-directory: backend
  run: npm test
```

---

## 8. Testsamenvatting

| Testcategorie      | Totaal | Geslaagd | Mislukt | Gepland |
|--------------------|--------|----------|---------|---------|
| Backend API        | 11     | 11       | 0       | 0       |
| Frontend UI        | 8      | 8        | 0       | 0       |
| Integratie         | 4      | 3        | 0       | 1       |
| Edge Cases         | 4      | 3        | 0       | 1       |
| **Totaal**         | **27** | **25**   | **0**   | **2**   |

**Testdekking:** Alle kritieke CRUD-functionaliteit is handmatig getest en geslaagd. Geautomatiseerde tests zijn gepland als volgende stap.
