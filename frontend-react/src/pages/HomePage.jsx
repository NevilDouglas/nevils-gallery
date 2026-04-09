// frontend-react/src/pages/HomePage.jsx
// Startpagina van de galerij.
// Toont een welkomstboodschap en een preview-raster van de eerste 8 schilderijen.
// De body-klasse 'index' wordt ingesteld voor paginaspecifieke CSS-stijlen.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPaintings, API_BASE_URL } from '../api/paintings';

export default function HomePage() {
  // De eerste 8 schilderijen voor de previewsectie
  const [previews, setPreviews] = useState([]);
  // Foutindicator als het laden mislukt
  const [error, setError] = useState(false);

  // Stel de body-klasse in voor paginaspecifieke CSS-achtergrond
  useEffect(() => {
    document.body.className = 'index';
    return () => { document.body.className = ''; }; // Herstel bij verlaten van de pagina
  }, []);

  // Laad de schilderijen bij het mounten van de component
  useEffect(() => {
    fetchPaintings()
      .then(data => setPreviews(data.slice(0, 8))) // Toon alleen de eerste 8
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <main className="content">
        <h1>👑 Welcome to Nevil's Final Gallery 👑</h1>
        <p>
          This is the home page of Nevil's last and final Gallery. <br />
          We have the most beautiful and famous paintings in the world, all in one place! <br />
          Feel free to explore the gallery and discover the masterpieces that await you. <br /><br />

          You can visit the <Link to="/main-table">Main Table</Link> to see all the paintings in detail. <br />
          If you are an artist or a painting enthusiast, check out the <Link to="/maintenance">Maintenance</Link> page to
          add or update paintings. <br /><br />

          For more information about the gallery, visit the <Link to="/about">About</Link> page. <br />
          We hope you enjoy your visit and find inspiration in the art we showcase. <br /><br />

          Enjoy your stay at Nevil's Final Gallery!
        </p>
      </main>

      {/* Previewsectie met thumbnail-kaartjes van de eerste 8 schilderijen */}
      <section>
        <h2>Een selectie van meesterwerken</h2>
        <div id="previewContainer" className="preview-grid">
          {error && <p className="error">Kon voorbeeldschilderijen niet laden.</p>}
          {previews.map(p => (
            <div key={p.id} className="preview-card">
              <img src={`${API_BASE_URL}${p.image}`} alt={p.title} className="preview-img" />
              <h3>{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
