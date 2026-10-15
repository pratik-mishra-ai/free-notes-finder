import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <section id="about">
          <h3>About</h3>
          <p>Free Notes Finder helps students find useful study material quickly. Upload your notes, search by subject or topic, and download PDFs for free.</p>
        </section>
        <section id="contact">
          <h3>Contact</h3>
          <p>hello@freenotesfinder.example</p>
          <p><Link to="/upload">Share your notes</Link></p>
        </section>
        <section>
          <h3>Project info</h3>
          <p>A frontend prototype built with React and Vite. Notes are saved in this browser only (localStorage), so they are not shared with other users or devices.</p>
        </section>
      </div>
    </footer>
  );
}
