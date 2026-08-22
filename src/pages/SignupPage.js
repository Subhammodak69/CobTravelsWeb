import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { requestOtp, verifyOtp } from "../api";
import { useTravel } from "../contexts/TravelContext";

const AUTH_BG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsMember } = useTravel();

  const send = async (event) => {
    event.preventDefault();
    if (!name.trim() || !identifier.trim()) return setError("Enter your name and mobile number or email.");
    setBusy(true); setError("");
    try { await requestOtp(identifier.trim()); setSent(true); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const verify = async (event) => {
    event.preventDefault();
    if (!otp.trim()) return setError("Enter the OTP sent to you.");
    setBusy(true); setError("");
    try { await verifyOtp(identifier.trim(), otp.trim(), name.trim()); setIsMember(true); navigate("/profile"); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  return (
    <main className="authPage" style={{ backgroundImage: `linear-gradient(100deg, rgba(23,32,51,.9), rgba(37,59,93,.72)), url(${AUTH_BG})`, backgroundPosition: "center", backgroundSize: "cover" }}>
      <section className="authIntro">
        <p className="eyebrow">Join the club</p>
        <h1>Make room<br /><em>for wonder.</em></h1>
        <p className="authIntroText">Create your account and keep every beautiful journey close at hand.</p>
        <div className="authTrust"><ShieldCheck size={17} /><span>Secure one-time-password signup</span></div>
      </section>

      <section className="authCard" aria-labelledby="signup-form-title">
        <div className="authCardHead">
          <p className="eyebrow">Start travelling</p>
          <h2 id="signup-form-title">{sent ? "Check your messages." : "Create your account."}</h2>
          <p>{sent ? `We sent a six-digit code to ${identifier}.` : "Tell us a little about yourself to get started."}</p>
        </div>
        <form className="authForm" onSubmit={sent ? verify : send}>
          <label htmlFor="signup-name">Your name</label>
          <input id="signup-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" autoComplete="name" disabled={sent || busy} />
          <label htmlFor="signup-identifier">Mobile number or email</label>
          <input id="signup-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="you@example.com" autoComplete="email" disabled={sent || busy} />
          {sent && <>
            <label htmlFor="signup-otp">One-time password</label>
            <input id="signup-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus disabled={busy} />
          </>}
          <button className="authSubmit" type="submit" disabled={busy}>{busy ? "Please wait…" : sent ? "Verify & create account" : "Send OTP"}{!busy && <ArrowRight size={17} />}</button>
          {sent && <button className="authChange" type="button" onClick={() => { setSent(false); setOtp(""); setError(""); }} disabled={busy}>Change details</button>}
          {error && <p className="authError" role="alert">{error}</p>}
        </form>
        <p className="authSwitch">Already have an account? <button type="button" onClick={() => navigate("/login")}>Log in</button></p>
      </section>
    </main>
  );
}
