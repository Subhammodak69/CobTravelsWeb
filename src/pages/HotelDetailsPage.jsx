import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, BedDouble, MapPin, Phone } from "lucide-react";
import Seo from "../components/Seo";
import PackageGallery from "../components/PackageGallery";
import { fetchAllDestinations, fetchHotels } from "../api";

function hotelGallery(hotel) {
  const source = Array.isArray(hotel.image)
    ? hotel.image
    : Array.isArray(hotel.images)
      ? hotel.images
      : Array.isArray(hotel.gallery)
        ? hotel.gallery
        : hotel.image_url
          ? [hotel.image_url]
          : [];

  return source.map((item) => {
    if (typeof item === "string") return { url: item, type: "image", alt: hotel.name };
    return { ...item, url: item?.url || item?.image_url || "", alt: item?.alt || hotel.name };
  }).filter((item) => item.url);
}

function hotelCover(hotel) {
  return hotelGallery(hotel)[0]?.url || "";
}

export default function HotelDetailsPage() {
  const { slug, hotelId } = useParams();
  const location = useLocation();
  const [destination, setDestination] = useState(location.state?.destination || null);
  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const gallery = useMemo(() => hotel ? hotelGallery(hotel) : [], [hotel]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchAllDestinations()
      .then(async (destinations) => {
        const selectedDestination = destinations.find((item) => item.slug === slug || item.id === slug);
        if (!selectedDestination) throw new Error("Destination not found.");
        const response = await fetchHotels(1, 100, selectedDestination.id);
        const items = Array.isArray(response?.data) ? response.data : [];
        const selectedHotel = items.find((item) => item.id === hotelId);
        if (!selectedHotel) throw new Error("Hotel not found.");
        if (active) {
          setDestination(selectedDestination);
          setHotel(selectedHotel);
        }
      })
      .catch((loadError) => { if (active) setError(loadError.message || "Hotel details could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [hotelId, slug]);

  if (loading && !hotel) {
    return <div className="grid min-h-[50vh] place-items-center text-sm font-semibold text-slate-500">Loading hotel…</div>;
  }

  if (!hotel || !destination) {
    return <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-16 text-center"><p className="font-display text-2xl font-bold text-navy">{error || "Hotel not found"}</p><Link to={`/destinations/${slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft size={15} /> Back to destination</Link></main>;
  }

  const cover = hotelCover(hotel);
  const destinationUrl = `/destinations/${encodeURIComponent(destination.slug || destination.id)}`;

  return (
    <main className="min-h-screen bg-slate-50">
      <Seo
        title={`${hotel.name} | ${destination.name} Hotels | Gantabyaa`}
        description={hotel.description || `${hotel.name} hotel information, address, contact details and photo gallery in ${destination.name}.`}
        path={`${destinationUrl}/hotels/${hotel.id}`}
      />
      <section className="relative flex min-h-[280px] items-end overflow-hidden bg-navy px-4 pb-8 pt-14 text-white sm:min-h-[340px] sm:px-6 sm:pb-10">
        {cover && <img src={cover} alt={hotel.name} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/65 to-navy/25" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <Link to={destinationUrl} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-white/85 hover:text-white"><ArrowLeft size={16} /> {destination.name}</Link>
          <p className="text-xs font-bold uppercase tracking-wider text-white/75">{hotel.category || "Hotel"} · {destination.name}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">{hotel.name}</h1>
          {hotel.address && <p className="mt-3 flex items-start gap-2 text-sm text-white/85"><MapPin size={16} className="mt-0.5 shrink-0" />{hotel.address}</p>}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-10">
        <div className="min-w-0">
          <p className="eyebrow">ABOUT THE PROPERTY</p>
          <h2 className="section-title">Hotel information</h2>
          <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600">{hotel.description || "More information about this property will be available soon."}</p>
        </div>
        <aside className="h-fit border-y border-slate-200 bg-white px-4 py-4 sm:rounded-xl sm:border">
          <h2 className="font-display text-lg font-bold text-navy">At a glance</h2>
          <dl className="mt-3 divide-y divide-slate-100">
            <div className="py-3"><dt className="text-[10px] font-bold uppercase text-slate-400">Destination</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{destination.name}, {destination.country}</dd></div>
            <div className="py-3"><dt className="text-[10px] font-bold uppercase text-slate-400">Category</dt><dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><BedDouble size={15} className="text-primary" />{hotel.category || "Hotel"}</dd></div>
            {hotel.address && <div className="py-3"><dt className="text-[10px] font-bold uppercase text-slate-400">Address</dt><dd className="mt-1 text-sm leading-5 text-slate-700">{hotel.address}</dd></div>}
            {hotel.contact && <div className="py-3"><dt className="text-[10px] font-bold uppercase text-slate-400">Contact</dt><dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><Phone size={14} className="text-primary" />{hotel.contact}</dd></div>}
          </dl>
        </aside>
      </section>

      {gallery.length > 0 ? (
        <PackageGallery pack={{ title: hotel.name, gallery }} openThumbnailsInModal />
      ) : (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6"><p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No photos are available for this hotel.</p></section>
      )}
    </main>
  );
}
