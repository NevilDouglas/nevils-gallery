// frontend/js/maintenance.js

import {
  fetchPaintings,
  fetchPainting,
  createPainting,
  updatePainting,
  deletePainting,
  resetPaintings,
  API_BASE_URL
} from './api.js';
import updateDateTime from './updateDateTime.js';

const form = document.getElementById('paintingForm');
const feedbackEl = document.getElementById('message');
const paintingsUl = document.getElementById('paintingsUl');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEditButton');
const resetDatasetButton = document.getElementById('resetDatasetButton');
const fileInput = document.getElementById('imageFile');
const updatePreviewModal = document.getElementById('updatePreviewModal');
const updatedImagePreview = document.getElementById('updatedImagePreview');
const updateOverlayText = document.getElementById('updateOverlayText');
const editingPreviewContainer = document.getElementById('editingPreviewContainer');
const editingPreviewImage = document.getElementById('editingPreviewImage');
const editingPreviewText = document.getElementById('editingPreviewText');

let paintingsData = [];
let isEditing = false;
let editingId = null;
let currentPreviewUrl = null;

function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = type;
  feedbackEl.style.opacity = '1';
  setTimeout(() => { feedbackEl.style.opacity = '0'; }, 5000);
}

function showActionFeedbackModal(data, actionText) {
  return new Promise((resolve) => {
    const imageEl = updatedImagePreview;
    const textEl = updateOverlayText;
    if (actionText === 'Deleted!') {
      imageEl.style.display = 'none';
      textEl.classList.add('feedback-text-only');
      textEl.innerHTML = `🗑️<br>${data.title}<br>${actionText}`;
    } else {
      imageEl.style.display = 'block';
      textEl.classList.remove('feedback-text-only');
      textEl.textContent = actionText;
      imageEl.src = data.image ? `${API_BASE_URL}${data.image}` : '';
    }
    updatePreviewModal.style.display = 'flex';
    setTimeout(() => {
      updatePreviewModal.style.display = 'none';
      resolve();
    }, 2000);
  });
}

function enterEditMode(painting) {
  form.title.value = painting.title || '';
  form.artist.value = painting.artist || '';
  form.ranking.value = painting.ranking || '';
  form.description.value = painting.description || '';
  if (painting.image) {
    editingPreviewImage.src = `${API_BASE_URL}${painting.image}`;
    editingPreviewImage.alt = `Current image of ${painting.title}`;
    editingPreviewContainer.style.display = 'block';
  } else {
    editingPreviewContainer.style.display = 'none';
  }
  editingPreviewText.textContent = `Currently editing: ${painting.title}`;
  isEditing = true;
  editingId = painting.id;
  submitButton.textContent = 'Update Painting';
  cancelEditButton.textContent = 'Cancel Edit';
}

function exitEditMode() {
  isEditing = false;
  editingId = null;
  form.reset();
  submitButton.textContent = 'Add Painting';
  cancelEditButton.textContent = 'Cancel';
  editingPreviewContainer.style.display = 'none';
  editingPreviewImage.src = '';
  if (currentPreviewUrl) {
    URL.revokeObjectURL(currentPreviewUrl);
    currentPreviewUrl = null;
  }
}

