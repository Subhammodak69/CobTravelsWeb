import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BedDouble, MapPin, PackageOpen } from "lucide-react";
import Seo from "../components/Seo";
import PackageCard from "../components/PackageCard";
import { fetchAllDestinations, fetchHotels, fetchPackages } from "../api";

function hotelImage(hotel) {
  if (typeof hotel.image === "string") return hotel.image;
  return hotel.image?.[0]?.url || hotel.images?.[0]?.url || hotel.image_url || "";
}

export default function DestinationDetailsPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loadingDestination, setLoadingDestination] = useState(true);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
    const [activeTab, setActiveTab] = useState("packages");
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedError, setRelatedError] = useState("");
  const destinationUrl = `/destinations/${encodeURIComponent(destination?.slug || destination?.id || slug)}`;

  useEffect(() => {
    let active = true;
    setDestination(null);
    setLoadingDestination(true);
    fetchAllDestinations()
      .then((items) => {
        const match = items.find((item) => item.slug === slug || item.id === slug);
        if (active) setDestination(match || null);
      })
      .catch((error) => { if (active) setRelatedError(error.message || "Destination could not be loaded."); })
      .finally(() => { if (active) setLoadingDestination(false); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!destination) return undefined;
    let active = true;
    setLoadingRelated(true);
    setRelatedError("");
    Promise.allSettled([
      fetchPackages({ page: 1, page_size: 100, destination: destination.name }),
      fetchHotels(1, 100, destination.id),
    ])
      .then(([packageResult, hotelResult]) => {
        if (!active) return;
        setPackages(packageResult.status === "fulfilled" ? packageResult.value.items || [] : []);
        setHotels(hotelResult.status === "fulfilled" && Array.isArray(hotelResult.value?.data) ? hotelResult.value.data : []);
        if (packageResult.status === "rejected" || hotelResult.status === "rejected") {
          setRelatedError("Some travel options could not be loaded. Refresh to try again.");
        }
      })
      .finally(() => { if (active) setLoadingRelated(false); });
    return () => { active = false; };
  }, [destination]);

  if (loadingDestination) {
    return <div className="grid min-h-[50vh] place-items-center text-sm font-semibold text-slate-500">Loading destination…</div>;
  }

  if (!destination) {
    return <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-16 text-center"><p className="font-display text-2xl font-bold text-navy">Destination not found</p><Link to="/destinations" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft size={15} /> All destinations</Link></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Seo
        title={`${destination.name} Travel Guide | Gantabyaa`}
        description={destination.description || `Explore tour packages and hotels in ${destination.name} with Gantabyaa.`}
        path={`/destinations/${destination.slug || destination.id}`}
      />
      <section className="relative flex min-h-[250px] items-end overflow-hidden bg-navy px-4 pb-8 pt-16 text-white sm:min-h-[250px] sm:px-6 sm:pb-12">
        {destination.image_url && <img src={destination.image_url} alt={destination.name} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-navy/25" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <Link to="/destinations" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/85 hover:text-white"><ArrowLeft size={16} /> All destinations</Link>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-white/80"><MapPin size={14} />{destination.country || (destination.is_domestic ? "India" : "International")}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">{destination.name}</h1>
          {destination.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">{destination.description}</p>}
        </div>
      </section>

      <div className="sticky top-14 z-20 border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl gap-1" role="tablist" aria-label="Destination content">
          <button
            id="destination-packages-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "packages"}
            aria-controls="destination-packages-panel"
            onClick={() => setActiveTab("packages")}
            className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-bold transition-colors ${activeTab === "packages" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-navy"}`}
          >
            <PackageOpen size={16} /> Tour Packages <span className="text-xs opacity-70">{loadingRelated ? "…" : packages.length}</span>
          </button>
          <button
            id="destination-hotels-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "hotels"}
            aria-controls="destination-hotels-panel"
            onClick={() => setActiveTab("hotels")}
            className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-bold transition-colors ${activeTab === "hotels" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-navy"}`}
          >
            <BedDouble size={16} /> Hotels <span className="text-xs opacity-70">{loadingRelated ? "…" : hotels.length}</span>
          </button>
        </div>
      </div>

      {activeTab === "packages" && <section id="destination-packages-panel" role="tabpanel" aria-labelledby="destination-packages-tab" className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:py-12">
        {relatedError && <p role="alert" className="mb-6 rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700">{relatedError}</p>}
        <div className="mb-5 flex items-end justify-between gap-3">
          <div><p className="eyebrow">Curated itineraries</p><h2 className="section-title">Packages in {destination.name}</h2></div>
          <span className="text-sm font-semibold text-slate-500">{loadingRelated ? "Loading…" : `${packages.length} packages`}</span>
        </div>
        {loadingRelated ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-xl bg-slate-200" />)}</div> : packages.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{packages.map((pack, index) => <PackageCard key={pack.id || pack.slug} pack={pack} index={index} />)}</div> : <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No packages are listed for this destination yet.</p>}
      </section>}

      {activeTab === "hotels" && <section id="destination-hotels-panel" role="tabpanel" aria-labelledby="destination-hotels-tab" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:py-12">
          {relatedError && <p role="alert" className="mb-6 rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700">{relatedError}</p>}
          <div className="mb-5 flex items-end justify-between gap-3">
            <div><p className="eyebrow">Stay nearby</p><h2 className="section-title">Hotels in {destination.name}</h2></div>
            <span className="text-sm font-semibold text-slate-500">{loadingRelated ? "Loading…" : `${hotels.length} hotels`}</span>
          </div>
          {loadingRelated ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-xl bg-slate-100" />)}</div> : hotels.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <Link key={hotel.id} to={`${destinationUrl}/hotels/${encodeURIComponent(hotel.id)}`} state={{ hotel, destination }} className="flex min-h-36 overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-primary-300 hover:shadow-card">
                  {hotelImage(hotel) ? <img src={hotelImage(hotel)} alt={hotel.name} loading="lazy" className="w-28 shrink-0 object-cover sm:w-36" /> : <div className="grid w-28 shrink-0 place-items-center bg-primary-50 text-primary sm:w-36"><BedDouble size={25} /></div>}
                  <div className="min-w-0 p-4">
                    <p className="text-[10px] font-bold uppercase text-primary">{hotel.category || "Hotel"}</p>
                    <h3 className="mt-1 font-display text-base font-bold text-navy">{hotel.name}</h3>
                    {hotel.address && <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{hotel.address}</p>}
                    {hotel.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{hotel.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">No hotels are listed for this destination yet.</p>}
        </div>
      </section>}
    </main>
  );
}