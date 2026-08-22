import { useTravel } from "../contexts/TravelContext";
import usePackages from "../hooks/usePackages";
import useScrollReveal from "../hooks/useScrollReveal";
import { useState } from "react";

const STATS = [
  { label: "Journeys taken", value: "3" },
  { label: "Countries visited", value: "1" },
  { label: "Travel days", value: "42" },
  { label: "Member since", value: "2022" },
];

const SETTINGS = [
  { id: "notif", label: "Push notifications", desc: "Trip reminders & updates" },
  { id: "newsletter", label: "Travel newsletter", desc: "Curated stories & offers" },
  { id: "sms", label: "SMS alerts", desc: "Booking confirmations" },
];

export default function ProfilePage() {
  const { isMember, toggleMember, goHome, user, selectPackage } = useTravel();
  const { packages } = usePackages();
  const revealRef = useScrollReveal();
  const [toggles, setToggles] = useState({ notif: true, newsletter: true, sms: false });
  const flip = (id) => setToggles((t) => ({ ...t, [id]: !t[id] }));
  const pastTrips = packages.slice(0, 3);

  return (
    <div ref={revealRef} className="profilePage" id="profile-page">
      <section className="profileHero">
        <div className="profileHeroBg" />
        <div className="profileHeroContent">
          <div className="profileAvatar">
            <span>{isMember ? "S" : "?"}</span>
          </div>
          <div className="profileInfo">
            <h1>{isMember ? (user?.name || "Member Traveller") : "Guest Traveller"}</h1>
            <p>{isMember ? ((user?.email || user?.mobile || "") + " · Member") : "Sign in to unlock your journey history"}</p>
            {!isMember && (
              <button className="profileSignIn" id="profile-signin-btn" onClick={() => window.location.assign("/login")}>
                Sign in / Register →
              </button>
            )}
          </div>
          {isMember && (
            <button className="profileEditBtn" id="profile-edit-btn">Edit profile</button>
          )}
        </div>
      </section>

      {isMember && (
        <section className="profileStats reveal" data-reveal>
          {STATS.map(({ label, value }) => (
            <div className="profileStat" key={label}>
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </section>
      )}

      <section className="profileSection reveal" data-reveal>
        <div className="profileSectionHead">
          <p className="eyebrow">Your journeys</p>
          <h2>Trips you&apos;ve <em>loved.</em></h2>
        </div>
        {isMember ? (
          <div className="profileTripList">
            {pastTrips.map((pack) => (
              <article key={pack.id} className="profileTrip" onClick={() => selectPackage(pack.id)} id={`profile-trip-${pack.id}`}>
                <img src={pack.image} alt={pack.title} />
                <div className="profileTripBody">
                  <p>{pack.code} · {pack.duration}</p>
                  <h3>{pack.title}</h3>
                  <span className="profileTripRoute">{pack.route.slice(0, 2).join(" → ")}</span>
                </div>
                <span className="profileTripArrow">↗</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="profileLocked">
            <span className="profileLockedIcon">🔒</span>
            <p>Sign in to see your trip history and saved itineraries.</p>
            <button className="reserve" id="profile-locked-signin-btn" onClick={() => window.location.assign("/login")}>
              Sign in <span>→</span>
            </button>
          </div>
        )}
      </section>

      <section className="profileSection profilePrefs reveal" data-reveal>
        <div className="profileSectionHead">
          <p className="eyebrow">Preferences</p>
          <h2>Stay in the <em>loop.</em></h2>
        </div>
        <div className="profileToggleList">
          {SETTINGS.map(({ id, label, desc }) => (
            <label key={id} className="profileToggleRow" id={`pref-${id}`}>
              <div>
                <span>{label}</span>
                <small>{desc}</small>
              </div>
              <button
                role="switch"
                aria-checked={toggles[id]}
                className={`toggle ${toggles[id] ? "on" : ""}`}
                onClick={() => flip(id)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="profileSection profileActions reveal" data-reveal>
        <div className="profileSectionHead">
          <p className="eyebrow">Account</p>
          <h2>Manage your <em>account.</em></h2>
        </div>
        <div className="profileActionList">
          <button className="profileActionRow" id="profile-action-support">
            <span>✉</span> Contact support <em>→</em>
          </button>
          <button className="profileActionRow" id="profile-action-privacy">
            <span>🔐</span> Privacy policy <em>→</em>
          </button>
          <button className="profileActionRow" id="profile-action-terms">
            <span>📄</span> Terms &amp; conditions <em>→</em>
          </button>
          {isMember && (
            <button className="profileActionRow profileSignOut" id="profile-signout-btn" onClick={toggleMember}>
              <span>↩</span> Sign out <em>→</em>
            </button>
          )}
        </div>
      </section>

      <div className="profileBack">
        <button className="explore" id="profile-back-home-btn" onClick={goHome}>
          Back to journeys <span>↓</span>
        </button>
      </div>
    </div>
  );
}
