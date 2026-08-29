import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";
import usePackages from "../hooks/usePackages";
import { addToWishlist, checkReviewEligibility, fetchReviews, fetchVariant, removeFromWishlist, submitReview } from "../api";
import { Heart, LoaderCircle } from "lucide-react";
import PackageGallery from "../components/PackageGallery";
import Reviews from "../components/Reviews";
import EnquiryModal from "../components/EnquiryModal";

const eyebrow = "mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500";
const sectionTitle = "font-display text-2xl font-semibold leading-none tracking-tight text-slate-950 sm:text-3xl lg:text-4xl";
const buttonPrimary = "inline-flex items-center justify-center gap-3 rounded-lg bg-amber-300 px-3.5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200";

export default function PackageDetailsPage() {
  const { id } = useParams();
  const { goHome, isMember } = useTravel();
  const { pack, loading, error } = usePackages(id);
  const [selected, setSelected] = useState(0);
  const [variant, setVariant] = useState(null);
  const [showBannerVideo, setShowBannerVideo] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });
  const [reviewState, setReviewState] = useState({ loading: false, message: "", error: "" });
  const [reviews, setReviews] = useState([]);
  const [eligibility, setEligibility] = useState(null); // { can_review, has_reviewed, review }
  const [wishlistState, setWishlistState] = useState("idle");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [id]);
  useEffect(() => { if (pack) { setVariant(pack.seasons?.[0] || null); setShowBannerVideo(false); setWishlistState(pack.is_wishlist ? "added" : "idle"); } }, [pack]);

  const toggleWishlist = async () => {
    if (!isMember) { window.location.assign("/login"); return; }
    setWishlistState("loading");
    try { if (wishlistState === "added") { await removeFromWishlist(pack.slug || id); setWishlistState("idle"); } else { await addToWishlist(pack.slug || id); setWishlistState("added"); } }
    catch { setWishlistState(pack.is_wishlist ? "added" : "idle"); }
  };

  // Load reviews from API using package slug
  useEffect(() => {
    const slug = pack?.slug || id;
    if (!slug) return;
    fetchReviews(slug)
      .then((r) => setReviews(Array.isArray(r?.data) ? r.data : []))
      .catch(() => {});
  }, [pack?.slug, id]);

  // Check review eligibility using package slug when logged in
  useEffect(() => {
    if (!isMember) { setEligibility(null); return; }
    const slug = pack?.slug || id;
    if (!slug) return;
    checkReviewEligibility(slug)
      .then((r) => setEligibility(r?.data || null))
      .catch(() => setEligibility(null));
  }, [isMember, pack?.slug, id]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 px-4"><h2 className={sectionTitle}>Loading journey...</h2></div>;
  if (error || !pack) return <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center"><div><h2 className={sectionTitle}>Journey unavailable</h2><p className="mt-3 text-xs text-slate-500">{error}</p><button className={`${buttonPrimary} mt-4`} onClick={goHome}>Back to journeys</button></div></div>;

  const active = variant || pack.seasons?.[selected] || {};
  const route = (active.route || pack.route || []).map((place) => place.city || place.place || place).join(" · ");
  const choose = async (index) => {
    setSelected(index);
    setShowBannerVideo(false);
    const option = pack.seasons[index];
    if (index && option.slug) {
      try { setVariant(await fetchVariant(pack.slug, option.slug)); }
      catch { setVariant(option); }
    } else setVariant(option);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!reviewForm.review.trim()) return setReviewState({ loading: false, message: "", error: "Please write a review first." });
    setReviewState({ loading: true, message: "", error: "" });
    try {
      const pkgId = pack.package_id || pack.id;
      const slug = pack.slug || id;
      await submitReview({ package_id: pkgId, ...reviewForm, review: reviewForm.review.trim() });
      setReviewForm({ rating: 5, review: "" });
      setReviewState({ loading: false, message: "Thanks — your review has been submitted.", error: "" });
      fetchReviews(slug).then((r) => setReviews(Array.isArray(r?.data) ? r.data : [])).catch(() => {});
      checkReviewEligibility(slug).then((r) => setEligibility(r?.data || null)).catch(() => {});
    } catch (err) {
      setReviewState({ loading: false, message: "", error: err.message || "Could not submit your review." });
    }
  };

  return (
    <div className="bg-slate-50 pb-20">
      <section className="relative flex min-h-[700px] items-end overflow-hidden px-4 pb-16 pt-32 text-white sm:px-6 lg:px-12">
        {!showBannerVideo && <img className="absolute inset-0 h-full w-full object-cover" src={active.cover_image || pack.image} alt={pack.title} />}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/10" />
        {showBannerVideo && active.banner?.video && <video className="absolute inset-0 h-full w-full object-cover" src={active.banner.video} autoPlay muted loop playsInline controls />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
        <button className="absolute left-3 top-16 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 lg:left-12" onClick={goHome}>← Back</button>
        <div className="relative z-10 max-w-4xl animate-fade-up">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">{pack.tour_code} · {active.duration}</p>
          <h1 className="font-display text-2xl font-semibold leading-[1.1] tracking-tight sm:text-3xl lg:text-4xl">{pack.title}</h1>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/80"><span>{pack.destination} · {pack.type}</span><span>From <b className="text-amber-300">₹{Number(active.price || pack.price).toLocaleString("en-IN")}</b></span></div>
          {active.banner?.video && <button className="mt-3 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold backdrop-blur transition hover:bg-white/20" onClick={() => setShowBannerVideo((value) => !value)}>{showBannerVideo ? "Show cover" : "Watch film"} <span className="ml-2 text-amber-300">{showBannerVideo ? "↗" : "▶"}</span></button>}
        </div>
      </section>

      <section className="grid gap-2 border-b border-slate-200 bg-white px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_auto] lg:px-12">
        <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-rose-500">Route</label><p className="mt-1 text-xs leading-5 text-slate-700">{route || "—"}</p></div>
        <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-rose-500">Availability</label><p className="mt-1 text-xs leading-5 text-slate-700">{active.availability || "—"}</p></div>
        <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-rose-500">Season</label><p className="mt-1 text-xs leading-5 text-slate-700">{active.season_name || "—"}</p></div>
          <button
            id="details-wishlist-btn"
            className={`mb-2 ml-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-bold backdrop-blur transition ${wishlistState === "added" ? "border-rose-400 bg-rose-500 text-white" : "border-white/25 bg-white/10 text-white hover:bg-white/20"}`}
            onClick={toggleWishlist}
            disabled={wishlistState === "loading"}
            aria-label={wishlistState === "added" ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlistState === "loading" ? <LoaderCircle size={13} className="animate-spin" /> : <Heart size={13} fill={wishlistState === "added" ? "currentColor" : "none"} />}
            {wishlistState === "added" ? "Saved" : "Save"}
          </button>
          <button
          id="details-enquire-btn"
          className={buttonPrimary}
          onClick={() => setEnquiryOpen(true)}
        >
          Plan <span>→</span>
        </button>
      </section>

      {pack.seasons?.length > 1 && (
        <section className="px-4 py-10 sm:px-6 lg:px-12">
          <p className={eyebrow}>Choose your package</p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {pack.seasons.map((option, index) => (
              <button key={option.id || option.slug} className={`rounded-lg border bg-white p-3.5 text-left shadow-md shadow-slate-950/5 transition hover:-translate-y-0.5 ${index === selected ? "border-amber-400 ring-2 ring-amber-200/60" : "border-slate-200"}`} onClick={() => choose(index)}>
                <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">{option.name}</p>
                <h3 className="font-display text-lg font-semibold leading-tight text-slate-950">{option.season_name}</h3>
                <div className="mt-3 flex justify-between gap-3 text-xs text-slate-500"><span>{option.price ? `₹${Number(option.price).toLocaleString("en-IN")}` : "View"}</span><span>{option.availability || "—"}</span></div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 bg-white px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-14">
        <div>
          <p className={eyebrow}>The experience</p>
          <h2 className={sectionTitle}>{pack.title}<br /><em className="text-amber-500">beautifully.</em></h2>
          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500">{pack.description}</p>
          <div className="mt-4 grid gap-2 text-xs text-slate-700">{(active.highlights || []).map((highlight) => <span key={highlight.id || highlight.text}>✦ {highlight.text || highlight}</span>)}</div>
        </div>
        {active.banner?.video && <div className="overflow-hidden rounded-lg bg-slate-950 p-2 shadow-md"><video className="aspect-video w-full rounded-lg object-cover" poster={active.cover_image} controls src={active.banner.video} /></div>}
      </section>

      <PackageGallery pack={{ ...pack, gallery: active.gallery || pack.gallery || [] }} />

      <section className="bg-white px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
        <p className={eyebrow}>A day-by-day rhythm</p>
        <h2 className={sectionTitle}>The route unfolds<br /><em className="text-amber-500">beautifully.</em></h2>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">{(active.itinerary || []).map((day) => <article className="grid gap-3 py-4 sm:grid-cols-[80px_1fr_24px]" key={day.id || day.day}><span className="text-[9px] font-bold uppercase tracking-[0.15em] text-rose-500">Day {day.day}</span><div><h3 className="font-display text-base font-semibold text-slate-950">{day.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{day.description}</p></div><b className="text-lg font-light text-slate-400">+</b></article>)}</div>
      </section>

      <section className="grid gap-6 bg-slate-100 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-12 lg:py-14">
        <div><p className={eyebrow}>Included in your journey</p><h2 className={sectionTitle}>Everything<br /><em className="text-amber-500">covered.</em></h2><ul className="mt-4 grid gap-2 text-xs leading-5 text-slate-600">{(active.inclusions || []).map((item) => <li key={item}>✓ {item}</li>)}</ul></div>
        <div className="border-t border-slate-300 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><p className={eyebrow}>Good to know</p><h2 className={sectionTitle}>A few<br /><em className="text-amber-500">extras.</em></h2><ul className="mt-4 grid gap-2 text-xs leading-5 text-slate-600">{(active.exclusions || []).map((item) => <li key={item}>＋ {item}</li>)}</ul></div>
      </section>

      <section className="grid gap-6 bg-amber-300 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-12">
        <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">Upcoming departures</p><h2 className={sectionTitle}>Pick your<br /><em className="text-white">moment.</em></h2></div>
        <div><p className="mb-3 text-xs text-slate-700"><b>{active.season_name}</b></p>{(active.dates || []).map((date) => <button className="mb-2 mr-2 rounded-lg border border-slate-950/20 px-2.5 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-slate-950 hover:text-white" key={date.id || date.date}>{date.date}</button>)}</div>
      </section>

      <Reviews reviews={reviews} />

      <section className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-4 shadow-md shadow-slate-950/5 sm:p-5">
          <p className={eyebrow}>Share your experience</p>
          <h2 className="font-display text-lg font-semibold text-slate-950">Tell future travellers.</h2>
          {isMember ? (
            eligibility !== null && !eligibility?.can_review && !eligibility?.has_reviewed ? (
              <p className="mt-3 text-xs text-slate-500">You need to complete a booking to leave a review.</p>
            ) : (
              <form className="mt-4 grid gap-3" onSubmit={handleSubmitReview}>
                <div><label className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500" htmlFor="review-rating">Rating</label><select id="review-rating" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-300" value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></div>
                <div><label className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500" htmlFor="review-text">Your review</label><textarea id="review-text" className="min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-300" placeholder="What did you enjoy?" value={reviewForm.review} onChange={(event) => setReviewForm({ ...reviewForm, review: event.target.value })} /></div>
                {reviewState.error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600" role="alert">{reviewState.error}</p>}{reviewState.message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700" role="status">{reviewState.message}</p>}
                <button className={buttonPrimary} type="submit" disabled={reviewState.loading}>{reviewState.loading ? "Submitting..." : eligibility?.has_reviewed ? "Update" : "Submit"}</button>
              </form>
            )
          ) : <p className="mt-3 text-xs text-slate-500">Sign in to share your experience.</p>}
        </div>
      </section>

      {/* Sticky bottom Enquire Now bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl shadow-lg shadow-slate-950/10 sm:px-6 lg:px-12">
        <div className="hidden sm:block">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 truncate">{pack.title}</p>
          <p className="text-xs font-semibold text-slate-950">
            From <span className="text-amber-500">₹{Number(active.price || pack.price || 0).toLocaleString("en-IN")}</span>
          </p>
        </div>
        <button
          id="bottom-enquire-now-btn"
          onClick={() => setEnquiryOpen(true)}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/30 transition hover:-translate-y-0.5 hover:bg-amber-200"
        >
          Enquire <span>→</span>
        </button>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        packageId={pack.package_id || pack.id || id}
        packageSlug={pack.slug || id}
        variantId={active?.id || ""}
        packageTitle={pack.title}
      />

    </div>
  );
}
