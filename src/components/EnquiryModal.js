import { useEffect, useRef, useState } from "react";
import { submitEnquiry, fetchPackageSelect, isValidUUID } from "../api";
import { useTravel } from "../contexts/TravelContext";
import enums from "../utils/enums.json";

const CHANNELS = Object.keys(enums?.EnquiryChannel || {
  WEBSITE: "WEBSITE",
  WHATSAPP: "WHATSAPP",
  PHONE: "PHONE",
  EMAIL: "EMAIL",
  OFFLINE: "OFFLINE",
  ADMIN: "ADMIN",
});

const INITIAL = { name: "", mobile: "", channel: "WEBSITE", subject: "", message: "", variant_id: "" };

export default function EnquiryModal({
  open,
  onClose,
  packageId = "",
  packageSlug = "",
  variantId = "",
  packageTitle = "",
}) {
  const { user } = useTravel();
  const [form, setForm] = useState(INITIAL);
  const [variants, setVariants] = useState([]);
  const [resolvedPackageId, setResolvedPackageId] = useState(packageId);
  const [displayTitle, setDisplayTitle] = useState(packageTitle);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const firstRef = useRef(null);
  const overlayRef = useRef(null);

  // Fetch package variants via /api/v1/tour-packages/select/{slug}
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    const lookupKey = packageSlug || packageId;

    if (lookupKey) {
      setLoadingVariants(true);
      fetchPackageSelect(lookupKey)
        .then((data) => {
          if (!isMounted || !data) return;
          if (data.id && isValidUUID(data.id)) {
            setResolvedPackageId(data.id);
          }
          if (data.title && !packageTitle) {
            setDisplayTitle(data.title);
          }
          if (Array.isArray(data.variants) && data.variants.length > 0) {
            setVariants(data.variants);
            // Default selected variant
            setForm((f) => ({
              ...f,
              variant_id: variantId || f.variant_id || data.variants[0].id || "",
            }));
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingVariants(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [open, packageSlug, packageId, variantId, packageTitle]);

  // Pre-fill user details
  useEffect(() => {
    if (open) {
      setForm({
        name: user?.name || "",
        mobile: user?.mobile || user?.phone || "",
        channel: "WEBSITE",
        subject: (packageTitle || displayTitle) ? `Enquiry about ${packageTitle || displayTitle}` : "",
        message: "",
        variant_id: variantId || "",
      });
      setStatus("idle");
      setErrorMsg("");
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [open, user, packageTitle, displayTitle, variantId]);

  // Trap keyboard & lock body scroll
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      setErrorMsg("Name and mobile number are required.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const finalPkgId = isValidUUID(resolvedPackageId) ? resolvedPackageId : (isValidUUID(packageId) ? packageId : "");
      await submitEnquiry({
        package_id: finalPkgId,
        variant_id: form.variant_id || variantId,
        channel: form.channel || "WEBSITE",
        subject: form.subject,
        message: form.message,
        name: form.name,
        mobile: form.mobile,
        customer_id: user?.id || "",
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" style={{ animation: "fadeInBg 0.2s ease forwards" }} />

      {/* Modal Container with Fixed Header, Scrollable Body, and Fixed Footer */}
      <div
        className="relative z-10 flex flex-col w-full max-w-lg max-h-[90vh] rounded-t-[2rem] sm:rounded-[2rem] bg-white shadow-2xl shadow-slate-950/30 overflow-hidden"
        style={{ animation: "slideUpPanel 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        {/* Fixed Header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-slate-950 to-teal-900 px-7 py-6 text-white border-b border-slate-800">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/15 blur-2xl" />
          <div className="absolute -bottom-6 left-16 h-28 w-28 rounded-full bg-teal-400/10 blur-2xl" />
          <div className="relative pr-10">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">Send Enquiry</p>
            <h2 id="enquiry-modal-title" className="font-display text-2xl font-semibold tracking-tight">
              {displayTitle || packageTitle ? `Plan "${displayTitle || packageTitle}"` : "Get in Touch"}
            </h2>
            <p className="mt-1 text-sm text-white/60">Our team will get back to you shortly.</p>
          </div>
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close enquiry modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {status === "success" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</span>
              <h3 className="font-display text-2xl font-semibold text-slate-950">Enquiry Sent!</h3>
              <p className="mt-2 text-sm text-slate-500">Thank you, {form.name}. We'll be in touch soon.</p>
            </div>
          ) : (
            <form id="enquiry-form" onSubmit={handleSubmit} noValidate className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" htmlFor="enq-name">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={firstRef}
                    id="enq-name"
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" htmlFor="enq-mobile">
                    Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="enq-mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={set("mobile")}
                    placeholder="+91 98765 43210"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50"
                    required
                  />
                </div>
              </div>

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" htmlFor="enq-variant">
                    Package Variant / Season
                  </label>
                  <select
                    id="enq-variant"
                    value={form.variant_id}
                    onChange={set("variant_id")}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50 cursor-pointer"
                  >
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name || v.season_name} {v.season_name && v.name && v.name !== v.season_name ? `(${v.season_name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" htmlFor="enq-subject">
                  Subject
                </label>
                <input
                  id="enq-subject"
                  type="text"
                  value={form.subject}
                  onChange={set("subject")}
                  placeholder="e.g. Group booking query"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" htmlFor="enq-message">
                  Message
                </label>
                <textarea
                  id="enq-message"
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us about your travel plans, group size, special needs…"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50 resize-none"
                />
              </div>

              {errorMsg && (
                <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-600">{errorMsg}</p>
              )}
            </form>
          )}
        </div>


        {/* Fixed Footer */}
        <div className="shrink-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/90 px-7 py-4 backdrop-blur-sm">
          {status === "success" ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-amber-300 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-200/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="enquiry-form"
                id="enq-submit-btn"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-60 disabled:translate-y-0"
              >
                {status === "loading" ? (
                  <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" /> Sending…</>
                ) : (
                  <>Send Enquiry <span>→</span></>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInBg { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUpPanel { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
