import { useRef } from "react";
import { useTravel } from "../contexts/TravelContext";

export default function PackageCard({ pack, index }) {
  const { selectPackage } = useTravel();
  const videoRef = useRef(null);

  const playVideo = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };
  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article className="packageCard" style={{ "--accent": pack.accent }} onClick={() => selectPackage(pack.id)} onMouseEnter={playVideo} onMouseLeave={stopVideo}>
      <div className="cardImage">
        <img src={pack.image} alt={pack.title} />
        {pack.video && <video ref={videoRef} className="cardVideo" src={pack.video} muted loop playsInline preload="metadata" aria-hidden="true" />}
        <span className="cardNo">0{index + 1}</span>
        {pack.badge && <span className="cardBadge">{pack.badge}</span>}
        <button aria-label={`Explore ${pack.title}`}>↗</button>
      </div>
      <div className="cardBody">
        <p>{pack.code} <span>·</span> {pack.season_name || pack.destination}</p>
        <h3>{pack.title}</h3>
        <div className="cardBottom"><span>{pack.destination}</span><span>{pack.type}</span></div>
      </div>
    </article>
  );
}
