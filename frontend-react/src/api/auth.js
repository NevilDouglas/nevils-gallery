// frontend-react/src/api/auth.js
// API-aanroepen voor authenticatie.

import { API_BASE_URL } from './paintings';

/**
 * Stuurt inloggegevens naar de backend en retourneert token + gebruikersinfo.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function loginRequest(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Inloggen mislukt.');
  }
  return data; // { token, user }
}
