// frontend-react/src/components/maintenance/PaintingForm.jsx
// Formuliercomponent voor het toevoegen en bewerken van schilderijen.
// In bewerkingsmodus worden de velden vooringevuld en een preview van de huidige afbeelding getoond.
// Bij een nieuwe afbeeldingselectie wordt een blob-URL aangemaakt voor de preview;
// deze wordt opgeruimd bij unmounten of bij het verlaten van de bewerkingsmodus.

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../api/paintings';

/**
 * @param {Object} props
 * @param {Object|null} props.editingPainting - Het schilderij in bewerkingsmodus, of null bij toevoegen
 * @param {Function} props.onSubmit - Callback bij indienen: (fields, imageFile) => void
 * @param {Function} props.onCancel - Callback bij annuleren
 */
export default function PaintingForm({ editingPainting, onSubmit, onCancel }) {
  const [fields, setFields] = useState({ title: '', artist: '', ranking: '', description: '', alt: '' });
  const [imageFile, setImageFile] = useState(null);       // Het geselecteerde afbeeldingsbestand
  const [previewSrc, setPreviewSrc] = useState(null);     // Blob-URL voor de nieuwe afbeeldingspreview
  const previewUrlRef = useRef(null);                     // Ref voor het bijhouden van de huidige blob-URL
  const titleRef = useRef(null);                          // Ref voor het automatisch focussen van het titelfeld

  // Vul de velden in en reset de preview bij het wisselen van schilderij
  useEffect(() => {
    if (editingPainting) {
      setFields({
        title: editingPainting.title || '',
        artist: editingPainting.artist || '',
        ranking: editingPainting.ranking || '',
        description: editingPainting.description || '',
        alt: editingPainting.alt || '',
      });
      // Focus het titelveld automatisch voor snelle invoer
      setTimeout(() => titleRef.current?.focus(), 0);
    } else {
      // Leeg alle velden in toevoegmodus
      setFields({ title: '', artist: '', ranking: '', description: '', alt: '' });
    }
    // Ruim de blob-URL op bij het wisselen van schilderij
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewSrc(null);
    setImageFile(null);
  }, [editingPainting]);

  // Ruim de blob-URL op bij het unmounten van het component om geheugenlekken te voorkomen
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  /**
   * Werkt een specifiek formulierveld bij in de state.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e
   */
  function handleFieldChange(e) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  }

  /**
   * Verwerkt de bestandsselectie voor een nieuwe afbeelding.
   * Maakt een blob-URL aan voor de preview en slaat het bestand op.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  function handleFileChange(e) {
    const file = e.target.files[0];
    // Ruim de vorige blob-URL op
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewSrc(url);
      setImageFile(file);
    }
  }

  /**
   * Verwerkt het indienen van het formulier.
   * Roept de onSubmit-callback aan met de velden en het optionele afbeeldingsbestand.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(fields, imageFile);
    // Ruim de blob-URL op na succesvol indienen
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewSrc(null);
    setImageFile(null);
  }

  /** Annuleert de bewerking en ruimt de preview op */
  function handleCancel() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewSrc(null);
    setImageFile(null);
    onCancel();
  }

  // Bepaal de te tonen afbeelding: nieuwe preview > huidige serverafbeelding > geen
  const editingImageSrc = previewSrc || (editingPainting?.image ? `${API_BASE_URL}${editingPainting.image}` : null);

  // Stel de bijschrifttekst in op basis van de previewstatus
  const editingPreviewText = previewSrc
    ? `New image preview: ${imageFile?.name}`
    : editingPainting
    ? `Currently editing: ${editingPainting.title} ⚙️`
    : null;

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input ref={titleRef} type="text" name="title" placeholder="Title" value={fields.title} onChange={handleFieldChange} required /><br />
          <input type="text" name="alt" placeholder="Alt description (optional — defaults to title)" value={fields.alt} onChange={handleFieldChange} /><br />
          <input type="text" name="artist" placeholder="Artist" value={fields.artist} onChange={handleFieldChange} required /><br />
          <input type="number" name="ranking" placeholder="Ranking" value={fields.ranking} onChange={handleFieldChange} /><br />
          <textarea name="description" placeholder="Description" rows="4" value={fields.description} onChange={handleFieldChange} required /><br />
          <input type="file" accept="image/*" onChange={handleFileChange} /><br />
          {/* Knoptekst wisselt op basis van de modus */}
          <button type="submit" id="submitButton">
            {editingPainting ? 'Update Painting' : 'Add Painting'}
          </button>
          <button type="button" id="cancelEditButton" onClick={handleCancel}>
            {editingPainting ? 'Cancel Edit' : 'Cancel'}
          </button>
        </form>
      </div>

      {/* Afbeeldingspreview: zichtbaar als er een schilderij bewerkt wordt of een nieuw bestand geselecteerd is */}
      {editingImageSrc && (
        <div id="editingPreviewContainer" style={{ display: 'block' }}>
          <img id="editingPreviewImage" src={editingImageSrc} alt="Currently Editing" />
          <p id="editingPreviewText">{editingPreviewText}</p>
        </div>
      )}
    </>
  );
}
