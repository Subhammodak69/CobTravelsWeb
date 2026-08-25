import { useTravel } from "../../contexts/TravelContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserRound } from "lucide-react";
import CustomEnquiryModal from "../CustomEnquiryModal";

function ProfileAvatar({ src }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src || imageFailed) {
    return <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />;
  }

  return <img src={src} alt="Profile" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />;
}

export default function Header() {
  const { goHome, goBack, goProfile, isMember, user } = useTravel();
  const location = useLocation();
  const navigate = useNavigate();
  const profileImage = user?.profile_image || user?.profile_picture || user?.profileImage || user?.profile_pic || user?.avatar || user?.photoURL || user?.picture || user?.image || user?.image_url;

  return (
    <nav className="absolute left-0 top-0 z-50 flex h-20 w-full items-center justify-between px-5 text-white sm:px-8 lg:px-16">
      <div className="flex items-center gap-3">
        {location.pathname !== "/" && (
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-lg backdrop-blur transition hover:-translate-x-1 hover:bg-white/20" onClick={goBack} aria-label="Go back">
            ←
          </button>
        )}
        <button className="group flex items-center gap-3 text-left" onClick={goHome} id="nav-brand">
          <i className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300 font-display text-3xl font-semibold italic text-slate-950 shadow-lg shadow-amber-300/20 transition group-hover:rotate-6">c</i>
          <span className="text-sm font-semibold leading-none tracking-tight text-white">coochbehar<br /><b className="text-[10px] uppercase tracking-[0.35em] text-white/65">travel</b></span>
        </button>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <a className="hidden text-sm font-medium text-white/75 transition hover:text-white sm:inline" href="/#journeys" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); document.getElementById("journeys")?.scrollIntoView({ behavior: "smooth" }); } }}>Journeys</a>
        <a className="hidden text-sm font-medium text-white/75 transition hover:text-white sm:inline" href="/#story" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); document.getElementById("story")?.scrollIntoView({ behavior: "smooth" }); } }}>Our story</a>
        <button
          className="rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-amber-300 backdrop-blur transition hover:bg-white/20 sm:text-sm sm:px-4 sm:py-2"
          onClick={() => navigate("/custom-tour-enquiry")}
          id="nav-custom-tour-enquiry-btn"
        >
          Custom Tour Enquiry
        </button>

        {isMember ? (
          <button className="grid h-8 w-8 place-items-center overflow-hidden rounded-2xl border border-white/25 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur transition hover:scale-105 hover:bg-white/20" onClick={goProfile} id="nav-profile-btn" aria-label="Profile" title="My Profile">
            <span className="grid h-full w-full place-items-center overflow-hidden">
              <ProfileAvatar src={profileImage} />
            </span>
          </button>
        ) : (
          <button className="rounded-2xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200" onClick={() => navigate("/login")} id="nav-login-btn">
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

