// frontend/js/maintenance.js
// JavaScript voor de beheerpagina (maintenance.html) van de vanilla JS frontend.
// Biedt volledige CRUD-functionaliteit voor de schilderijencollectie:
// - Schilderijen laden en weergeven als kaartjes
// - Bewerken via een formulier met vooringevulde velden en afbeeldingspreview
// - Verwijderen met bevestigingsdialoog
// - Toevoegen van nieuwe schilderijen met optionele afbeeldingsupload
// - Feedbackmodaal na elke actie
// - Dataset resetten naar de originele 20 schilderijen

import {
  fetchPaintings,
  fetchPainting,
  createPainting,
  updatePainting,
  deletePainting,
  resetPaintings,
  API_BASE_URL,
} from './api.js';
import updateDateTime from './updateDateTime.js';

// DOM-elementen ophalen
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

// Toestandsvariabelen
let paintingsData = [];       // Gecachte lijst van alle schilderijen
let isEditing = false;        // Of de pagina in bewerkingsmodus is
let editingId = null;         // UUID van het schilderij dat bewerkt wordt
let currentPreviewUrl = null; // Huidige blob-URL voor de afbeeldingspreview

/**
 * Toont een statusbericht dat na 5 seconden vervaagt.
 * @param {string} message - Het te tonen bericht
 * @param {string} type - CSS-klasse ('success' of 'error')
 */
function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = type;
  feedbackEl.style.opacity = '1';
  setTimeout(() => { feedbackEl.style.opacity = '0'; }, 5000);
}

/**
 * Toont het feedbackmodaal kort (2 seconden) na een CRUD-actie.
 * Bij verwijderen wordt alleen de titel getoond; anders de afbeelding van het schilderij.
 * @param {Object} data - Schilderijdata (of object met alleen title)
 * @param {string} actionText - Te tonen actietekst ('Added!', 'Updated!', 'Deleted!')
 * @returns {Promise<void>}
 */
function showActionFeedbackModal(data, actionText) {
  return new Promise((resolve) => {
    if (actionText === 'Deleted!') {
      // Verwijderingsfeedback: verberg afbeelding, toon alleen tekst
      updatedImagePreview.style.display = 'none';
      updateOverlayText.classList.add('feedback-text-only');
      updateOverlayText.innerHTML = `🗑️<br>${data.title}<br>${actionText}`;
    } else {
      // Toevoeg-/bijwerkfeedback: toon afbeelding met overlaytext
      updatedImagePreview.style.display = 'block';
      updateOverlayText.classList.remove('feedback-text-only');
      updateOverlayText.textContent = actionText;
      updatedImagePreview.src = data.image ? `${API_BASE_URL}${data.image}` : '';
    }
    updatePreviewModal.style.display = 'flex';
    setTimeout(() => {
      updatePreviewModal.style.display = 'none';
      resolve();
    }, 2000);
  });
}

/**
 * Zet het formulier in bewerkingsmodus voor het opgegeven schilderij.
 * Vult alle velden in, toont de huidige afbeeldingspreview en past de knoppen aan.
 * @param {Object} painting - Het te bewerken schilderij
 */
