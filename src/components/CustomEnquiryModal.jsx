import { useEffect, useRef, useState } from "react";
import { submitCustomEnquiry } from "../api";
import { useTravel } from "../contexts/TravelContext";
import enums from "../utils/enums.json";

const VEHICLE_OPTIONS = Object.values(enums.VehicleType);
const MEAL_OPTIONS = Object.values(enums.MealPlan);
const ENQUIRY_TYPE_OPTIONS = Object.values(enums.EnquiryType).filter(
  (t) => t !== "FIXED_TOUR" && t !== "FIXED TOUR"
);


const INITIAL = {
  name: "", mobile: "", destination: "", travel_date: "", travel_duration: "",
  pax_no: 2, no_room: 1, vehicle_type: "", meal_plan: "", special_requirements: "", enquiry_type: "CUSTOM_TOUR",
};

export default function CustomEnquiryModal({ open, onClose }) {
  const { user } = useTravel();
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const firstRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL, name: user?.name || "", mobile: user?.mobile || user?.phone || "" });
      setStatus("idle");
      setErrorMsg("");
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setNum = (field) => (e) => setForm((f) => ({ ...f, [field]: Number(e.target.value) || 1 }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim() || !form.destination.trim()) {
      setErrorMsg("Name, mobile and destination are required.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await submitCustomEnquiry({ ...form, customer_id: user?.id || "" });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (!open) return null;

  const inputCls = "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200/50";
  const selectCls = "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200/50 cursor-pointer";
  const labelCls = "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-enquiry-modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" style={{animation:"fadeInBg 0.2s ease forwards"}} />

      {/* Panel — scrollable on mobile */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-t-[2rem] sm:rounded-[2rem] bg-white shadow-2xl shadow-slate-950/30 sm:mx-4 overflow-hidden"
        style={{animation:"slideUpPanel 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards", maxHeight:"94dvh", display:"flex", flexDirection:"column"}}
      >
        {/* Header */}
        <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-indigo-950 to-teal-900 px-7 py-7 text-white">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute -bottom-8 left-24 h-32 w-32 rounded-full bg-teal-400/10 blur-2xl" />
          <div className="relative">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">Custom Package</p>
            <h2 id="custom-enquiry-modal-title" className="font-display text-2xl font-semibold tracking-tight">
              Build Your Dream Journey
            </h2>
            <p className="mt-1 text-sm text-white/60">Tell us what you have in mind and we'll craft it for you.</p>
          </div>
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close custom enquiry modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-7 py-6 flex-1">
          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</span>
              <h3 className="font-display text-2xl font-semibold text-slate-950">Request Received!</h3>
              <p className="mt-2 text-sm text-slate-500">
                Thank you, {form.name}! Our team will design your custom package and contact you soon.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-2xl bg-amber-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-5">
              {/* Section: Contact */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-500">Contact Details</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="cenq-name">Full Name <span className="text-rose-500">*</span></label>
                    <input ref={firstRef} id="cenq-name" type="text" value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-mobile">Mobile <span className="text-rose-500">*</span></label>
                    <input id="cenq-mobile" type="tel" value={form.mobile} onChange={set("mobile")} placeholder="+91 98765 43210" className={inputCls} required />
                  </div>
                </div>
              </div>

              {/* Section: Trip */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-500">Trip Details</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="cenq-destination">Destination <span className="text-rose-500">*</span></label>
                    <input id="cenq-destination" type="text" value={form.destination} onChange={set("destination")} placeholder="e.g. Darjeeling, Sikkim" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-enquiry-type">Enquiry Type</label>
                    <select id="cenq-enquiry-type" value={form.enquiry_type} onChange={set("enquiry_type")} className={selectCls}>
                      {ENQUIRY_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-travel-date">Travel Date</label>
                    <input id="cenq-travel-date" type="date" value={form.travel_date} onChange={set("travel_date")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-travel-duration">Duration</label>
                    <input id="cenq-travel-duration" type="text" value={form.travel_duration} onChange={set("travel_duration")} placeholder="e.g. 5N / 6D" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Section: Group */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-500">Group & Accommodation</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelCls} htmlFor="cenq-pax">No. of Travellers</label>
                    <input id="cenq-pax" type="number" min={1} max={100} value={form.pax_no} onChange={setNum("pax_no")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-rooms">No. of Rooms</label>
                    <input id="cenq-rooms" type="number" min={1} max={50} value={form.no_room} onChange={setNum("no_room")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-meal">Meal Plan</label>
                    <select id="cenq-meal" value={form.meal_plan} onChange={set("meal_plan")} className={selectCls}>
                      <option value="">Select meal plan</option>
                      {MEAL_OPTIONS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Vehicle & Notes */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-500">Vehicle & Notes</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="cenq-vehicle">Vehicle Type</label>
                    <select id="cenq-vehicle" value={form.vehicle_type} onChange={set("vehicle_type")} className={selectCls}>
                      <option value="">Select vehicle</option>
                      {VEHICLE_OPTIONS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-1 col-span-full">
                    <label className={labelCls} htmlFor="cenq-special">Special Requirements</label>
                    <textarea
                      id="cenq-special"
                      value={form.special_requirements}
                      onChange={set("special_requirements")}
                      placeholder="Any dietary needs, accessibility requirements, preferences…"
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-600">{errorMsg}</p>
              )}

              <div className="flex items-center justify-end gap-3 pb-1">
                <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100">
                  Cancel
                </button>
                <button
                  type="submit"
                  id="cenq-submit-btn"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-60 disabled:translate-y-0"
                >
                  {status === "loading" ? (
                    <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" /> Sending…</>
                  ) : (
                    <>Request Custom Package <span>→</span></>
                  )}
                </button>
              </div>
            </form>
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
