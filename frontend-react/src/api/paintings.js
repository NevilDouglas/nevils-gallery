// frontend-react/src/api/paintings.js
// API-module voor alle communicatie met de backend.
// Alle fetch-aanroepen naar de schilderijen-endpoints zijn hier gecentraliseerd.
// De basis-URL wordt ingesteld via de omgevingsvariabele VITE_API_BASE_URL,
// zodat de app zowel lokaal als in productie (Heroku) correct werkt.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const API_URL = `${API_BASE_URL}/api/paintings`;

/**
 * Haalt alle schilderijen op, gesorteerd op ranking.
 * @returns {Promise<Array>} Lijst van schilderijobjecten
 */
export async function fetchPaintings() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch paintings');
  return response.json();
}

/**
 * Haalt één schilderij op via zijn UUID.
 * @param {string} id - UUID van het schilderij
 * @returns {Promise<Object>} Het gevonden schilderijobject
 */
export async function fetchPainting(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Painting not found');
  return response.json();
}

/**
 * Maakt een nieuw schilderij aan.
 * Verstuurt de gegevens als multipart/form-data zodat ook een afbeelding meegestuurd kan worden.
 * @param {Object} data - Velden: title, artist, ranking, description
 * @param {File|null} imageFile - Optioneel afbeeldingsbestand
 * @returns {Promise<Object>} Het aangemaakte schilderijobject
 */
export async function createPainting(data, imageFile) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  if (imageFile) formData.append('imageFile', imageFile);

  const response = await fetch(API_URL, { method: 'POST', body: formData });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create painting');
  }
  return response.json();
}

/**
 * Werkt een bestaand schilderij bij.
 * Verstuurt de gegevens als multipart/form-data; een nieuwe afbeelding is optioneel.
 * @param {string} id - UUID van het bij te werken schilderij
 * @param {Object} data - Bij te werken velden
 * @param {File|null} imageFile - Optioneel nieuwe afbeelding
 * @returns {Promise<Object>} Het bijgewerkte schilderijobject
 */
export async function updatePainting(id, data, imageFile) {
  const formData = new FormData();
  for (const key in data) {
    // Sla null/undefined waarden over om de backend niet te vervuilen
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  }
  if (imageFile) formData.append('imageFile', imageFile);

  const response = await fetch(`${API_URL}/${id}`, { method: 'PUT', body: formData });
  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.errors) {
      throw new Error(errorData.errors.map(e => e.message).join(', '));
    }
    throw new Error(errorData.message || 'Failed to update painting');
  }
  return response.json();
}

/**
 * Verwijdert een schilderij via zijn UUID.
 * @param {string} id - UUID van het te verwijderen schilderij
 * @returns {Promise<void>} Geen inhoud bij HTTP 204
 */
export async function deletePainting(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (response.status === 204) return; // Succesvol verwijderd, geen inhoud
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete painting');
  }
  return response.json();
}

/**
 * Reset de collectie naar de originele 20 schilderijen.
 * @returns {Promise<Object>} Bevestigingsbericht van de server
 */
export async function resetPaintings() {
  const response = await fetch(`${API_URL}/reset`, { method: 'POST' });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset paintings');
  }
  return response.json();
}
