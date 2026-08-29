import { useTravel } from "../../contexts/TravelContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserRound, ChevronDown, User, MessageSquareText, MapPinned, Files, Heart, Gift, LoaderCircle } from "lucide-react";

function ProfileAvatar({ src }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src || imageFailed) {
    return <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />;
  }

  return <img src={src} alt="Profile" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />;
}

export default function Header() {
  const { goHome, goBack, isMember, authReady, user } = useTravel();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileImage = user?.profile_image || user?.profile_picture || user?.profileImage || user?.profile_pic || user?.avatar || user?.photoURL || user?.picture || user?.image || user?.image_url;

  return (
    <nav className="absolute left-0 top-0 z-50 flex h-14 w-full items-center justify-between px-4 text-white sm:px-6 lg:px-12">
      <div className="flex items-center gap-2">
        {location.pathname !== "/" && (
          <button className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-sm backdrop-blur transition hover:-translate-x-1 hover:bg-white/20" onClick={goBack} aria-label="Go back">
            ←
          </button>
        )}
        <button className="group flex items-center gap-2 text-left" onClick={goHome} id="nav-brand">
          <i className="grid h-8 w-8 place-items-center rounded-lg bg-amber-300 font-display text-xl font-semibold italic text-slate-950 shadow-md shadow-amber-300/20 transition group-hover:rotate-6">c</i>
          <span className="text-xs font-semibold leading-none tracking-tight text-white hidden sm:inline">coochbehar<br /><b className="text-[8px] uppercase tracking-[0.3em] text-white/65\">travel</b></span>
        </button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <a className="hidden text-xs font-medium text-white/75 transition hover:text-white sm:inline" href="/#journeys" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); document.getElementById("journeys")?.scrollIntoView({ behavior: "smooth" }); } }}>Journeys</a>
        <a className="hidden text-xs font-medium text-white/75 transition hover:text-white sm:inline" href="/#story" onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); document.getElementById("story")?.scrollIntoView({ behavior: "smooth" }); } }}>Our story</a>
        <button
          className="hidden text-xs font-medium text-white/75 transition hover:text-white lg:inline"
          onClick={() => navigate("/custom-tour-enquiry")}
          id="nav-custom-tour-enquiry-btn"
        >
          Custom Tour
        </button>

        {!authReady ? (
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/20 bg-white/10 text-white/80 backdrop-blur" aria-label="Loading account" role="status">
            <LoaderCircle size={14} className="animate-spin" />
          </span>
        ) : isMember ? (
          <div className="relative">
            <button className="flex h-8 items-center gap-0.5 rounded-lg border border-white/25 bg-white/10 px-1 text-white shadow-md shadow-black/10 backdrop-blur transition hover:bg-white/20" onClick={() => setProfileOpen((value) => !value)} id="nav-profile-btn" aria-label="Open profile menu" aria-expanded={profileOpen}>
              <span className="grid h-6 w-6 place-items-center overflow-hidden rounded text-xs"><ProfileAvatar src={profileImage} /></span><ChevronDown size={12} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            {profileOpen && <div className="absolute right-0 top-10 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 text-slate-800 shadow-lg" role="menu">
              {[{ label: "Profile", path: "/profile", Icon: User }, { label: "Enquiries", path: "/my-enquiries", Icon: MessageSquareText }, { label: "Trips", path: "/my-trips", Icon: MapPinned }, { label: "Documents", path: "/documents", Icon: Files }, { label: "Wishlist", path: "/wishlist", Icon: Heart }, { label: "Referrals", path: "/referrals", Icon: Gift }].map(({ label, path, Icon }) => <button key={path} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold transition hover:bg-amber-50" onClick={() => { setProfileOpen(false); navigate(path); }} role="menuitem"><Icon size={14} className="text-rose-500" />{label}</button>)}
            </div>}
          </div>
        ) : (
          <button className="rounded-lg bg-amber-300 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/20 transition hover:-translate-y-0.5 hover:bg-amber-200" onClick={() => navigate("/login")} id="nav-login-btn">
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
