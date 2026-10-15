import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import NoteCard from '../components/NoteCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import DemoTools from '../components/DemoTools.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { filterNotes, sortNotes } from '../utils/notes.js';

export default function AllNotes() {
  const { notes } = useNotes();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const subject = params.get('subject') || '';
  const semester = params.get('semester') || '';
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const hasFilters = Boolean(q || subject || semester);

  const update = (key, value) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: true });

  const results = sortNotes(filterNotes(notes, { q, subject, semester }), sort);

  return (
    <div className="wrap section">
      <h1>All notes</h1>
      <SearchBar value={q} onChange={(v) => update('q', v)} />
      <FilterBar subject={subject} semester={semester} sort={sort} onChange={update} onClear={() => setParams({}, { replace: true })} hasFilters={hasFilters} />
      <p className="muted" aria-live="polite">{results.length} {results.length === 1 ? 'note' : 'notes'} found</p>

      {results.length ? (
        <div className="grid">{results.map((n) => <NoteCard key={n.id} note={n} />)}</div>
      ) : (
        <EmptyState
          title={notes.length ? 'No notes match your search' : 'No notes yet'}
          text={notes.length ? 'Try a different keyword or clear the filters.' : 'Upload a note or load the sample notes below.'}
        >
          {hasFilters && <button className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
        </EmptyState>
      )}
      <DemoTools />
    </div>
  );
}
