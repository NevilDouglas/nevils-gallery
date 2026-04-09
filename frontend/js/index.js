// frontend/js/index.js
// JavaScript voor de startpagina (index.html) van de vanilla JS frontend.
// Laadt een preview van de eerste 3 schilderijen en toont ze in het previewraster.

import { fetchPaintings, API_BASE_URL } from './api.js';
import updateDateTime from './updateDateTime.js';

/**
 * Laadt de eerste 3 schilderijen en rendert ze als kaartjes in het previewraster.
 * Bij een fout wordt een foutmelding getoond.
 */
async function loadPreview() {
  const previewContainer = document.getElementById('previewContainer');
  try {
    const paintings = await fetchPaintings();
    const firstThree = paintings.slice(0, 3); // Toon alleen de eerste 3
    previewContainer.innerHTML = '';

    firstThree.forEach(p => {
      const div = document.createElement('div');
      div.className = 'preview-card';
      // Bouw een kaartje met afbeelding, titel, kunstenaar en beschrijving
      div.innerHTML = `
        <img src="${API_BASE_URL}${p.image}" alt="${p.title}" class="preview-img" />
        <h3>${p.title}</h3>
        <p><strong>Artist:</strong> ${p.artist}</p>
        <p><strong>Description:</strong> ${p.description || 'Geen beschrijving.'}</p>
      `;
      previewContainer.appendChild(div);
    });

  } catch (error) {
    console.error('Fout bij laden preview schilderijen:', error);
    previewContainer.innerHTML = '<p class="error">Kon voorbeeldschilderijen niet laden.</p>';
  }
}

// Start datum/tijd-update en laad de preview na het laden van de DOM
document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000); // Elke seconde bijwerken
  loadPreview();
});
