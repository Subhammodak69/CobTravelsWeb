import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, RotateCcw, Compass, Sparkles, MapPin, Globe, Tag, Sparkle } from "lucide-react";
import PackageCard from "../components/PackageCard";
import CustomSelect from "../components/CustomSelect";
import usePackages from "../hooks/usePackages";
import useScrollReveal from "../hooks/useScrollReveal";

const HERO_BG = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=90";

const QUICK_FILTERS = [
  { label: "All Tours", icon: Compass, match: (params) => !params.get("type") && !params.get("is_featured") && !params.get("badge"), getQuery: () => ({}) },
  { label: "Featured", icon: Sparkles, match: (params) => params.get("is_featured") === "true", getQuery: () => ({ is_featured: "true" }) },
  { label: "Domestic", icon: MapPin, match: (params) => params.get("type") === "DOMESTIC", getQuery: () => ({ type: "DOMESTIC" }) },
  { label: "International", icon: Globe, match: (params) => params.get("type") === "INTERNATIONAL", getQuery: () => ({ type: "INTERNATIONAL" }) },
  { label: "Special Offers", icon: Tag, match: (params) => params.get("badge") === "SPECIAL_OFFER" || Boolean(params.get("badge")), getQuery: () => ({ badge: "SPECIAL_OFFER" }) },
];

export default function ToursExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const revealRef = useScrollReveal();

  const searchParam = searchParams.get("search") || "";
  const typeParam = searchParams.get("type") || "";
  const destinationParam = searchParams.get("destination") || "";
  const seasonParam = searchParams.get("season") || "";
  const isFeaturedParam = searchParams.get("is_featured") || "";
  const badgeParam = searchParams.get("badge") || "";
  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(searchParam);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync state with URL params
  const activeFilters = useMemo(() => ({
    page: pageParam,
    page_size: 12,
    search: searchParam,
    destination: destinationParam,
    type: typeParam,
    season: seasonParam,
    is_featured: isFeaturedParam,
    badge: badgeParam,
    sort_by: sortByParam,
    sort_order: sortOrderParam,
  }), [pageParam, searchParam, destinationParam, typeParam, seasonParam, isFeaturedParam, badgeParam, sortByParam, sortOrderParam]);

  const { packages, pagination, loading, error } = usePackages(undefined, activeFilters);

  // Debounced search sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        const current = new URLSearchParams(searchParams);
        if (searchInput) {
          current.set("search", searchInput);
        } else {
          current.delete("search");
        }
        current.set("page", "1");
        setSearchParams(current);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchParam, searchParams, setSearchParams]);

  // Keep searchInput aligned if URL changes externally
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const updateParams = (newParams) => {
    const current = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === "") {
        current.delete(key);
      } else {
        current.set(key, String(val));
      }
    });
    setSearchParams(current);
  };

  const resetAllFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchParam || typeParam || destinationParam || seasonParam || isFeaturedParam || badgeParam || (sortByParam && sortByParam !== "created_at")
  );

  // Dynamic heading based on current filters
  const getPageHeading = () => {
    if (isFeaturedParam === "true") return { title: "Featured Journeys", accent: "Handpicked & Celebrated", eyebrow: "Exclusive Collection" };
    if (typeParam === "DOMESTIC") return { title: "Domestic Packages", accent: "Across Incredible India", eyebrow: "Explore Home" };
    if (typeParam === "INTERNATIONAL") return { title: "International Packages", accent: "Beyond Borders", eyebrow: "Global Escapes" };
    if (badgeParam) return { title: "Special Offers", accent: "Curated Deals & Limited Packages", eyebrow: "Exclusive Offers" };
    if (destinationParam) return { title: `Journeys to ${destinationParam}`, accent: "Unforgettable Stays", eyebrow: "Destination Filtered" };
    if (searchParam) return { title: `Results for "${searchParam}"`, accent: "Discover your match", eyebrow: "Search Results" };
    return { title: "Explore All Journeys", accent: "Curated Experiences", eyebrow: "Discover & Wander" };
  };

  const headingInfo = getPageHeading();

  return (
    <div ref={revealRef} className="min-h-screen bg-slate-50">
      {/* Top Hero Banner */}
      <section className="relative flex min-h-[340px] items-end overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-12">
        <img className="absolute inset-0 h-full w-full object-cover object-center brightness-75" src={HERO_BG} alt="Explore tours background" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-4 left-10 h-56 w-56 rounded-full bg-amber-300/20 blur-2xl" />

        <div className="relative z-10 w-full max-w-5xl animate-fade-up">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">{headingInfo.eyebrow}</p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {headingInfo.title} <em className="text-amber-300 font-normal italic">{headingInfo.accent}</em>
          </h1>

          {/* Quick Category Tabs Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {QUICK_FILTERS.map(({ label, icon: Icon, match, getQuery }) => {
              const active = match(searchParams);
              return (
                <button
                  key={label}
                  onClick={() => {
                    const q = getQuery();
                    const next = new URLSearchParams();
                    if (searchParam) next.set("search", searchParam);
                    Object.entries(q).forEach(([k, v]) => next.set(k, v));
                    setSearchParams(next);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${active
                    ? "bg-amber-300 text-slate-950 shadow-md shadow-amber-300/30 scale-105"
                    : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  <Icon size={13} className={active ? "text-slate-950" : "text-amber-300"} />
                  <span>{label}</span>
                </button>
              );
            })}
            <button
              onClick={() => navigate("/custom-tour-enquiry")}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-300/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md transition hover:bg-amber-300/20"
            >
              <Sparkle size={13} />
              <span>Custom Enquiry</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-12">
        {/* Search Bar & Filter Controls */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-md shadow-slate-950/5">
          {/* Top Row: Search Input + Filter Toggle */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                id="tours-search-input"
                type="text"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-200/50"
                placeholder="Search packages by name, destination, route or highlight..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search tour packages"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFiltersMobile((prev) => !prev)}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 sm:hidden"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {hasActiveFilters && "•"}</span>
            </button>
          </div>
        </div>

        {/* Results Counter & Active Filter Pills */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {loading ? "Searching tours…" : error ? "Unable to load tours" : `Found ${pagination.total || packages.length} journey${(pagination.total || packages.length) === 1 ? "" : "s"}`}
            </span>
            {hasActiveFilters && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                Filtered
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Loading Skeleton / Package Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="h-44 w-full rounded-lg bg-slate-200" />
                <div className="mt-3 h-3 w-1/3 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-4 flex justify-between">
                  <div className="h-3 w-1/4 rounded bg-slate-200" />
                  <div className="h-6 w-1/3 rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={resetAllFilters}
              className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-xs font-bold text-rose-700 shadow-sm hover:bg-rose-100"
            >
              Reset Filters
            </button>
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Compass className="mx-auto text-slate-300" size={38} />
            <h3 className="mt-3 font-display text-lg font-semibold text-slate-800">No journeys found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any packages matching your active filters. Try adjusting your search or clearing some filters.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm hover:bg-amber-200 transition"
              >
                Clear all filters
              </button>
              <button
                onClick={() => navigate("/custom-tour-enquiry")}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                Plan custom tour
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {packages.map((pack, index) => (
              <PackageCard key={pack.id || pack.slug} pack={pack} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
              disabled={pageParam <= 1}
              onClick={() => updateParams({ page: pageParam - 1 })}
            >
              ← Previous
            </button>
            <span className="text-xs font-semibold text-slate-500">
              Page {pageParam} of {pagination.pages}
            </span>
            <button
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
              disabled={pageParam >= pagination.pages}
              onClick={() => updateParams({ page: pageParam + 1 })}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
