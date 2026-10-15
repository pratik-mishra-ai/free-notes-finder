// Small localStorage wrapper: never throws, always reports success or failure.
export const KEYS = {
  notes: 'freeNotesFinder.notes',
  profile: 'freeNotesFinder.profile',
};

export function isStorageAvailable() {
  try {
    const k = '__fnf_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

// Returns the parsed value, or `fallback` if missing, unreadable or invalid JSON.
export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isQuotaError(e) {
  return !!e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
}

// Returns { ok: true } or { ok: false, quota: boolean }.
export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (e) {
    return { ok: false, quota: isQuotaError(e) };
  }
}

export function makeId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
