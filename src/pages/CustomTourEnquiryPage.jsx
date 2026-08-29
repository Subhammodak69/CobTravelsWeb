import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCustomEnquiry } from "../api";
import { useTravel } from "../contexts/TravelContext";
import CustomSelect from "../components/CustomSelect";
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

export default function CustomTourEnquiryPage() {
  const { user, goHome } = useTravel();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const firstRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setForm((f) => ({
      ...f,
      name: user?.name || f.name,
      mobile: user?.mobile || user?.phone || f.mobile,
    }));
    setTimeout(() => firstRef.current?.focus(), 100);
  }, [user]);

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

  const inputCls = "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50";
  const selectCls = "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50 cursor-pointer";
  const labelCls = "mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-600";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header Banner */}
      <section className="relative flex min-h-[380px] items-end overflow-hidden px-6 pb-16 pt-32 text-white sm:px-8 lg:px-16">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90"
          alt="Custom travel"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="relative z-10 max-w-4xl animate-fade-up">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Customised Itineraries</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Build Your <em className="text-amber-300">Dream Journey.</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Tell us where you want to go, who you're travelling with, and what matters most. We'll handcraft the complete experience.
          </p>
        </div>
      </section>

      {/* Main Form Container - Expanded to max-w-[90rem] / 8xl with 3-4 column grid on lg */}
      <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-12">
        <div className="overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-950/5 sm:p-10 lg:p-12">
          {status === "success" ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-4xl text-emerald-600">✓</span>
              <h2 className="font-display text-3xl font-semibold text-slate-950 sm:text-4xl">Enquiry Received!</h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-slate-600">
                Thank you, <b className="text-slate-900">{form.name}</b>! Our travel designers are crafting your custom itinerary for <b className="text-slate-900">{form.destination}</b> and will reach out to you shortly.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => { setForm(INITIAL); setStatus("idle"); }}
                  className="rounded-2xl border border-slate-300 px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Submit another enquiry
                </button>
                <button
                  onClick={goHome}
                  className="rounded-2xl bg-amber-300 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200"
                >
                  Back to journeys
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-10">
              {/* Section 1: Contact Information (4 columns on lg) */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-xs font-bold text-slate-950">1</span>
                  <h3 className="font-display text-2xl font-semibold text-slate-950">Contact Information</h3>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="lg:col-span-2">
                    <label className={labelCls} htmlFor="custom-page-name">Full Name <span className="text-rose-500">*</span></label>
                    <input ref={firstRef} id="custom-page-name" type="text" value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} required />
                  </div>
                  <div className="lg:col-span-2">
                    <label className={labelCls} htmlFor="custom-page-mobile">Mobile Number <span className="text-rose-500">*</span></label>
                    <input id="custom-page-mobile" type="tel" value={form.mobile} onChange={set("mobile")} placeholder="+91 98765 43210" className={inputCls} required />
                  </div>
                </div>
              </div>

              {/* Section 2: Trip Preferences (4 columns on lg) */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-xs font-bold text-slate-950">2</span>
                  <h3 className="font-display text-2xl font-semibold text-slate-950">Trip Preferences</h3>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className={labelCls} htmlFor="custom-page-dest">Destination <span className="text-rose-500">*</span></label>
                    <input id="custom-page-dest" type="text" value={form.destination} onChange={set("destination")} placeholder="e.g. North Sikkim, Bhutan" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="custom-page-type">Enquiry Type</label>
                    <CustomSelect
                      value={form.enquiry_type}
                      options={ENQUIRY_TYPE_OPTIONS.map((t) => ({ label: t.replace(/_/g, " "), value: t }))}
                      onChange={(value) => setForm((f) => ({ ...f, enquiry_type: value }))}
                      placeholder="Select enquiry type"
                      triggerClassName="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="custom-page-date">Tentative Travel Date</label>
                    <input id="custom-page-date" type="date" value={form.travel_date} onChange={set("travel_date")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="custom-page-duration">Expected Duration</label>
                    <input id="custom-page-duration" type="text" value={form.travel_duration} onChange={set("travel_duration")} placeholder="e.g. 5 Nights / 6 Days" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Section 3: Travellers & Accommodation (4 columns on lg) */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-xs font-bold text-slate-950">3</span>
                  <h3 className="font-display text-2xl font-semibold text-slate-950">Travellers & Stay</h3>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className={labelCls} htmlFor="custom-page-pax">No. of Travellers</label>
                    <input id="custom-page-pax" type="number" min={1} max={100} value={form.pax_no} onChange={setNum("pax_no")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="custom-page-rooms">Rooms Required</label>
                    <input id="custom-page-rooms" type="number" min={1} max={50} value={form.no_room} onChange={setNum("no_room")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="custom-page-meal">Meal Plan</label>
                    <CustomSelect
                      value={form.meal_plan}
                      options={[{ label: "Any / No preference", value: "ANY" }, ...MEAL_OPTIONS.map((m) => ({ label: m, value: m }))]}
                      onChange={(value) => setForm((f) => ({ ...f, meal_plan: value }))}
                      placeholder="Select meal plan"
                      triggerClassName="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="custom-page-vehicle">Vehicle Preference</label>
                    <CustomSelect
                      value={form.vehicle_type}
                      options={[{ label: "Any / No preference", value: "ANY" }, ...VEHICLE_OPTIONS.map((v) => ({ label: v, value: v }))]}
                      onChange={(value) => setForm((f) => ({ ...f, vehicle_type: value }))}
                      placeholder="Select vehicle"
                      triggerClassName="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Special Requirements (Full horizontal width) */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-xs font-bold text-slate-950">4</span>
                  <h3 className="font-display text-2xl font-semibold text-slate-950">Special Requirements & Notes</h3>
                </div>
                <div>
                  <textarea
                    id="custom-page-special"
                    value={form.special_requirements}
                    onChange={set("special_requirements")}
                    placeholder="Tell us about special preferences (e.g. senior citizens, child meals, pickup points, hotel category, sightseeing requests…)"
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50 resize-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-600 border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-2xl border border-slate-200 px-7 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-custom-enquiry-page-btn"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-3 rounded-2xl bg-amber-300 px-9 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:opacity-60 disabled:translate-y-0"
                >
                  {status === "loading" ? (
                    <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" /> Submitting Request…</>
                  ) : (
                    <>Submit Custom Tour Enquiry <span>→</span></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
