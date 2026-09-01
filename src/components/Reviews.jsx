import { Star } from "lucide-react";

export default function Reviews({ reviews = [] }) {
  const score = reviews.length
    ? (reviews.reduce((sum, item) => {
        const review = Array.isArray(item) ? { rating: item[1] } : item;
        return sum + Number(review.rating || 0);
      }, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Guest Testimonials</p>
          <h2 className="section-title text-xl sm:text-2xl">Traveller Reviews</h2>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card w-fit">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-xl font-bold text-white">
            {score}
          </div>
          <div>
            <div className="flex items-center gap-0.5 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              Based on {reviews.length || 1} verified review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <p className="text-sm">No reviews yet for this package. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((item, index) => {
            const r = Array.isArray(item) ? { name: item[0], rating: item[1], review: item[2] } : item;
            return (
              <article
                className="card p-5 flex flex-col justify-between"
                key={r.id || r.name || index}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      {r.reviewer_pic ? (
                        <img className="h-9 w-9 rounded-full object-cover border border-primary-200" src={r.reviewer_pic} alt={r.name} />
                      ) : (
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-100 font-display text-sm font-bold text-primary">
                          {(r.name || r.reviewer_by || "T")[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-navy truncate max-w-[150px]">{r.name || r.reviewer_by || "Verified Traveller"}</h4>
                        <p className="text-[10px] text-slate-400">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Verified Guest"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-accent text-xs">
                      {[...Array(Number(r.rating || 5))].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 italic">
                    "{r.review}"
                  </p>
                </div>

                {r.review_gallery?.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pt-2 border-t border-slate-100">
                    {r.review_gallery.map((media, i) =>
                      media.type === "video" ? (
                        <a
                          className="grid h-12 w-16 flex-none place-items-center rounded-lg bg-slate-100 text-[10px] font-bold text-primary hover:bg-primary-50"
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          key={media.id || i}
                        >
                          ▶ Video
                        </a>
                      ) : (
                        <img
                          className="h-12 w-16 flex-none rounded-lg object-cover border border-slate-200"
                          src={media.url}
                          alt={media.alt || "Review photo"}
                          key={media.id || i}
                        />
                      )
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
