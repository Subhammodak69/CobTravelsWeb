import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEnquiries } from "../api";
import { useTravel } from "../contexts/TravelContext";

function formatDate(value) {
  if (!value) return "Date not set";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

const STATUS_THEMES = {
  NEW: "bg-amber-100 text-amber-800 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  QUOTED: "bg-purple-100 text-purple-800 border-purple-200",
  CONVERTED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
  CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
};

const card = "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5";

export default function EnquiriesPage() {
  const { isMember } = useTravel();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchEnquiries()
      .then((response) => {
        const data = response?.data;
        setItems(Array.isArray(data) ? data : data?.items || data?.results || []);
      })
      .catch((err) => setError(err.message || "Could not load your enquiries."))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = activeFilter === "ALL"
    ? items
    : items.filter((item) => (item.status || "NEW") === activeFilter);

  const statuses = ["ALL", ...Array.from(new Set(items.map((i) => i.status || "NEW")))];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Header Banner */}
      <section className="relative flex min-h-[260px] items-end overflow-hidden px-6 pb-8 pt-20 text-white sm:min-h-[300px] sm:px-8 sm:pt-24 lg:px-16">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=90"
          alt="Enquiries and journeys"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />

        <div className="relative z-10 max-w-4xl animate-fade-up">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
            Your Travel Dashboard
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            My <em className="text-amber-300">Enquiries.</em>
          </h1>
          <p className="mt-2.5 max-w-2xl text-xs leading-5 text-white/80 sm:text-sm">
            Track your journey proposals, custom itineraries, and stay updated with your travel concierge.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-6 lg:px-12">
        {/* Actions Bar & Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                  activeFilter === status
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status} {status !== "ALL" && `(${items.filter((i) => (i.status || "NEW") === status).length})`}
              </button>
            ))}
          </div>

          <Link
            to="/custom-tour"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-300 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            Plan Custom Tour <span>→</span>
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-600" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className={`${card} mt-6 flex flex-col items-center justify-center p-10 text-center`}>
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-amber-300 border-t-slate-900" />
            <p className="mt-3 text-xs font-semibold text-slate-600">Loading your enquiries…</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className={`${card} mt-6 flex flex-col items-center justify-center p-10 text-center`}>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-xl text-amber-700">
              ✈
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-950 sm:text-xl">
              {activeFilter === "ALL" ? "No enquiries found" : `No enquiries with status "${activeFilter}"`}
            </h3>
            <p className="mt-1.5 max-w-md text-xs text-slate-500">
              {activeFilter === "ALL"
                ? "You haven't requested any custom tours or package quotes yet. Ready to start planning?"
                : "Try switching filters to view other enquiries."}
            </p>
            {activeFilter === "ALL" && (
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  to="/"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Explore Packages
                </Link>
                <Link
                  to="/custom-tour"
                  className="rounded-lg bg-amber-300 px-4 py-2 text-[11px] font-bold text-slate-950 shadow-md shadow-amber-300/25 transition hover:bg-amber-200"
                >
                  Request Custom Itinerary
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const status = item.status || "NEW";
              const themeCls = STATUS_THEMES[status] || "bg-slate-100 text-slate-700 border-slate-200";

              return (
                <article
                  key={item.id || item.enquiry_code}
                  className={`${card} flex flex-col justify-between p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <div>
                    {/* Header: Code & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                          {item.enquiry_code || "ENQUIRY"}
                        </span>
                        <h2 className="mt-0.5 truncate font-display text-base font-semibold leading-tight text-slate-950 sm:text-lg">
                          {item.subject || item.destination || "Custom Itinerary"}
                        </h2>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${themeCls}`}>
                        {status.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
                      <div>
                        <span className="mb-0.5 block font-medium text-slate-400">Channel</span>
                        <b className="text-slate-900">{item.channel || "WEBSITE"}</b>
                      </div>
                      <div>
                        <span className="mb-0.5 block font-medium text-slate-400">Type</span>
                        <b className="text-slate-900">{item.enquiry_type?.replace(/_/g, " ") || "TOUR"}</b>
                      </div>
                      <div>
                        <span className="mb-0.5 block font-medium text-slate-400">Travel Date</span>
                        <b className="text-slate-900">{formatDate(item.travel_date)}</b>
                      </div>
                      <div>
                        <span className="mb-0.5 block font-medium text-slate-400">Travellers / Rooms</span>
                        <b className="text-slate-900">{item.pax_no || 1} Pax · {item.no_room || 1} Rm</b>
                      </div>
                    </div>

                    {/* Message / Special Request */}
                    {item.message && (
                      <p className="mt-3 rounded-lg border border-slate-100 bg-white p-2.5 text-[11px] italic leading-relaxed text-slate-500">
                        "{item.message}"
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                    <span>Submitted {formatDate(item.created_at)}</span>
                    {item.mobile && <span className="font-medium text-slate-600">📞 {item.mobile}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}