import { useTravel } from "../../contexts/TravelContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserRound } from "lucide-react";

function ProfileAvatar({ src }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src || imageFailed) {
    return <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />;
  }

  return <img src={src} alt="Profile" className="navAvatarImage" onError={() => setImageFailed(true)} />;
}

export default function Header() {
  const { goHome, goBack, goProfile, isMember, user } = useTravel();
  const location = useLocation();
  const navigate = useNavigate();
  const profileImage = user?.profile_image || user?.profile_picture || user?.profileImage || user?.profile_pic || user?.avatar || user?.photoURL || user?.picture || user?.image || user?.image_url;

  return (
    <nav className="nav">
      <div className="navLeading">
        {location.pathname !== "/" && <button className="navBack" onClick={goBack} aria-label="Go back">←</button>}
        <button className="brand" onClick={goHome} id="nav-brand">
          <i>c</i>
          <span>coochbehar<br /><b>travel</b></span>
        </button>
      </div>
      <div className="navlinks">
        <a href="#journeys" onClick={goHome}>Journeys</a>
        <a href="#story" onClick={goHome}>Our story</a>
        {isMember ? (
          <button className="navProfile" onClick={goProfile} id="nav-profile-btn" aria-label="Profile" title="My Profile">
            <span className="navAvatarIcon">
              <ProfileAvatar src={profileImage} />
            </span>
          </button>
        ) : (
          <button className="login" onClick={() => navigate("/login")} id="nav-login-btn">
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
