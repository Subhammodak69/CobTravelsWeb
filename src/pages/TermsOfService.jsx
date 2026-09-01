import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";

const LAST_UPDATED = "September 1, 2026";

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "about", title: "2. About Our Services" },
  { id: "bookings", title: "3. Bookings & Reservations" },
  { id: "payments", title: "4. Payment Terms" },
  { id: "cancellations", title: "5. Cancellations & Refunds" },
  { id: "conduct", title: "6. Traveler Responsibilities" },
  { id: "documents", title: "7. Travel Documents & Eligibility" },
  { id: "changes", title: "8. Itinerary Changes & Force Majeure" },
  { id: "liability", title: "9. Limitation of Liability" },
  { id: "insurance", title: "10. Travel Insurance" },
  { id: "ip", title: "11. Intellectual Property" },
  { id: "thirdparty", title: "12. Third-Party Services & Links" },
  { id: "law", title: "13. Governing Law & Disputes" },
  { id: "updates", title: "14. Changes to These Terms" },
  { id: "contact", title: "15. Contact Us" },
];

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-slate-100 py-6 last:border-0">
      <h2 className="font-display text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
        {title}
      </h2>
      <div className="mt-2 space-y-3 text-[13px] leading-6 text-slate-600">{children}</div>
    </section>
  );
}

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-950 px-4 pb-10 pt-24 text-white sm:px-6 lg:px-12 lg:pt-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">Legal</p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            These terms govern how you book and travel with us. Please read them carefully before
            confirming a reservation — they cover payments, cancellations, and what to expect from
            each other along the way.
          </p>
          <p className="mt-4 text-xs text-white/50">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[220px_1fr]">
          {/* Table of contents */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                On this page
              </p>
              <ul className="space-y-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setActiveSection(s.id)}
                      className={`block rounded-md px-2 py-1.5 text-xs font-medium transition ${
                        activeSection === s.id
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Mobile TOC */}
          <details className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
            <summary className="flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <FileText size={14} /> Jump to a section
            </summary>
            <ul className="mt-3 space-y-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block px-1 py-1 text-xs text-slate-600 hover:text-amber-600">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          {/* Body */}
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-2 shadow-sm sm:px-8">
            <Section id="acceptance" title="1. Acceptance of Terms">
              <p>
                By accessing this website or booking a tour, package, or service through
                [Company Name] ("we," "us," "our"), you agree to be bound by these Terms of
                Service and our Privacy Policy. If you do not agree with any part of these terms,
                please do not use our website or services.
              </p>
              <p>
                These terms apply to all visitors, users, and travelers who book domestic or
                international packages, request custom itineraries, or otherwise engage our
                services.
              </p>
            </Section>

            <Section id="about" title="2. About Our Services">
              <p>
                We design and operate guided group tours, custom itineraries, and travel packages
                across India and select international destinations. Package details — including
                itinerary, inclusions, exclusions, accommodation category, and pricing — are
                described on each package page and form part of your booking agreement once
                confirmed.
              </p>
              <p>
                We act as an intermediary between you and third-party suppliers such as hotels,
                airlines, transport operators, and local guides. While we vet our partners
                carefully, the services they provide are ultimately governed by their own terms
                and conditions.
              </p>
            </Section>

            <Section id="bookings" title="3. Bookings & Reservations">
              <p>
                A booking is confirmed only once we have received your booking form (or online
                submission) and the applicable advance payment. Confirmation will be sent to the
                email address you provide, so please ensure your contact details are accurate.
              </p>
              <p>
                Package availability, pricing, and dates are subject to change without notice
                until a booking is confirmed. Any special requests (dietary, accessibility, room
                configuration) are passed on to suppliers on a best-effort basis and are not
                guaranteed unless confirmed in writing.
              </p>
            </Section>

            <Section id="payments" title="4. Payment Terms">
              <p>
                Unless otherwise stated on the package page, a non-refundable deposit is required
                to confirm a booking, with the remaining balance due before the travel start date
                as specified in your booking confirmation. Failure to pay the balance by the due
                date may result in automatic cancellation of your booking under Section 5.
              </p>
              <p>
                Prices are quoted in the currency shown at checkout and may exclude government
                taxes, fuel surcharges, or visa fees unless explicitly included. We reserve the
                right to correct pricing errors before a booking is confirmed.
              </p>
            </Section>

            <Section id="cancellations" title="5. Cancellations & Refunds">
              <p>
                Cancellations must be submitted in writing (email is acceptable). Refunds, where
                applicable, are calculated based on how far in advance of the travel date the
                cancellation is received, and may be reduced by supplier cancellation fees
                (hotels, airlines, permits) that are outside our control.
              </p>
              <p>
                As a general guide: cancellations 30+ days before departure may receive a partial
                refund of amounts paid, minus the non-refundable deposit; cancellations within 15
                days of departure are typically non-refundable. Exact tiers are listed on your
                package's booking page and take precedence over this general guide.
              </p>
              <p>
                We are not responsible for costs arising from a traveler's failure to obtain
                required documents, missed connections, or voluntary early departure from a tour.
              </p>
            </Section>

            <Section id="conduct" title="6. Traveler Responsibilities">
              <p>
                You are responsible for arriving at designated meeting points on time, following
                the reasonable instructions of your tour leader or local guide, and treating
                fellow travelers, staff, and local communities with respect.
              </p>
              <p>
                We reserve the right to remove any traveler from a tour, without refund, whose
                conduct endangers the health, safety, or enjoyment of the group, or who behaves in
                a manner that is illegal, abusive, or disruptive.
              </p>
            </Section>

            <Section id="documents" title="7. Travel Documents & Eligibility">
              <p>
                You are solely responsible for ensuring you hold a valid passport, visas, permits
                (including Inner Line Permits where applicable), vaccinations, and any other
                documentation required for your itinerary. We can advise where possible, but entry
                requirements are set by the relevant governments and may change without notice.
              </p>
              <p>
                We are not liable for any loss, delay, or additional cost arising from a
                traveler's failure to hold the correct documents.
              </p>
            </Section>

            <Section id="changes" title="8. Itinerary Changes & Force Majeure">
              <p>
                Itineraries are planned in good faith but may need to change due to weather, road
                or flight conditions, local regulations, safety concerns, or circumstances beyond
                our reasonable control ("force majeure"), including natural disasters, strikes,
                political unrest, or public health emergencies.
              </p>
              <p>
                Where possible, we will offer a comparable alternative. We are not liable for
                costs, losses, or inconvenience arising from such changes, though we will always
                act to keep you safe and informed.
              </p>
            </Section>

            <Section id="liability" title="9. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, our liability for any claim arising from
                your booking is limited to the amount you paid for the affected package. We are
                not liable for indirect, incidental, or consequential damages, including lost
                income, missed connections, or loss of enjoyment.
              </p>
              <p>
                We are not liable for the acts, omissions, or default of independent third-party
                suppliers (airlines, hotels, transport providers), except where required by
                applicable law.
              </p>
            </Section>

            <Section id="insurance" title="10. Travel Insurance">
              <p>
                We strongly recommend that all travelers purchase comprehensive travel insurance
                covering trip cancellation, medical emergencies, evacuation, and lost baggage
                before departure. Insurance is not included in package pricing unless explicitly
                stated.
              </p>
            </Section>

            <Section id="ip" title="11. Intellectual Property">
              <p>
                All text, images, itineraries, logos, and other content on this website are owned
                by or licensed to [Company Name] and are protected by copyright and trademark law.
                You may not reproduce, distribute, or create derivative works from our content
                without prior written permission.
              </p>
            </Section>

            <Section id="thirdparty" title="12. Third-Party Services & Links">
              <p>
                Our website may link to third-party sites (payment processors, mapping services,
                partner accommodations) that we do not control. We are not responsible for the
                content, policies, or practices of these third parties.
              </p>
            </Section>

            <Section id="law" title="13. Governing Law & Disputes">
              <p>
                These terms are governed by the laws of India, without regard to conflict-of-law
                principles. Any dispute arising from these terms or your booking will be subject
                to the exclusive jurisdiction of the courts of [City, State].
              </p>
              <p>
                Where required by local consumer protection law in your place of residence,
                mandatory provisions of that law will apply instead, to the extent they conflict
                with the above.
              </p>
            </Section>

            <Section id="updates" title="14. Changes to These Terms">
              <p>
                We may update these Terms of Service from time to time to reflect changes in our
                services or applicable law. The "Last updated" date at the top of this page
                reflects the most recent revision. Continued use of our website or services after
                changes take effect constitutes acceptance of the revised terms.
              </p>
            </Section>

            <Section id="contact" title="15. Contact Us">
              <p>
                If you have questions about these terms, reach us at{" "}
                <a href="mailto:hello@yourcompany.com" className="font-semibold text-amber-600 hover:underline">
                  hello@yourcompany.com
                </a>{" "}
                or through our{" "}
                <Link to="/custom-tour-enquiry" className="font-semibold text-amber-600 hover:underline">
                  enquiry form
                </Link>
                .
              </p>
            </Section>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-slate-500">Want to know how we handle your data?</p>
          <Link
            to="/privacy-policy"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
          >
            Read our Privacy Policy <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
