import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import usePdfUrl from '../hooks/usePdfUrl.js';
import { useNotes } from '../context/NotesContext.jsx';
import { formatDate, formatSize } from '../utils/format.js';

export default function NoteDetails() {
  const { id } = useParams();
  const { notes } = useNotes();
  const note = notes.find((n) => n.id === id);
  const pdfUrl = usePdfUrl(note ? note.pdfData : '');
  const [showPdf, setShowPdf] = useState(false);

  if (!note) {
    return (
      <div className="wrap section">
        <EmptyState title="Note not found" text="It may have been deleted, or it was saved in a different browser.">
          <Link className="btn btn-primary" to="/notes">Back to notes</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="wrap section">
      <Link to="/notes" className="back">Back to notes</Link>
      <article className="card detail">
        <div className="chips">
          <span className="chip">{note.subject}</span>
          <span className="chip chip-plain">Semester {note.semester}</span>
        </div>
        <h1>{note.title}</h1>
        <p>{note.description}</p>
        <dl className="meta meta-lg">
          <div><dt>Topic</dt><dd>{note.topic}</dd></div>
          <div><dt>Uploaded by</dt><dd>{note.uploader}</dd></div>
          <div><dt>Upload date</dt><dd>{formatDate(note.uploadedAt)}</dd></div>
          <div><dt>File</dt><dd>{note.fileName} ({formatSize(note.fileSize)})</dd></div>
        </dl>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => setShowPdf((s) => !s)} aria-expanded={showPdf}>
            {showPdf ? 'Hide PDF' : 'View PDF'}
          </button>
          <a className="btn btn-ghost" href={pdfUrl || note.pdfData} download={note.fileName}>Download PDF</a>
          {pdfUrl && <a className="btn btn-ghost" href={pdfUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a>}
        </div>
        {showPdf && (
          pdfUrl
            ? <iframe className="pdf-frame" src={pdfUrl} title={`PDF: ${note.title}`} />
            : <p className="muted">Loading PDF...</p>
        )}
      </article>
    </div>
  );
}
