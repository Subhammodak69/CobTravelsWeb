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

  const inputCls = "h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50";
  const selectTriggerCls = "h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900";
  const labelCls = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600";

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Header Banner */}
      <section className="relative flex min-h-[260px] items-end overflow-hidden px-6 pb-8 pt-20 text-white sm:min-h-[300px] sm:px-8 sm:pt-24 lg:px-16">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=90"
          alt="Custom travel"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="relative z-10 max-w-4xl animate-fade-up">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">Customised Itineraries</p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Build Your <em className="text-amber-300">Dream Journey.</em>
          </h1>
          <p className="mt-2.5 max-w-2xl text-xs leading-5 text-white/80 sm:text-sm">
            Tell us where you want to go, who you're travelling with, and what matters most. We'll handcraft the complete experience.
          </p>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-6 lg:px-12">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 sm:p-6 lg:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</span>
              <h2 className="font-display text-xl font-semibold text-slate-950 sm:text-2xl">Enquiry Received!</h2>
              <p className="mt-2 max-w-lg text-xs leading-5 text-slate-600 sm:text-sm">
                Thank you, <b className="text-slate-900">{form.name}</b>! Our travel designers are crafting your custom itinerary for <b className="text-slate-900">{form.destination}</b> and will reach out to you shortly.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => { setForm(INITIAL); setStatus("idle"); }}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Submit another enquiry
                </button>
                <button
                  onClick={goHome}
                  className="rounded-xl bg-amber-300 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200"
                >
                  Back to journeys
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-6">
              {/* Section 1: Contact Information */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-300 text-[10px] font-bold text-slate-950">1</span>
                  <h3 className="font-display text-base font-semibold text-slate-950 sm:text-lg">Contact Information</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

              {/* Section 2: Trip Preferences */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-300 text-[10px] font-bold text-slate-950">2</span>
                  <h3 className="font-display text-base font-semibold text-slate-950 sm:text-lg">Trip Preferences</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                      triggerClassName={selectTriggerCls}
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

              {/* Section 3: Travellers & Accommodation */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-300 text-[10px] font-bold text-slate-950">3</span>
                  <h3 className="font-display text-base font-semibold text-slate-950 sm:text-lg">Travellers & Stay</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                      triggerClassName={selectTriggerCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="custom-page-vehicle">Vehicle Preference</label>
                    <CustomSelect
                      value={form.vehicle_type}
                      options={[{ label: "Any / No preference", value: "ANY" }, ...VEHICLE_OPTIONS.map((v) => ({ label: v, value: v }))]}
                      onChange={(value) => setForm((f) => ({ ...f, vehicle_type: value }))}
                      placeholder="Select vehicle"
                      triggerClassName={selectTriggerCls}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Special Requirements */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-300 text-[10px] font-bold text-slate-950">4</span>
                  <h3 className="font-display text-base font-semibold text-slate-950 sm:text-lg">Special Requirements & Notes</h3>
                </div>
                <div>
                  <textarea
                    id="custom-page-special"
                    value={form.special_requirements}
                    onChange={set("special_requirements")}
                    placeholder="Tell us about special preferences (e.g. senior citizens, child meals, pickup points, hotel category, sightseeing requests…)"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-200/50"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-custom-enquiry-page-btn"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-xs font-bold text-slate-950 shadow-md shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:translate-y-0 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <><span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" /> Submitting Request…</>
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