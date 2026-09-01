import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEnquiries } from "../api";
import { MapPin, Calendar, Users, Plane, LoaderCircle } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=90";

function formatDate(value) {
  const d = new Date(value);
  return value && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Date to be confirmed";
}

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries()
      .then((r) => {
        const d = r?.data;
        setTrips((Array.isArray(d) ? d : d?.items || []).filter((item) => item.travel_date || item.destination));
      })
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      {/* Top Banner */}
      <section className="relative flex min-h-[220px] items-center overflow-hidden bg-navy px-4 pb-8 pt-8 text-white sm:px-6 lg:px-12">
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
            Bookings & Itineraries
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            My <span className="text-primary-300">Trips</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/80 max-w-xl">
            Track confirmed bookings and itineraries as your upcoming journeys take shape.
          </p>
        </div>
      </section>

      {/* Trips Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {loading ? (
          <div className="card flex items-center justify-center p-12 text-slate-400">
            <LoaderCircle className="animate-spin text-primary" size={26} />
          </div>
        ) : trips.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {trips.map((trip) => (
              <article key={trip.id} className="card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {trip.enquiry_code || "PLANNED TRIP"}
                    </span>
                    <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary border border-primary-200">
                      {trip.status || "NEW"}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-navy">
                    {trip.destination || trip.subject || "Custom Journey"}
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary" />
                      <span>{formatDate(trip.travel_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-primary" />
                      <span>{trip.pax_no || 1} Traveller{Number(trip.pax_no) === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-400 text-[11px]">Coochbehar Travel Team</span>
                  <Link to="/custom-tour-enquiry" className="font-bold text-primary hover:underline">
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Plane className="mx-auto text-primary-300" size={36} />
            <h2 className="mt-3 font-display text-lg font-bold text-navy">No Trips Scheduled Yet</h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              You haven't booked any upcoming holiday packages yet. Ready to start planning?
            </p>
            <Link to="/tours" className="btn-primary mt-6 text-xs font-bold">
              Explore Available Tours →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
