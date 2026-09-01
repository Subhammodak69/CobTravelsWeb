import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";
import usePackages from "../hooks/usePackages";
import { addToWishlist, checkReviewEligibility, fetchReviews, fetchVariant, removeFromWishlist, submitReview } from "../api";
import {
  Heart, LoaderCircle, MapPin, Clock, Calendar, Check, X as CloseIcon,
  Video, Image as ImageIcon, ArrowRight, MessageCircle, Star, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import PackageGallery from "../components/PackageGallery";
import Reviews from "../components/Reviews";
import EnquiryModal from "../components/EnquiryModal";
import CustomSelect from "../components/CustomSelect";

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
  const [eligibility, setEligibility] = useState(null);
  const [wishlistState, setWishlistState] = useState("idle");
  const [openItineraryDays, setOpenItineraryDays] = useState({ 0: true, 1: true });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (pack) {
      setVariant(pack.seasons?.[0] || null);
      setShowBannerVideo(false);
      setWishlistState(pack.is_wishlist ? "added" : "idle");
    }
  }, [pack]);

  const toggleWishlist = async () => {
    if (!isMember) {
      window.location.assign("/login");
      return;
    }
    setWishlistState("loading");
    try {
      if (wishlistState === "added") {
        await removeFromWishlist(pack.slug || id);
        setWishlistState("idle");
      } else {
        await addToWishlist(pack.slug || id);
        setWishlistState("added");
      }
    } catch {
      setWishlistState(pack.is_wishlist ? "added" : "idle");
    }
  };

  useEffect(() => {
    const slug = pack?.slug || id;
    if (!slug) return;
    fetchReviews(slug)
      .then((r) => setReviews(Array.isArray(r?.data) ? r.data : []))
      .catch(() => {});
  }, [pack?.slug, id]);

  useEffect(() => {
    if (!isMember) {
      setEligibility(null);
      return;
    }
    const slug = pack?.slug || id;
    if (!slug) return;
    checkReviewEligibility(slug)
      .then((r) => setEligibility(r?.data || null))
      .catch(() => setEligibility(null));
  }, [isMember, pack?.slug, id]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50 px-4">
        <div className="text-center">
          <LoaderCircle size={36} className="mx-auto animate-spin text-primary" />
          <h2 className="mt-4 font-display text-xl font-bold text-navy">Loading package details...</h2>
        </div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50 px-4 text-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy">Package Not Found</h2>
          <p className="mt-2 text-sm text-slate-500">{error || "The requested journey could not be located."}</p>
          <button className="btn-primary mt-6 text-sm font-bold" onClick={goHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const active = variant || pack.seasons?.[selected] || {};
  const route = (active.route || pack.route || []).map((place) => place.city || place.place || place).join(" → ");

  const chooseVariant = async (index) => {
    setSelected(index);
    setShowBannerVideo(false);
    const option = pack.seasons[index];
    if (index && option.slug) {
      try {
        setVariant(await fetchVariant(pack.slug, option.slug));
      } catch {
        setVariant(option);
      }
    } else {
      setVariant(option);
    }
  };

  const toggleItineraryDay = (idx) => {
    setOpenItineraryDays((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!reviewForm.review.trim()) {
      return setReviewState({ loading: false, message: "", error: "Please write your review before submitting." });
    }
    setReviewState({ loading: true, message: "", error: "" });
    try {
      const pkgId = pack.package_id || pack.id;
      const slug = pack.slug || id;
      await submitReview({ package_id: pkgId, ...reviewForm, review: reviewForm.review.trim() });
      setReviewForm({ rating: 5, review: "" });
      setReviewState({ loading: false, message: "Thank you! Your review has been submitted.", error: "" });
      fetchReviews(slug).then((r) => setReviews(Array.isArray(r?.data) ? r.data : [])).catch(() => {});
      checkReviewEligibility(slug).then((r) => setEligibility(r?.data || null)).catch(() => {});
    } catch (err) {
      setReviewState({ loading: false, message: "", error: err.message || "Could not submit your review." });
    }
  };

  const displayPrice = active.price != null && !isNaN(active.price) && active.price > 0
    ? `₹${Number(active.price).toLocaleString("en-IN")}`
    : pack.price != null && !isNaN(pack.price) && pack.price > 0
    ? `₹${Number(pack.price).toLocaleString("en-IN")}`
    : null;

  return (
    <div className="bg-slate-50 pb-28">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-primary">Holidays</Link>
          <span>/</span>
          <span className="font-semibold text-navy truncate">{pack.title}</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative flex min-h-[480px] items-end overflow-hidden bg-navy-dark px-4 pb-12 pt-8 text-white sm:px-6 lg:min-h-[520px] lg:px-12">
        {!showBannerVideo && (
          <img
            className="absolute inset-0 h-full w-full object-cover brightness-75"
            src={active.cover_image || pack.image}
            alt={pack.title}
          />
        )}
        {showBannerVideo && active.banner?.video && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={active.banner.video}
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl animate-fade-up">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-md bg-accent px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              {pack.badge || "Featured"}
            </span>
            <span className="rounded-md bg-white/20 backdrop-blur px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              {pack.type === "DOMESTIC" ? "Incredible India" : "International Tour"}
            </span>
            <span className="text-xs text-white/75 font-semibold">
              Code: {pack.tour_code || "COB"}
            </span>
          </div>

          <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white max-w-4xl">
            {pack.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin size={16} className="text-primary-300" />
              <span>{pack.destination}</span>
            </span>
            {active.duration && (
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={16} className="text-primary-300" />
                <span>{active.duration}</span>
              </span>
            )}
            {displayPrice && (
              <span className="font-bold text-accent-300 text-lg sm:text-xl">
                {displayPrice} <span className="text-xs font-normal text-white/70">/person</span>
              </span>
            )}
          </div>

          {/* Action Buttons in Hero */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="btn-accent rounded-xl text-sm font-bold shadow-lg"
            >
              Enquire Now →
            </button>
            <button
              onClick={toggleWishlist}
              disabled={wishlistState === "loading"}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold backdrop-blur transition-all ${
                wishlistState === "added"
                  ? "bg-rose-500 text-white"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              <Heart size={16} fill={wishlistState === "added" ? "currentColor" : "none"} />
              <span>{wishlistState === "added" ? "Saved to Wishlist" : "Save Journey"}</span>
            </button>
            {active.banner?.video && (
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/25"
                onClick={() => setShowBannerVideo((v) => !v)}
              >
                {showBannerVideo ? <ImageIcon size={16} /> : <Video size={16} />}
                <span>{showBannerVideo ? "View Photos" : "Watch Video"}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Info Strip */}
      <section className="border-b border-slate-200 bg-white py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Route Highlights</p>
              <p className="mt-0.5 text-xs font-semibold text-navy line-clamp-1">{route || "Customized Route"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
              <p className="mt-0.5 text-xs font-semibold text-navy">{active.duration || "Multi-Day Journey"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Availability</p>
              <p className="mt-0.5 text-xs font-semibold text-success">{active.availability || "Available for Booking"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Season / Category</p>
              <p className="mt-0.5 text-xs font-semibold text-navy">{active.season_name || pack.type || "All Seasons"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Variants Selector */}
      {pack.seasons?.length > 1 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="eyebrow">Select Itinerary Variant</p>
          <h2 className="section-title text-xl sm:text-2xl mb-4">Available Tour Options</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pack.seasons.map((option, index) => (
              <button
                key={option.id || option.slug}
                className={`card p-5 text-left transition-all ${
                  index === selected
                    ? "border-primary ring-2 ring-primary/20 bg-primary-50/30"
                    : "border-slate-200 hover:border-primary-200"
                }`}
                onClick={() => chooseVariant(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Option {index + 1}
                  </span>
                  {index === selected && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      Selected
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-navy">{option.season_name || option.name}</h3>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="font-bold text-navy">
                    {option.price ? `₹${Number(option.price).toLocaleString("en-IN")}` : "Contact for Price"}
                  </span>
                  <span>{option.duration || ""}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Overview & Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-6 sm:p-8">
            <p className="eyebrow">Tour Overview</p>
            <h2 className="section-title text-xl sm:text-2xl mb-3">About This Holiday</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {pack.description || "Experience an unforgettable journey with thoughtfully curated accommodations, verified stays, dedicated tour guidance, and seamless transport."}
            </p>

            {/* Highlights */}
            {active.highlights && active.highlights.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Tour Highlights</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {active.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded-full bg-primary-100 text-primary">
                        ✓
                      </span>
                      <span>{typeof h === "string" ? h : h.text || h.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Booking Action Card */}
          <div className="card p-6 sm:p-8 bg-gradient-to-br from-navy to-navy-light text-white h-fit">
            <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Instant Enquiry
            </span>
            <h3 className="mt-2 font-display text-xl font-bold text-white">Book Your Trip Today</h3>
            <p className="mt-1 text-xs text-white/70">
              Have questions? Talk to our holiday experts on WhatsApp or submit a quick enquiry form.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="btn-accent w-full justify-center rounded-xl py-3 text-sm font-bold"
              >
                Send Travel Enquiry →
              </button>
              <a
                href={`https://wa.me/919876543210?text=Hello%2C%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(pack.title)}%20tour.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center rounded-xl py-3 text-sm font-bold"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <PackageGallery pack={{ ...pack, gallery: active.gallery || pack.gallery || [] }} />

      {/* Day by Day Itinerary */}
      {active.itinerary && active.itinerary.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="eyebrow">Detailed Schedule</p>
          <h2 className="section-title text-xl sm:text-2xl mb-6">Day-by-Day Itinerary</h2>

          <div className="space-y-3">
            {active.itinerary.map((day, idx) => {
              const isOpen = openItineraryDays[idx];
              return (
                <div key={day.id || idx} className="card">
                  <button
                    onClick={() => toggleItineraryDay(idx)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-navy hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-bold text-white flex-shrink-0">
                        D{day.day || idx + 1}
                      </span>
                      <span className="text-sm font-bold text-navy">{day.title || `Day ${day.day || idx + 1}`}</span>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 ml-11">
                      {day.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Inclusions & Exclusions */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inclusions */}
          <div className="card p-6 border-l-4 border-l-success">
            <h3 className="font-display text-base font-bold text-navy mb-4 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-green-100 text-success text-xs font-bold">✓</span>
              What's Included
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {(active.inclusions || ["Hotel accommodations on twin-sharing basis", "Daily breakfast and dinner", "AC transport for sightseeing", "All state taxes and tolls", "24/7 tour assistance"]).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="card p-6 border-l-4 border-l-rose-400">
            <h3 className="font-display text-base font-bold text-navy mb-4 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-100 text-rose-500 text-xs font-bold">✕</span>
              What's Not Included
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {(active.exclusions || ["Flight or train tickets (unless specified)", "Personal expenses & tips", "Monument entry fees", "Travel insurance", "Any cost arising due to unforeseen events"]).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CloseIcon size={14} className="text-rose-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Upcoming Departure Dates */}
      {active.dates && active.dates.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="card p-6 bg-primary-50/50 border-primary-100">
            <p className="eyebrow">Available Dates</p>
            <h2 className="section-title text-xl sm:text-2xl mb-3">Upcoming Departures</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {active.dates.map((d, i) => (
                <button
                  key={d.id || i}
                  onClick={() => setEnquiryOpen(true)}
                  className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-xs font-bold text-navy shadow-sm transition hover:bg-primary hover:text-white"
                >
                  📅 {d.date || d}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <Reviews reviews={reviews} />

      {/* Submit Review Card */}
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="card p-6 sm:p-8">
          <p className="eyebrow">Feedback</p>
          <h2 className="section-title text-xl sm:text-2xl mb-2">Share Your Travel Experience</h2>
          {isMember ? (
            eligibility !== null && !eligibility?.can_review && !eligibility?.has_reviewed ? (
              <p className="mt-2 text-xs text-slate-500">You need to complete this journey to write a verified review.</p>
            ) : (
              <form className="mt-4 grid gap-3" onSubmit={handleSubmitReview}>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="review-rating">
                    Your Rating
                  </label>
                  <CustomSelect
                    value={String(reviewForm.rating)}
                    options={[5, 4, 3, 2, 1].map((r) => ({ label: `★ ${r} Stars`, value: String(r) }))}
                    onChange={(val) => setReviewForm({ ...reviewForm, rating: Number(val) })}
                    placeholder="Select rating"
                    triggerClassName="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="review-text">
                    Your Feedback
                  </label>
                  <textarea
                    id="review-text"
                    className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-primary focus:bg-white"
                    placeholder="What did you enjoy about this tour? How were the hotels and transport?"
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                  />
                </div>
                {reviewState.error && <p className="rounded-xl bg-rose-50 p-3 text-xs text-rose-600">{reviewState.error}</p>}
                {reviewState.message && <p className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">{reviewState.message}</p>}
                <button className="btn-primary rounded-xl text-xs font-bold" type="submit" disabled={reviewState.loading}>
                  {reviewState.loading ? "Submitting..." : eligibility?.has_reviewed ? "Update Review" : "Post Review"}
                </button>
              </form>
            )
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link> to share your verified review.
            </p>
          )}
        </div>
      </section>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-elevated backdrop-blur-md sm:px-6 lg:px-12">
        <div className="hidden sm:block">
          <p className="text-xs font-bold text-navy truncate max-w-md">{pack.title}</p>
          <p className="text-xs text-slate-500">
            Starting from <span className="font-bold text-primary">{displayPrice || "Contact Us"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <a
            href={`https://wa.me/919876543210?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(pack.title)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp rounded-xl text-xs font-bold px-3.5 py-2"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <button
            id="bottom-enquire-now-btn"
            onClick={() => setEnquiryOpen(true)}
            className="btn-accent rounded-xl text-xs font-bold px-4 py-2"
          >
            Enquire Now →
          </button>
        </div>
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
