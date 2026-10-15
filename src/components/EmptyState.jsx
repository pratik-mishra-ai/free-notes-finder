export default function EmptyState({ title, text, children }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{text}</p>
      {children && <div className="actions center">{children}</div>}
    </div>
  );
}
