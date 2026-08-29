import { useEffect, useState } from "react";
import PackageCard from "../components/PackageCard";
import CustomSelect from "../components/CustomSelect";
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
      <section className="relative flex min-h-[720px] overflow-hidden px-4 pb-20 pt-32 text-white sm:px-6 lg:px-12">
        <img className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition duration-1000" src={heroImage} alt="Travel destination" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900/50 to-indigo-900/20" />
        <div className="absolute -right-40 -top-48 h-[36rem] w-[36rem] rounded-full bg-cyan-400/25 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-float" />
        <div className="relative z-10 flex max-w-2xl flex-col justify-center animate-fade-up">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">Since 1994 · Guided group journeys</p>
          <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">Go further.<br /><em className="text-amber-300">Feel more.</em></h1>
          <p className="mt-3 max-w-lg text-xs leading-5 text-white/75">Thoughtful journeys across India and beyond, paced for the moments you will remember.</p>
          <label className="mt-5 flex max-w-lg items-center gap-2 rounded-lg border border-white/20 bg-white/15 px-3 py-2 shadow-glow backdrop-blur-xl">
            <span className="text-base text-amber-300">⌕</span>
            <input className="w-full bg-transparent text-xs text-white placeholder:text-white/55 focus:outline-none" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search destinations..." aria-label="Search destinations or journeys" />
          </label>
          <a href="#journeys" className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-amber-300 px-3 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200">Explore journeys <span>↓</span></a>
        </div>
        <div className="absolute bottom-8 right-3 hidden h-20 w-20 rotate-[-10deg] flex-col items-center justify-center rounded-full border border-white/25 bg-white/10 text-center backdrop-blur-xl animate-float sm:flex lg:right-10">
          <span className="text-[9px]">curated with</span>
          <b className="font-display text-lg italic text-amber-300">heart</b>
          <i className="absolute right-2 top-2 text-amber-300 text-xs">✦</i>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-3 bg-slate-950 px-4 py-3 text-[8px] font-bold uppercase tracking-[0.2em] text-white/65">
        <span>Handpicked stays</span><i>✦</i>
        <span>Small group feeling</span><i>✦</i>
        <span>Always-on support</span><i>✦</i>
        <span>Memories, not checklists</span>
      </section>

      <section id="journeys" className="px-4 py-10 sm:px-6 lg:px-12 lg:py-14" data-reveal>
        <div className="mb-6 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">Find your next story</p>
            <h2 className="font-display text-xl font-semibold leading-none tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">Journeys that stay with you.</h2>
          </div>
          <p className="max-w-sm text-xs leading-5 text-slate-500">{isMember ? "Welcome back. Your next escape is waiting." : "Choose a place. We'll take care of the rest."}</p>
        </div>
        <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-md shadow-slate-950/5 sm:grid-cols-2 lg:grid-cols-5">
          <input className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200/50" value={filters.destination} onChange={e => setFilters(f => ({ ...f, destination: e.target.value, page: 1 }))} placeholder="Destination" aria-label="Filter destination" />
          <CustomSelect
            value={filters.type}
            options={[{ label: "All types", value: "" }, { label: "Domestic", value: "DOMESTIC" }, { label: "International", value: "INTERNATIONAL" }]}
            onChange={(value) => setFilters(f => ({ ...f, type: value, page: 1 }))}
            placeholder="All types"
            className="h-8"
            triggerClassName="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900"
          />
          <CustomSelect
            value={filters.season}
            options={[{ label: "All seasons", value: "" }, { label: "Spring", value: "Spring" }, { label: "Summer", value: "Summer" }, { label: "Autumn", value: "Autumn" }, { label: "Winter", value: "Winter" }]}
            onChange={(value) => setFilters(f => ({ ...f, season: value, page: 1 }))}
            placeholder="All seasons"
            className="h-8"
            triggerClassName="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900"
          />
          <CustomSelect
            value={`${filters.sort_by}|${filters.sort_order}`}
            options={[
              { label: "Newest", value: "created_at|desc" },
              { label: "Title A–Z", value: "title|asc" },
              { label: "Destination A–Z", value: "destination|asc" },
              { label: "Price low to high", value: "starting_price|asc" },
              { label: "Price high to low", value: "starting_price|desc" },
              { label: "Recently updated", value: "updated_at|desc" },
            ]}
            onChange={(value) => {
              const [sort_by, sort_order] = value.split("|");
              setFilters(f => ({ ...f, sort_by, sort_order, page: 1 }));
            }}
            placeholder="Newest"
            className="h-8"
            triggerClassName="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900"
          />
          <label className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600"><input className="h-3 w-3 accent-amber-400" type="checkbox" checked={filters.is_featured === "true"} onChange={e => setFilters(f => ({ ...f, is_featured: e.target.checked ? "true" : "", page: 1 }))} /> Featured</label>
        </div>
        <div className="mb-4 flex items-center justify-between gap-4 text-xs text-slate-500"><span>{loading ? "Finding journeys…" : error ? error : "Showing " + packages.length + " of " + pagination.total + " journeys"}</span><button className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-600 transition hover:bg-rose-100" onClick={() => { setSearchInput(""); setFilters({ page: 1, page_size: 12, search: "", destination: "", type: "", season: "", is_featured: "", min_price: "", max_price: "", sort_by: "created_at", sort_order: "desc" }) }}>Reset</button></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packages.map((pack, index) => <PackageCard key={pack.id} pack={pack} index={index} />)}
        </div>
        {!loading && !error && packages.length === 0 && <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500"><p className="text-xs">No journeys match these filters.</p></div>}
        {pagination.pages > 1 && <div className="mt-6 flex items-center justify-center gap-2"><button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40" disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button><span className="text-xs text-slate-500">P{filters.page}/{pagination.pages}</span><button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40" disabled={filters.page >= pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button></div>}
      </section>

      <section id="story" className="grid bg-white lg:grid-cols-2" data-reveal>
        <div className="relative min-h-[200px] overflow-hidden lg:min-h-[360px]">
          <img
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85"
            alt="India travel — Taj Mahal at sunrise"
          />
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">Since 1994 · Cooch Behar</span>
        </div>
        <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-12">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">A little bit about us</p>
          <h2 className="font-display text-xl font-semibold leading-none tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">Travel should change the way you <em className="text-amber-500">feel.</em></h2>
          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500">For over three decades, we've made travel personal. Our team starts with a good route, then leaves room for the kind of unplanned moments that make a trip yours.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">✦ 30+ Years</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">✦ 5,000+ Happy</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">✦ 12+ Destinations</span>
          </div>
        </div>
      </section>

    </div>
  );
}
