import { API_BASE_URL } from '../../api/paintings';

export default function PaintingCard({ painting: p, onEdit, onDelete }) {
  const imageUrl = p.image ? `${API_BASE_URL}${p.image}`.replace(/'/g, '%27') : null;

  return (
    <li className="painting-card" data-id={p.id}>
      <div
        className="image-container"
        style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}}
        aria-label={`An image of the painting '${p.title}'`}
        role="img"
      />
      <div className="card-body">
        <strong>{p.title}</strong>
        <span>By {p.artist}</span>
      </div>
      <div className="card-actions">
        <button className="editBtn" onClick={onEdit}>Edit</button>
        <button className="deleteBtn" onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}
