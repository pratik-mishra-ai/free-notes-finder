import { Routes, Route, Link } from 'react-router-dom';
import { NotesProvider, useNotes } from './context/NotesContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Notice from './components/Notice.jsx';
import EmptyState from './components/EmptyState.jsx';
import Home from './pages/Home.jsx';
import AllNotes from './pages/AllNotes.jsx';
import UploadNotes from './pages/UploadNotes.jsx';
import NoteDetails from './pages/NoteDetails.jsx';
import MyUploads from './pages/MyUploads.jsx';

function StorageWarning() {
  const { storageOk } = useNotes();
  if (storageOk) return null;
  return (
    <div className="wrap">
      <Notice type="error">
        Browser storage is unavailable (private mode or blocked). You can browse, but uploads can't be saved.
      </Notice>
    </div>
  );
}

function NotFound() {
  return (
    <div className="wrap">
      <EmptyState title="Page not found" text="The page you opened doesn't exist.">
        <Link className="btn btn-primary" to="/">Go to home</Link>
      </EmptyState>
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <Navbar />
      <main>
        <StorageWarning />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<AllNotes />} />
          <Route path="/notes/:id" element={<NoteDetails />} />
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/my-uploads" element={<MyUploads />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </NotesProvider>
  );
}
