import { useState } from 'react';
import { useNotes } from '../context/NotesContext.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Notice from './Notice.jsx';

export default function DemoTools() {
  const { notes, loadSamples, clearDemoData } = useNotes();
  const [confirming, setConfirming] = useState(false);
  const [msg, setMsg] = useState(null);
  const hasSamples = notes.some((n) => n.isSample);

  const load = () => {
    const r = loadSamples();
    setMsg(r.ok ? { type: 'success', text: 'Sample notes loaded.' } : { type: 'error', text: 'Browser storage is full or unavailable, so samples were not saved.' });
  };
  const clear = () => {
    const r = clearDemoData();
    setConfirming(false);
    setMsg(r.ok ? { type: 'success', text: 'Demo data cleared. Your own uploads were kept.' } : { type: 'error', text: 'Could not update browser storage.' });
  };

  return (
    <section className="demo-tools" aria-label="Demo data">
      <h3>Demo data</h3>
      <p className="muted">Load sample notes to try the app, or remove them. Your own uploads are never removed here.</p>
      {msg && <Notice type={msg.type}>{msg.text}</Notice>}
      <div className="actions">
        <button className="btn btn-ghost" onClick={load}>Load sample notes</button>
        <button className="btn btn-ghost" onClick={() => setConfirming(true)} disabled={!hasSamples}>Clear demo data</button>
      </div>
      <ConfirmDialog open={confirming} title="Clear demo data?" message="All sample notes will be removed from this browser. Notes you uploaded stay." confirmLabel="Clear demo data" onConfirm={clear} onCancel={() => setConfirming(false)} />
    </section>
  );
}
