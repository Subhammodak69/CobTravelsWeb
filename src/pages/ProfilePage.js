import { useCallback, useEffect, useState } from "react";
import { useTravel } from "../contexts/TravelContext";
import { deleteSession, fetchPackages, fetchSessions, updateMe, uploadFile } from "../api";
import useScrollReveal from "../hooks/useScrollReveal";
import ImageCropModal from "../components/ImageCropModal";


let profilePackagesPromise;

function loadProfilePackagesOnce() {
  if (!profilePackagesPromise) profilePackagesPromise = fetchPackages();
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

const eyebrow = "mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500";
const section = "px-6 py-16 sm:px-8 lg:px-16 lg:py-24";
const title = "font-display text-4xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl";
const input = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50 disabled:opacity-60";
const softButton = "rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60";
const dangerButton = "rounded-full bg-rose-100 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60";
const primaryButton = "inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ProfilePage() {
  const { isMember, toggleMember, handleLogout, goHome, user, setUser, selectPackage } = useTravel();
  const [packages, setPackages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState("");
  const [sessionActionId, setSessionActionId] = useState("");
  const [loggingOutAll, setLoggingOutAll] = useState(false);
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
  const [toggles, setToggles] = useState({ notif: true, newsletter: true, sms: false });
  const revealRef = useScrollReveal();
  const pastTrips = packages.slice(0, 3);

  useEffect(() => {
    loadProfilePackagesOnce()
      .then((result) => setPackages(result.items))
      .catch(() => setPackages([]));
  }, []);

  const loadSessions = useCallback(async () => {
    if (!isMember) return;
    setSessionsLoading(true);
    setSessionsError("");
    try {
      const response = await fetchSessions();
      setSessions(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setSessionsError(error.message || "Could not load active sessions.");
    } finally {
      setSessionsLoading(false);
    }
  }, [isMember]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const revokeSession = async (session) => {
    if (!session?.id || sessionActionId) return;
    const message = session.is_current ? "This will sign you out on this device. Continue?" : "Revoke this active session?";
    if (!window.confirm(message)) return;
    setSessionActionId(session.id);
    setSessionsError("");
    try {
      await deleteSession(session.id);
      if (session.is_current) {
        await handleLogout(false);
        return;
      }
      setSessions((current) => current.filter((item) => item.id !== session.id));
    } catch (error) {
      setSessionsError(error.message || "Could not revoke this session.");
    } finally {
      setSessionActionId("");
    }
  };

  const logoutEverywhere = async () => {
    if (loggingOutAll) return;
    if (!window.confirm("Log out from all active sessions?")) return;
    setLoggingOutAll(true);
    setSessionsError("");
    try {
      await handleLogout(true);
    } catch (error) {
      setSessionsError(error.message || "Could not log out all sessions.");
      setLoggingOutAll(false);
    }
  };

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

  useEffect(() => {
    if (!editing) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [editing]);


  const [rawImageForCrop, setRawImageForCrop] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const chooseProfilePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageForCrop(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    // Reset file input value so re-selecting same file works
    event.target.value = "";
  };

  const handleCroppedPhoto = async (croppedFile, previewDataUrl) => {
    setCropModalOpen(false);
    setProfileFile(croppedFile);
    setProfilePreview(previewDataUrl);
    setUploadingPhoto(true);
    setEditError("");
    try {
      const uploadResponse = await uploadFile(croppedFile);
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
      const response = await updateMe({ ...profileForm, name: profileForm.name.trim(), source: "WEBSITE", is_imported: true });
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
  const profileDetails = [
    ["Customer code", user?.customer_code],
    ["Full name", user?.name],
    ["Mobile", user?.mobile],
    ["Email", user?.email],
    ["Address", user?.address],
    ["Emergency contact", user?.emergency_contact_name],
    ["Emergency mobile", user?.emergency_contact_mobile],
    ["Source", user?.source],
    ["Member since", formatDate(user?.created_at)],
    ["Last updated", formatDate(user?.updated_at)],
  ].filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");

  return (
    <div ref={revealRef} className="bg-slate-50" id="profile-page">
      <section className="relative overflow-hidden bg-slate-950 px-6 pb-14 pt-32 text-white sm:px-8 lg:px-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-float" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full bg-amber-300 font-display text-5xl font-semibold text-slate-950 shadow-glow">
            {profileImage ? <img className="h-full w-full object-cover" src={profileImage} alt={user?.name || "Profile"} /> : <span>{avatarLetter}</span>}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-4xl font-semibold leading-none tracking-tight sm:text-6xl">{user?.name || "Member Traveller"}</h1>
            <p className="mt-3 text-sm text-white/60">{(user?.email || user?.mobile || "Authenticated Member") + " · Member"}</p>
          </div>
          <button className="w-fit rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20" id="profile-edit-btn" onClick={openEditor}>Edit profile</button>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xl" role="presentation" onClick={() => !saving && setEditing(false)}>
          <section className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/30" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onClick={(event) => event.stopPropagation()}>
            {/* Fixed Modal Header */}
            <div className="relative flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
              <div>
                <p className={eyebrow}>Account</p>
                <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl" id="profile-modal-title">Edit your profile</h2>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-2xl text-slate-500 transition hover:rotate-90 hover:bg-slate-200" type="button" onClick={() => setEditing(false)} aria-label="Close">×</button>
            </div>

            {/* Scrollable Modal Content */}
            <form id="profile-edit-form" className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8" onSubmit={saveProfile}>
              <div className="flex flex-col items-center gap-3 pb-4">
                <div className="relative grid h-28 w-28 place-items-center overflow-visible rounded-full bg-amber-300 font-display text-4xl font-semibold text-slate-950 shadow-xl shadow-slate-950/10">
                  {profilePreview ? <img className="h-full w-full rounded-full object-cover" src={profilePreview} alt="Profile preview" /> : <span>{(user?.name || "M")[0].toUpperCase()}</span>}
                  <label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-2xl bg-slate-950 text-xl text-white shadow-lg transition hover:scale-105" htmlFor="profile-picture" aria-label="Choose profile picture">+</label>
                </div>
                <input className="hidden" id="profile-picture" type="file" accept="image/*" onChange={chooseProfilePhoto} disabled={saving || uploadingPhoto} />
                <small className="text-xs text-slate-500">{uploadingPhoto ? "Uploading image..." : profileFile ? `${profileFile.name} · Uploaded` : "Add a profile picture"}</small>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["name", "Full name"],
                  ["mobile", "Mobile"],
                  ["email", "Email"],
                  ["address", "Address"],
                  ["emergency_contact_name", "Emergency contact name"],
                  ["emergency_contact_mobile", "Emergency contact mobile"],
                ].map(([field, label]) => (
                  <div className={field === "address" ? "sm:col-span-2" : ""} key={field}>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500" htmlFor={`profile-${field}`}>{label}</label>
                    {field === "address" ? (
                      <textarea className={`${input} min-h-24 resize-y`} id={`profile-${field}`} value={profileForm[field]} onChange={(event) => setProfileForm({ ...profileForm, [field]: event.target.value })} disabled={saving} />
                    ) : (
                      <input className={input} id={`profile-${field}`} type={field === "email" ? "email" : "text"} value={profileForm[field]} onChange={(event) => setProfileForm({ ...profileForm, [field]: event.target.value })} autoFocus={field === "name"} disabled={saving} />
                    )}
                  </div>
                ))}
              </div>
              {editError && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">{editError}</p>}
            </form>

            {/* Fixed Modal Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 backdrop-blur-sm sm:px-8">
              <button type="button" className={softButton} onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
              <button type="submit" form="profile-edit-form" className={primaryButton} disabled={saving || uploadingPhoto}>{saving ? "Saving..." : "Save changes"}</button>
            </div>
          </section>
        </div>
      )}

      {/* WhatsApp style Crop Modal */}
      <ImageCropModal
        imageSrc={rawImageForCrop}
        open={cropModalOpen}
        onCrop={handleCroppedPhoto}
        onCancel={() => setCropModalOpen(false)}
      />



      {isMember && (
        <section className="grid grid-cols-2 border-b border-slate-200 bg-white lg:grid-cols-4">
          {STATS.map(({ label, value }) => (
            <div className="border-r border-b border-slate-200 p-6 lg:p-8" key={label}>
              <b className="block font-display text-4xl font-semibold leading-none text-slate-950">{value}</b>
              <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
            </div>
          ))}
        </section>
      )}

      {isMember && profileDetails.length > 0 && (
        <section className={`${section} bg-slate-100`}>
          <p className={eyebrow}>Profile</p>
          <h2 className={title}>Your <em className="text-amber-500">details.</em></h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {profileDetails.map(([label, value]) => (
              <div className={`rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 ${label === "Address" ? "lg:col-span-2" : ""}`} key={label}>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500">{label}</span>
                <b className="block break-words text-sm font-semibold leading-6 text-slate-800">{String(value)}</b>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={`${section} bg-slate-50`}>
        <p className={eyebrow}>Your journeys</p>
        <h2 className={title}>Trips you&apos;ve <em className="text-amber-500">loved.</em></h2>
        {isMember ? (
          <div className="mt-10 grid gap-4">
            {pastTrips.map((pack) => (
              <article key={pack.id} className="group flex cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-lg shadow-slate-950/5 transition hover:-translate-y-1 hover:shadow-glow sm:flex-row sm:items-center" onClick={() => selectPackage(pack.id)} id={`profile-trip-${pack.id}`}>
                <img className="h-44 w-full object-cover transition group-hover:scale-105 sm:h-28 sm:w-40" src={pack.image} alt={pack.title} />
                <div className="flex-1 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{pack.code} · {pack.duration}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">{pack.title}</h3>
                  <span className="mt-2 block text-sm text-slate-500">{pack.route.slice(0, 2).join(" → ")}</span>
                </div>
                <span className="px-5 pb-5 text-2xl text-amber-500 sm:pb-0">↗</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-950/5">
            <p className="text-slate-500">Sign in to see your trip history and saved itineraries.</p>
            <button className={`${primaryButton} mt-5`} id="profile-locked-signin-btn" onClick={() => window.location.assign("/login")}>Sign in <span>→</span></button>
          </div>
        )}
      </section>

      <section className={`${section} bg-white`}>
        <p className={eyebrow}>Preferences</p>
        <h2 className={title}>Stay in the <em className="text-amber-500">loop.</em></h2>
        <div className="mt-10 divide-y divide-slate-200 rounded-[1.5rem] border border-slate-200 bg-slate-50">
          {SETTINGS.map(({ id, label, desc }) => (
            <label key={id} className="flex cursor-pointer items-center justify-between gap-5 p-5" id={`pref-${id}`}>
              <div><span className="block text-sm font-bold text-slate-900">{label}</span><small className="text-xs text-slate-500">{desc}</small></div>
              <button role="switch" aria-checked={toggles[id]} className={`relative h-7 w-12 shrink-0 rounded-full transition ${toggles[id] ? "bg-amber-400" : "bg-slate-300"}`} onClick={() => setToggles((t) => ({ ...t, [id]: !t[id] }))} type="button">
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${toggles[id] ? "left-6" : "left-1"}`} />
              </button>
            </label>
          ))}
        </div>
      </section>

      {isMember && (
        <section className={`${section} bg-slate-50`}>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div><p className={eyebrow}>Security</p><h2 className={title}>Active <em className="text-amber-500">sessions.</em></h2></div>
            <div className="flex flex-wrap gap-3">
              <button className={softButton} type="button" onClick={loadSessions} disabled={sessionsLoading || Boolean(sessionActionId) || loggingOutAll}>{sessionsLoading ? "Refreshing..." : "Refresh"}</button>
              <button className={dangerButton} type="button" onClick={logoutEverywhere} disabled={loggingOutAll || Boolean(sessionActionId)}>{loggingOutAll ? "Logging out..." : "Logout all"}</button>
            </div>
          </div>
          {sessionsError && <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">{sessionsError}</p>}
          {sessionsLoading && sessions.length === 0 ? (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6 text-slate-500">Loading active sessions...</div>
          ) : sessions.length > 0 ? (
            <div className="mt-8 grid gap-4">
              {sessions.map((session) => (
                <article className="flex flex-col gap-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 lg:flex-row lg:items-center lg:justify-between" key={session.id}>
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-950">{session.actor_type || "Session"}</h3>
                      {session.is_current && <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">Current device</span>}
                    </div>
                    <p className="break-words text-sm leading-6 text-slate-600">{session.user_agent || "Unknown browser"}</p>
                    <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                      <small>IP: {session.ip_address || "Not available"}</small>
                      <small>Started: {formatDateTime(session.created_at)}</small>
                      <small>Last used: {formatDateTime(session.last_used_at)}</small>
                      <small>Expires: {formatDateTime(session.expires_at)}</small>
                    </div>
                  </div>
                  <button className="rounded-full bg-slate-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => revokeSession(session)} disabled={Boolean(sessionActionId) || loggingOutAll}>
                    {sessionActionId === session.id ? "Revoking..." : session.is_current ? "Sign out here" : "Revoke"}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6 text-slate-500">No active sessions found.</div>
          )}
        </section>
      )}

      <section className={`${section} bg-white`}>
        <p className={eyebrow}>Account</p>
        <h2 className={title}>Manage your <em className="text-amber-500">account.</em></h2>
        <div className="mt-10 divide-y divide-slate-200 rounded-[1.5rem] border border-slate-200 bg-slate-50">
          {["Contact support", "Privacy policy", "Terms & conditions"].map((label) => (
            <button className="flex w-full items-center justify-between px-5 py-5 text-left text-sm font-semibold text-slate-700 transition hover:bg-white hover:px-7" key={label}>{label}<em className="not-italic text-slate-400">→</em></button>
          ))}
          {isMember && <button className="flex w-full items-center justify-between px-5 py-5 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50 hover:px-7" id="profile-signout-btn" onClick={toggleMember}>Sign out<em className="not-italic">→</em></button>}
        </div>
      </section>

      <div className="bg-slate-50 px-6 py-12 text-center">
        <button className={primaryButton} id="profile-back-home-btn" onClick={goHome}>Back to journeys <span>↓</span></button>
      </div>
    </div>
  );
}
