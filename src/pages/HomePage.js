import PackageCard from "../components/PackageCard";
import usePackages from "../hooks/usePackages";
import { useTravel } from "../contexts/TravelContext";
import useScrollReveal from "../hooks/useScrollReveal";

// Real Unsplash hero — beautiful Indian landscape (Dal Lake / Kashmir valley)
const HERO_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90";

export default function HomePage() {
  const { packages } = usePackages();
  const { isMember } = useTravel();
  const revealRef = useScrollReveal();

  const heroStyle = {
    backgroundImage: `linear-gradient(100deg, rgba(5,16,34,.82) 0%, rgba(5,16,34,.45) 55%, rgba(5,16,34,.08) 100%), url(${HERO_IMG})`,
    backgroundPosition: "center 40%",
    backgroundSize: "cover",
  };

  return (
    <div ref={revealRef}>
      <section className="homeHero" style={heroStyle}>
        <div className="aurora one" />
        <div className="aurora two" />
        <div className="heroCopy">
          <p className="eyebrow">Since 1994 · Guided group journeys</p>
          <h1>Everywhere feels<br /><em>closer</em> with us.</h1>
          <p className="intro">Beautifully paced Indian journeys, brought to life by people who know every curve, colour and quiet corner.</p>
          <a href="#journeys" className="explore">Explore journeys <span>↓</span></a>
        </div>
        <div className="heroStamp">
          <span>curated with</span>
          <b>heart</b>
          <i>✦</i>
        </div>
      </section>

      <section className="trust">
        <span>Handpicked stays</span><i>✦</i>
        <span>Small group feeling</span><i>✦</i>
        <span>Always-on support</span><i>✦</i>
        <span>Memories, not checklists</span>
      </section>

      <section id="journeys" className="journeySection reveal" data-reveal>
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Find your next story</p>
            <h2>Journeys that stay<br />with you.</h2>
          </div>
          <p>{isMember ? "Welcome back. Your next escape is waiting." : "Choose a place. We'll take care of the rest."}</p>
        </div>
        <div className="packageGrid">
          {packages.map((pack, index) => <PackageCard key={pack.id} pack={pack} index={index} />)}
        </div>
      </section>

      <section id="story" className="story reveal" data-reveal>
        <div className="storyImg">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85"
            alt="India travel — Taj Mahal at sunrise"
          />
          <span className="storyImgTag">Since 1994 · Cooch Behar</span>
        </div>
        <div className="storyBody">
          <p className="eyebrow">A little bit about us</p>
          <h2>Travel should change<br />the way you <em>feel.</em></h2>
          <p>For over three decades, we've made travel personal. Our team starts with a good route, then leaves room for the kind of unplanned moments that make a trip yours.</p>
          <div className="storyPills">
            <span className="storyPill">✦ 30+ Years of journeys</span>
            <span className="storyPill">✦ 5,000+ Happy travellers</span>
            <span className="storyPill">✦ 12+ Destinations</span>
          </div>
        </div>
      </section>

    </div>
  );
}
