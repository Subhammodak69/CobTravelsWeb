import { useTravel } from "../../contexts/TravelContext";
export default function Header() {
  const { goHome, goProfile, isMember, toggleMember } = useTravel();
  return (
    <nav className="nav">
      <button className="brand" onClick={goHome} id="nav-brand">
        <i>c</i>
        <span>coochbehar<br /><b>travel</b></span>
      </button>
      <div className="navlinks">
        <a href="#journeys" onClick={goHome}>Journeys</a>
        <a href="#story" onClick={goHome}>Our story</a>
        <button className="navProfile" onClick={goProfile} id="nav-profile-btn" aria-label="Profile">
          <span className="navAvatarIcon">{isMember ? "S" : "○"}</span>
        </button>
        <button className="login" onClick={toggleMember} id="nav-login-btn">
          {isMember ? "Member account" : "Log in"}
        </button>
      </div>
    </nav>
  );
}
