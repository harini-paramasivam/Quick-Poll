function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-brand-400" />
    </div>
  );
}

export default LoadingSpinner;
