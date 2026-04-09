// frontend-react/src/components/maintenance/PaintingCard.jsx
// Kaartcomponent voor één schilderij in de lijst op de Maintenance-pagina.
// Toont de afbeelding als achtergrond, de titel en kunstenaar, en knoppen voor bewerken/verwijderen.
// Apostrofs in de afbeeldings-URL worden gecodeerd om CSS-fouten te voorkomen.

import { API_BASE_URL } from '../../api/paintings';

/**
 * @param {Object} props
 * @param {Object} props.painting - Het schilderijobject
 * @param {Function} props.onEdit - Callback bij klikken op de Edit-knop
 * @param {Function} props.onDelete - Callback bij klikken op de Delete-knop
 */
export default function PaintingCard({ painting: p, onEdit, onDelete }) {
  // Codeer apostrofs in de URL zodat de CSS backgroundImage-waarde geldig blijft
  const imageUrl = p.image ? `${API_BASE_URL}${p.image}`.replace(/'/g, '%27') : null;

  return (
    <li className="painting-card" data-id={p.id}>
      {/* Afbeelding als CSS-achtergrond voor betere objectweergave */}
      <div
        className="image-container"
        style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}}
        aria-label={`An image of the painting '${p.title}'`}
        role="img"
      />
      {/* Tekst met titel en kunstenaar */}
      <div className="card-body">
        <strong>{p.title}</strong>
        <span>By {p.artist}</span>
      </div>
      {/* Actieknoppen */}
      <div className="card-actions">
        <button className="editBtn" onClick={onEdit}>Edit</button>
        <button className="deleteBtn" onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}
