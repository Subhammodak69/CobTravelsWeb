import { useEffect, useState } from "react";
import PackageCard from "../components/PackageCard";
import usePackages from "../hooks/usePackages";
import { useTravel } from "../contexts/TravelContext";
import useScrollReveal from "../hooks/useScrollReveal";

// Real Unsplash hero — beautiful Indian landscape (Dal Lake / Kashmir valley)
const HERO_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90";

export default function HomePage() {
  const [filters, setFilters] = useState({ page: 1, page_size: 12, search: "", destination: "", type: "", season: "", is_featured: "", min_price: "", max_price: "", sort_by: "created_at", sort_order: "desc" });
  const [searchInput, setSearchInput] = useState("");
  const { packages, pagination, loading, error } = usePackages(undefined, filters);
  const { isMember } = useTravel();
  const revealRef = useScrollReveal();
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(current => current.search === searchInput ? current : { ...current, search: searchInput, page: 1 });
    }, 450);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const heroImage = packages[0]?.image || HERO_IMG;
  return (
    <div ref={revealRef} className="bg-slate-50">
      <section className="relative flex min-h-[720px] overflow-hidden px-6 pb-20 pt-32 text-white sm:px-8 lg:px-16">
        <img className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition duration-1000" src={heroImage} alt="Travel destination" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900/50 to-indigo-900/20" />
        <div className="absolute -right-40 -top-48 h-[36rem] w-[36rem] rounded-full bg-cyan-400/25 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-float" />
        <div className="relative z-10 flex max-w-3xl flex-col justify-center animate-fade-up">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Since 1994 · Guided group journeys</p>
          <h1 className="font-display text-6xl font-semibold leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">Go further.<br /><em className="text-amber-300">Feel more.</em></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/75">Thoughtful journeys across India and beyond, paced for the moments you will remember.</p>
          <label className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3 shadow-glow backdrop-blur-xl">
            <span className="text-xl text-amber-300">⌕</span>
            <input className="w-full bg-transparent text-sm text-white placeholder:text-white/55 focus:outline-none" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search destinations or journeys..." aria-label="Search destinations or journeys" />
          </label>
          <a href="#journeys" className="mt-6 inline-flex w-fit items-center gap-8 rounded-2xl bg-amber-300 px-5 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-1 hover:bg-amber-200">Explore journeys <span>↓</span></a>
        </div>
        <div className="absolute bottom-16 right-6 hidden h-36 w-36 rotate-[-10deg] flex-col items-center justify-center rounded-full border border-white/25 bg-white/10 text-center backdrop-blur-xl animate-float sm:flex lg:right-20">
          <span>curated with</span>
          <b className="font-display text-3xl italic text-amber-300">heart</b>
          <i className="absolute right-5 top-5 text-amber-300">✦</i>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-4 bg-slate-950 px-6 py-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white/65">
        <span>Handpicked stays</span><i>✦</i>
        <span>Small group feeling</span><i>✦</i>
        <span>Always-on support</span><i>✦</i>
        <span>Memories, not checklists</span>
      </section>

      <section id="journeys" className="px-6 py-20 sm:px-8 lg:px-16 lg:py-28" data-reveal>
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">Find your next story</p>
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl">Journeys that stay<br />with you.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-500">{isMember ? "Welcome back. Your next escape is waiting." : "Choose a place. We'll take care of the rest."}</p>
        </div>
        <div className="mb-4 grid gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/5 sm:grid-cols-2 lg:grid-cols-5">
          <input className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50" value={filters.destination} onChange={e => setFilters(f => ({ ...f, destination: e.target.value, page: 1 }))} placeholder="Destination" aria-label="Filter destination" />
          <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))} aria-label="Filter tour type">
            <option value="">All types</option><option value="DOMESTIC">Domestic</option><option value="INTERNATIONAL">International</option>
          </select>
          <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50" value={filters.season} onChange={e => setFilters(f => ({ ...f, season: e.target.value, page: 1 }))} aria-label="Filter season">
            <option value="">All seasons</option><option value="Spring">Spring</option><option value="Summer">Summer</option><option value="Autumn">Autumn</option><option value="Winter">Winter</option>
          </select>
          <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50" value={filters.sort_by + "|" + filters.sort_order} onChange={e => { const [sort_by, sort_order] = e.target.value.split("|"); setFilters(f => ({ ...f, sort_by, sort_order, page: 1 })) }} aria-label="Sort tours">
            <option value="created_at|desc">Newest</option><option value="title|asc">Title A–Z</option><option value="destination|asc">Destination A–Z</option><option value="starting_price|asc">Price low to high</option><option value="starting_price|desc">Price high to low</option><option value="updated_at|desc">Recently updated</option>
          </select>
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600"><input className="h-4 w-4 accent-amber-400" type="checkbox" checked={filters.is_featured === "true"} onChange={e => setFilters(f => ({ ...f, is_featured: e.target.checked ? "true" : "", page: 1 }))} /> Featured</label>
        </div>
        <div className="mb-8 flex items-center justify-between gap-4 text-sm text-slate-500"><span>{loading ? "Finding journeys…" : error ? error : "Showing " + packages.length + " of " + pagination.total + " journeys"}</span><button className="rounded-full bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100" onClick={() => { setSearchInput(""); setFilters({ page: 1, page_size: 12, search: "", destination: "", type: "", season: "", is_featured: "", min_price: "", max_price: "", sort_by: "created_at", sort_order: "desc" }) }}>Reset</button></div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pack, index) => <PackageCard key={pack.id} pack={pack} index={index} />)}
        </div>
        {!loading && !error && packages.length === 0 && <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500"><p>No journeys match these filters.</p></div>}
        {pagination.pages > 1 && <div className="mt-10 flex items-center justify-center gap-4"><button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-40" disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Previous</button><span className="text-sm text-slate-500">Page {filters.page} of {pagination.pages}</span><button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-40" disabled={filters.page >= pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button></div>}
      </section>

      <section id="story" className="grid bg-white lg:grid-cols-2" data-reveal>
        <div className="relative min-h-[320px] overflow-hidden lg:min-h-[560px]">
          <img
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85"
            alt="India travel — Taj Mahal at sunrise"
          />
          <span className="absolute bottom-6 left-6 rounded-full bg-amber-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950">Since 1994 · Cooch Behar</span>
        </div>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-8 lg:px-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">A little bit about us</p>
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl">Travel should change<br />the way you <em className="text-amber-500">feel.</em></h2>
          <p className="mt-7 max-w-xl text-sm leading-7 text-slate-500">For over three decades, we've made travel personal. Our team starts with a good route, then leaves room for the kind of unplanned moments that make a trip yours.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">✦ 30+ Years of journeys</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">✦ 5,000+ Happy travellers</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">✦ 12+ Destinations</span>
          </div>
        </div>
      </section>

    </div>
  );
}
