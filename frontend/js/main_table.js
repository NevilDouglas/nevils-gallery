// frontend/js/main_table.js
// JavaScript voor de tabel pagina (main_table.html) van de vanilla JS frontend.
// Laadt alle schilderijen en rendert ze in een interactieve tabel met:
// - Sortering per kolom (klik op de kolomkop)
// - Filtering per kolom via zoekinvoervelden
// - Paginering met instelbaar aantal rijen per pagina

import { fetchPaintings, API_BASE_URL } from './api.js';
import updateDateTime from './updateDateTime.js';

// DOM-elementen ophalen
const tableHeaders = document.getElementById("tableHeaders");
const searchInputsRow = document.getElementById("searchInputs");
const tableBody = document.getElementById("tableBody");
const pagination = document.getElementById("pagination");
const paginationBottom = document.getElementById("paginationBottom");
const maxRowsInput = document.getElementById("maxRowsPerPageInput");
const clearAllBtn = document.getElementById("clearAll");
const feedback = document.getElementById("feedback");

// Toestandsvariabelen
let paintingsData = [];           // Alle geladen schilderijen
let activePage = 1;               // Huidige paginanummer
let filters = {};                 // Actieve filters per kolomsleutel
let sort = { order: "asc", orderBy: "id" }; // Huidige sorteerstatus
let maxRowsPerPage = 5;           // Maximum aantal rijen per pagina

// Kolomdefinities: accessor = objectsleutel, label = weergavenaam in de tabelkop
const columns = [
  { accessor: "id", label: "ID" },
  { accessor: "image", label: "Image" },
  { accessor: "title", label: "Title" },
  { accessor: "artist", label: "Artist" },
  { accessor: "ranking", label: "Ranking" },
  { accessor: "description", label: "Description" },
];

/**
 * Toont een statusbericht in het feedbackelement dat na 5 seconden vervaagt.
 * @param {string} message - Het te tonen bericht
 * @param {string} type - CSS-klasse voor de stijl ('success' of 'error')
 */
function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = type;
  feedback.style.opacity = '1';
  setTimeout(() => {
    feedback.style.opacity = '0';
  }, 5000);
}

/**
 * Rendert de kolomkoppen met een sorteerknopje per kolom.
 * De knoppen roepen window.handleSort aan via een inline onclick.
 */
function renderTableHeaders() {
  tableHeaders.innerHTML = "";
  columns.forEach(col => {
    const th = document.createElement("th");
    th.innerHTML = `${col.label} <button onclick="handleSort('${col.accessor}')">↕️</button>`;
    tableHeaders.appendChild(th);
  });
}

/**
 * Rendert de filterinvoervelden onder de kolomkoppen.
 * De afbeeldingskolom krijgt geen filter (niet zinvol voor URL-paden).
 */
function renderSearchInputs() {
  searchInputsRow.innerHTML = "";
  columns.forEach(col => {
    const td = document.createElement("td");
    if (col.accessor === 'image') {
      searchInputsRow.appendChild(td); // Lege cel voor de afbeeldingskolom
      return;
    }
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search " + col.label;
    input.dataset.accessor = col.accessor;
    input.addEventListener("input", function (event) {
      const value = event.target.value.trim().toLowerCase();
      // Voeg filter toe of verwijder het als de invoer leeg is
      if (value) {
        filters[col.accessor] = value;
      } else {
        delete filters[col.accessor];
      }
      activePage = 1; // Terug naar pagina 1 bij elke filterwijziging
      renderTable();
    });
    td.appendChild(input);
    searchInputsRow.appendChild(td);
  });
}

/**
 * Filtert, sorteert en pagineert de schilderijdata en rendert de tabelrijen.
 * Wordt aangeroepen bij elke statuswijziging (filter, sortering, paginering).
 */
