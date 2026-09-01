import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Gift, ArrowRight, Compass, Sparkles, LoaderCircle, Users } from "lucide-react";
import { validateInviteToken, clearReferralCode } from "../api";

const INVITE_BG = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=90";

export default function InviteLandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

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
    <main className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-navy px-4 py-16 text-white sm:px-6 lg:px-8">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-25 brightness-75"
        src={INVITE_BG}
        alt="Scenic travel background"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark via-navy/90 to-primary-950/80" />

      <div className="relative z-10 w-full max-w-xl animate-fade-up">
        {/* CHECKING / VALIDATING STATE */}
        {status === "checking" && (
          <div className="card p-8 text-center bg-white/95 backdrop-blur-xl shadow-2xl sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary">
              <LoaderCircle className="animate-spin" size={36} />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Coochbehar Travel
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Verifying Your Invitation…
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-500">
              Please wait a moment while we validate your exclusive referral link.
            </p>
          </div>
        )}

        {/* VALID INVITATION STATE */}
        {status === "valid" && (
          <div className="card p-8 text-slate-900 shadow-2xl sm:p-10">
            {/* Header badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent">
                  <Gift size={18} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Special Travel Invitation
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-success border border-green-200">
                <CheckCircle2 size={13} /> Verified
              </span>
            </div>

            {/* Referrer Announcement */}
            <div className="mt-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-600 border border-slate-200">
                <Users size={14} className="text-primary" />
                <span>
                  Invited by <strong className="font-bold text-navy">{referrerData?.referrer_name || "A travel companion"}</strong>
                </span>
              </div>

              <h1 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
                You're invited to travel <span className="text-primary">with us.</span>
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                Welcome to Coochbehar Travel. Your exclusive referral invite has been verified and will be automatically applied to your account for upcoming trip perks.
              </p>
            </div>

            {/* Auto-redirect indicator & timer */}
            <div className="mt-6 rounded-2xl bg-primary-50 p-4 border border-primary-100">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-primary">
                  <Sparkles size={14} />
                  {isAutoRedirectPaused
                    ? "Auto-redirect paused"
                    : `Redirecting to registration in ${countdown}s…`}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAutoRedirectPaused((prev) => !prev)}
                  className="font-bold text-primary hover:underline"
                >
                  {isAutoRedirectPaused ? "Resume redirect" : "Stay here"}
                </button>
              </div>

              {/* Progress Bar */}
              {!isAutoRedirectPaused && (
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-primary-200">
                  <div
                    className="h-full bg-primary transition-all duration-1000 ease-linear"
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
                className="btn-primary flex-1 justify-center rounded-xl py-3 text-xs font-bold shadow-md"
              >
                <span>Continue to Sign Up</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="btn-outline justify-center rounded-xl py-3 text-xs font-bold"
              >
                Sign In Instead
              </button>
            </div>
          </div>
        )}

        {/* INVALID / EXPIRED STATE */}
        {status === "invalid" && (
          <div className="card p-8 text-slate-900 shadow-2xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle size={32} />
            </div>

            <div className="mt-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Invalid Invitation
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Invitation Link Not Active
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {errorMessage || "The referral code is invalid, expired, or was improperly formatted."}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Don't worry — you can still create an account and explore curated tour packages!
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="btn-primary flex-1 justify-center rounded-xl py-3 text-xs font-bold shadow-md"
              >
                <span>Sign Up Anyway</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/tours"
                className="btn-outline justify-center rounded-xl py-3 text-xs font-bold"
              >
                <Compass size={15} />
                <span>Explore Tours</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
