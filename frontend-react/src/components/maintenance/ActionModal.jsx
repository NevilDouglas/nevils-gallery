import { API_BASE_URL } from '../../api/paintings';

export default function ActionModal({ visible, data, actionText }) {
  if (!visible) return null;

  const isDelete = actionText === 'Deleted!';

  return (
    <div id="updatePreviewModal" style={{ display: 'flex' }}>
      <div className="update-preview-content">
        {isDelete ? (
          <span id="updateOverlayText" className="update-overlay-text feedback-text-only">
            🗑️<br />{data?.title}<br />{actionText}
          </span>
        ) : (
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