function renderTable() {
  tableBody.innerHTML = "";

  // Stap 1: Filter de rijen op basis van alle actieve filters
  const filteredRows = paintingsData.filter(row =>
    Object.keys(filters).every(key =>
      (row[key] ?? '').toString().toLowerCase().includes(filters[key])
    )
  );

  // Stap 2: Sorteer de gefilterde rijen
  const sortedRows = [...filteredRows].sort((a, b) => {
    const aVal = a[sort.orderBy];
    const bVal = b[sort.orderBy];
    // Numerieke sortering voor ranking, alfabetisch voor de rest
    if (sort.orderBy === 'ranking') {
      return sort.order === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
    }
    if (String(aVal) < String(bVal)) return sort.order === 'asc' ? -1 : 1;
    if (String(aVal) > String(bVal)) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });

  // Stap 3: Bereken paginering en snijd de juiste rijen eruit
  const totalPages = Math.ceil(sortedRows.length / maxRowsPerPage) || 1;
  const paginatedRows = sortedRows.slice((activePage - 1) * maxRowsPerPage, activePage * maxRowsPerPage);

  // Stap 4: Render de tabelrijen
  paginatedRows.forEach(row => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      if (col.accessor === "image") {
        // Afbeeldingskolom: toon thumbnail met fallback naar Crown.ico
        if (row.image) {
          const img = document.createElement("img");
          img.className = 'imageStyle';
          img.src = `${API_BASE_URL}${row.image}`;
          img.alt = row.title || 'Painting image';
          img.onerror = () => { img.src = './public/Crown.ico'; img.alt = 'Image not found'; };
          td.appendChild(img);
        }
      } else {
        // Tekstkolom: toon de waarde of een lege string als fallback
        td.textContent = row[col.accessor] ?? '';
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  // Stap 5: Render de pagineringscontroles
  renderPagination(totalPages, filteredRows.length);
}

/**
 * Rendert de paginatieknoppen (eerste, vorige, volgende, laatste) en de rijindicator.
 * Wordt zowel boven als onder de tabel gerenderd.
 * @param {number} totalPages - Totaal aantal pagina's
 * @param {number} totalRows - Totaal aantal gefilterde rijen
 */
function renderPagination(totalPages, totalRows) {
  const startIndex = totalRows === 0 ? 0 : (activePage - 1) * maxRowsPerPage + 1;
  const endIndex = Math.min(activePage * maxRowsPerPage, totalRows);
  const paginationHTML = `
    <button ${activePage === 1 ? "disabled" : ""} onclick="changePage(1)">⏮️ First</button>
    <button ${activePage === 1 ? "disabled" : ""} onclick="changePage(${activePage - 1})">⬅️ Previous</button>
    <button ${activePage === totalPages || totalPages === 0 ? "disabled" : ""} onclick="changePage(${activePage + 1})">Next ➡️</button>
    <button ${activePage === totalPages || totalPages === 0 ? "disabled" : ""} onclick="changePage(${totalPages})">Last ⏭️</button>
    <p>Page ${activePage} of ${totalPages} | Rows ${startIndex} - ${endIndex} of ${totalRows}</p>
  `;
  pagination.innerHTML = paginationHTML;
  paginationBottom.innerHTML = paginationHTML;
}

/**
 * Navigeert naar een nieuwe pagina als die geldig is en herrendert de tabel.
 * Beschikbaar als globale functie vanwege gebruik in inline onclick-handlers.
 * @param {number} newPage - Het gewenste paginanummer
 */
window.changePage = function (newPage) {
  // Herbereken het totale aantal pagina's op basis van de huidige filters
  const totalPages = Math.ceil(paintingsData.filter(row =>
    Object.keys(filters).every(key =>
      (row[key] ?? '').toString().toLowerCase().includes(filters[key])
    )
  ).length / maxRowsPerPage) || 1;

  if (newPage >= 1 && newPage <= totalPages) {
    activePage = newPage;
    renderTable();
  }
};

/**
 * Wisselt de sorteervolgorde voor een kolom en herrendert de tabel.
 * Beschikbaar als globale functie vanwege gebruik in inline onclick-handlers.
 * @param {string} accessor - De kolomsleutel om op te sorteren
 */
window.handleSort = function (accessor) {
  sort = {
    order: sort.order === "asc" && sort.orderBy === accessor ? "desc" : "asc",
    orderBy: accessor,
  };
  renderTable();
};

// Wis alle filters, sortering en zoekteksten en herrendert de tabel
clearAllBtn.addEventListener("click", () => {
  filters = {};
  activePage = 1;
  sort = { order: "asc", orderBy: "id" };
  document.querySelectorAll("#searchInputs input").forEach(input => input.value = "");
  renderTable();
});

// Initialisatie na het laden van de DOM: laad schilderijen en bouw de tabel op
document.addEventListener("DOMContentLoaded", async () => {
  try {
    paintingsData = await fetchPaintings();
    maxRowsInput.max = paintingsData.length; // Stel het maximum in op het totale aantal
    renderTableHeaders();
    renderSearchInputs();
    renderTable();
    showFeedback('Schilderijen succesvol geladen.', 'success');
  } catch (error) {
    showFeedback('Fout bij laden van schilderijen.', 'error');
    console.error(error);
  }
});

// Pas het aantal rijen per pagina aan bij wijziging van het invoerveld
maxRowsInput.addEventListener("change", function () {
  const newMax = parseInt(this.value, 10);
  if (newMax > 0) {
    maxRowsPerPage = newMax;
    activePage = 1; // Terug naar pagina 1 bij wijziging
    renderTable();
  }
});
