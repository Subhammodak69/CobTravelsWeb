import { useRef, useState } from "react";
import { useTravel } from "../contexts/TravelContext";
import EnquiryModal from "./EnquiryModal";

export default function PackageCard({ pack, index }) {
  const { selectPackage } = useTravel();
  const videoRef = useRef(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const playVideo = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };
  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <article
        className={`group animate-fade-up cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-xl shadow-slate-950/5 transition duration-500 hover:-translate-y-2 hover:shadow-glow motion-reduce:animate-none ${index % 3 === 1 ? "[animation-delay:120ms]" : index % 3 === 2 ? "[animation-delay:240ms]" : ""}`}
        onClick={() => selectPackage(pack.id)}
        onMouseEnter={playVideo}
        onMouseLeave={stopVideo}
      >
        <div className="relative h-72 overflow-hidden bg-slate-200">
          <img className="h-full w-full object-cover transition duration-700 group-hover:scale-110" src={pack.image} alt={pack.title} />
          {pack.video && <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" src={pack.video} muted loop playsInline preload="metadata" aria-hidden="true" />}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-white backdrop-blur">0{index + 1}</span>
          {pack.badge && <span className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-300/30">{pack.badge}</span>}
          <button className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl text-slate-950 shadow-lg transition group-hover:rotate-6 group-hover:bg-amber-300" aria-label={`Explore ${pack.title}`}>↗</button>
        </div>
        <div className="p-5 sm:p-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{pack.code} <span>·</span> {pack.season_name || pack.destination}</p>
          <h3 className="mb-4 font-display text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{pack.title}</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4 text-xs font-semibold text-slate-500">
              <span>{pack.destination}</span>
              <span>{pack.type}</span>
            </div>
            <button
              id={`enquire-btn-${pack.id}`}
              onClick={(e) => { e.stopPropagation(); setEnquiryOpen(true); }}
              className="rounded-xl bg-amber-300 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200"
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
        packageId={pack.id}
        packageTitle={pack.title}
      />
    </>
  );
}
