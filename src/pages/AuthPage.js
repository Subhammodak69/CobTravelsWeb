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
  const { setIsMember } = useTravel();

  const send = async (event) => {
    event.preventDefault();
    if (!identifier.trim()) return setError("Enter your mobile number or email address.");
    setBusy(true); setError("");
    try { await requestOtp(identifier.trim()); setSent(true); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const verify = async (event) => {
    event.preventDefault();
    if (!otp.trim()) return setError("Enter the OTP sent to you.");
    setBusy(true); setError("");
    try { await verifyOtp(identifier.trim(), otp.trim(), isSignup ? name.trim() : ""); setIsMember(true); navigate("/profile"); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const submit = sent ? verify : send;

  return (
    <main
      className="authPage"
      style={{
        backgroundImage: `linear-gradient(100deg, rgba(23,32,51,.9), rgba(37,59,93,.72)), url(${AUTH_BG})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <section className="authIntro">
        <p className="eyebrow">Member access</p>
        <h1>{isSignup ? "Begin your" : "Welcome"}<br /><em>{isSignup ? "journey." : "traveller."}</em></h1>
        <p className="authIntroText">Keep your favourite journeys, bookings and travel plans in one beautiful place.</p>
        <div className="authTrust"><ShieldCheck size={17} /><span>Secure one-time-password login</span></div>
      </section>

      <section className="authCard" aria-labelledby="auth-form-title">
        <div className="authCardHead">
          <p className="eyebrow">Continue your journey</p>
          <h2 id="auth-form-title">{sent ? "Check your messages." : isSignup ? "Create your account." : "Sign in to your account."}</h2>
          <p>{sent ? `We sent a six-digit code to ${identifier}.` : "Use your mobile number or email to continue."}</p>
        </div>
        <form className="authForm" onSubmit={submit}>
          {!sent && isSignup && <><label htmlFor="auth-name">Full name</label><input id="auth-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" autoComplete="name" disabled={busy} /></>}
          <label htmlFor="auth-identifier">Mobile number or email</label>
          <input id="auth-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="you@example.com" autoComplete="email" disabled={sent || busy} />
          {sent && <>
            <label htmlFor="auth-otp">One-time password</label>
            <input id="auth-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus disabled={busy} />
          </>}
          <button className="authSubmit" type="submit" disabled={busy}>{busy ? "Please wait…" : sent ? (isSignup ? "Verify & create account" : "Verify & log in") : "Send OTP"}{!busy && <ArrowRight size={17} />}</button>
          {sent && <button className="authChange" type="button" onClick={() => { setSent(false); setOtp(""); setError(""); }} disabled={busy}>Change identifier</button>}
          {error && <p className="authError" role="alert">{error}</p>}
        </form>
        <p className="authSwitch">{isSignup ? "Already have an account? " : "New here? "}<button type="button" onClick={() => navigate(isSignup ? "/login" : "/signup")}>{isSignup ? "Log in" : "Create an account"}</button></p>
      </section>
    </main>
  );
}
