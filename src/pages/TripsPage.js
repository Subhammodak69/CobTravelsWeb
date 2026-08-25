import { useEffect, useState } from "react";
import { fetchEnquiries } from "../api";

function date(value) { const d = new Date(value); return value && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date to be confirmed"; }

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchEnquiries().then((r) => { const d = r?.data; setTrips((Array.isArray(d) ? d : d?.items || []).filter((item) => item.travel_date || item.destination)); }).catch(() => setTrips([])).finally(() => setLoading(false)); }, []);
  return <main className="min-h-screen bg-slate-50 px-6 pb-24 pt-32 sm:px-8 lg:px-16"><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">Your travel plans</p><h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">My <em className="text-amber-500">trips.</em></h1><p className="mt-5 text-sm leading-7 text-slate-500">Your planned journeys will appear here as your travel plans take shape.</p>{loading ? <div className="mt-10 rounded-[1.5rem] bg-white p-8 text-slate-500">Loading your trips...</div> : trips.length ? <div className="mt-10 grid gap-5 lg:grid-cols-2">{trips.map((trip) => <article key={trip.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-950/5"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{trip.enquiry_code || "Planned journey"}</p><h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">{trip.destination || trip.subject || "Your journey"}</h2><p className="mt-4 text-sm text-slate-600">Travel date: <b>{date(trip.travel_date)}</b></p><p className="mt-2 text-sm text-slate-600">{trip.pax_no || 1} traveller{Number(trip.pax_no) === 1 ? "" : "s"} · {trip.status || "NEW"}</p></article>)}</div> : <div className="mt-10 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-8 text-slate-500">No trips found yet. Start with an enquiry for a journey you love.</div>}</main>;
}
