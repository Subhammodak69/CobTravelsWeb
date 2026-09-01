import { useEffect, useRef, useState } from "react";
import { submitCustomEnquiry } from "../api";
import { useTravel } from "../contexts/TravelContext";
import CustomSelect from "./CustomSelect";
import enums from "../utils/enums.json";
import { X, Sparkle } from "lucide-react";

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
  const [status, setStatus] = useState("idle");
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
      setErrorMsg("Name, mobile number and destination are required.");
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

  const inputCls = "h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";
  const labelCls = "mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-700";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-enquiry-modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-navy-dark/75 backdrop-blur-sm" style={{ animation: "fadeInBg 0.2s ease forwards" }} />

      <div
        className="relative z-10 w-full max-w-2xl rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{ animation: "slideUpPanel 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        {/* Header */}
        <div className="relative shrink-0 bg-navy px-6 py-4 text-white border-b border-navy-light flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent-300">
              <Sparkle size={11} /> Tailor-Made Itinerary
            </span>
            <h2 id="custom-enquiry-modal-title" className="font-display text-base font-bold text-white">
              Plan a Customized Holiday
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

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {status === "success" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl text-success font-bold">✓</span>
              <h3 className="font-display text-xl font-bold text-navy">Custom Enquiry Received!</h3>
              <p className="mt-2 text-xs text-slate-500 max-w-sm">
                Thank you, {form.name}! Our destination planners will design your itinerary for {form.destination} and reach out to you within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="btn-primary mt-6 rounded-xl text-xs font-bold px-6 py-2.5"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-4">
              {/* Contact */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">1. Contact Information</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="cenq-name">Full Name <span className="text-rose-500">*</span></label>
                    <input ref={firstRef} id="cenq-name" type="text" value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-mobile">Mobile / WhatsApp <span className="text-rose-500">*</span></label>
                    <input id="cenq-mobile" type="tel" value={form.mobile} onChange={set("mobile")} placeholder="+91 98765 43210" className={inputCls} required />
                  </div>
                </div>
              </div>

              {/* Trip */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">2. Trip Preferences</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="cenq-destination">Destination <span className="text-rose-500">*</span></label>
                    <input id="cenq-destination" type="text" value={form.destination} onChange={set("destination")} placeholder="e.g. Kashmir, Bhutan, Goa" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-enquiry-type">Tour Category</label>
                    <CustomSelect
                      value={form.enquiry_type}
                      options={ENQUIRY_TYPE_OPTIONS.map((t) => ({ label: t.replace(/_/g, " "), value: t }))}
                      onChange={(value) => setForm((f) => ({ ...f, enquiry_type: value }))}
                      placeholder="Select category"
                      triggerClassName="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-travel-date">Tentative Date</label>
                    <input id="cenq-travel-date" type="date" value={form.travel_date} onChange={set("travel_date")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-travel-duration">Trip Duration</label>
                    <input id="cenq-travel-duration" type="text" value={form.travel_duration} onChange={set("travel_duration")} placeholder="e.g. 5N / 6D" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Group & Preferences */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">3. Travellers & Stays</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className={labelCls} htmlFor="cenq-pax">Total Travellers</label>
                    <input id="cenq-pax" type="number" min={1} max={100} value={form.pax_no} onChange={setNum("pax_no")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-rooms">Rooms</label>
                    <input id="cenq-rooms" type="number" min={1} max={50} value={form.no_room} onChange={setNum("no_room")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="cenq-meal">Meal Plan</label>
                    <CustomSelect
                      value={form.meal_plan}
                      options={[{ label: "Any Plan", value: "ANY" }, ...MEAL_OPTIONS.map((m) => ({ label: m, value: m }))]}
                      onChange={(value) => setForm((f) => ({ ...f, meal_plan: value }))}
                      placeholder="Select meal"
                      triggerClassName="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className={labelCls} htmlFor="cenq-special">Special Notes</label>
                <textarea
                  id="cenq-special"
                  value={form.special_requirements}
                  onChange={set("special_requirements")}
                  placeholder="Dietary requirements, senior citizen care, hotel tier preferences, etc."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {errorMsg && (
                <p className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600">{errorMsg}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="btn-ghost text-xs font-semibold">
                  Cancel
                </button>
                <button
                  type="submit"
                  id="cenq-submit-btn"
                  disabled={status === "loading"}
                  className="btn-accent rounded-xl text-xs font-bold px-5 py-2.5 disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting…" : "Request Custom Plan →"}
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
