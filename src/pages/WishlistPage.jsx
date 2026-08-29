// WishlistPage.jsx
import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, LoaderCircle, Trash2 } from "lucide-react";
import { fetchWishlist, removeFromWishlist } from "../api";

function WishlistCard({ item, onRemove }) {
  const [removing, setRemoving] = useState(false);
  
  const remove = async () => {
    setRemoving(true);
    try {
      await onRemove(item);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-slate-200">
        <img 
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
          src={item.banner?.image || item.image || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85"} 
          alt={item.title || item.destination || "Saved journey"} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
          {item.type || "Journey"}
        </span>
        <Heart className="absolute right-3 top-3 text-rose-400" size={18} fill="currentColor" />
      </div>
      
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-500">
          {item.tour_code || item.season_name || item.destination}
        </p>
        <h2 className="mt-1.5 text-base font-semibold text-slate-950 line-clamp-1">
          {item.title || "Saved journey"}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
          {item.description || `A journey through ${item.destination || "somewhere wonderful"}.`}
        </p>
        
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span className="text-[10px] text-slate-400">
            Saved {item.wishlisted_at ? new Date(item.wishlisted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "recently"}
          </span>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={remove} 
              disabled={removing} 
              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-300 hover:text-rose-500 disabled:opacity-50"
              aria-label={`Remove ${item.title || "journey"} from wishlist`}
              title="Remove from wishlist"
            >
              {removing ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
            <a 
              href={`/journey/${item.slug || item.package_id}`} 
              className="grid h-7 w-7 place-items-center rounded-lg bg-amber-300 text-slate-950 transition hover:bg-amber-200"
              aria-label={`View ${item.title || "journey"}`}
              title="View journey"
            >
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = () => {
    setLoading(true);
    fetchWishlist()
      .then((response) => {
        const data = response?.data;
        setItems(Array.isArray(data) ? data : data?.items || data?.results || []);
      })
      .catch((err) => setError(err.message || "Could not load your wishlist."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const remove = async (item) => {
    try {
      // Use the package slug or ID to remove from wishlist
      const identifier = item.slug || item.package_id || item.id;
      await removeFromWishlist(identifier);
      setItems((current) => current.filter((saved) => saved.id !== item.id));
    } catch (err) {
      setError(err.message || "Could not remove this journey.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-1">Saved for later</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 font-display">
            Your <span className="text-amber-500">wishlist.</span>
          </h1>
          <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
            The journeys that caught your eye, kept together until you are ready to go.
          </p>
        </div>
        <Heart className="hidden sm:block text-rose-400" size={28} fill="currentColor" />
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-600">✕</button>
        </div>
      )}

      {/* WISHLIST GRID */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-slate-400">
          <LoaderCircle className="animate-spin" size={22} />
        </div>
      ) : items.length ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} onRemove={remove} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Heart className="mx-auto text-slate-300" size={28} />
          <h2 className="mt-3 text-base font-semibold text-slate-800">Nothing saved yet</h2>
          <p className="mt-1 text-xs text-slate-500">Tap the heart on a journey to keep it close.</p>
          <a 
            href="/#journeys" 
            className="mt-4 inline-flex rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm hover:bg-amber-200 transition"
          >
            Explore journeys
          </a>
        </div>
      )}

      {/* COUNT FOOTER */}
      {!loading && items.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200/80 pt-4">
          <span>{items.length} journey{items.length === 1 ? "" : "s"} saved</span>
          <span>❤️ {items.length} hearts</span>
        </div>
      )}
    </div>
  );
}