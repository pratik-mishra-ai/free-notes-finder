export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search by title, subject, topic or uploader', large = false }) {
  const handle = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };
  return (
    <form className={large ? 'searchbar large' : 'searchbar'} role="search" onSubmit={handle}>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label="Search notes" />
      {onSubmit && <button type="submit" className="btn btn-primary">Search</button>}
    </form>
  );
}
