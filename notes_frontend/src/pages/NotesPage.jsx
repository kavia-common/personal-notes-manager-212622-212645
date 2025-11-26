import React, { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/notesApi';
import NoteForm from '../components/NoteForm';

/**
 * PUBLIC_INTERFACE
 * NotesPage - Lists notes and provides create/edit/delete interactions
 */
export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadNotes = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await getNotes();
      // Accept arrays or wrapped objects
      const items = Array.isArray(data) ? data : data?.items || data?.results || [];
      setNotes(items);
    } catch (e) {
      setErr(e?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotes(); }, []);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      const created = await createNote(payload);
      setNotes((prev) => [created, ...prev]);
    } catch (e) {
      setErr(e?.message || 'Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    setSubmitting(true);
    try {
      const updated = await updateNote(editing.id ?? editing.note_id ?? editing._id, payload);
      setNotes((prev) =>
        prev.map((n) =>
          (n.id ?? n.note_id ?? n._id) === (editing.id ?? editing.note_id ?? editing._id) ? updated : n
        )
      );
      setEditing(null);
    } catch (e) {
      setErr(e?.message || 'Failed to update note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (note) => {
    const id = note.id ?? note.note_id ?? note._id;
    if (!id) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => (n.id ?? n.note_id ?? n._id) !== id));
    } catch (e) {
      setErr(e?.message || 'Failed to delete note');
    }
  };

  return (
    <div className="main">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Your Notes</div>
            <div className="card-sub">Create, edit, and organize your ideas.</div>
          </div>
        </div>
        {!editing ? (
          <NoteForm onSubmit={handleCreate} submitting={submitting} />
        ) : (
          <NoteForm
            initialNote={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        )}
      </div>

      {err && <div className="card" style={{ borderColor: 'var(--error)', color: 'var(--error)', marginBottom: 16 }}>{err}</div>}

      <div className="notes-grid">
        {loading ? (
          <div className="card">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="card">No notes yet. Start by creating one above.</div>
        ) : (
          notes.map((note) => {
            const id = note.id ?? note.note_id ?? note._id;
            return (
              <div key={id} className="note">
                <div className="note-title">{note.title}</div>
                <div className="note-content" style={{ whiteSpace: 'pre-wrap' }}>{note.content}</div>
                <div className="note-meta">
                  {note.updated_at || note.updatedAt || note.created_at || note.createdAt || ''}
                </div>
                <div className="note-actions">
                  <button className="btn btn-outline" onClick={() => setEditing(note)}>Edit</button>
                  <button className="btn" style={{ background: 'var(--error)' }} onClick={() => handleDelete(note)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
