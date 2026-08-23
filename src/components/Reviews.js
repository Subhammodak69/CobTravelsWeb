export default function Reviews({ reviews = [] }) {
  const score = reviews.length
    ? (reviews.reduce((sum, item) => {
        const review = Array.isArray(item) ? { rating: item[1] } : item;
        return sum + Number(review.rating || 0);
      }, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <section className="bg-white px-6 py-20 sm:px-8 lg:px-16 lg:py-28">
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">Traveller notes</p>
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl">Loved by people<br />who went.</h2>
        </div>
        <div className="rounded-[1.5rem] bg-slate-950 px-6 py-5 text-white shadow-glow">
          <b className="block font-display text-5xl font-semibold leading-none">{score}</b>
          <span className="text-amber-300">★★★★★</span>
          <p className="mt-1 text-xs text-white/55">Based on {reviews.length} reviews</p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {reviews.map((item, index) => {
          const r = Array.isArray(item) ? { name: item[0], rating: item[1], review: item[2] } : item;
          return (
            <article className={`animate-fade-up rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-950/5 transition hover:-translate-y-1 hover:border-amber-200 hover:bg-white motion-reduce:animate-none ${index === 1 ? "[animation-delay:120ms]" : index > 1 ? "[animation-delay:240ms]" : ""}`} key={r.id || r.name || index}>
              <div className="flex items-center gap-3">
                {r.reviewer_pic ? <img className="h-11 w-11 rounded-2xl object-cover" src={r.reviewer_pic} alt={r.name} /> : <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300 font-display text-xl font-semibold text-slate-950">{(r.name || "?")[0]}</div>}
                <span className="flex min-w-0 flex-1 flex-col">
                  <b className="truncate text-sm text-slate-950">{r.name || r.reviewer_by}</b>
                  <small className="text-xs text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "Verified traveller"}</small>
                </span>
                <em className="text-xs not-italic text-amber-400">{"★".repeat(Number(r.rating || 0))}</em>
              </div>
              <p className="mt-5 font-display text-xl leading-8 text-slate-700">“{r.review}”</p>
              {r.review_gallery?.length > 0 && (
                <div className="mt-5 flex gap-2 overflow-x-auto">
                  {r.review_gallery.map((media, i) => media.type === "video"
                    ? <a className="grid h-16 w-24 flex-none place-items-center rounded-xl bg-slate-200 text-xs font-bold text-slate-700" href={media.url} target="_blank" rel="noreferrer" key={media.id || i}>▶ Video</a>
                    : <img className="h-16 w-24 flex-none rounded-xl object-cover" src={media.url} alt={media.alt || "Review"} key={media.id || i} />)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
