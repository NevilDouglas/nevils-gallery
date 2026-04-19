# Opdracht 1 — UX/UI Ontwerp: De 5 E's van Quesenbery

## Nevil's Gallery — Gebruikersgeoriënteerd Ontwerp

---

## 1. Inleiding

Dit document beschrijft hoe de frontend van Nevil's Gallery is ontworpen met aandacht voor gebruikersgerichte principes. Als leidraad zijn de **5 E's van Quesenbery** gebruikt: Effective, Efficient, Engaging, Error Tolerant en Easy to Learn. Persona's vormen de basis van elke ontwerpkeuze — ze geven een concreet gezicht aan de eindgebruikers van de applicatie.

---

## 2. Persona's

### Persona 1 — Marieke de Kunstliefhebber

| Kenmerk        | Details                                                          |
|----------------|------------------------------------------------------------------|
| **Leeftijd**   | 38 jaar                                                          |
| **Beroep**     | Lerares beeldende kunst, middelbare school                       |
| **Technisch**  | Gemiddeld — gebruikt dagelijks internet en e-mail                |
| **Doel**       | De schilderijencollectie verkennen, achtergronden lezen          |
| **Frustratie** | Trage pagina's, onduidelijke navigatie, te veel klikken          |
| **Apparaat**   | Desktop op school, soms tablet thuis                             |
| **Citaat**     | *"Ik wil snel zien welk schilderij het beroemdst is en waarom."* |

---

### Persona 2 — David de Galerij-Beheerder

| Kenmerk        | Details                                                         |
|----------------|-----------------------------------------------------------------|
| **Leeftijd**   | 27 jaar                                                         |
| **Beroep**     | Stagiair digitaal erfgoed, beheert de online collectie          |
| **Technisch**  | Gevorderd — werkt dagelijks met CMS-systemen en databases       |
| **Doel**       | Schilderijen toevoegen, bijwerken, verwijderen en sorteren      |
| **Frustratie** | Formulieren zonder feedback, knoppen die niets doen, crashes    |
| **Apparaat**   | Desktop (Windows 11), Chrome                                    |
| **Citaat**     | *"Ik heb een betrouwbaar systeem nodig — geen verrassingen."*   |

---

### Persona 3 — Lars de Casual Bezoeker

| Kenmerk        | Details                                                       |
|----------------|---------------------------------------------------------------|
| **Leeftijd**   | 22 jaar                                                       |
| **Beroep**     | Student communicatie                                          |
| **Technisch**  | Basis — gebruikt voornamelijk social media en YouTube         |
| **Doel**       | Snel iets interessants vinden om te laten zien aan vrienden   |
| **Frustratie** | Verwarrende interfaces, te veel tekst, trage laadtijden       |
| **Apparaat**   | Smartphone (Android), ook laptop                              |
| **Citaat**     | *"Wauw, mooi plaatje — wat is het verhaal?"*                  |

---

## 3. De 5 E's van Quesenbery toegepast op Nevil's Gallery

### E1 — Effective (Doeltreffend)

> *Kan de gebruiker zijn doel bereiken?*

**Definitie:** Effectiveness meet of gebruikers hun taken daadwerkelijk kunnen voltooien — correct en volledig.

**Toepassing in de applicatie:**

- **Homepagina (`index.html` / `HomePage.jsx`):** De pagina toont direct de eerste 8 schilderijen op volgorde van ranking, zodat Marieke en Lars meteen de meest relevante werken zien zonder te zoeken.
- **Overzichtstabel (`main_table.html` / `MainTablePage.jsx`):** David kan alle schilderijen in één overzicht bekijken, gesorteerd op ranking (de API levert ze al gesorteerd: `order: [['ranking', 'ASC']]`). Hierdoor weet hij precies wat er in de collectie zit.
- **Beheerpagina (`maintenance.html` / `MaintenancePage.jsx`):** Bevat een volledig formulier voor aanmaken, bewerken en verwijderen. David kan zijn beheerstaak volledig uitvoeren zonder buiten de applicatie te hoeven gaan.
- **Reset-functie:** De knop "Reset naar origineel" herstelt de dataset als er fouten zijn gemaakt — David kan altijd terug naar een bekende stabiele staat.

**Koppeling met persona's:**
- Marieke: vindt de meest beroemde schilderijen direct op de homepagina (ranking 1–8 zichtbaar).
- David: kan elk CRUD-scenario uitvoeren via de beheerpagina.
- Lars: ziet direct visuele content zonder registratie of aanmeldprocedure.

