function Card({ title, description, children }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/30">
      {(title || description) && (
        <div className="mb-5 space-y-1">
          {title && <h2 className="text-2xl font-semibold text-white">{title}</h2>}
          {description && <p className="text-slate-400">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export default Card;
