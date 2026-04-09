// frontend-react/src/pages/MainTablePage.jsx
// Tabelpagina met een volledig overzicht van alle schilderijen.
// Ondersteunt sortering per kolom, filtering per kolom en paginering.
// De body-klasse 'main-table-page' wordt ingesteld voor paginaspecifieke CSS-stijlen.

import { useState, useEffect } from 'react';
import { fetchPaintings, API_BASE_URL } from '../api/paintings';

// Kolomdefinities: accessor is de sleutel in het schilderijobject, label is de weergavenaam
const columns = [
  { accessor: 'id', label: 'ID' },
  { accessor: 'image', label: 'Image' },
  { accessor: 'title', label: 'Title' },
  { accessor: 'artist', label: 'Artist' },
  { accessor: 'ranking', label: 'Ranking' },
  { accessor: 'description', label: 'Description' },
];

/**
 * Paginatiecomponent met knoppen voor eerste, vorige, volgende en laatste pagina.
 * Toont ook het aantal weergegeven rijen.
 * @param {Object} props
 * @param {number} props.page - Huidige pagina
 * @param {number} props.totalPages - Totaal aantal pagina's
 * @param {number} props.totalRows - Totaal aantal gefilterde rijen
 * @param {number} props.maxRows - Maximum aantal rijen per pagina
 * @param {Function} props.onChangePage - Callback bij paginawissel
 */
function Pagination({ page, totalPages, totalRows, maxRows, onChangePage }) {
  const startIndex = totalRows === 0 ? 0 : (page - 1) * maxRows + 1;
  const endIndex = Math.min(page * maxRows, totalRows);
  return (
    <div>
      <button disabled={page === 1} onClick={() => onChangePage(1)}>⏮️ First</button>
      <button disabled={page === 1} onClick={() => onChangePage(page - 1)}>⬅️ Previous</button>
      <button disabled={page >= totalPages} onClick={() => onChangePage(page + 1)}>Next ➡️</button>
      <button disabled={page >= totalPages} onClick={() => onChangePage(totalPages)}>Last ⏭️</button>
      <p>Page {page} of {totalPages} | Rows {startIndex} - {endIndex} of {totalRows}</p>
    </div>
  );
}