---

### E2 — Efficient (Efficiënt)

> *Hoe snel kan de gebruiker zijn doel bereiken?*

**Definitie:** Efficiency richt zich op de snelheid en inspanning die nodig is om taken te voltooien.

**Toepassing in de applicatie:**

- **Sortering en filtering (`main_table.js` / `MainTablePage.jsx`):** De tabel ondersteunt sortering op alle kolommen (Title, Artist, Ranking) en per-kolom filtering. Marieke kan in twee klikken de tabel op kunstenaar filteren.
- **Paginering:** Grote datasets worden opgesplitst in pagina's, zodat er niet onnodig door honderden rijen hoeft te worden gescrold.
- **Centrale navigatiebalk:** Alle vier pagina's zijn altijd bereikbaar via de navbar. Geen diepe menustructuren.
- **Actieve pagina-markering (`nav-highlight.js` / `Nav.jsx`):** De huidige pagina is altijd gemarkeerd in de navigatie — de gebruiker weet altijd waar hij is.
- **Automatisch ranking-schuiven:** Wanneer David een nieuw schilderij toevoegt met een bestaande ranking, worden alle andere rankings automatisch bijgewerkt door de backend (`ranking-shift` logica in `painting.controller.js`). David hoeft niet handmatig alle rankings aan te passen.

**Koppeling met persona's:**
- David: voegt in minder dan 1 minuut een nieuw schilderij toe via het formulier op de beheerpagina.
- Marieke: vindt schilderijen van een specifieke kunstenaar via de filterkolom in de tabel.
- Lars: ziet in één oogopslag de top 8 schilderijen op de homepagina.

---

### E3 — Engaging (Aantrekkelijk)

> *Is de interface prettig en motiverend om te gebruiken?*

**Definitie:** Engaging gaat over de subjectieve beleving — voelt het aangenaam, motiveert de interface om door te gaan?

**Toepassing in de applicatie:**

- **Kaartlayout op de homepagina:** Schilderijen worden weergegeven als visuele kaarten met afbeelding, titel en kunstenaar — niet als droge tabel. Dit spreekt Lars aan en houdt Marieke gemotiveerd om door te klikken.
- **Live datum en tijdweergave (`updateDateTime.js` / `useDateTime.js`):** De footer toont de actuele datum en tijd. Een kleine maar effectieve aanraking die de pagina "levend" laat aanvoelen.
- **Consistente stijl (`styles.css`):** Consistente kleuren, fonts en hover-effecten op knoppen en kaarten geven de applicatie een professionele uitstraling.
- **Favicon (Crown.ico):** Een herkenbaar icoon in het browsertabblad vergroot de brand identity.
- **Beschrijvingsteksten:** Elk schilderij heeft een rijke beschrijving (tot 250+ woorden) die verhaalvertelling combineert met feitelijke informatie — aantrekkelijk voor Marieke en Lars.
- **React SPA-navigatie:** De React-frontend navigeert zonder paginaherlaad, wat zorgt voor een vloeiende, app-achtige beleving.

**Koppeling met persona's:**
- Lars: de visuele homepagina met grote afbeeldingen trekt zijn aandacht.
- Marieke: de beschrijvingsteksten bij elk schilderij geven verdieping en context.
- David: de duidelijke kaartweergave op de beheerpagina geeft overzicht over de collectie.

---

### E4 — Error Tolerant (Foutbestendig)

> *Hoe goed gaat de interface om met fouten van de gebruiker?*

**Definitie:** Error Tolerance betekent dat de interface fouten voorkomt, ze detecteert, en gebruikers helpt te herstellen.

**Toepassing in de applicatie:**

