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
  const [paintings, setPaintings] = useState([]);
  const [editingPainting, setEditingPainting] = useState(null);
  const [message, setMessage] = useState('');
  const [actionModal, setActionModal] = useState({ visible: false, data: null, actionText: '' });

  useEffect(() => {
    document.body.className = 'maintenance-page';
    return () => { document.body.className = ''; };
  }, []);

  useEffect(() => {
    loadPaintings();
  }, []);

  async function loadPaintings() {
    try {
      const data = await fetchPaintings();
      setPaintings(data);
    } catch {
      showFeedback('Fout bij laden van schilderijen.');
    }
  }

  function showFeedback(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  }

  function showActionModal(data, actionText) {
    return new Promise(resolve => {
      setActionModal({ visible: true, data, actionText });
      setTimeout(() => {
        setActionModal({ visible: false, data: null, actionText: '' });
        resolve();
      }, 2000);
    });
  }

  async function handleFormSubmit(fields, imageFile) {
    try {
      if (editingPainting) {
        const updated = await updatePainting(editingPainting.id, fields, imageFile);
        await showActionModal(updated, 'Updated!');
        await loadPaintings();
      } else {
        const created = await createPainting(fields, imageFile);
        await showActionModal(created, 'Added!');
        setPaintings(prev => [created, ...prev]);
      }
      setEditingPainting(null);
    } catch (err) {
      showFeedback(`Fout: ${err.message}`);
    }
  }

  async function handleEdit(id) {
    try {
      const painting = await fetchPainting(id);
      setEditingPainting(painting);
    } catch {
      showFeedback('Fout bij ophalen van schilderijdetails.');
    }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) return;
    try {
      await deletePainting(id);
      await showActionModal({ title }, 'Deleted!');
      if (editingPainting?.id === id) setEditingPainting(null);
      await loadPaintings();
    } catch (err) {
      showFeedback(`Fout bij verwijderen: ${err.message}`);
    }
  }

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

      <ActionModal
        visible={actionModal.visible}
        data={actionModal.data}
        actionText={actionModal.actionText}
      />
    </main>
  );
}
