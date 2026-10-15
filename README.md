# Free Notes Finder
Live Demo: https://free-notes-finder.vercel.app

A frontend-only React app where students upload, search, view and download free study notes as PDFs.
This is a **prototype**: there is no backend, API, database or login.

## Features
- **Home**: hero search, subject cards (Java, DSA, DBMS, Operating Systems, Computer Networks, Mathematics, Web Development), recent uploads, popular subjects, footer.
- **All Notes**: instant search (title, subject, topic, uploader), subject and semester filters, newest/oldest sort, empty state, clear-filters button. Filters live in the URL, so results can be bookmarked.
- **Upload Notes**: validated form, PDF only, 2 MB limit, `%PDF` header check, success and error messages, unique ID and upload date, double-submit protection, duplicate detection, friendly storage-full message.
- **Note Details**: metadata, in-page PDF viewer, Download PDF, Open in new tab, Back to Notes, graceful "note not found" state.
- **My Uploads**: notes uploaded from this browser, delete with confirmation, instant UI and storage update.
- **Demo data**: Load sample notes (real, viewable PDFs generated in code) and Clear demo data (confirmation; your own uploads are kept).

## Tech
React 18, Vite, JavaScript, plain CSS, React Router, localStorage, File API. No TypeScript, Tailwind, Bootstrap or backend.

## Run it
Requires Node.js 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview
```

## localStorage keys
- `freeNotesFinder.notes`: note metadata plus the PDF as a Base64 data URL
- `freeNotesFinder.profile`: local profile `{ id, name }` used to decide what appears in My Uploads

## Limitations (please read)
- Data lives **only in this browser**. Other users and other devices cannot see uploaded notes.
- localStorage holds roughly 5 MB per site, and Base64 adds about 33% to every PDF, so only a few notes fit. When storage is full the app shows a message instead of crashing.
- "My Uploads" matches a random ID saved in this browser. It is not authentication, and clearing browser data loses access to those notes.
- Private/incognito windows may block or clear storage.

## Project structure
```
src/
  components/  Navbar, Footer, SearchBar, NoteCard, FilterBar, ConfirmDialog, Notice, EmptyState, DemoTools
  pages/       Home, AllNotes, UploadNotes, NoteDetails, MyUploads
  context/     NotesContext.jsx (state + storage sync)
  hooks/       usePdfUrl.js (data URL to Blob URL for viewing)
  utils/       storage.js, validation.js, notes.js, format.js
  data/        sampleNotes.js
```

## Manual test checklist
1. Home: click "Load sample notes". Cards, counts and popular subjects appear.
2. All Notes: type "meera"; pick Java + Semester 3; sort Oldest; click Clear filters.
3. Upload: submit empty (errors), upload a .txt (rejected), upload a PDF over 2 MB (rejected), upload a small PDF (success).
4. Open the note: View PDF, Download PDF, Back to Notes. Open `/notes/does-not-exist` to see the missing-note state.
5. My Uploads: delete the note and confirm. Reload the page: it stays deleted.
6. All Notes: Clear demo data removes only the samples.

## Future backend
Replace `src/context/NotesContext.jsx` and `src/utils/storage.js` with API calls to a Spring Boot + MySQL service, and store PDFs as files rather than Base64.
