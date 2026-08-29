// PackageGallery.jsx - Fixed hooks ordering
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

// Helper to check if item is video
const isVideo = (item) => {
  return item.type === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(item.url);
};

export default function PackageGallery({ pack }) {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Filter gallery - only images, no videos (MUST be before early return)
  const gallery = (pack.gallery || [])
    .filter((item) => {
      const url = typeof item === "string" ? item : item?.url;
      return url && (typeof item === "string" || item.type !== "video") && !/\.(mp4|webm|ogg)(\?|$)/i.test(url);
    })
    .map((item) => typeof item === "string" ? { url: item, type: "image" } : item);

  // Hooks must be called before any early return
  const openModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
  };

  const prevImage = useCallback(() => {
    setModalIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  }, [gallery.length]);

  const nextImage = useCallback(() => {
    setModalIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  }, [gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen, prevImage, nextImage]);

  // Early return AFTER all hooks
  if (!gallery.length) return null;

  const selected = gallery[active] || gallery[0];

  return (
    <>
      <section className="bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-1">Through our lens</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 font-display">
              Scenes worth <br className="hidden sm:block" /><span className="text-amber-500">remembering.</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Scenes from this journey supplied by Coochbehar Travel.
          </p>
        </div>

        {/* GALLERY GRID */}
        <div className="grid gap-3 lg:grid-cols-[1fr_140px]">
          {/* Main Image */}
          <div 
            className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-200 cursor-pointer group lg:h-[480px]"
            onClick={() => openModal(active)}
          >
            {isVideo(selected) ? (
              <video className="h-full w-full object-cover" src={selected.url} controls />
            ) : (
              <>
                <img 
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                  src={selected.url} 
                  alt={selected.alt || pack.title + " gallery"} 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition" size={24} />
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-1">
            {gallery.map((item, index) => (
              <button
                key={item.id || item.url + index}
                className={`h-14 overflow-hidden rounded-xl border-2 transition hover:scale-105 lg:h-[108px] ${
                  index === active ? "border-amber-400 opacity-100 shadow-md shadow-amber-400/20" : "border-transparent opacity-60 hover:opacity-80"
                }`}
                onClick={() => setActive(index)}
                aria-label={`View ${item.alt || "gallery item"}`}
              >
                {isVideo(item) ? (
                  <video className="h-full w-full object-cover" src={item.url} muted />
                ) : (
                  <img className="h-full w-full object-cover" src={item.url} alt={item.alt || ""} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="mt-3 text-center text-[10px] text-slate-400">
          {active + 1} / {gallery.length}
        </div>
      </section>

      {/* FULL-SCREEN MODAL */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition p-2 rounded-full hover:bg-white/10"
            aria-label="Close gallery"
          >
            <X size={28} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium bg-black/50 px-3 py-1 rounded-full">
            {modalIndex + 1} / {gallery.length}
          </div>

          {/* Main Image */}
          <div 
            className="w-full h-full flex items-center justify-center p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {gallery[modalIndex] && (
              <img
                src={gallery[modalIndex].url}
                alt={gallery[modalIndex].alt || "Gallery image"}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 sm:left-4 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 sm:right-4 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              {/* Thumbnail strip at bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 rounded-xl backdrop-blur-sm max-w-[90vw] overflow-x-auto">
                {gallery.map((item, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setModalIndex(index); }}
                    className={`h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      index === modalIndex ? "border-amber-400" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Minimize hint */}
          <div className="absolute bottom-20 text-white/20 text-[10px] hidden sm:block">
            Press ESC to close · Arrow keys to navigate
          </div>
        </div>
      )}
    </>
  );
}