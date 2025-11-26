import { apiFetch } from './api';

/**
 * PUBLIC_INTERFACE
 * getNotes - Fetch all notes
 */
export function getNotes() {
  return apiFetch('/notes', { method: 'GET' });
}

/**
 * PUBLIC_INTERFACE
 * createNote - Create a new note
 */
export function createNote({ title, content }) {
  return apiFetch('/notes', { method: 'POST', body: { title, content } });
}

/**
 * PUBLIC_INTERFACE
 * updateNote - Update an existing note by id
 */
export function updateNote(id, { title, content }) {
  return apiFetch(`/notes/${id}`, { method: 'PUT', body: { title, content } });
}

/**
 * PUBLIC_INTERFACE
 * deleteNote - Delete a note by id
 */
export function deleteNote(id) {
  return apiFetch(`/notes/${id}`, { method: 'DELETE' });
}
