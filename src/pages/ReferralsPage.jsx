// ReferralsPage.jsx - Compressed version
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
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the referral link.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 max-w-8xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-1">Bring someone along</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 font-display">
                Your <span className="text-amber-500">referrals.</span>
              </h1>
              <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                Share a private invite link with someone who would love to travel with us.
              </p>
            </div>
            <span className="text-[10px] font-medium text-slate-400 bg-white px-2.5 py-1 rounded-full shadow-sm ring-1 ring-slate-200/80">
              {referrals.length} referral{referrals.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-600">✕</button>
            </div>
          )}

          {/* INVITE HISTORY */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-950 font-display">Invite history</h2>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {referrals.length} total
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-slate-400">
                <LoaderCircle className="animate-spin" size={22} />
              </div>
            ) : referrals.length ? (
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {referrals.map((referral) => (
                  <article key={referral.id} className="flex flex-col justify-between gap-2 px-4 py-3 sm:flex-row sm:items-center hover:bg-slate-50/50 transition">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {referral.referred_customer?.name || "Invited traveller"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-slate-400">
                          Invited {formatDate(referral.created_at)}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                        <p className="text-[10px] text-slate-400">
                          {referral.referred_customer?.email || referral.referred_customer?.mobile || "Contact unavailable"}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit ${referral.status === "COMPLETED" || referral.status === "SIGNED_UP"
                      ? "bg-emerald-100 text-emerald-700"
                      : referral.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                      }`}>
                      {referral.status || "Pending"}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Gift className="mx-auto text-slate-300" size={26} />
                <h3 className="mt-3 text-sm font-semibold text-slate-800">No referrals yet</h3>
                <p className="mt-1 text-xs text-slate-500">Share your invite link to start earning rewards.</p>
              </div>
            )}
          </section>

          {/* STATS FOOTER */}
          {!loading && referrals.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] text-slate-400 border-t border-slate-200/80 pt-4">
              <span>📤 {referrals.filter(r => r.status === "PENDING").length} pending</span>
              <span>✅ {referrals.filter(r => r.status === "COMPLETED" || r.status === "SIGNED_UP").length} completed</span>
              <span className="text-amber-500">⭐ Share more to earn rewards!</span>
            </div>
          )}

        </div>

      <section className="fixed bottom-3 left-0 right-0 rounded-2xl  max-w-2xl mx-auto bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300 text-slate-950">
            <Gift size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold font-display">Invite a fellow traveller</h2>
            <p className="text-[10px] text-white/50">Your referral code stays hidden inside the link.</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
            {link ? "Private invite link ready" : "Preparing your invite link..."}
          </div>
          <button
            onClick={copyLink}
            disabled={!link || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-300 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy invite link"}
          </button>
        </div>
      </section>
    </>

  );
}