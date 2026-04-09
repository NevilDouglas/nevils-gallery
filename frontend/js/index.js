import { fetchPaintings, API_BASE_URL } from './api.js';
import updateDateTime from './updateDateTime.js';

async function loadPreview() {
  const previewContainer = document.getElementById('previewContainer');
  try {
    const paintings = await fetchPaintings();
    const firstThree = paintings.slice(0, 3);
    previewContainer.innerHTML = '';

    firstThree.forEach(p => {
      const div = document.createElement('div');
      div.className = 'preview-card';
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

document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  loadPreview();
});