function enterEditMode(painting) {
  form.title.value = painting.title || '';
  form.artist.value = painting.artist || '';
  form.ranking.value = painting.ranking || '';
  form.description.value = painting.description || '';

  // Toon de huidige afbeelding als preview (als die er is)
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

/**
 * Verlaat de bewerkingsmodus en reset het formulier naar de toevoegmodus.
 * Ruimt ook de afbeeldingspreview op en vrijgeeft de blob-URL.
 */
function exitEditMode() {
  isEditing = false;
  editingId = null;
  form.reset();
  submitButton.textContent = 'Add Painting';
  cancelEditButton.textContent = 'Cancel';
  editingPreviewContainer.style.display = 'none';
  editingPreviewImage.src = '';

  // Vrijgeef de blob-URL om geheugenlekken te voorkomen
  if (currentPreviewUrl) {
    URL.revokeObjectURL(currentPreviewUrl);
    currentPreviewUrl = null;
  }
}

/**
 * Bouwt een schilderijkaart-element (li) voor de lijst.
 * Gebruikt een CSS-achtergrondafbeelding voor betere schaal en positionering.
 * @param {Object} p - Het schilderijobject
 * @returns {HTMLLIElement} Het aangemaakte lijstelement
 */
function createPaintingCardElement(p) {
  const li = document.createElement('li');
  li.className = 'painting-card';
  li.dataset.id = p.id;

  // Afbeeldingscontainer met CSS backgroundImage
  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  if (p.image) {
    let imageUrl = `${API_BASE_URL}${p.image}`;
    // Codeer apostrofs om CSS-fouten te voorkomen
    const safeImageUrl = imageUrl.replace(/'/g, "%27");
    imageContainer.style.backgroundImage = `url("${safeImageUrl}")`;
    imageContainer.setAttribute('aria-label', `An image of the painting '${p.title}'`);
    imageContainer.setAttribute('role', 'img');
  }

  // Tekstinhoud van de kaart
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  const titleEl = document.createElement('strong');
  titleEl.textContent = p.title;
  const artistEl = document.createElement('span');
  artistEl.textContent = `By ${p.artist}`;
  cardBody.appendChild(titleEl);
  cardBody.appendChild(artistEl);

  // Actieknoppen
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

/**
 * Haalt alle schilderijen op van de API en rendert ze als kaartjes.
 */
async function loadPaintings() {
  try {
    paintingsData = await fetchPaintings();
    renderPaintingList(paintingsData);
  } catch (error) {
    console.error('Fout bij ophalen schilderijen:', error);
    showFeedback('Fout bij laden van schilderijen.', 'error');
  }
}

/**
 * Rendert de lijst van schilderijen als kaartjes in de ul.
 * @param {Array} paintings - Array van schilderijobjecten
 */
function renderPaintingList(paintings) {
  paintingsUl.innerHTML = '';
  paintings.forEach(p => {
    const card = createPaintingCardElement(p);
    paintingsUl.appendChild(card);
  });
}

/**
 * Verwerkt een nieuwe afbeeldingsselectie via het bestandsinvoerveld.
 * Maakt een blob-URL aan voor de preview en toont die in de preview-container.
 * @param {Event} event - Het change-event van het bestandsinvoerveld
 */
function handleFileSelect(event) {
  const file = event.target.files[0];
  // Vrijgeef de vorige blob-URL
  if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
  if (file && file.type.startsWith('image/')) {
    currentPreviewUrl = URL.createObjectURL(file);
    editingPreviewImage.src = currentPreviewUrl;
    editingPreviewContainer.style.display = 'block';
    editingPreviewText.textContent = `New image preview: ${file.name}`;
  }
}

// Verwerk het indienen van het formulier (toevoegen of bijwerken)
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
      // Bewerkingsmodus: bijwerken van bestaand schilderij
      const updatedPainting = await updatePainting(editingId, paintingData, imageFile);
      await showActionFeedbackModal(updatedPainting, 'Updated!');
      // Vervang het bijgewerkte kaartje in de lijst
      const index = paintingsData.findIndex(p => p.id === editingId);
      if (index !== -1) paintingsData[index] = updatedPainting;
      const newCard = createPaintingCardElement(updatedPainting);
      const oldCard = paintingsUl.querySelector(`li[data-id="${editingId}"]`);
      if (oldCard) oldCard.replaceWith(newCard);
    } else {
      // Toevoegmodus: nieuw schilderij aanmaken
      const newPainting = await createPainting(paintingData, imageFile);
      await showActionFeedbackModal(newPainting, 'Added!');
      paintingsData.unshift(newPainting); // Voeg bovenaan de gecachte lijst toe
      const newCard = createPaintingCardElement(newPainting);
      newCard.style.opacity = '0'; // Start transparant voor fade-in effect
      paintingsUl.prepend(newCard);
      setTimeout(() => newCard.style.opacity = '1', 100); // Fade in
    }
    exitEditMode();
  } catch (err) {
    console.error(err);
    showFeedback(`Fout: ${err.message}`, 'error');
  }
});

// Verwerk klikken op Edit- en Delete-knoppen via event delegation op de lijst
paintingsUl.addEventListener('click', async (event) => {
  const target = event.target;
  const card = target.closest('.painting-card');
  if (!card) return;
  const id = card.dataset.id;

  if (target.classList.contains('editBtn')) {
    // Haal de meest actuele versie op en zet het formulier in bewerkingsmodus
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
        // Verlaat bewerkingsmodus als het verwijderde schilderij bewerkt werd
        if (id === editingId) exitEditMode();
        await loadPaintings();
      } catch (error) {
        showFeedback(`Fout bij verwijderen: ${error.message}`, 'error');
      }
    }
  }
});

// Verwerk klikken op de annuleerknop
cancelEditButton.addEventListener('click', () => {
  if (isEditing) {
    exitEditMode();
  } else {
    // In toevoegmodus: reset alleen het formulier en de preview
    form.reset();
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
      currentPreviewUrl = null;
      editingPreviewContainer.style.display = 'none';
    }
  }
});

// Verwerk klikken op de resetknop na bevestiging
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

// Verwerk de selectie van een nieuw afbeeldingsbestand
fileInput.addEventListener('change', handleFileSelect);

// Initialisatie na het laden van de DOM
window.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000); // Elke seconde bijwerken
  loadPaintings();
});
