export default function Reviews({ reviews = [] }) {
  const score = reviews.length
    ? (reviews.reduce((sum, item) => {
        const review = Array.isArray(item) ? { rating: item[1] } : item;
        return sum + Number(review.rating || 0);
      }, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">Traveller notes</p>
          <h2 className="font-display text-2xl font-semibold leading-none tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">Loved by people who went.</h2>
        </div>
        <div className="rounded-lg bg-slate-950 px-4 py-3 text-white shadow-md">
          <b className="block font-display text-3xl font-semibold leading-none">{score}</b>
          <span className="text-amber-300 text-sm">★★★★★</span>
          <p className="mt-0.5 text-[9px] text-white/55">Based on {reviews.length} reviews</p>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {reviews.map((item, index) => {
          const r = Array.isArray(item) ? { name: item[0], rating: item[1], review: item[2] } : item;
          return (
            <article className={`animate-fade-up rounded-lg border border-slate-200 bg-slate-50 p-3.5 shadow-md shadow-slate-950/5 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white motion-reduce:animate-none ${index === 1 ? "[animation-delay:120ms]" : index > 1 ? "[animation-delay:240ms]" : ""}`} key={r.id || r.name || index}>
              <div className="flex items-center gap-2">
                {r.reviewer_pic ? <img className="h-8 w-8 rounded-lg object-cover" src={r.reviewer_pic} alt={r.name} /> : <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-300 font-display text-sm font-semibold text-slate-950">{(r.name || "?")[0]}</div>}
                <span className="flex min-w-0 flex-1 flex-col">
                  <b className="truncate text-xs text-slate-950">{r.name || r.reviewer_by}</b>
                  <small className="text-[9px] text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "Verified traveller"}</small>
                </span>
                <em className="text-[9px] not-italic text-amber-400">{"★".repeat(Number(r.rating || 0))}</em>
              </div>
              <p className="mt-2.5 font-display text-sm leading-6 text-slate-700">"<span className="line-clamp-3">{r.review}</span>"</p>
              {r.review_gallery?.length > 0 && (
                <div className="mt-3 flex gap-1.5 overflow-x-auto">
                  {r.review_gallery.map((media, i) => media.type === "video"
                    ? <a className="grid h-12 w-18 flex-none place-items-center rounded-lg bg-slate-200 text-[10px] font-bold text-slate-700" href={media.url} target="_blank" rel="noreferrer" key={media.id || i}>▶ Video</a>
                    : <img className="h-12 w-18 flex-none rounded-lg object-cover" src={media.url} alt={media.alt || "Review"} key={media.id || i} />)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
