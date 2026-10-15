import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Notice from '../components/Notice.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { SUBJECTS, SEMESTERS } from '../utils/notes.js';
import { makeId } from '../utils/storage.js';
import { validateFields, validateFile, readPdfAsDataUrl, MAX_FILE_BYTES } from '../utils/validation.js';
import { formatSize } from '../utils/format.js';

const EMPTY = { title: '', subject: '', topic: '', semester: '', uploader: '', description: '' };

function Field({ id, label, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field-error" id={`${id}-err`}>{error}</span>}
    </div>
  );
}

export default function UploadNotes() {
  const { notes, profile, addNote, saveProfileName } = useNotes();
  const [values, setValues] = useState({ ...EMPTY, uploader: profile.name });
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0); // changing the key resets the file input
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [savedId, setSavedId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false); // blocks double submits before state updates

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const aria = (k) => ({ 'aria-invalid': errors[k] ? 'true' : 'false', 'aria-describedby': errors[k] ? `${k}-err` : undefined });

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy.current) return;
    setSavedId('');
    const fieldErrors = validateFields(values);
    const fileError = validateFile(file);
    if (fileError) fieldErrors.file = fileError;
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) {
      setStatus({ type: 'error', text: 'Please fix the highlighted fields and try again.' });
      return;
    }

    busy.current = true;
    setSubmitting(true);
    setStatus(null);
    try {
      const title = values.title.trim();
      const uploader = values.uploader.trim();
      const duplicate = notes.some((n) => n.title.toLowerCase() === title.toLowerCase() && n.uploader === uploader && n.fileName === file.name && n.fileSize === file.size);
      if (duplicate) throw new Error('This note was already uploaded from this browser.');

      const pdfData = await readPdfAsDataUrl(file);
      const note = {
        id: makeId(),
        title, uploader,
        subject: values.subject,
        topic: values.topic.trim(),
        semester: Number(values.semester),
        description: values.description.trim(),
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
        pdfData,
        ownerId: profile.id,
      };
      const result = addNote(note);
      if (!result.ok) {
        throw new Error(result.quota
          ? 'Browser storage is full. Delete some notes from My Uploads or use a smaller PDF, then try again.'
          : 'The note could not be saved because browser storage is unavailable.');
      }
      saveProfileName(uploader);
      setSavedId(note.id);
      setStatus({ type: 'success', text: 'Note uploaded successfully.' });
      setValues({ ...EMPTY, uploader });
      setFile(null);
      setFileKey((k) => k + 1);
      setErrors({});
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap section narrow">
      <h1>Upload notes</h1>
      <Notice type="info">
        Prototype: your PDF is saved only in this browser (localStorage, roughly 5 MB total). Other people and other devices can't see it.
      </Notice>
      {status && <Notice type={status.type}>{status.text}{savedId && <> <Link to={`/notes/${savedId}`}>View your note</Link></>}</Notice>}

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Field id="title" label="Note title" error={errors.title}>
          <input id="title" value={values.title} onChange={set('title')} maxLength={100} {...aria('title')} />
        </Field>
        <div className="row">
          <Field id="subject" label="Subject" error={errors.subject}>
            <select id="subject" value={values.subject} onChange={set('subject')} {...aria('subject')}>
              <option value="">Choose a subject</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              <option value="Other">Other</option>
            </select>
          </Field>
          <Field id="semester" label="Semester" error={errors.semester}>
            <select id="semester" value={values.semester} onChange={set('semester')} {...aria('semester')}>
              <option value="">Choose a semester</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </Field>
        </div>
        <div className="row">
          <Field id="topic" label="Topic" error={errors.topic}>
            <input id="topic" value={values.topic} onChange={set('topic')} {...aria('topic')} />
          </Field>
          <Field id="uploader" label="Your name" error={errors.uploader}>
            <input id="uploader" value={values.uploader} onChange={set('uploader')} {...aria('uploader')} />
          </Field>
        </div>
        <Field id="description" label="Short description" error={errors.description}>
          <textarea id="description" rows="3" value={values.description} onChange={set('description')} maxLength={300} {...aria('description')} />
        </Field>
        <Field id="file" label={`PDF file (max ${formatSize(MAX_FILE_BYTES)})`} error={errors.file}>
          <input key={fileKey} id="file" type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files[0] || null)} {...aria('file')} />
        </Field>
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Uploading...' : 'Upload note'}</button>
      </form>
    </div>
  );
}
