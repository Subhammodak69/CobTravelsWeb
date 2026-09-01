import { useNavigate, Link } from "react-router-dom";
import { Sparkles, MapPin, Globe, Tag, Sparkle, ArrowRight, ShieldCheck, HeartHandshake, Headphones, Award } from "lucide-react";
import PackageCard from "../components/PackageCard";
import usePackages from "../hooks/usePackages";
import useScrollReveal from "../hooks/useScrollReveal";

const HERO_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90";

const QUICK_DESTINATIONS = [
  { name: "Kashmir", image: "https://images.unsplash.com/photo-1715457573748-8e8a70b2c1be?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Kashmir" },
  { name: "Bhutan", image: "https://images.unsplash.com/photo-1608377229419-3b5168b6c3da?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Bhutan" },
  { name: "Goa", image: "https://images.unsplash.com/photo-1695453463057-aa5d48d9e3d4?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Goa" },
  { name: "Thailand", image: "https://images.unsplash.com/photo-1762950297550-1d8d7cce12ae?auto=format&fit=crop&w=400&q=80", link: "/tours?search=Thailand" },
];

const CATEGORY_CARDS = [
  {
    id: "featured",
    title: "Featured Tours",
    subtitle: "Handpicked & Popular",
    description: "Our highest rated and most loved itineraries",
    badge: "Must Travel",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
    gradient: "from-amber-500/80 to-amber-900/90",
    accentBg: "bg-amber-300 text-slate-950",
    link: "/tours?is_featured=true",
  },
  {
    id: "domestic",
    title: "Domestic Tours",
    subtitle: "Incredible India",
    description: "Kashmir, Kerala, Sikkim, Ladakh & beyond",
    badge: "India",
    icon: MapPin,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80",
    gradient: "from-teal-600/80 to-teal-950/90",
    accentBg: "bg-teal-300 text-teal-950",
    link: "/tours?type=DOMESTIC",
  },
  {
    id: "international",
    title: "International Tours",
    subtitle: "World Escapes",
    description: "Bhutan, Thailand, Bali, Dubai, Europe & more",
    badge: "Global",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    gradient: "from-indigo-600/80 to-indigo-950/90",
    accentBg: "bg-indigo-300 text-indigo-950",
    link: "/tours?type=INTERNATIONAL",
  },
  {
    id: "special-offers",
    title: "Special Offers",
    subtitle: "Seasonal Deals",
    description: "Limited-time discounts & festive holiday specials",
    badge: "Save More",
    icon: Tag,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
    gradient: "from-rose-600/80 to-rose-950/90",
    accentBg: "bg-rose-300 text-rose-950",
    link: "/tours?badge=SPECIAL_OFFER",
  },
  {
    id: "custom-tours",
    title: "Custom Tours",
    subtitle: "Tailor-Made Trips",
    description: "Personalized itineraries designed around your dreams",
    badge: "Bespoke",
    icon: Sparkle,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
    gradient: "from-violet-600/80 to-slate-950/90",
    accentBg: "bg-purple-300 text-purple-950",
    link: "/custom-tour-enquiry",
  },
];

