import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/notes', label: 'All Notes' },
  { to: '/upload', label: 'Upload Notes' },
  { to: '/my-uploads', label: 'My Uploads' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="navbar">
      <div className="wrap nav-inner">
        <Link to="/" className="logo" onClick={close} aria-label="Free Notes Finder home">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <rect x="4" y="2" width="20" height="24" rx="3" fill="#1d4ed8" />
            <path d="M9 9h10M9 14h10M9 19h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Free Notes Finder</span>
        </Link>
        <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="nav-links" className={open ? 'nav-links open' : 'nav-links'} aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>{l.label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
