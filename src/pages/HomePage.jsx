import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search, MapPin, Globe, Tag, Sparkles, ArrowRight, ShieldCheck,
  HeartHandshake, Headphones, Award, Compass, MessageCircle, Star,
  Sparkle
} from "lucide-react";
import PackageCard from "../components/PackageCard";
import CustomSelect from "../components/CustomSelect";
import usePackages from "../hooks/usePackages";
import useScrollReveal from "../hooks/useScrollReveal";

const HERO_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90";

const QUICK_DESTINATIONS = [
  { name: "Kashmir", image: "https://images.unsplash.com/photo-1715457573748-8e8a70b2c1be?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Kashmir", tag: "Popular" },
  { name: "Bhutan", image: "https://images.unsplash.com/photo-1608377229419-3b5168b6c3da?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Bhutan", tag: "Trending" },
  { name: "Goa", image: "https://images.unsplash.com/photo-1695453463057-aa5d48d9e3d4?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Goa", tag: "Beach" },
  { name: "Thailand", image: "https://images.unsplash.com/photo-1762950297550-1d8d7cce12ae?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Thailand", tag: "International" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Kerala", tag: "Backwaters" },
  { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Dubai", tag: "Luxury" },
];

const CATEGORY_TABS = [
  { id: "all", title: "All Holidays", desc: "100+ Handcrafted Tours", icon: Compass, link: "/tours" },
  { id: "domestic", title: "Domestic Tours", desc: "Incredible India", icon: MapPin, link: "/tours?type=DOMESTIC" },
  { id: "international", title: "International", desc: "Global Escapes", icon: Globe, link: "/tours?type=INTERNATIONAL" },
  { id: "featured", title: "Featured Tours", desc: "Highest Rated", icon: Sparkles, link: "/tours?is_featured=true" },
  { id: "offers", title: "Special Offers", desc: "Seasonal Deals", icon: Tag, link: "/tours?badge=SPECIAL_OFFER" },
  { id: "custom", title: "Custom Tour", desc: "Tailor-Made Trips", icon: Sparkle, link: "/custom-tour-enquiry" },
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    location: "Kolkata",
    trip: "Kashmir Paradise Tour",
    rating: 5,
    quote: "Everything was planned so smoothly! Hotels, transfers, and sightseeing in Kashmir were perfectly organized. The tour manager was always attentive.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Dr. Tanmoy Banerjee",
    location: "Siliguri",
    trip: "Bhutan Himalayan Escape",
    rating: 5,
    quote: "The monastery visits and scenic mountain drives in Bhutan were unforgettable. Very transparent pricing with no hidden charges. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Rahul & Priya Verma",
    location: "Cooch Behar",
    trip: "Thailand Family Holiday",
    rating: 5,
    quote: "One of our best family vacations. Coochbehar Travel took care of every detail from delicious Indian meals to 4-star hotel stays throughout.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
];

function PackageSection({ title, eyebrow, viewAllLink, packages, loading, emptyMessage }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10" data-reveal>
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
        </div>
        <Link
          to={viewAllLink}
          className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-700"
        >
          <span>View All</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="h-44 rounded-xl bg-slate-200" />
              <div className="mt-3 h-3 w-1/3 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-full rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
          <p className="text-sm">{emptyMessage || "No packages currently available in this section."}</p>
          <Link to={viewAllLink} className="mt-2 inline-block text-xs font-bold text-primary hover:underline">
            Browse all packages →
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packages.slice(0, 4).map((pack, index) => (
            <PackageCard key={pack.id || pack.slug} pack={pack} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

const FEATURED_FILTERS = { is_featured: "true", page_size: 4 };
const DOMESTIC_FILTERS = { type: "DOMESTIC", page_size: 4 };
const INTERNATIONAL_FILTERS = { type: "INTERNATIONAL", page_size: 4 };

export default function HomePage() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal();

  const [searchQuery, setSearchQuery] = useState("");
  const [tourTypeFilter, setTourTypeFilter] = useState("ALL");

  const { packages: featuredPackages, loading: loadingFeatured } = usePackages(undefined, FEATURED_FILTERS);
  const { packages: domesticPackages, loading: loadingDomestic } = usePackages(undefined, DOMESTIC_FILTERS);
  const { packages: internationalPackages, loading: loadingInternational } = usePackages(undefined, INTERNATIONAL_FILTERS);

  const heroImage = featuredPackages[0]?.image || HERO_IMG;

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (tourTypeFilter !== "ALL") params.set("type", tourTypeFilter);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div ref={revealRef} className="bg-slate-50">
      {/* Hero Section with Thomas Cook Style Search Widget */}
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-navy-dark px-4 pb-14 pt-12 text-white sm:px-6 lg:min-h-[620px] lg:px-12">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40 brightness-75 transition-all duration-1000"
          src={heroImage}
          alt="Scenic travel destination"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/80 to-primary-950/70" />

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <Award size={14} className="text-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Since 1994 · 30+ Years of Trusted Journeys
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Explore Your <span className="text-primary-300">Next Destination</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 sm:text-base leading-relaxed">
            Thoughtfully planned domestic & international tours, customized itineraries, and unforgettable travel experiences.
          </p>

          {/* Search Booking Widget */}
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/20 bg-white/95 p-3 shadow-2xl backdrop-blur-xl text-slate-800">
            <form onSubmit={handleHeroSearch} className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Destination Search Input */}
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <input
                  type="text"
                  placeholder="Where do you want to go? (e.g. Kashmir, Bhutan, Goa...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Type Selector */}
              <div className="sm:w-48 text-left">
                <CustomSelect
                  value={tourTypeFilter}
                  options={[
                    { label: "All Regions", value: "ALL" },
                    { label: "Domestic (India)", value: "DOMESTIC" },
                    { label: "International", value: "INTERNATIONAL" },
                  ]}
                  onChange={(val) => setTourTypeFilter(val)}
                  triggerClassName="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs sm:text-sm font-medium text-slate-700 hover:border-primary"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="btn-accent h-12 rounded-xl px-6 text-sm font-bold shadow-lg"
              >
                <Search size={16} />
                <span>Search Tours</span>
              </button>
            </form>

            {/* Quick Destination Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Popular:</span>
              {QUICK_DESTINATIONS.slice(0, 5).map((dest) => (
                <Link
                  key={dest.name}
                  to={dest.link}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-primary-50 hover:text-primary"
                >
                  {dest.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs Strip */}
      <section className="border-b border-slate-200 bg-white py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORY_TABS.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={cat.link}
                  className="group flex flex-col items-center rounded-xl p-3 text-center transition-all duration-200 hover:bg-primary-50"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-100 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:scale-105">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-2 text-xs font-bold text-navy group-hover:text-primary">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {cat.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <PackageSection
        title="Featured Tours & Top Picks"
        eyebrow="Handpicked Journeys"
        viewAllLink="/tours?is_featured=true"
        packages={featuredPackages}
        loading={loadingFeatured}
        emptyMessage="No featured tours currently available."
      />

      {/* Popular Destinations Visual Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10" data-reveal>
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Top Places to Visit</p>
            <h2 className="section-title">Trending Destinations</h2>
          </div>
          <Link to="/tours" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-700">
            <span>Browse All Destinations</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_DESTINATIONS.map((dest) => (
            <Link
              key={dest.name}
              to={dest.link}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                  {dest.tag}
                </span>
                <h3 className="mt-1 text-sm font-bold text-white">{dest.name}</h3>
                <span className="text-[10px] text-white/75 group-hover:text-primary-200">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Custom Tour CTA Banner (Mobile Feature Parity) */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6" data-reveal>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy-light to-primary-900 p-6 text-white shadow-xl sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider">
              <Sparkle size={12} /> Tailored Experiences
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl text-white">
              Want a Custom Family or Corporate Trip?
            </h2>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              We personalize hotels, private transport, flights, and sightseeing exactly as you prefer. Get a custom itinerary crafted within 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/custom-tour-enquiry" className="btn-accent rounded-xl text-sm font-bold">
                Plan Custom Trip →
              </Link>
              <a
                href="https://wa.me/919932204885?text=Hello%20Coochbehar%20Travel%2C%20I%20am%20interested%20in%20planning%20a%20customized%20trip!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp rounded-xl text-sm font-bold"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Domestic Packages */}
      <PackageSection
        title="Domestic Holiday Packages"
        eyebrow="Explore Incredible India"
        viewAllLink="/tours?type=DOMESTIC"
        packages={domesticPackages}
        loading={loadingDomestic}
        emptyMessage="No domestic packages available currently."
      />

      {/* International Packages */}
      <PackageSection
        title="International Escapes"
        eyebrow="World Tours & Vacations"
        viewAllLink="/tours?type=INTERNATIONAL"
        packages={internationalPackages}
        loading={loadingInternational}
        emptyMessage="No international packages available currently."
      />

      {/* Traveller Stories / Reviews Carousel (Feature Parity with Mobile) */}
      <section className="bg-white py-12 border-y border-slate-200" data-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="eyebrow">Real Experiences</p>
            <h2 className="section-title">Loved by 5,000+ Travellers</h2>
            <p className="mt-2 text-sm text-slate-500">
              Read authentic feedback from guests who explored the world with Coochbehar Travel.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-accent mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover border border-primary-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-navy">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.location} · {t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-12" data-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="eyebrow">Why Coochbehar Travel</p>
            <h2 className="section-title">Travel With Complete Confidence</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: "30+ Years Legacy", desc: "Serving travellers with trust, care and excellence since 1994." },
              { icon: ShieldCheck, title: "Verified Stays", desc: "Personally inspected hotels and quality assured accommodations." },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated tour managers and ground assistance at every step." },
              { icon: HeartHandshake, title: "Transparent Pricing", desc: "Clear inclusions with no hidden costs or surprise surcharges." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card p-6 text-center hover:border-primary-300">
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary">
                    <Icon size={26} />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy">{f.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story / About Coochbehar Travel */}
      <section className="border-t border-slate-200 bg-white" data-reveal>
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div
            className="relative min-h-[300px] overflow-hidden group lg:min-h-[420px]"
            onMouseEnter={(e) => e.currentTarget.querySelector("video")?.play()}
            onMouseLeave={(e) => {
              const v = e.currentTarget.querySelector("video");
              if (v) { v.pause(); v.currentTime = 0; }
            }}
          >
            <img
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-0"
              src="https://3.bp.blogspot.com/-q3o7UKTtYhc/WIZNM4cuIWI/AAAAAAAABws/wgi7XtaJZ0AM2rAzKY_a9aNIEYu-0lAugCPcB/s1600/Cooch_behar_palace_original_photos.jpg"
              alt="Cooch Behar Rajbari Palace"
            />
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              src="https://www.shutterstock.com/shutterstock/videos/3730953955/preview/stock-footage-historical-monument-cooch-behar-royal-palace-surrounded-by-beautiful-parks-on-the-bank-of-river.webm"
              muted
              loop
              playsInline
              preload="none"
            />
            <span className="absolute bottom-4 left-4 rounded-lg bg-navy/90 backdrop-blur px-3 py-1 text-xs font-bold text-white">
              Cooch Behar Palace · Rooted in Heritage
            </span>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="eyebrow">About Our Journey</p>
            <h2 className="section-title">
              Travel should change the way you <span className="text-primary">feel.</span>
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              For over three decades, Coochbehar Travel has crafted personalized travel experiences across India and international destinations. Our team plans seamless routes while leaving room for the authentic, spontaneous moments that make every journey unforgettable.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">✓ 30+ Years Experience</span>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">✓ 5,000+ Happy Travellers</span>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">✓ 50+ Destinations</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/custom-tour-enquiry" className="btn-primary rounded-xl text-sm font-bold">
                Plan a Custom Journey →
              </Link>
              <Link to="/tours" className="btn-outline rounded-xl text-sm font-bold">
                Explore Packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}