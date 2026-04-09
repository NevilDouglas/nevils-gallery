// frontend-react/src/components/maintenance/ActionModal.jsx
// Modaal voor visuele feedback na een CRUD-actie (toevoegen, bijwerken, verwijderen).
// Bij verwijderen wordt alleen de titel en een prullenbak-icoon getoond.
// Bij toevoegen/bijwerken wordt de afbeelding van het schilderij getoond met een overlaytext.
// Het modaal wordt automatisch gesloten na 2 seconden (geregeld in de parent-component).

import { API_BASE_URL } from '../../api/paintings';

/**
 * @param {Object} props
 * @param {boolean} props.visible - Of het modaal zichtbaar is
 * @param {Object} props.data - Het schilderijobject (of object met alleen title bij verwijderen)
 * @param {string} props.actionText - De actietekst ('Added!', 'Updated!', 'Deleted!')
 */
export default function ActionModal({ visible, data, actionText }) {
  // Render niets als het modaal niet zichtbaar is
  if (!visible) return null;

  const isDelete = actionText === 'Deleted!';

  return (
    <div id="updatePreviewModal" style={{ display: 'flex' }}>
      <div className="update-preview-content">
        {isDelete ? (
          // Verwijderingsfeedback: geen afbeelding, alleen tekst
          <span id="updateOverlayText" className="update-overlay-text feedback-text-only">
            🗑️<br />{data?.title}<br />{actionText}
          </span>
        ) : (
          // Toevoeg-/bijwerkfeedback: afbeelding met overlaytext
          <>
            <img
              id="updatedImagePreview"
              src={data?.image ? `${API_BASE_URL}${data.image}` : ''}
              alt="Action feedback preview"
            />
            <span id="updateOverlayText" className="update-overlay-text">{actionText}</span>
          </>
        )}
      </div>
    </div>
  );
}