export default function MainTablePage() {
  const [paintings, setPaintings] = useState([]);            // Alle schilderijen uit de API
  const [filters, setFilters] = useState({});                // Actieve filterwaarden per kolom
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'ranking' }); // Huidige sorteerstatus
  const [page, setPage] = useState(1);                       // Huidige paginanummer
  const [maxRows, setMaxRows] = useState(5);                 // Maximum rijen per pagina
  const [feedback, setFeedback] = useState('');              // Statusbericht

  // Stel de body-klasse in voor paginaspecifieke achtergrondstijl
  useEffect(() => {
    document.body.className = 'main-table-page';
    return () => { document.body.className = ''; };
  }, []);

  // Laad alle schilderijen bij het mounten van de component
  useEffect(() => {
    fetchPaintings()
      .then(data => {
        setPaintings(data);
        setFeedback('Schilderijen succesvol geladen.');
        setTimeout(() => setFeedback(''), 5000);
      })
      .catch(() => {
        setFeedback('Fout bij laden van schilderijen.');
      });
  }, []);

  /**
   * Schakelt de sorteervolgorde voor een kolom.
   * Bij opnieuw klikken op dezelfde kolom wisselt de volgorde (asc ↔ desc).
   * @param {string} accessor - De kolomsleutel om op te sorteren
   */
  function handleSort(accessor) {
    setSort(prev => ({
      order: prev.orderBy === accessor && prev.order === 'asc' ? 'desc' : 'asc',
      orderBy: accessor,
    }));
  }

  /**
   * Werkt de filterwaarde bij voor een specifieke kolom en springt terug naar pagina 1.
   * @param {string} accessor - De kolomsleutel om op te filteren
   * @param {string} value - De filterwaarde (leeg = filter verwijderen)
   */
  function handleFilterChange(accessor, value) {
    setFilters(prev => {
      const updated = { ...prev };
      if (value.trim()) updated[accessor] = value.trim().toLowerCase();
      else delete updated[accessor]; // Verwijder lege filters
      return updated;
    });
    setPage(1); // Terug naar eerste pagina bij elke filterwijziging
  }

  /** Wist alle actieve filters en sortering en springt terug naar pagina 1 */
  function clearAll() {
    setFilters({});
    setPage(1);
    setSort({ order: 'asc', orderBy: 'ranking' });
  }

  // Filter de schilderijen op basis van alle actieve filterwaarden
  const filtered = paintings.filter(row =>
    Object.keys(filters).every(key =>
      (row[key] ?? '').toString().toLowerCase().includes(filters[key])
    )
  );

  // Sorteer de gefilterde rijen op de geselecteerde kolom
  const sorted = [...filtered].sort((a, b) => {
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

  // Bereken het totale aantal pagina's en de rijen voor de huidige pagina
  const totalPages = Math.ceil(sorted.length / maxRows) || 1;
  const paginated = sorted.slice((page - 1) * maxRows, page * maxRows);

  /**
   * Navigeert naar een nieuwe pagina als die geldig is.
   * @param {number} newPage - Het gewenste paginanummer
   */
  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  }

  return (
    <main className="content">
      <h1>👑 Main Table 👑</h1>

      {/* Invoer voor het maximum aantal rijen per pagina */}
      <form id="maxRowsPerPageForm">
        <label>
          Please enter preferred maximum number of records per page:{' '}
          <input
            type="number"
            id="maxRowsPerPageInput"
            value={maxRows}
            min="1"
            max={paintings.length || undefined}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              if (v > 0) { setMaxRows(v); setPage(1); }
            }}
          />
        </label>
      </form>

      {/* Paginering bovenaan de tabel */}
      <div id="pagination">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRows={sorted.length}
          maxRows={maxRows}
          onChangePage={handlePageChange}
        />
      </div>

      <table id="paintingsTable">
        <thead>
          {/* Kolomkoppen met sorteerknopjes */}
          <tr id="tableHeaders">
            {columns.map(col => {
              const isActive = sort.orderBy === col.accessor;
              return (
                <th key={col.accessor} className={isActive ? 'active-sort' : ''}>
                  <span className="col-label">{col.label}</span>{' '}
                  <button className="sort-btn" onClick={() => handleSort(col.accessor)}>
                    {isActive ? (sort.order === 'asc' ? '⬆️' : '⬇️') : '↕️'}
                  </button>
                </th>
              );
            })}
          </tr>
          {/* Filterinvoervelden per kolom (niet voor de afbeeldingskolom) */}
          <tr id="searchInputs">
            {columns.map(col => (
              <td key={col.accessor}>
                {col.accessor !== 'image' && (
                  <input
                    type="search"
                    placeholder={`Search ${col.label}`}
                    value={filters[col.accessor] || ''}
                    onChange={e => handleFilterChange(col.accessor, e.target.value)}
                  />
                )}
              </td>
            ))}
          </tr>
        </thead>
        <tbody id="tableBody">
          {/* Tabelrijen voor de gesorteerde en gepagineerde schilderijen */}
          {paginated.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.accessor}>
                  {col.accessor === 'image' ? (
                    // Afbeeldingskolom: toon een thumbnail met fallback naar Crown.ico
                    row.image ? (
                      <img
                        className="imageStyle"
                        src={`${API_BASE_URL}${row.image}`}
                        alt={row.title || 'Painting image'}
                        onError={e => { e.currentTarget.src = '/Crown.ico'; e.currentTarget.alt = 'Image not found'; }}
                      />
                    ) : null
                  ) : (
                    // Tekstkolom: toon de waarde of een lege string als fallback
                    row[col.accessor] ?? ''
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginering onderaan de tabel */}
      <div id="paginationBottom">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRows={sorted.length}
          maxRows={maxRows}
          onChangePage={handlePageChange}
        />
      </div>

      {/* Knop om alle filters en sortering te wissen */}
      <button id="clearAll" onClick={clearAll}>Clear all</button>

      {feedback && <div id="feedback">{feedback}</div>}
    </main>
  );
}
