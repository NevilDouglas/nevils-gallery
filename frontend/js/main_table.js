// js/main_table.js

import { fetchPaintings, API_BASE_URL } from './api.js';
import updateDateTime from './updateDateTime.js';

const tableHeaders = document.getElementById("tableHeaders");
const searchInputsRow = document.getElementById("searchInputs");
const tableBody = document.getElementById("tableBody");
const pagination = document.getElementById("pagination");
const paginationBottom = document.getElementById("paginationBottom");
const maxRowsInput = document.getElementById("maxRowsPerPageInput");
const clearAllBtn = document.getElementById("clearAll");
const feedback = document.getElementById("feedback");

let paintingsData = [];
let activePage = 1;
let filters = {};
let sort = { order: "asc", orderBy: "id" };
let maxRowsPerPage = 5;

const columns = [
  { accessor: "id", label: "ID" },
  { accessor: "image", label: "Image" },
  { accessor: "title", label: "Title" },
  { accessor: "artist", label: "Artist" },
  { accessor: "ranking", label: "Ranking" },
  { accessor: "description", label: "Description" }
];

function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = type;
  feedback.style.opacity = '1';
  setTimeout(() => {
    feedback.style.opacity = '0';
  }, 5000);
}

function renderTableHeaders() {
  tableHeaders.innerHTML = "";
  columns.forEach(col => {
    const th = document.createElement("th");
    th.innerHTML = `${col.label} <button onclick="handleSort('${col.accessor}')">↕️</button>`;
    tableHeaders.appendChild(th);
  });
}

function renderSearchInputs() {
  searchInputsRow.innerHTML = "";
  columns.forEach(col => {
    const td = document.createElement("td");
    if (col.accessor === 'image') {
        searchInputsRow.appendChild(td);
        return;
    }
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search " + col.label;
    input.dataset.accessor = col.accessor;
    input.addEventListener("input", function (event) {
      const value = event.target.value.trim().toLowerCase();
      if (value) {
        filters[col.accessor] = value;
      } else {
        delete filters[col.accessor];
      }
      activePage = 1;
      renderTable();
    });
    td.appendChild(input);
    searchInputsRow.appendChild(td);
  });
}

function renderTable() {
  tableBody.innerHTML = "";
  const filteredRows = paintingsData.filter(row =>
    Object.keys(filters).every(key =>
      (row[key] ?? '').toString().toLowerCase().includes(filters[key])
    )
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    const aVal = a[sort.orderBy];
    const bVal = b[sort.orderBy];

    if (sort.orderBy === 'ranking') {
      return sort.order === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
    }

    if (String(aVal) < String(bVal)) return sort.order === 'asc' ? -1 : 1;
    if (String(aVal) > String(bVal)) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRows.length / maxRowsPerPage) || 1;
  const paginatedRows = sortedRows.slice((activePage - 1) * maxRowsPerPage, activePage * maxRowsPerPage);

  paginatedRows.forEach(row => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      if (col.accessor === "image") {
        if (row.image) {
          const img = document.createElement("img");
          img.className = 'imageStyle';
          img.src = `${API_BASE_URL}${row.image}`;
          img.alt = row.title || 'Painting image';
          img.onerror = () => { img.src = './public/Crown.ico'; img.alt = 'Image not found'; };
          td.appendChild(img);
        }
      } else {
        td.textContent = row[col.accessor] ?? '';
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  renderPagination(totalPages, filteredRows.length);
}

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

window.changePage = function (newPage) {
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

window.handleSort = function (accessor) {
  sort = {
    order: sort.order === "asc" && sort.orderBy === accessor ? "desc" : "asc",
    orderBy: accessor
  };
  renderTable();
};

clearAllBtn.addEventListener("click", () => {
  filters = {};
  activePage = 1;
  sort = { order: "asc", orderBy: "id" };
  document.querySelectorAll("#searchInputs input").forEach(input => input.value = "");
  renderTable();
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    paintingsData = await fetchPaintings();
    maxRowsInput.max = paintingsData.length;
    renderTableHeaders();
    renderSearchInputs();
    renderTable();
    showFeedback('Schilderijen succesvol geladen.', 'success');
  } catch (error) {
    showFeedback('Fout bij laden van schilderijen.', 'error');
    console.error(error);
  }
});

maxRowsInput.addEventListener("change", function () {
  const newMax = parseInt(this.value, 10);
  if (newMax > 0) {
    maxRowsPerPage = newMax;
    activePage = 1;
    renderTable();
  }
});
