// frontend-react/src/pages/MaintenancePage.jsx
// Beheerpagina voor de schilderijencollectie.
// Biedt volledige CRUD-functionaliteit: toevoegen, bewerken en verwijderen van schilderijen.
// Na elke actie wordt een ActionModal getoond als visuele bevestiging.

import { useState, useEffect } from 'react';
import {
  fetchPaintings,
  fetchPainting,
  createPainting,
  updatePainting,
  deletePainting,
  resetPaintings,
} from '../api/paintings';
import PaintingCard from '../components/maintenance/PaintingCard';
import PaintingForm from '../components/maintenance/PaintingForm';
import ActionModal from '../components/maintenance/ActionModal';

export default function MaintenancePage() {
  const [paintings, setPaintings] = useState([]);          // Volledige lijst van schilderijen
  const [editingPainting, setEditingPainting] = useState(null); // Het schilderij dat momenteel bewerkt wordt (null = toevoegmodus)
  const [message, setMessage] = useState('');              // Foutmelding of statusbericht
  const [actionModal, setActionModal] = useState({ visible: false, data: null, actionText: '' }); // Feedbackmodaal-toestand

  // Stel de body-klasse in voor paginaspecifieke CSS-stijlen
  useEffect(() => {
    document.body.className = 'maintenance-page';
    return () => { document.body.className = ''; };
  }, []);

  // Laad de schilderijen bij het eerste renderen van de pagina
  useEffect(() => {
    loadPaintings();
  }, []);

  /** Haalt alle schilderijen op van de API en slaat ze op in de state */
  async function loadPaintings() {
    try {
      const data = await fetchPaintings();
      setPaintings(data);
    } catch {
      showFeedback('Fout bij laden van schilderijen.');
    }
  }

  /**
   * Toont een foutmelding of statusbericht dat na 5 seconden automatisch verdwijnt.
   * @param {string} msg - Het te tonen bericht
   */
  function showFeedback(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  }

  /**
   * Toont het feedbackmodaal kort (2 seconden) na een CRUD-actie.
   * Geeft een Promise terug zodat de aanroepende code kan wachten tot het modaal gesloten is.
   * @param {Object} data - Schilderijdata voor het modaal
   * @param {string} actionText - Tekst die in het modaal getoond wordt
   * @returns {Promise<void>}
   */
  function showActionModal(data, actionText) {
    return new Promise(resolve => {
      setActionModal({ visible: true, data, actionText });
      setTimeout(() => {
        setActionModal({ visible: false, data: null, actionText: '' });
        resolve();
      }, 2000);
    });
  }

  /**
   * Verwerkt het indienen van het formulier.
   * In bewerkingsmodus wordt het schilderij bijgewerkt; anders wordt een nieuw schilderij aangemaakt.
   * @param {Object} fields - Formuliervelden (title, artist, ranking, description)
   * @param {File|null} imageFile - Optioneel afbeeldingsbestand
   */
  async function handleFormSubmit(fields, imageFile) {
    try {
      if (editingPainting) {
        // Bewerkingsmodus: bijwerken van bestaand schilderij
        const updated = await updatePainting(editingPainting.id, fields, imageFile);
        await showActionModal(updated, 'Updated!');
        await loadPaintings(); // Herlaad de lijst om rankingwijzigingen te verwerken
      } else {
        // Toevoegmodus: nieuw schilderij aanmaken
        const created = await createPainting(fields, imageFile);
        await showActionModal(created, 'Added!');
        setPaintings(prev => [created, ...prev]); // Voeg bovenaan de lijst toe
      }
      setEditingPainting(null); // Terug naar toevoegmodus
    } catch (err) {
      showFeedback(`Fout: ${err.message}`);
    }
  }

  /**
   * Zet het formulier in bewerkingsmodus voor het schilderij met het gegeven ID.
   * Haalt de meest actuele versie op via de API.
   * @param {string} id - UUID van het te bewerken schilderij
   */
  async function handleEdit(id) {
    try {
      const painting = await fetchPainting(id);
      setEditingPainting(painting);
    } catch {
      showFeedback('Fout bij ophalen van schilderijdetails.');
    }
  }

  /**
   * Verwijdert het schilderij na bevestiging via een confirm-dialoog.
   * Als het verwijderde schilderij momenteel bewerkt werd, wordt de bewerkingsmodus verlaten.
   * @param {string} id - UUID van het te verwijderen schilderij
   * @param {string} title - Titel voor de bevestigingsdialoog
   */
  async function handleDelete(id, title) {
    if (!confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) return;
    try {
      await deletePainting(id);
      await showActionModal({ title }, 'Deleted!');
      if (editingPainting?.id === id) setEditingPainting(null); // Verlaat bewerkingsmodus
      await loadPaintings();
    } catch (err) {
      showFeedback(`Fout bij verwijderen: ${err.message}`);
    }
  }

  /**
   * Reset de collectie naar de originele 20 schilderijen na bevestiging.
   * Sluit de bewerkingsmodus en herlaadt de lijst.
   */
  async function handleReset() {
    if (!confirm('Weet je zeker dat je alle toegevoegde schilderijen wilt verwijderen?')) return;
    try {
      const result = await resetPaintings();
      showFeedback(result.message);
      setEditingPainting(null);
      await loadPaintings();
    } catch {
      showFeedback('Fout bij het resetten van de dataset.');
    }
  }

  return (
    <main className="content">
      <h1>👑 Maintenance Page 👑</h1>

      <div className="maintenance-layout">
        {/* Linkerkolom: overzichtslijst van alle schilderijen als kaartjes */}
        <div className="maintenance-left-column">
          <div id="paintingsList">
            <h2><i>Currently in our collection:</i></h2>
            <ul id="paintingsUl">
              {paintings.map(p => (
                <PaintingCard
                  key={p.id}
                  painting={p}
                  onEdit={() => handleEdit(p.id)}
                  onDelete={() => handleDelete(p.id, p.title)}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Rechterkolom: formulier voor toevoegen/bewerken en resetknop */}
        <div className="maintenance-right-column">
          <PaintingForm
            editingPainting={editingPainting}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditingPainting(null)}
          />
          {message && <div id="message">{message}</div>}
          <button id="resetDatasetButton" onClick={handleReset}>⚠️ Reset Dataset ⚠️</button>
        </div>
      </div>

      {/* Feedbackmodaal dat kort verschijnt na een CRUD-actie */}
      <ActionModal
        visible={actionModal.visible}
        data={actionModal.data}
        actionText={actionModal.actionText}
      />
    </main>
  );
}
