import { useEffect, useRef, useState } from "react";
import { submitEnquiry, fetchPackageSelect, isValidUUID } from "../api";
import { useTravel } from "../contexts/TravelContext";
import CustomSelect from "./CustomSelect";
import enums from "../utils/enums.json";
import { X } from "lucide-react";

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
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const firstRef = useRef(null);
  const overlayRef = useRef(null);

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
      <div className="absolute inset-0 bg-navy-dark/75 backdrop-blur-sm" style={{ animation: "fadeInBg 0.2s ease forwards" }} />

      <div
        className="relative z-10 flex flex-col w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{ animation: "slideUpPanel 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        {/* Header */}
        <div className="relative shrink-0 bg-navy px-6 py-4 text-white border-b border-navy-light flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-300">Quick Holiday Enquiry</p>
            <h2 id="enquiry-modal-title" className="font-display text-base font-bold text-white truncate max-w-sm">
              {displayTitle || packageTitle ? `${displayTitle || packageTitle}` : "Send Travel Enquiry"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl text-success font-bold">✓</span>
              <h3 className="font-display text-xl font-bold text-navy">Enquiry Sent Successfully!</h3>
              <p className="mt-2 text-xs text-slate-500 max-w-xs">Thank you, {form.name}. Our holiday manager will contact you on WhatsApp or phone shortly.</p>
            </div>
          ) : (
            <form id="enquiry-form" onSubmit={handleSubmit} noValidate className="grid gap-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-700" htmlFor="enq-name">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={firstRef}
                    id="enq-name"
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-700" htmlFor="enq-mobile">
                    Mobile / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="enq-mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={set("mobile")}
                    placeholder="+91 98765 43210"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {variants.length > 0 && (
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-700" htmlFor="enq-variant">
                    Tour Variant / Season
                  </label>
                  <CustomSelect
                    value={form.variant_id}
                    options={variants.map((v) => ({
                      label: `${v.name || v.season_name}${v.season_name && v.name && v.name !== v.season_name ? ` (${v.season_name})` : ""}`,
                      value: v.id,
                    }))}
                    onChange={(value) => setForm((f) => ({ ...f, variant_id: value }))}
                    placeholder="Select package option"
                    triggerClassName="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800"
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-700" htmlFor="enq-subject">
                  Enquiry Subject
                </label>
                <input
                  id="enq-subject"
                  type="text"
                  value={form.subject}
                  onChange={set("subject")}
                  placeholder="e.g. Group booking enquiry"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-700" htmlFor="enq-message">
                  Travel Plans & Preferences
                </label>
                <textarea
                  id="enq-message"
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us about dates, group size, hotel preferences or specific needs…"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {errorMsg && (
                <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600">{errorMsg}</p>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-3.5">
          {status === "success" ? (
            <button
              type="button"
              onClick={onClose}
              className="btn-primary rounded-xl text-xs font-bold px-5 py-2"
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="enquiry-form"
                id="enq-submit-btn"
                disabled={status === "loading"}
                className="btn-accent rounded-xl text-xs font-bold px-5 py-2 disabled:opacity-60"
              >
                {status === "loading" ? "Sending Enquiry…" : "Submit Enquiry →"}
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
