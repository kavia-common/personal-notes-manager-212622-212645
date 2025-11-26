import React, { useState, useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteForm - Controlled form for note title/content with submit and cancel
 */
export default function NoteForm({ initialNote, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');

  useEffect(() => {
    setTitle(initialNote?.title || '');
    setContent(initialNote?.content || '');
  }, [initialNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="title">Title</label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your note title"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="content">Content</label>
        <textarea
          id="content"
          className="input"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          required
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
