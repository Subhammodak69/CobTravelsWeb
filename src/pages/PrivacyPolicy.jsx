import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

const LAST_UPDATED = "September 1, 2026";

const SECTIONS = [
  { id: "intro", title: "1. Introduction" },
  { id: "collect", title: "2. Information We Collect" },
  { id: "use", title: "3. How We Use Your Information" },
  { id: "cookies", title: "4. Cookies & Tracking" },
  { id: "sharing", title: "5. Sharing Your Information" },
  { id: "payments", title: "6. Payment & Data Security" },
  { id: "retention", title: "7. Data Retention" },
  { id: "rights", title: "8. Your Rights & Choices" },
  { id: "children", title: "9. Children's Privacy" },
  { id: "transfers", title: "10. International Transfers" },
  { id: "updates", title: "11. Changes to This Policy" },
  { id: "contact", title: "12. Contact Us" },
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

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="border-b border-navy-light bg-navy px-4 pb-10 pt-16 text-white sm:px-6 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent-300">Legal Information</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl text-white">
            Privacy <span className="text-primary-300">Policy</span>
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/80">
            Planning a trip means sharing some personal details with us. Here's exactly what we
            collect, why we need it, and how we protect your personal information.
          </p>
          <p className="mt-3 text-xs text-white/50">Last updated: {LAST_UPDATED}</p>
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
              <ShieldCheck size={14} /> Jump to a section
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
            <Section id="intro" title="1. Introduction">
              <p>
                This policy explains how [Company Name] ("we," "us," "our") collects, uses,
                shares, and protects your personal information when you visit our website, enquire
                about a tour, or book a package with us. By using our website or services, you
                agree to the practices described here.
              </p>
            </Section>

            <Section id="collect" title="2. Information We Collect">
              <p>We collect information in a few different ways:</p>
              <ul className="ml-4 list-disc space-y-1.5">
                <li>
                  <span className="font-semibold text-slate-800">Information you provide:</span>{" "}
                  name, email, phone number, postal address, passport or ID details (where
                  required for bookings), payment details, dietary or accessibility needs, and any
                  messages you send us through enquiry or booking forms.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Information collected automatically:</span>{" "}
                  IP address, browser type, device information, pages viewed, and referring URLs,
                  collected via cookies and similar technologies when you browse our site.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Information from third parties:</span>{" "}
                  confirmation or status updates from hotels, airlines, and other suppliers
                  involved in fulfilling your booking.
                </li>
              </ul>
            </Section>

            <Section id="use" title="3. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul className="ml-4 list-disc space-y-1.5">
                <li>Process enquiries, quotes, bookings, and payments</li>
                <li>Communicate with you about your itinerary, changes, or travel advisories</li>
                <li>Personalize package recommendations and marketing (where you've opted in)</li>
                <li>Improve our website, packages, and customer support</li>
                <li>Meet legal, tax, and regulatory obligations</li>
              </ul>
            </Section>

            <Section id="cookies" title="4. Cookies & Tracking">
              <p>
                We use cookies and similar technologies to keep you signed in, remember your
                preferences, and understand how visitors use our site (for example, which
                destinations are most viewed). You can control or disable cookies through your
                browser settings, though some site features may not work as intended if you do.
              </p>
            </Section>

            <Section id="sharing" title="5. Sharing Your Information">
              <p>We share personal information only where necessary, with:</p>
              <ul className="ml-4 list-disc space-y-1.5">
                <li>Hotels, airlines, transport operators, and local guides needed to fulfill your booking</li>
                <li>Payment processors to complete transactions securely</li>
                <li>Service providers who support our website, email, or analytics (bound by confidentiality obligations)</li>
                <li>Government or regulatory authorities where required by law, such as for visa or permit processing</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>
            </Section>

            <Section id="payments" title="6. Payment & Data Security">
              <p>
                Payments are processed through PCI-compliant third-party payment gateways; we do
                not store full card details on our own servers. We use reasonable technical and
                organizational measures — including encryption in transit and access controls — to
                protect your information, though no online system can be guaranteed 100% secure.
              </p>
            </Section>

            <Section id="retention" title="7. Data Retention">
              <p>
                We retain booking and identity information for as long as needed to fulfill your
                trip, meet legal and tax record-keeping requirements, and resolve any disputes —
                typically up to 7 years after your travel date, unless a longer period is required
                by law. Marketing data is retained until you unsubscribe or request deletion.
              </p>
            </Section>

            <Section id="rights" title="8. Your Rights & Choices">
              <p>Depending on where you live, you may have the right to:</p>
              <ul className="ml-4 list-disc space-y-1.5">
                <li>Access a copy of the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information, subject to legal retention needs</li>
                <li>Opt out of marketing emails at any time via the unsubscribe link</li>
                <li>Object to or restrict certain uses of your information</li>
              </ul>
              <p>
                To exercise any of these rights, contact us using the details in Section 12 — we
                will respond within a reasonable timeframe.
              </p>
            </Section>

            <Section id="children" title="9. Children's Privacy">
              <p>
                Our website and services are intended for adults booking travel. We do not
                knowingly collect personal information directly from children under 18 outside the
                context of a family booking made by a parent or guardian.
              </p>
            </Section>

            <Section id="transfers" title="10. International Transfers">
              <p>
                As we coordinate with hotels, airlines, and partners abroad, your information may
                be transferred to and processed in countries outside your own, including
                destinations on your itinerary. We take steps to ensure such transfers are
                handled with appropriate safeguards.
              </p>
            </Section>

            <Section id="updates" title="11. Changes to This Policy">
              <p>
                We may update this Privacy Policy periodically to reflect changes in our
                practices or legal requirements. The "Last updated" date at the top of this page
                reflects the most recent revision. We encourage you to review this page
                occasionally.
              </p>
            </Section>

            <Section id="contact" title="12. Contact Us">
              <p>
                For questions about this policy or to exercise your privacy rights, contact us at{" "}
                <a href="mailto:privacy@yourcompany.com" className="font-semibold text-amber-600 hover:underline">
                  privacy@yourcompany.com
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
          <p className="text-xs text-slate-500">Curious what you're agreeing to when you book?</p>
          <Link
            to="/terms-of-service"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
          >
            Read our Terms of Service <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
