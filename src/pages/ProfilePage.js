import { useEffect, useState } from "react";
import { useTravel } from "../contexts/TravelContext";
import { fetchPackages, updateMe, uploadFile } from "../api";
import useScrollReveal from "../hooks/useScrollReveal";

let profilePackagesPromise;

function loadProfilePackagesOnce() {
  if (!profilePackagesPromise) {
    profilePackagesPromise = fetchPackages();
  }
  return profilePackagesPromise;
}

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
  const { isMember, toggleMember, goHome, user, setUser, selectPackage } = useTravel();
  const [packages, setPackages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_mobile: "",
    profile_pic: "",
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");
  const revealRef = useScrollReveal();
  const [toggles, setToggles] = useState({ notif: true, newsletter: true, sms: false });
  const flip = (id) => setToggles((t) => ({ ...t, [id]: !t[id] }));
  const pastTrips = packages.slice(0, 3);

  useEffect(() => {
    loadProfilePackagesOnce()
      .then((result) => setPackages(result.items))
      .catch(() => setPackages([]));
  }, []);

  const openEditor = () => {
    setProfileForm({
      name: user?.name || "",
      mobile: user?.mobile || "",
      email: user?.email || "",
      address: user?.address || "",
      emergency_contact_name: user?.emergency_contact_name || "",
      emergency_contact_mobile: user?.emergency_contact_mobile || "",
      profile_pic: user?.profile_pic || user?.profile_image || "",
    });
    setProfileFile(null);
    setProfilePreview(user?.profile_pic || user?.profile_image || "");
    setEditError("");
    setEditing(true);
  };

  const chooseProfilePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setUploadingPhoto(true);
    setEditError("");
    try {
      const uploadResponse = await uploadFile(file);
      const profilePic = uploadResponse?.data?.url || uploadResponse?.url || "";
      if (!profilePic) throw new Error("The uploaded image URL was not returned.");
      setProfileForm((current) => ({ ...current, profile_pic: profilePic }));
      setProfilePreview(profilePic);
    } catch (error) {
      setProfileFile(null);
      setEditError(error.message || "Could not upload your profile picture.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!profileForm.name.trim()) return setEditError("Please enter your name.");
    setSaving(true);
    setEditError("");
    try {
      const response = await updateMe({
        ...profileForm,
        name: profileForm.name.trim(),
        source: "WEBSITE",
        is_imported: true,
      });
      const updatedUser = response?.data?.user || response?.data || response?.user;
      setUser(updatedUser ? { ...user, ...updatedUser } : { ...user, ...profileForm });
      setEditing(false);
    } catch (error) {
      setEditError(error.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = (user?.name || user?.email || "M")[0]?.toUpperCase() || "M";
  const profileImage = user?.profile_image || user?.profile_picture || user?.profileImage || user?.profile_pic || user?.avatar || user?.photoURL || user?.picture || user?.image || user?.image_url;

  return (
    <div ref={revealRef} className="profilePage" id="profile-page">
      <section className="profileHero">
        <div className="profileHeroBg" />
        <div className="profileHeroContent">
          <div className="profileAvatar">
            {profileImage ? (
              <img src={profileImage} alt={user?.name || "Profile"} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <span>{avatarLetter}</span>
            )}
          </div>
          <div className="profileInfo">
            <h1>{user?.name || "Member Traveller"}</h1>
            <p>{(user?.email || user?.mobile || "Authenticated Member") + " · Member"}</p>
          </div>
          <button className="profileEditBtn" id="profile-edit-btn" onClick={openEditor}>Edit profile</button>
        </div>
      </section>

      {editing && (
        <div className="profileModalBackdrop" role="presentation" onClick={() => !saving && setEditing(false)}>
          <section className="profileModal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="profileModalClose" type="button" onClick={() => setEditing(false)} aria-label="Close">×</button>
            <p className="eyebrow">Account</p>
            <h2 id="profile-modal-title">Edit your profile</h2>
            <form className="profileModalForm" onSubmit={saveProfile}>
              <div className="profilePhotoPicker">
                <div className="profilePhotoCircle">
                  {profilePreview ? <img src={profilePreview} alt="Profile preview" /> : <span>{(user?.name || "M")[0].toUpperCase()}</span>}
                  <label className="profilePhotoAdd" htmlFor="profile-picture" aria-label="Choose profile picture">+</label>
                </div>
                <input className="profilePhotoInput" id="profile-picture" type="file" accept="image/*" onChange={chooseProfilePhoto} disabled={saving || uploadingPhoto} />
                {uploadingPhoto ? <small className="profileUploadStatus"><span className="profileLoader" />Uploading image…</small> : <small>{profileFile ? `${profileFile.name} · Uploaded` : "Add a profile picture"}</small>}
              </div>
              <div className="profileFormGrid">
              {[
                ["name", "Full name"],
                ["mobile", "Mobile"],
                ["email", "Email"],
                ["address", "Address"],
                ["emergency_contact_name", "Emergency contact name"],
                ["emergency_contact_mobile", "Emergency contact mobile"],
              ].map(([field, label]) => (
                <div className={`profileFieldGroup ${field === "address" || field === "profile_pic" ? "profileFormFull" : ""}`} key={field}>
                  <label htmlFor={`profile-${field}`}>{label}</label>
                  {field === "address" ? (
                    <textarea id={`profile-${field}`} value={profileForm[field]} onChange={(event) => setProfileForm({ ...profileForm, [field]: event.target.value })} disabled={saving} />
                  ) : (
                    <input id={`profile-${field}`} type={field === "email" ? "email" : "text"} value={profileForm[field]} onChange={(event) => setProfileForm({ ...profileForm, [field]: event.target.value })} autoFocus={field === "name"} disabled={saving} />
                  )}
                </div>
              ))}
              </div>
              {editError && <p className="authError" role="alert">{editError}</p>}
              <div className="profileModalActions">
                <button type="button" className="catalogReset" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="reserve" disabled={saving || uploadingPhoto}>{saving ? "Saving…" : "Save changes"}</button>
              </div>
            </form>
          </section>
        </div>
      )}

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
