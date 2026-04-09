// frontend/js/about.js
// JavaScript voor de about-pagina (about.html) van de vanilla JS frontend.
// Start de datum/tijd-update in de footer na het laden van de DOM.

import updateDateTime from "./updateDateTime.js";

document.addEventListener("DOMContentLoaded", function () {
  updateDateTime();
  setInterval(updateDateTime, 1000); // Elke seconde bijwerken
});
