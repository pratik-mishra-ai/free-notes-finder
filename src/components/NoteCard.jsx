import { Link } from 'react-router-dom';
import { formatDate, formatSize } from '../utils/format.js';

export default function NoteCard({ note }) {
  return (
    <article className="card note-card">
      <div className="chips">
        <span className="chip">{note.subject}</span>
        <span className="chip chip-plain">Semester {note.semester}</span>
        {note.isSample && <span className="chip chip-plain">Sample</span>}
      </div>
      <h3><Link to={`/notes/${note.id}`}>{note.title}</Link></h3>
      <p className="muted">{note.topic}</p>
      <dl className="meta">
        <div><dt>Uploaded by</dt><dd>{note.uploader}</dd></div>
        <div><dt>Date</dt><dd>{formatDate(note.uploadedAt)}</dd></div>
        <div><dt>PDF size</dt><dd>{formatSize(note.fileSize)}</dd></div>
      </dl>
      <Link className="btn btn-ghost" to={`/notes/${note.id}`}>Open note</Link>
    </article>
  );
}