function PackageSection({ title, eyebrow, viewAllLink, packages, loading, emptyMessage }) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-12 lg:py-10" data-reveal>
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">{eyebrow}</p>
          <h2 className="font-display text-xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
            {title}
          </h2>
        </div>
        <Link
          to={viewAllLink}
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 transition hover:text-rose-600"
        >
          <span>View All</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="h-40 rounded-md bg-slate-200 sm:h-48" />
              <div className="mt-3 h-3 w-1/3 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-4 h-6 w-full rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
          <p className="text-xs">{emptyMessage || "No packages currently available in this section."}</p>
          <Link to={viewAllLink} className="mt-2 inline-block text-xs font-bold text-amber-600 hover:underline">
            Browse all available packages →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packages.slice(0, 4).map((pack, index) => (
            <PackageCard key={pack.id || pack.slug} pack={pack} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

// Static filter objects defined outside component — never recreated on render
const FEATURED_FILTERS = { is_featured: "true", page_size: 4 };
const DOMESTIC_FILTERS = { type: "DOMESTIC", page_size: 4 };
const INTERNATIONAL_FILTERS = { type: "INTERNATIONAL", page_size: 4 };

export default function HomePage() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal();

  // Load section-specific packages — no duplicate calls (hook uses ref-based dedup)
  const { packages: featuredPackages, loading: loadingFeatured } = usePackages(undefined, FEATURED_FILTERS);
  const { packages: domesticPackages, loading: loadingDomestic } = usePackages(undefined, DOMESTIC_FILTERS);
  const { packages: internationalPackages, loading: loadingInternational } = usePackages(undefined, INTERNATIONAL_FILTERS);

  const heroImage = featuredPackages[0]?.image || HERO_IMG;

  return (
    <div ref={revealRef} className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative flex min-h-[640px] overflow-hidden px-4 pb-10 pt-24 text-white sm:px-6 lg:min-h-[690px] lg:px-12 lg:pt-28">
        <img className="absolute inset-0 h-full w-full object-cover object-center opacity-85 transition duration-1000" src={heroImage} alt="Travel destination" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900/65 to-indigo-900/35" />
        <div className="absolute -right-40 -top-48 h-[36rem] w-[36rem] rounded-full bg-cyan-400/25 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-float" />

        <div className="relative z-10 flex max-w-3xl flex-col justify-start animate-fade-up">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Since 1994 · Guided group & custom journeys</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Go further.<br />
              <em className="text-amber-300">Feel more.</em>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
              Thoughtful journeys across India and beyond, crafted for the moments you will remember forever.
            </p>
          </div>

          <div>
            {/* Quick Destinations Strip */}
            <div className="mt-6 grid max-w-2xl grid-cols-4 gap-3">
              {QUICK_DESTINATIONS.map((dest) => (
                <Link
                  key={dest.name}
                  to={dest.link}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-glow backdrop-blur-xl transition hover:border-amber-300 hover:bg-white/20"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold text-white sm:text-sm">
                    {dest.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <a href="#categories" className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
                Explore Categories ↓
              </a>
              <Link to="/tours" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:underline">
                All 100+ Tours →
              </Link>
            </div>
          </div>

        </div>

        <div className="absolute bottom-8 right-3 hidden h-20 w-20 rotate-[-10deg] flex-col items-center justify-center rounded-full border border-white/25 bg-white/10 text-center backdrop-blur-xl animate-float sm:flex lg:right-10">
          <span className="text-[9px]">curated with</span>
          <b className="font-display text-lg italic text-amber-300">heart</b>
          <i className="absolute right-2 top-2 text-amber-300 text-xs">✦</i>
        </div>
      </section>

      {/* Trust Badges Ribbon */}
      <section className="flex flex-wrap items-center justify-center gap-3 bg-slate-950 px-4 py-3 text-[8px] font-bold uppercase tracking-[0.2em] text-white/65">
        <span>Handpicked stays</span><i>✦</i>
        <span>Small group feeling</span><i>✦</i>
        <span>Always-on support</span><i>✦</i>
        <span>Memories, not checklists</span>
      </section>

      {/* Under-Hero Category Cards Grid */}
      <section id="categories" className="px-4 py-10 sm:px-6 lg:px-12 lg:py-12" data-reveal>
        <div className="mb-6 text-center max-w-2xl mx-auto">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-500">Discover by Category</p>
          <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">
            Choose Your Travel Style
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Select a category to explore curated packages, tailored itineraries, and exclusive holiday deals.
          </p>
        </div>

        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_CARDS.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(cat.link)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-md shadow-slate-950/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-300"
              >
                {/* Background Image Layer with gradient */}
                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-900">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115 opacity-80"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />
                  <span className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider ${cat.accentBg} shadow-sm`}>
                    {cat.badge}
                  </span>
                  <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur transition group-hover:bg-white group-hover:text-slate-950 group-hover:rotate-12">
                    <Icon size={14} />
                  </div>
                </div>

                {/* Content */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{cat.subtitle}</p>
                  <h3 className="mt-0.5 font-display text-base font-semibold text-slate-950 group-hover:text-amber-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                    {cat.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-900 group-hover:text-amber-600">
                    <span>Explore Now</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Package Sections */}
      <div id="journeys" className="space-y-2">
        {/* Section 1: Featured Tours */}
        <PackageSection
          title="Featured Tours & Top Picks"
          eyebrow="Curated Experiences"
          viewAllLink="/tours?is_featured=true"
          packages={featuredPackages}
          loading={loadingFeatured}
          emptyMessage="No featured tours right now."
        />

        {/* Section 2: Domestic Packages */}
        <PackageSection
          title="Domestic Packages"
          eyebrow="Explore India"
          viewAllLink="/tours?type=DOMESTIC"
          packages={domesticPackages}
          loading={loadingDomestic}
          emptyMessage="No domestic packages available currently."
        />

        {/* Section 3: International Packages */}
        <PackageSection
          title="International Packages"
          eyebrow="Global Escapes"
          viewAllLink="/tours?type=INTERNATIONAL"
          packages={internationalPackages}
          loading={loadingInternational}
          emptyMessage="No international packages available currently."
        />
      </div>

      {/* Why Choose Us Highlight */}
      <section className="bg-slate-900 text-white px-4 py-12 sm:px-6 lg:px-12 my-8" data-reveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">Why Travel With Us</p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl mt-1">Crafting Memories Since 1994</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: "30+ Years Experience", desc: "Decades of localized knowledge and trusted tour execution." },
              { icon: ShieldCheck, title: "Verified Stays", desc: "Personally inspected hotels and authentic local cuisines." },
              { icon: Headphones, title: "24/7 Tour Support", desc: "Dedicated tour guides and emergency assistance on ground." },
              { icon: HeartHandshake, title: "Custom Flexibility", desc: "Personalize any package to fit your schedule and group size." },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300 text-slate-950 font-bold">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1 text-xs text-white/70 leading-5">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story / About Section */}
      <section id="story" className="grid bg-white lg:grid-cols-2" data-reveal>
        <div
          className="relative min-h-[240px] overflow-hidden lg:min-h-[380px] group"
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
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">
            Since 1994 · Cooch Behar
          </span>
        </div>
        <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-12">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">A little bit about us</p>
          <h2 className="font-display text-xl font-semibold leading-none tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
            Travel should change the way you <em className="text-amber-500 font-normal italic">feel.</em>
          </h2>
          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500">
            For over three decades, we've made travel personal. Our team starts with a good route, then leaves room for the kind of unplanned moments that make a trip truly yours.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">✦ 30+ Years</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">✦ 5,000+ Happy Travellers</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">✦ 50+ Destinations</span>
          </div>
          <div className="mt-6">
            <Link
              to="/custom-tour-enquiry"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:bg-amber-200"
            >
              Plan a Custom Journey →
            </Link>
          </div>
          <Link
            to="/terms-of-service"
            className="mt-3 inline-block text-xs font-bold text-slate-700 hover:underline"
          >
            Terms of Service →
          </Link>
          <Link
            to="/privacy-policy"
            className="mt-3 inline-block text-xs font-bold text-slate-700 hover:underline"
          >
            Privacy Policy →
          </Link>
        </div>
      </section>
    </div>
  );
}