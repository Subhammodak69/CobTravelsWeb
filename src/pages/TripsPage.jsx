import { useEffect, useState } from "react";
import { fetchEnquiries } from "../api";

// Unsplash hero image — beautiful travel destination
const HERO_IMG = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=90";

function date(value) { const d = new Date(value); return value && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date to be confirmed"; }

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchEnquiries().then((r) => { const d = r?.data; setTrips((Array.isArray(d) ? d : d?.items || []).filter((item) => item.travel_date || item.destination)); }).catch(() => setTrips([])).finally(() => setLoading(false)); }, []);
  return <main className="bg-slate-50">
      <section className="relative flex min-h-[380px] overflow-hidden px-4 pb-12 pt-32 text-white sm:px-6 lg:px-12">
        <img className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition duration-1000" src={HERO_IMG} alt="Your travel journeys" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900/50 to-indigo-900/20" />
        <div className="absolute -right-40 -top-48 h-[36rem] w-[36rem] rounded-full bg-cyan-400/25 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-float" />
        <div className="relative z-10 flex max-w-2xl flex-col justify-center animate-fade-up">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">Your travel plans</p>
          <h1 className="font-display text-2xl font-semibold leading-[1.1] tracking-tight sm:text-3xl lg:text-4xl">My <em className="text-amber-300">trips.</em></h1>
          <p className="mt-2 max-w-lg text-[10px] leading-4 text-white/75">Your planned journeys will appear below as your travel plans take shape.</p>
        </div>
      </section>
      <section className="px-4 pb-24 sm:px-6 lg:px-12">
        {loading ? <div className="mt-10 rounded-[1.5rem] bg-white p-8 text-slate-500">Loading your trips...</div> : trips.length ? <div className="mt-10 grid gap-5 lg:grid-cols-2">{trips.map((trip) => <article key={trip.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-950/5"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{trip.enquiry_code || "Planned journey"}</p><h2 className="mt-2 font-display text-2xl font-semibold text-slate-950">{trip.destination || trip.subject || "Your journey"}</h2><p className="mt-4 text-sm text-slate-600">Travel date: <b>{date(trip.travel_date)}</b></p><p className="mt-2 text-sm text-slate-600">{trip.pax_no || 1} traveller{Number(trip.pax_no) === 1 ? "" : "s"} · {trip.status || "NEW"}</p></article>)}</div> : <div className="mt-10 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-8 text-slate-500">No trips found yet. Start with an enquiry for a journey you love.</div>}
      </section>
    </main>;
}
