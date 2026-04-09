import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../api/paintings';

export default function PaintingForm({ editingPainting, onSubmit, onCancel }) {
  const [fields, setFields] = useState({ title: '', artist: '', ranking: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const previewUrlRef = useRef(null);
  const titleRef = useRef(null);

  // Sync form fields when editingPainting changes
  useEffect(() => {
    if (editingPainting) {
      setFields({
        title: editingPainting.title || '',
        artist: editingPainting.artist || '',
        ranking: editingPainting.ranking || '',
        description: editingPainting.description || '',
      });
      setTimeout(() => titleRef.current?.focus(), 0);
    } else {
      setFields({ title: '', artist: '', ranking: '', description: '' });
    }
    // Clear file preview when switching paintings
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewSrc(null);
    setImageFile(null);
  }, [editingPainting]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewSrc(url);
      setImageFile(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(fields, imageFile);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewSrc(null);
    setImageFile(null);
  }

  function handleCancel() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewSrc(null);
    setImageFile(null);
    onCancel();
  }

  const editingImageSrc = previewSrc || (editingPainting?.image ? `${API_BASE_URL}${editingPainting.image}` : null);
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
          <input type="text" name="artist" placeholder="Artist" value={fields.artist} onChange={handleFieldChange} required /><br />
          <input type="number" name="ranking" placeholder="Ranking" value={fields.ranking} onChange={handleFieldChange} /><br />
          <textarea name="description" placeholder="Description" rows="4" value={fields.description} onChange={handleFieldChange} required /><br />
          <input type="file" accept="image/*" onChange={handleFileChange} /><br />
          <button type="submit" id="submitButton">
            {editingPainting ? 'Update Painting' : 'Add Painting'}
          </button>
          <button type="button" id="cancelEditButton" onClick={handleCancel}>
            {editingPainting ? 'Cancel Edit' : 'Cancel'}
          </button>
        </form>
      </div>

      {editingImageSrc && (
        <div id="editingPreviewContainer" style={{ display: 'block' }}>
          <img id="editingPreviewImage" src={editingImageSrc} alt="Currently Editing" />
          <p id="editingPreviewText">{editingPreviewText}</p>
        </div>
      )}
    </>
  );
}