- **JWT-authenticatie voor de beheerpagina (`LoginPage.jsx`):** De beheerpagina (`/maintenance`) is beveiligd achter een loginpagina. Bezoekers zonder geldig JWT-token worden automatisch doorgestuurd naar de loginpagina. Dit voorkomt dat onbevoegden per ongeluk (of opzettelijk) de collectie kunnen wijzigen.
- **Bevestigingsmodal bij verwijderen (`ActionModal.jsx`):** Wanneer David op "Delete" klikt, verschijnt er een bevestigingspopup. Accidenteel verwijderen is daarmee vrijwel onmogelijk.
- **UUID-validatie in de backend (`validateUUID` middleware):** Als een ongeldig ID wordt meegegeven in een API-aanroep, geeft de server direct HTTP 400 terug met een duidelijke foutmelding (`{ error: 'Invalid UUID format' }`). Dit voorkomt dat ongeldige data de database bereikt.
- **HTTP 404 bij niet-gevonden schilderij:** Als een schilderij niet bestaat, geeft de API een 404-foutcode terug — nooit een lege response of crash.
- **Reset-functie (beveiligd):** Als David per ongeluk meerdere schilderijen verwijdert of incorrect bewerkt, kan hij de volledige collectie herstellen via de reset-knop (`POST /api/paintings/reset`). Dit endpoint vereist ook een JWT-token — willekeurige bezoekers kunnen de dataset niet resetten.
- **Beschermde initiële afbeeldingen:** Afbeeldingen uit de `/initials/` map worden nooit verwijderd, zelfs als het bijbehorende schilderij wordt verwijderd. Dit voorkomt dat de originele dataset onherstelbaar beschadigd raakt.
- **Formuliervalidatie:** Het formulier op de beheerpagina vereist verplichte velden vóór indiening, zodat incomplete data niet de backend bereikt.

**Koppeling met persona's:**
- David: de bevestigingsmodal geeft hem zekerheid bij destructieve acties; de loginvereiste beschermt hem tegen onbedoeld gebruik door anderen.
- Marieke en Lars: zij kunnen de applicatie niet per ongeluk "kapot" maken — ze hebben alleen leesrechten en geen toegang tot de beheerpagina zonder login.

---

### E5 — Easy to Learn (Makkelijk te leren)

> *Hoe snel begrijpt een nieuwe gebruiker de interface?*

**Definitie:** Easy to Learn meet hoe snel nieuwe gebruikers de interface doorhebben, zonder uitgebreide handleiding.

**Toepassing in de applicatie:**

- **Vertrouwde navigatiestructuur:** De applicatie gebruikt een horizontale navbar bovenaan met duidelijke, beschrijvende paginanamen (Home, Main Table, Maintenance, About). Dit is een conventioneel patroon dat gebruikers al kennen.
- **Beschrijvende knoppen:** Knoppen zoals "Add", "Edit" en "Delete" zijn voorzien van duidelijke tekst — geen cryptische iconen zonder label.
- **Consistente paginalayout:** Elke pagina volgt dezelfde basisstructuur: navbar bovenaan, inhoud in het midden, footer onderaan. Marieke en Lars hoeven dit maar één keer te leren.
- **Tabelheaders als sorteerknop:** In de overzichtstabel zijn de kolomkoppen aanklikbaar voor sortering — een patroon dat gebruikers herkennen van spreadsheets en e-mailclients.
- **Inline feedbackberichten:** Na een succesvolle aanmaak, bewerking of verwijdering geeft de frontend directe visuele feedback (bijv. het kaartje verdwijnt of verschijnt).
- **Over-pagina (`about.html`):** Bevat uitleg over de applicatie, de collectie en het doel. Nieuwe gebruikers zoals Lars kunnen hier de context van de applicatie snel begrijpen.

**Koppeling met persona's:**
- Lars: begrijpt de navigatie direct zonder instructie — alles is herkenbaar en intuïtief.
- Marieke: kan de sorteerfunctie in de tabel zonder uitleg ontdekken.
- David: het formulier volgt standaard web-conventies (labels boven velden, knop onderaan).

---

## 4. Samenvatting

| E-principe      | Sleutelkeuze in de applicatie                                       | Primaire persona |
|-----------------|----------------------------------------------------------------------|-----------------|
| Effective       | Homepagina toont top-8 direct; CRUD volledig via beheerpagina       | Marieke, David  |
| Efficient       | Sortering, filtering, paginering; automatisch ranking-schuiven      | David, Marieke  |
| Engaging        | Kaartlayout, beschrijvingsteksten, live klok, consistente stijl     | Lars, Marieke   |
| Error Tolerant  | JWT-login vereist voor beheer, bevestigingsmodal, UUID-validatie, reset-knop | David           |
| Easy to Learn   | Vertrouwde navbar, beschrijvende knoppen, consistente layout        | Lars, Marieke   |

De 5 E's vormen samen een solide basis voor een gebruikersvriendelijke, toegankelijke en foutbestendige galerij-applicatie die tegemoet komt aan de behoeften van kunstliefhebbers, beheerders en casual bezoekers.
