import { useState, useEffect } from 'react';
import { fetchPaintings, API_BASE_URL } from '../api/paintings';

const columns = [
  { accessor: 'id', label: 'ID' },
  { accessor: 'image', label: 'Image' },
  { accessor: 'title', label: 'Title' },
  { accessor: 'artist', label: 'Artist' },
  { accessor: 'ranking', label: 'Ranking' },
  { accessor: 'description', label: 'Description' },
];

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
  const [paintings, setPaintings] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'ranking' });
  const [page, setPage] = useState(1);
  const [maxRows, setMaxRows] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    document.body.className = 'main-table-page';
    return () => { document.body.className = ''; };
  }, []);

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

  function handleSort(accessor) {
    setSort(prev => ({
      order: prev.orderBy === accessor && prev.order === 'asc' ? 'desc' : 'asc',
      orderBy: accessor,
    }));
  }

  function handleFilterChange(accessor, value) {
    setFilters(prev => {
      const updated = { ...prev };
      if (value.trim()) updated[accessor] = value.trim().toLowerCase();
      else delete updated[accessor];
      return updated;
    });
    setPage(1);
  }

  function clearAll() {
    setFilters({});
    setPage(1);
    setSort({ order: 'asc', orderBy: 'ranking' });
  }

  const filtered = paintings.filter(row =>
    Object.keys(filters).every(key =>
      (row[key] ?? '').toString().toLowerCase().includes(filters[key])
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sort.orderBy];
    const bVal = b[sort.orderBy];
    if (sort.orderBy === 'ranking') {
      return sort.order === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
    }
    if (String(aVal) < String(bVal)) return sort.order === 'asc' ? -1 : 1;
    if (String(aVal) > String(bVal)) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / maxRows) || 1;
  const paginated = sorted.slice((page - 1) * maxRows, page * maxRows);

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  }

  return (
    <main className="content">
      <h1>👑 Main Table 👑</h1>

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
          {paginated.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.accessor}>
                  {col.accessor === 'image' ? (
                    row.image ? (
                      <img
                        className="imageStyle"
                        src={`${API_BASE_URL}${row.image}`}
                        alt={row.title || 'Painting image'}
                        onError={e => { e.currentTarget.src = '/Crown.ico'; e.currentTarget.alt = 'Image not found'; }}
                      />
                    ) : null
                  ) : (
                    row[col.accessor] ?? ''
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div id="paginationBottom">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRows={sorted.length}
          maxRows={maxRows}
          onChangePage={handlePageChange}
        />
      </div>

      <button id="clearAll" onClick={clearAll}>Clear all</button>

      {feedback && <div id="feedback">{feedback}</div>}
    </main>
  );
}
