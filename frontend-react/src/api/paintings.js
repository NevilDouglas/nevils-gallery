export const API_BASE_URL = 'http://localhost:4000';
const API_URL = `${API_BASE_URL}/api/paintings`;

export async function fetchPaintings() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch paintings');
  return response.json();
}

export async function fetchPainting(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Painting not found');
  return response.json();
}

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

export async function updatePainting(id, data, imageFile) {
  const formData = new FormData();
  for (const key in data) {
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

export async function deletePainting(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (response.status === 204) return;
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete painting');
  }
  return response.json();
}

export async function resetPaintings() {
  const response = await fetch(`${API_URL}/reset`, { method: 'POST' });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset paintings');
  }
  return response.json();
}
