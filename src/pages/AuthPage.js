import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { requestOtp, verifyOtp } from "../api";
import { useTravel } from "../contexts/TravelContext";

const AUTH_BG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90";

export default function AuthPage() {
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const { loginSuccess } = useTravel();

  const send = async (event) => {
    event.preventDefault();
    if (!identifier.trim()) return setError("Enter your mobile number or email address.");
    if (isSignup && !name.trim()) return setError("Enter your full name.");
    setBusy(true); setError("");
    try {
      await requestOtp(identifier.trim());
      setSent(true);
    } catch (e) {
      setError(e.message || "Failed to send OTP. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    if (!otp.trim()) return setError("Enter the OTP sent to you.");
    setBusy(true); setError("");
    try {
      const r = await verifyOtp(identifier.trim(), otp.trim(), isSignup ? name.trim() : "");
      await loginSuccess(r);
      const returnTo = location.state?.from?.pathname || "/profile";
      navigate(returnTo, { replace: true });
    } catch (e) {
      setError(e.message || "Invalid OTP. Please check and try again.");
    } finally {
      setBusy(false);
    }
  };

  const submit = sent ? verify : send;

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-950 px-6 py-24 text-white sm:px-8 lg:grid-cols-[0.9fr_450px] lg:items-center lg:gap-20 lg:px-24">
      <img className="absolute inset-0 h-full w-full object-cover opacity-40" src={AUTH_BG} alt="Mountain landscape" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-teal-950/90 to-indigo-950/75" />
      <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-float" />
      <div className="relative z-10 col-span-full grid gap-12 lg:col-span-full lg:grid-cols-[0.9fr_450px] lg:items-center lg:gap-20">
      <section className="hidden max-w-xl animate-fade-up lg:block">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Member access</p>
        <h1 className="font-display text-7xl font-semibold leading-[0.9] tracking-tight">{isSignup ? "Begin your" : "Welcome"}<br /><em className="text-amber-300">{isSignup ? "journey." : "traveller."}</em></h1>
        <p className="mt-7 max-w-md text-base leading-8 text-white/75">Keep your favourite journeys, bookings and travel plans in one beautiful place.</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200 backdrop-blur"><ShieldCheck size={17} /><span>Secure one-time-password login</span></div>
      </section>

      <section className="animate-fade-up rounded-[2rem] border border-white/50 bg-white p-6 text-slate-950 shadow-glow sm:p-9" aria-labelledby="auth-form-title">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">Continue your journey</p>
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight" id="auth-form-title">{sent ? "Check your messages." : isSignup ? "Create your account." : "Sign in to your account."}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{sent ? `We sent a six-digit code to ${identifier}.` : "Use your mobile number or email to continue."}</p>
        </div>
        <form className="mt-8 flex flex-col gap-3" onSubmit={submit}>
          {!sent && isSignup && <><label className="text-[11px] font-bold uppercase tracking-wider text-slate-500" htmlFor="auth-name">Full name</label><input className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50 disabled:opacity-60" id="auth-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" autoComplete="name" disabled={busy} /></>}
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500" htmlFor="auth-identifier">Mobile number or email</label>
          <input className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50 disabled:opacity-60" id="auth-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="you@example.com" autoComplete="email" disabled={sent || busy} />
          {sent && <>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500" htmlFor="auth-otp">One-time password</label>
            <input className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/50 disabled:opacity-60" id="auth-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus disabled={busy} />
          </>}
          <button className="mt-3 flex h-[52px] items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60" type="submit" disabled={busy}>{busy ? "Please wait…" : sent ? (isSignup ? "Verify & create account" : "Verify & log in") : "Send OTP"}{!busy && <ArrowRight size={17} />}</button>
          {sent && <button className="self-center px-3 py-2 text-xs font-semibold text-slate-500 underline underline-offset-4" type="button" onClick={() => { setSent(false); setOtp(""); setError(""); }} disabled={busy}>Change identifier</button>}
          {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">{error}</p>}
        </form>
        <p className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">{isSignup ? "Already have an account? " : "New here? "}<button className="font-bold text-rose-500 underline underline-offset-4" type="button" onClick={() => navigate(isSignup ? "/login" : "/signup")}>{isSignup ? "Log in" : "Create an account"}</button></p>
      </section>
      </div>
    </main>
  );
}
