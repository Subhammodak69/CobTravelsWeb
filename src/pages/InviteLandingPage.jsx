import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Gift, ArrowRight, Compass, Sparkles, LoaderCircle, Users } from "lucide-react";
import { validateInviteToken, clearReferralCode } from "../api";

const INVITE_BG = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=90";

export default function InviteLandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Status: "checking" | "valid" | "invalid"
  const [status, setStatus] = useState("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const [referrerData, setReferrerData] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isAutoRedirectPaused, setIsAutoRedirectPaused] = useState(false);

  const redirectTimerRef = useRef(null);
  const intervalTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const searchParams = new URLSearchParams(location.search);
    const rawToken = searchParams.get("r") || searchParams.get("ref") || searchParams.get("referral") || "";

    if (!rawToken.trim()) {
      setStatus("invalid");
      setErrorMessage("No invitation code was found in this link.");
      clearReferralCode();
      return;
    }

    async function verify() {
      try {
        setStatus("checking");
        const data = await validateInviteToken(rawToken);
        if (!isMounted) return;

        setReferrerData(data);
        setStatus("valid");
      } catch (err) {
        if (!isMounted) return;
        clearReferralCode();
        setStatus("invalid");
        setErrorMessage(err.message || "This invitation link is invalid or has expired.");
      }
    }

    verify();

    return () => {
      isMounted = false;
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [location.search]);

  // Handle countdown and auto-navigation when verified
  useEffect(() => {
    if (status !== "valid" || isAutoRedirectPaused) {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      return;
    }

    setCountdown(3);

    intervalTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    redirectTimerRef.current = setTimeout(() => {
      navigate("/signup", { replace: true });
    }, 3000);

    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [status, isAutoRedirectPaused, navigate]);

  return (
    <main className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      {/* Background imagery and gradients */}
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        src={INVITE_BG}
        alt="Scenic travel background"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/85 to-indigo-950/70" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-rose-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl animate-fade-up">
        {/* CHECKING / VALIDATING STATE */}
        {status === "checking" && (
          <div className="rounded-[2.5rem] border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl shadow-2xl sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/20 text-amber-300 ring-8 ring-amber-400/10">
              <LoaderCircle className="animate-spin" size={36} />
            </div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300">
              Coochbehar Travels
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Verifying your invitation…
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Please wait a moment while we validate your exclusive referral link.
            </p>
          </div>
        )}

        {/* VALID INVITATION STATE */}
        {status === "valid" && (
          <div className="overflow-hidden rounded-[2.5rem] border border-white/25 bg-white p-8 text-slate-950 shadow-glow sm:p-10">
            {/* Header badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Gift size={18} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Exclusive Invitation
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                <CheckCircle2 size={13} /> Verified
              </span>
            </div>

            {/* Referrer Announcement */}
            <div className="mt-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200">
                <Users size={14} className="text-amber-600" />
                <span>
                  Invited by <strong className="font-semibold text-slate-900">{referrerData?.referrer_name || "A travel companion"}</strong>
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                You're invited to travel <span className="text-amber-600">better.</span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Welcome to Coochbehar Travels. Your referral invitation has been verified and will be automatically applied to your account.
              </p>
            </div>

            {/* Auto-redirect indicator & timer */}
            <div className="mt-6 rounded-2xl bg-amber-50/80 p-4 border border-amber-200/70">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-amber-900">
                  <Sparkles size={14} className="text-amber-600" />
                  {isAutoRedirectPaused
                    ? "Auto-redirect paused"
                    : `Redirecting to registration in ${countdown}s…`}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAutoRedirectPaused((prev) => !prev)}
                  className="font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-950"
                >
                  {isAutoRedirectPaused ? "Resume redirect" : "Stay on this page"}
                </button>
              </div>

              {/* Progress Bar */}
              {!isAutoRedirectPaused && (
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-amber-200/70">
                  <div
                    className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <span>Continue to Sign Up</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Log In Instead
              </button>
            </div>
          </div>
        )}

        {/* INVALID / EXPIRED STATE */}
        {status === "invalid" && (
          <div className="rounded-[2.5rem] border border-white/30 bg-white p-8 text-slate-950 shadow-2xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50">
              <AlertCircle size={32} />
            </div>

            <div className="mt-5 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-rose-600">
                Invalid Invitation
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Invitation link not active
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                {errorMessage || "The referral code is invalid, expired, or was improperly formatted."}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Don't worry — you can still create an account and explore curated tours!
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800"
              >
                <span>Sign Up Anyway</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/tours"
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Compass size={16} />
                <span>Explore Tours</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
