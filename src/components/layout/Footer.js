import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <>
      <footer className="flex flex-col gap-3 bg-slate-950 px-6 py-8 text-xs font-medium tracking-wide text-white/60 sm:flex-row sm:items-center sm:justify-between lg:px-16">
        <span>© 2026 Coochbehar Travel</span>
        <span>Explore · Identify · Reinvent</span>
        <span>info@coochbehartravel.com</span>
      </footer>

      {/* Mobile bottom navigation bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 pb-safe pt-2 backdrop-blur-xl sm:hidden shadow-2xl shadow-slate-950/10"
        aria-label="Mobile navigation"
      >
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500 transition hover:text-slate-950" aria-label="Home">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10h5v-6h6v6h5V10" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Home</span>
        </button>

        <a href="/#journeys" className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500 transition hover:text-slate-950" aria-label="Journeys">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Journeys</span>
        </a>

        <button
          id="bottom-nav-enquiry-btn"
          onClick={() => navigate("/custom-tour-enquiry")}
          className="flex flex-col items-center gap-1 px-4 py-2 text-amber-500 transition hover:text-amber-600"
          aria-label="Custom tour enquiry page"
        >
          <span className="grid h-10 w-10 -translate-y-3 place-items-center rounded-full bg-amber-300 text-xl shadow-lg shadow-amber-300/30 transition hover:bg-amber-200">✉</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500">Enquiry</span>
        </button>

        <a href="/#story" className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500 transition hover:text-slate-950" aria-label="Our story">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Story</span>
        </a>
      </nav>
    </>
  );
}
