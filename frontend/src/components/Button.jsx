function Button({ children, variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60';
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-400',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
