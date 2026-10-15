import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import NoteCard from '../components/NoteCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { SUBJECTS, sortNotes } from '../utils/notes.js';

export default function Home() {
  const { notes, loadSamples } = useNotes();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const recent = sortNotes(notes, 'newest').slice(0, 3);
  const counts = SUBJECTS.map((s) => ({ subject: s, count: notes.filter((n) => n.subject === s).length }));
  const popular = [...counts].filter((c) => c.count > 0).sort((a, b) => b.count - a.count).slice(0, 4);
  const search = () => navigate(q.trim() ? `/notes?q=${encodeURIComponent(q.trim())}` : '/notes');

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>Find the Notes You Need, For Free.</h1>
          <p>Search study notes shared by students. View them online or download the PDF.</p>
          <SearchBar value={q} onChange={setQ} onSubmit={search} large />
        </div>
      </section>

      <section className="wrap section">
        <h2>Browse by subject</h2>
        <div className="grid grid-cats">
          {counts.map((c) => (
            <Link key={c.subject} className="card cat-card" to={`/notes?subject=${encodeURIComponent(c.subject)}`}>
              <strong>{c.subject}</strong>
              <span className="muted">{c.count} {c.count === 1 ? 'note' : 'notes'}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Recently uploaded</h2>
          <Link to="/notes">See all notes</Link>
        </div>
        {recent.length ? (
          <div className="grid">{recent.map((n) => <NoteCard key={n.id} note={n} />)}</div>
        ) : (
          <EmptyState title="No notes yet" text="Upload the first note, or load a few samples to explore the app.">
            <Link className="btn btn-primary" to="/upload">Upload notes</Link>
            <button className="btn btn-ghost" onClick={loadSamples}>Load sample notes</button>
          </EmptyState>
        )}
      </section>

      <section className="wrap section">
        <h2>Popular subjects</h2>
        {popular.length ? (
          <div className="pills">
            {popular.map((p) => (
              <Link key={p.subject} className="pill" to={`/notes?subject=${encodeURIComponent(p.subject)}`}>
                {p.subject} <span>{p.count}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">Popular subjects appear here once notes are uploaded.</p>
        )}
      </section>
    </>
  );
}
