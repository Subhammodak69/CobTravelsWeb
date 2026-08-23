import { useState } from "react";

function isVideo(item) {
  return item.type === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(item.url);
}

export default function PackageGallery({ pack }) {
  const [active, setActive] = useState(0);
  const gallery = (pack.gallery || []).filter((item) => { const url = typeof item === "string" ? item : item?.url; return url && (typeof item === "string" || item.type !== "video") && !/\.(mp4|webm|ogg)(\?|$)/i.test(url); }).map((item) => typeof item === "string" ? { url: item, type: "image" } : item);
  if (!gallery.length) return null;
  const selected = gallery[active] || gallery[0];

  return (
    <section className="bg-slate-100 px-6 py-20 sm:px-8 lg:px-16 lg:py-28">
      <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">Through our lens</p><h2 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl">Scenes worth<br /><em className="text-amber-500">remembering.</em></h2></div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">Scenes from this journey supplied by Coochbehar Travel.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_170px]">
        {isVideo(selected) ? <video className="h-[360px] w-full rounded-[2rem] object-cover shadow-glow animate-fade-up lg:h-[540px]" src={selected.url} controls /> : <img className="h-[360px] w-full rounded-[2rem] object-cover shadow-glow animate-fade-up lg:h-[540px]" src={selected.url} alt={selected.alt || pack.title + " gallery"} />}
        <div className="grid grid-cols-4 gap-3 lg:grid-cols-1">
          {gallery.map((item, index) => (
            <button className={`h-20 overflow-hidden rounded-2xl border-2 transition hover:scale-105 lg:h-[126px] ${index === active ? "border-amber-400 opacity-100 shadow-lg shadow-amber-400/20" : "border-transparent opacity-60"}`} onClick={() => setActive(index)} key={item.id || item.url + index} aria-label={`View ${item.alt || "gallery item"}`}>
              {isVideo(item) ? <video className="h-full w-full object-cover" src={item.url} muted /> : <img className="h-full w-full object-cover" src={item.url} alt={item.alt || ""} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
