import { createContext, useContext, useState } from 'react';
import { KEYS, readJSON, writeJSON, isStorageAvailable, makeId } from '../utils/storage.js';
import { getSampleNotes } from '../data/sampleNotes.js';

const NotesContext = createContext(null);
export const useNotes = () => useContext(NotesContext);

function sanitize(list) {
  return Array.isArray(list) ? list.filter((n) => n && typeof n.id === 'string' && typeof n.title === 'string') : [];
}

function loadProfile() {
  const saved = readJSON(KEYS.profile, null);
  if (saved && typeof saved.id === 'string') return saved;
  const fresh = { id: makeId(), name: '' };
  writeJSON(KEYS.profile, fresh);
  return fresh;
}

export function NotesProvider({ children }) {
  const [storageOk] = useState(isStorageAvailable);
  const [notes, setNotes] = useState(() => sanitize(readJSON(KEYS.notes, [])));
  const [profile, setProfile] = useState(loadProfile);

  // Always start from what is stored right now so existing notes are never overwritten.
  const stored = () => sanitize(readJSON(KEYS.notes, []));

  function persist(next) {
    const result = writeJSON(KEYS.notes, next);
    if (result.ok) setNotes(next);
    return result;
  }

  const addNote = (note) => persist([note, ...stored()]);
  const deleteNote = (id) => persist(stored().filter((n) => n.id !== id));

  function loadSamples() {
    const current = stored();
    const have = new Set(current.map((n) => n.id));
    return persist([...current, ...getSampleNotes().filter((n) => !have.has(n.id))]);
  }

  const clearDemoData = () => persist(stored().filter((n) => !n.isSample));

  function saveProfileName(name) {
    const next = { ...profile, name };
    setProfile(next);
    writeJSON(KEYS.profile, next);
  }

  const value = { notes, profile, storageOk, addNote, deleteNote, loadSamples, clearDemoData, saveProfileName };
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
