import { useEffect, useRef, useState } from "react";
import { useTravel } from "../contexts/TravelContext";
import EnquiryModal from "./EnquiryModal";
import { addToWishlist, removeFromWishlist } from "../api";
import { Heart, LoaderCircle } from "lucide-react";

export default function PackageCard({ pack, index }) {
  const { selectPackage, isMember } = useTravel();
  const videoRef = useRef(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [wishlistState, setWishlistState] = useState(pack.is_wishlist ? "added" : "idle");

  useEffect(() => { setWishlistState(pack.is_wishlist ? "added" : "idle"); }, [pack.is_wishlist]);

  const playVideo = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };
  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleWishlist = async (event) => {
    event.stopPropagation();
    if (!isMember) return window.location.assign("/login");
    setWishlistState("loading");
    try { if (wishlistState === "added") { await removeFromWishlist(pack.slug || pack.id); setWishlistState("idle"); } else { await addToWishlist(pack.slug || pack.id); setWishlistState("added"); } }
    catch { setWishlistState("error"); }
  };

  return (
    <>
      <article
        className={`group animate-fade-up cursor-pointer overflow-hidden rounded-lg border border-white/70 bg-white shadow-md shadow-slate-950/5 transition duration-500 hover:-translate-y-1 hover:shadow-lg motion-reduce:animate-none ${index % 3 === 1 ? "[animation-delay:120ms]" : index % 3 === 2 ? "[animation-delay:240ms]" : ""}`}
        onClick={() => selectPackage(pack.id)}
        onMouseEnter={playVideo}
        onMouseLeave={stopVideo}
      >
        <div className="relative h-40 overflow-hidden bg-slate-200 sm:h-48">
          <img className="h-full w-full object-cover transition duration-700 group-hover:scale-110" src={pack.image} alt={pack.title} />
          {pack.video && <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" src={pack.video} muted loop playsInline preload="metadata" aria-hidden="true" />}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
          <span className="absolute left-2 top-2 rounded-full bg-white/15 px-2 py-0.5 text-[8px] font-bold tracking-[0.2em] text-white backdrop-blur">0{index + 1}</span>
          {pack.badge && <span className="absolute right-2 top-2 rounded-full bg-amber-300 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-950 shadow-md shadow-amber-300/30">{pack.badge}</span>}
          <button className={`absolute right-2 top-10 grid h-8 w-8 place-items-center rounded-lg shadow-md transition hover:scale-105 ${wishlistState === "added" ? "bg-rose-500 text-white" : "bg-white text-slate-950 hover:bg-amber-300"}`} onClick={toggleWishlist} disabled={wishlistState === "loading"} aria-label={wishlistState === "added" ? `Remove ${pack.title} from wishlist` : `Add ${pack.title} to wishlist`} title={wishlistState === "added" ? "Remove from wishlist" : "Add to wishlist"}>{wishlistState === "loading" ? <LoaderCircle size={14} className="animate-spin" /> : <Heart size={14} fill={wishlistState === "added" ? "currentColor" : "none"} />}</button>
          <button className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-lg bg-white text-sm text-slate-950 shadow-md transition group-hover:rotate-6 group-hover:bg-amber-300" aria-label={`Explore ${pack.title}`}>↗</button>
        </div>
        <div className="p-3 sm:p-3.5">
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 truncate">{pack.code} · {pack.season_name || pack.destination}</p>
          <h3 className="mb-2 font-display text-sm font-semibold leading-tight tracking-tight text-slate-950 sm:text-base line-clamp-2">{pack.title}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 text-[9px] font-semibold text-slate-500">
              <span className="truncate">{pack.destination}</span>
              <span className="flex-shrink-0">{pack.type}</span>
            </div>
            <button
              id={`enquire-btn-${pack.id}`}
              onClick={(e) => { e.stopPropagation(); setEnquiryOpen(true); }}
              className="rounded-lg bg-amber-300 px-2.5 py-1.5 text-[11px] font-bold text-slate-950 shadow-sm shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200 w-full"
              aria-label={`Enquire about ${pack.title}`}
            >
              Enquire
            </button>
          </div>
        </div>
      </article>

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        packageId={pack.package_id || pack.id}
        packageSlug={pack.slug || pack.id}
        variantId={pack.default_variant_id || ""}
        packageTitle={pack.title}
      />

    </>
  );
}
