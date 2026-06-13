function Notification({ message, status = 'info' }) {
  if (!message) return null;

  const variant = {
    info: 'bg-slate-800 text-slate-100',
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-slate-950',
  };

  return (
    <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${variant[status] || variant.info}`}>
      {message}
    </div>
  );
}

export default Notification;
