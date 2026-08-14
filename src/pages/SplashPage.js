import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashPage() {
  const navigate = useNavigate();
  const goHome = () => navigate("/home");
  const [phase, setPhase] = useState(0); // 0=appear 1=full 2=exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => goHome(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [goHome]);

  return (
    <div className={`splash phase-${phase}`} id="splash-screen">
      <div className="splashBg">
        <div className="splashOrb one" />
        <div className="splashOrb two" />
        <div className="splashOrb three" />
      </div>
      <div className="splashContent">
        <div className="splashLogo">
          <span className="splashLogoLetter">c</span>
          <div className="splashLogoText">
            <span className="splashLogoName">coochbehar</span>
            <span className="splashLogoSub">TRAVEL</span>
          </div>
        </div>
        <p className="splashTagline">Every journey tells a story.</p>
        <div className="splashLoader">
          <span className="splashLoaderDot" />
          <span className="splashLoaderDot" />
          <span className="splashLoaderDot" />
        </div>
      </div>
      <div className="splashFooter">
        <span>Since 1994 · Guided group journeys</span>
      </div>
      <button className="splashSkip" onClick={goHome} id="splash-skip-btn">
        Skip →
      </button>
    </div>
  );
}
