import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTravel } from "../contexts/TravelContext";
import usePackages from "../hooks/usePackages";
import { fetchVariant } from "../api";
import PackageGallery from "../components/PackageGallery";
import Reviews from "../components/Reviews";

export default function PackageDetailsPage() {
  const { id } = useParams();
  const { goHome } = useTravel();
  const { pack, loading, error } = usePackages(id);
  const [selected, setSelected] = useState(0);
  const [variant, setVariant] = useState(null);
  const [showBannerVideo, setShowBannerVideo] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [id]);
  useEffect(() => { if (pack) { setVariant(pack.seasons?.[0] || null); setShowBannerVideo(false); } }, [pack]);

  if (loading) return <div className="journeySection"><h2>Loading journey...</h2></div>;
  if (error || !pack) return <div className="journeySection"><h2>Journey unavailable</h2><p>{error}</p><button className="reserve" onClick={goHome}>Back to journeys</button></div>;

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

  return (
    <div>
      <section className="detailHero" style={{ backgroundImage: showBannerVideo ? "none" : `linear-gradient(90deg,rgba(23,32,51,.82),rgba(23,32,51,.12)),url(${active.cover_image || pack.image})` }}>
        {showBannerVideo && active.banner?.video && <video className="detailHeroVideo" src={active.banner.video} autoPlay muted loop playsInline controls />}
        <button className="back" onClick={goHome}>← &nbsp; All journeys</button>
        <div className="detailTitle"><p>{pack.tour_code} · {active.duration}</p><h1>{pack.title}</h1><div><span>{pack.destination} · {pack.type}</span><span>From <b>₹{Number(active.price || pack.price).toLocaleString("en-IN")}</b></span></div>{active.banner?.video && <button className="bannerToggle" onClick={() => setShowBannerVideo((value) => !value)}>{showBannerVideo ? "Show cover image" : "Watch journey film"} <span>{showBannerVideo ? "↗" : "▶"}</span></button>}</div>
      </section>

      <section className="facts">
        <div><label>Journey route</label><p>{route || "—"}</p></div>
        <div><label>Availability</label><p>{active.availability || "—"}</p></div>
        <div><label>Season</label><p>{active.season_name || "—"}</p></div>
        <button className="reserve">Plan this journey <span>→</span></button>
      </section>

      {pack.seasons?.length > 1 && <section className="journeySection"><p className="eyebrow">Choose your package</p><div className="packageGrid">{pack.seasons.map((option, index) => <button key={option.id || option.slug} className={`packageCard ${index === selected ? "selectedPackage" : ""}`} onClick={() => choose(index)}><div className="cardBody"><p>{option.name}</p><h3>{option.season_name}</h3><div className="cardBottom"><span>{option.price ? `₹${Number(option.price).toLocaleString("en-IN")}` : "View details"}</span><span>{option.availability || "—"}</span></div></div></button>)}</div></section>}

      <section className="overview"><div className="overviewIntro"><p className="eyebrow">The experience</p><h2>{pack.title}<br /><em>beautifully.</em></h2><p>{pack.description}</p><div className="highlights">{(active.highlights || []).map((highlight) => <span key={highlight.id || highlight.text}>✦ &nbsp;{highlight.text || highlight}</span>)}</div></div>{active.banner?.video && <div className="videoBlock"><video poster={active.cover_image} controls src={active.banner.video} /></div>}</section>

      <PackageGallery pack={{ ...pack, gallery: active.gallery || pack.gallery || [] }} />

      <section className="itinerary"><p className="eyebrow">A day-by-day rhythm</p><h2>The route unfolds<br /><em>beautifully.</em></h2><div className="days">{(active.itinerary || []).map((day) => <article key={day.id || day.day}><span>Day {day.day}</span><div><h3>{day.title}</h3><p>{day.description}</p></div><b>+</b></article>)}</div></section>

      <section className="inclusionSection"><div className="inclusionColumn"><p className="eyebrow">Included in your journey</p><h2>Everything<br /><em>thoughtfully covered.</em></h2><ul>{(active.inclusions || []).map((item) => <li key={item}>✓ {item}</li>)}</ul></div><div className="inclusionColumn exclusionColumn"><p className="eyebrow">A few extras</p><h2>Good to<br /><em>know.</em></h2><ul>{(active.exclusions || []).map((item) => <li key={item}>＋ {item}</li>)}</ul></div></section>

      <section className="departures"><div><p className="eyebrow">Upcoming departures</p><h2>Pick your<br /><em>perfect moment.</em></h2></div><div className="dateContent"><p><b>{active.season_name}</b></p>{(active.dates || []).map((date) => <button className="date" key={date.id || date.date}>{date.date}</button>)}</div></section>

      <Reviews reviews={pack.reviews || []} />
    </div>
  );
}
