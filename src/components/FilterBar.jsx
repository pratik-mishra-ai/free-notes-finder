import { SUBJECTS, SEMESTERS } from '../utils/notes.js';

export default function FilterBar({ subject, semester, sort, onChange, onClear, hasFilters }) {
  return (
    <div className="filterbar">
      <label>Subject
        <select value={subject} onChange={(e) => onChange('subject', e.target.value)}>
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          <option value="Other">Other</option>
        </select>
      </label>
      <label>Semester
        <select value={semester} onChange={(e) => onChange('semester', e.target.value)}>
          <option value="">All semesters</option>
          {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </label>
      <label>Sort by
        <select value={sort} onChange={(e) => onChange('sort', e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </label>
      <button type="button" className="btn btn-ghost" onClick={onClear} disabled={!hasFilters}>Clear filters</button>
    </div>
  );
}