function createPaintingCardElement(p) {
    const li = document.createElement('li');
    li.className = 'painting-card';
    li.dataset.id = p.id;
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    if (p.image) {
        let imageUrl = `${API_BASE_URL}${p.image}`;
        const safeImageUrl = imageUrl.replace(/'/g, "%27");
        imageContainer.style.backgroundImage = `url("${safeImageUrl}")`;
        imageContainer.setAttribute('aria-label', `An image of the painting '${p.title}'`);
        imageContainer.setAttribute('role', 'img');
    }
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const titleEl = document.createElement('strong');
    titleEl.textContent = p.title;
    const artistEl = document.createElement('span');
    artistEl.textContent = `By ${p.artist}`;
    cardBody.appendChild(titleEl);
    cardBody.appendChild(artistEl);
    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';
    const editBtn = document.createElement('button');
    editBtn.className = 'editBtn';
    editBtn.textContent = 'Edit';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.dataset.title = p.title;
    deleteBtn.textContent = 'Delete';
    cardActions.appendChild(editBtn);
    cardActions.appendChild(deleteBtn);
    li.appendChild(imageContainer);
    li.appendChild(cardBody);
    li.appendChild(cardActions);
    return li;
}

async function loadPaintings() {
  try {
    paintingsData = await fetchPaintings();
    renderPaintingList(paintingsData);
  } catch (error) {
    console.error('Fout bij ophalen schilderijen:', error);
    showFeedback('Fout bij laden van schilderijen.', 'error');
  }
}

function renderPaintingList(paintings) {
  paintingsUl.innerHTML = '';
  paintings.forEach(p => {
    const card = createPaintingCardElement(p);
    paintingsUl.appendChild(card);
  });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
    if (file && file.type.startsWith('image/')) {
        currentPreviewUrl = URL.createObjectURL(file);
        editingPreviewImage.src = currentPreviewUrl;
        editingPreviewContainer.style.display = 'block';
        editingPreviewText.textContent = `New image preview: ${file.name}`;
    }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const paintingData = {
    title: form.title.value,
    artist: form.artist.value,
    ranking: form.ranking.value,
    description: form.description.value,
  };
  const imageFile = fileInput.files[0];
  try {
    if (isEditing) {
      const updatedPainting = await updatePainting(editingId, paintingData, imageFile);
      await showActionFeedbackModal(updatedPainting, 'Updated!');
      const index = paintingsData.findIndex(p => p.id === editingId);
      if (index !== -1) paintingsData[index] = updatedPainting;
      const newCard = createPaintingCardElement(updatedPainting);
      const oldCard = paintingsUl.querySelector(`li[data-id="${editingId}"]`);
      if (oldCard) oldCard.replaceWith(newCard);
    } else {
      const newPainting = await createPainting(paintingData, imageFile);
      await showActionFeedbackModal(newPainting, 'Added!');
      paintingsData.unshift(newPainting);
      const newCard = createPaintingCardElement(newPainting);
      newCard.style.opacity = '0';
      paintingsUl.prepend(newCard);
      setTimeout(() => newCard.style.opacity = '1', 100);
    }
    exitEditMode();
  } catch (err) {
    console.error(err);
    showFeedback(`Fout: ${err.message}`, 'error');
  }
});

paintingsUl.addEventListener('click', async (event) => {
  const target = event.target;
  const card = target.closest('.painting-card');
  if (!card) return;
  const id = card.dataset.id;
  if (target.classList.contains('editBtn')) {
    try {
      const paintingToEdit = await fetchPainting(id);
      enterEditMode(paintingToEdit);
    } catch (error) {
      showFeedback('Fout bij ophalen van schilderijdetails.', 'error');
    }
  }
  if (target.classList.contains('deleteBtn')) {
    const title = target.dataset.title;
    if (confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) {
      try {
        await deletePainting(id);
        await showActionFeedbackModal({ title: title }, 'Deleted!');
        if (id === editingId) exitEditMode();
        await loadPaintings();
      } catch (error) {
        showFeedback(`Fout bij verwijderen: ${error.message}`, 'error');
      }
    }
  }
});

cancelEditButton.addEventListener('click', () => {
    if (isEditing) {
        exitEditMode();
    } else {
        form.reset();
        if (currentPreviewUrl) {
            URL.revokeObjectURL(currentPreviewUrl);
            currentPreviewUrl = null;
            editingPreviewContainer.style.display = 'none';
        }
    }
});

resetDatasetButton.addEventListener('click', async () => {
    if (confirm('Weet je zeker dat je alle toegevoegde schilderijen wilt verwijderen?')) {
        try {
            const result = await resetPaintings();
            showFeedback(result.message, 'success');
            exitEditMode();
            await loadPaintings();
        } catch (error) {
            showFeedback('Fout bij het resetten van de dataset.', 'error');
        }
    }
});

fileInput.addEventListener('change', handleFileSelect);

window.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  loadPaintings();
});
