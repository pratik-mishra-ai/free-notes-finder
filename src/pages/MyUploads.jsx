import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Notice from '../components/Notice.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { sortNotes } from '../utils/notes.js';
import { formatDate, formatSize } from '../utils/format.js';

export default function MyUploads() {
  const { notes, profile, deleteNote } = useNotes();
  const [pending, setPending] = useState(null);
  const [msg, setMsg] = useState(null);
  const mine = sortNotes(notes.filter((n) => n.ownerId === profile.id), 'newest');

  function confirmDelete() {
    const r = deleteNote(pending.id);
    setMsg(r.ok ? { type: 'success', text: `"${pending.title}" was deleted.` } : { type: 'error', text: 'The note could not be deleted because browser storage is unavailable.' });
    setPending(null);
  }

  return (
    <div className="wrap section">
      <h1>My uploads</h1>
      <p className="muted">Notes uploaded from this browser. This is a local prototype profile, not a secure account, so clearing browser data removes access to these uploads.</p>
      {msg && <Notice type={msg.type}>{msg.text}</Notice>}

      {mine.length ? (
        <ul className="rows">
          {mine.map((n) => (
            <li key={n.id} className="card row-item">
              <div>
                <h3><Link to={`/notes/${n.id}`}>{n.title}</Link></h3>
                <p className="muted">{n.subject}, Semester {n.semester} - {formatDate(n.uploadedAt)} - {formatSize(n.fileSize)}</p>
              </div>
              <button className="btn btn-danger-ghost" onClick={() => setPending(n)} aria-label={`Delete ${n.title}`}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="You haven't uploaded any notes" text="Notes you upload will be listed here so you can manage them.">
          <Link className="btn btn-primary" to="/upload">Upload notes</Link>
        </EmptyState>
      )}

      <ConfirmDialog open={Boolean(pending)} title="Delete this note?" message={pending ? `"${pending.title}" will be removed from this browser. This can't be undone.` : ''} confirmLabel="Delete note" onConfirm={confirmDelete} onCancel={() => setPending(null)} />
    </div>
  );
}
