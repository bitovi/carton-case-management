export function Header() {
  return (
    <header className="bg-[#1a5d5d] text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
            <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold">Carton Case Management</h1>
      </div>
      <div className="w-10 h-10 bg-white text-[#1a5d5d] rounded-full flex items-center justify-center font-semibold text-sm">
        AM
      </div>
    </header>
  );
}
