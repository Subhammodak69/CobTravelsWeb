import { useEffect, useState } from "react";
import { Check, Copy, Gift, LoaderCircle } from "lucide-react";
import { fetchReferralCode, fetchReferrals, getReferralLink } from "../api";

const formatDate = (value) => {
  const parsed = new Date(value);
  return value && !Number.isNaN(parsed.getTime())
    ? parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Not available";
};

export default function ReferralsPage() {
  const [link, setLink] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchReferralCode(), fetchReferrals()])
      .then(([codeResponse, referralResponse]) => {
        const code = codeResponse?.data?.referral_code;
        if (code) setLink(getReferralLink(code));
        const data = referralResponse?.data;
        setReferrals(Array.isArray(data) ? data : data?.items || data?.results || []);
      })
      .catch((err) => setError(err.message || "Could not load referrals."))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = async () => {
    if (!link) return;
    const message = `Join me on Coochbehar Travels and plan your next journey: ${link}`;
    try {
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        await navigator.share({
          title: "Join Coochbehar Travels",
          text: message,
          url: link,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
        return;
      }
    } catch {}

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the referral link.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-36">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <p className="eyebrow">Refer & Earn</p>
            <h1 className="section-title text-2xl sm:text-3xl">
              Invite <span className="text-primary">Friends</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
              Share a private invite link with friends and family to gift them discounts on their next journey.
            </p>
          </div>
          <span className="text-xs font-bold text-navy bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
            {referrals.length} referral{referrals.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-600">✕</button>
          </div>
        )}

        {/* INVITE HISTORY */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-navy">Referral Activity</h2>
            <span className="text-xs text-slate-400 font-semibold">
              {referrals.length} total
            </span>
          </div>

          {loading ? (
            <div className="card flex items-center justify-center p-12 text-slate-400">
              <LoaderCircle className="animate-spin text-primary" size={26} />
            </div>
          ) : referrals.length ? (
            <div className="card divide-y divide-slate-100">
              {referrals.map((referral) => (
                <article key={referral.id} className="flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center hover:bg-slate-50 transition">
                  <div>
                    <h3 className="text-sm font-bold text-navy">
                      {referral.referred_customer?.name || "Invited Traveller"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-slate-400">
                        Invited {formatDate(referral.created_at)}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                      <p className="text-[11px] text-slate-400">
                        {referral.referred_customer?.email || referral.referred_customer?.mobile || "Contact hidden"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit ${
                    referral.status === "COMPLETED" || referral.status === "SIGNED_UP"
                      ? "bg-green-100 text-success"
                      : referral.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {referral.status || "Pending"}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Gift className="mx-auto text-primary-300" size={36} />
              <h3 className="mt-3 font-display text-base font-bold text-navy">No Referrals Yet</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                Copy your unique invite link below and share it on WhatsApp or social media to get started.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* FLOATING INVITE CTA BAR */}
      <section className="fixed bottom-4 left-4 right-4 z-40 max-w-3xl mx-auto rounded-2xl bg-navy p-4 text-white shadow-elevated sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white flex-shrink-0">
            <Gift size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-bold text-white truncate">Invite a Fellow Traveller</h2>
            <p className="text-[11px] text-white/60 truncate">Your referral code is encoded securely in the invite link.</p>
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs text-white/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success flex-shrink-0"></span>
            <span className="truncate">{link ? link : "Generating your invite link..."}</span>
          </div>
          <button
            onClick={copyLink}
            disabled={!link || loading}
            className="btn-accent rounded-xl text-xs font-bold px-4 py-2.5 flex-shrink-0 disabled:opacity-50"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied Link!" : "Share Invite"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}