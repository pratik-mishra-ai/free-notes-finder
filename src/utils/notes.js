export const SUBJECTS = ['Java', 'DSA', 'DBMS', 'Operating Systems', 'Computer Networks', 'Mathematics', 'Web Development'];
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function filterNotes(notes, { q = '', subject = '', semester = '' }) {
  const term = q.trim().toLowerCase();
  return notes.filter((n) => {
    if (subject && n.subject !== subject) return false;
    if (semester && String(n.semester) !== String(semester)) return false;
    if (!term) return true;
    return [n.title, n.subject, n.topic, n.uploader].some((f) => String(f || '').toLowerCase().includes(term));
  });
}

export function sortNotes(notes, order = 'newest') {
  const dir = order === 'oldest' ? 1 : -1;
  return [...notes].sort((a, b) => dir * (Date.parse(a.uploadedAt) - Date.parse(b.uploadedAt)));
}
