import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PlumbingCalculator from "@/components/PlumbingCalculator";
import {
  formatCad,
  LOCATIONS,
  LOCATION_ZONES,
  SERVICES,
  SERVICE_GROUPS,
} from "@/lib/plumbingData";

const FAQS = [
  {
    q: "How much does a plumber cost in the Greater Toronto Area?",
    a: "Most residential plumbing repairs in the GTA fall between $150 and $650, depending on the job, the fixtures involved and your location. Simple repairs like faucet or toilet fixes sit at the lower end, while leak detection, main drain clearing and repiping cost more. Our calculator gives you a realistic range for your specific service and city in seconds.",
  },
  {
    q: "Is this plumbing cost calculator really free?",
    a: "Yes — completely free with no obligation. Pick your service and location, see an instant estimate, and only share your contact details if you want a licensed plumber from Saving Plumbing to confirm an exact written quote.",
  },
  {
    q: "Do you handle commercial plumbing estimates too?",
    a: "We do. Switch the calculator to Commercial and the ranges adjust to reflect typical commercial job sizes — from restaurants and retail plazas to office buildings and multi-unit residential properties across the GTA.",
  },
  {
    q: "How accurate are the estimates?",
    a: "The ranges are based on real GTA job data: typical labour time, standard materials and travel within our service area. Emergency calls carry a premium, and complex installs can exceed the top of the range — which is why every estimate can be confirmed with a free on-site quote.",
  },
  {
    q: "Which areas do you serve?",
    a: "Saving Plumbing is headquartered in Scarborough and serves the entire Greater Toronto Area — Toronto, North York, Etobicoke, East York, Vaughan, Markham, Richmond Hill, Mississauga, Brampton, Pickering, Ajax and more.",
  },
  {
    q: "Do you offer 24/7 emergency plumbing?",
    a: "Yes. Select Emergency in the calculator to see the after-hours rate before you call. Our licensed plumbers are on call around the clock for bursts, backups and no-hot-water emergencies across the GTA.",
  },
];

const STATS = [
  { value: "17", label: "GTA cities served" },
  { value: "24/7", label: "Emergency response" },
  { value: "60+", label: "Services priced" },
  { value: "Free", label: "Always no-obligation" },
];

function SectionHeading({
  index,
  title,
  intro,
}: {
  index: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="border-b-2 border-ink pb-6">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-sp-red">
        {index}
      </p>
      <h2 className="mt-3 font-display text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      )}
    </div>
  );
}

export default function Landing() {
  const leadCount = useQuery(api.estimates.leadCount) ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="flex items-center gap-3">
            <span className="bg-sp-red p-2">
              <span className="block size-4 bg-white" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-black uppercase leading-none tracking-tight">
              Saving
              <br />
              Plumbing
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#calculator" className="font-mono text-[11px] font-semibold uppercase tracking-widest hover:text-sp-red">
              Calculator
            </a>
            <a href="#services" className="font-mono text-[11px] font-semibold uppercase tracking-widest hover:text-sp-red">
              Services
            </a>
            <a href="#areas" className="font-mono text-[11px] font-semibold uppercase tracking-widest hover:text-sp-red">
              Areas
            </a>
            <a href="#faq" className="font-mono text-[11px] font-semibold uppercase tracking-widest hover:text-sp-red">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:flex">
              <MapPin className="size-3 text-sp-red" /> Scarborough, ON
            </span>
            <Button asChild className="hidden font-display text-xs font-bold uppercase tracking-wide sm:inline-flex">
              <a href="#calculator">Get estimate</a>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Hero + Calculator                                                */}
      {/* ---------------------------------------------------------------- */}
      <section id="calculator" className="grid-lines border-b-2 border-ink">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-sp-red">
              Plumbing calculator · Greater Toronto Area
            </p>
            <h1 className="mt-5 font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl">
              Know the
              <br />
              price<span className="text-sp-red">.</span>
              <br />
              Before we
              <br />
              arrive<span className="text-sp-red">.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              The honest plumbing cost estimator for homeowners and businesses across the GTA.
              Pick a service, pick your city, see the real price range — then lock it in with a
              free written quote.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-px border border-ink bg-ink sm:max-w-md">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-background p-4">
                  <p className="font-display text-2xl font-black tracking-tight">{stat.value}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm">
              <a href="#services" className="group inline-flex items-center gap-2 font-display font-bold uppercase tracking-wide">
                Browse priced services
                <ArrowDown className="size-4 text-sp-red transition-transform group-hover:translate-y-0.5" />
              </a>
              <a href="tel:+17702737246" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
                <Phone className="size-3.5 text-sp-blue" /> (770) 273-7246
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:pt-4"
          >
            <PlumbingCalculator />
            {leadCount > 0 && (
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {leadCount.toLocaleString()}+ estimates requested through this tool
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Trust bar                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b-2 border-ink bg-ink text-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-background/0 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: BadgeCheck, text: "Licensed & insured plumbers" },
            { icon: Clock3, text: "On time, or we knock $25 off" },
            { icon: ShieldCheck, text: "Upfront pricing — no surprises" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 py-5 sm:justify-center">
              <item.icon className="size-5 shrink-0 text-sp-red" />
              <p className="font-display text-sm font-bold uppercase tracking-wide">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Services with real ranges                                        */}
      {/* ---------------------------------------------------------------- */}
      <section id="services" className="border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading
            index="01 — Services"
            title="Every job, priced upfront"
            intro="Typical price ranges for the services Greater Toronto homeowners and property managers ask for most. Tap any service to calculate it for your address."
          />
          {SERVICE_GROUPS.map((group, gi) => (
            <div key={group} className="mt-10">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-sp-blue">
                {String(gi + 1).padStart(2, "0")} / {group}
              </p>
              <div className="mt-4 grid gap-px border border-ink bg-ink md:grid-cols-3">
                {SERVICES.filter((s) => s.group === group).map((service) => (
                  <a
                    key={service.slug}
                    href="#calculator"
                    className="group flex flex-col justify-between bg-background p-5 transition-colors hover:bg-secondary"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-base font-bold uppercase leading-snug tracking-tight">
                          {service.label}
                        </h3>
                        <service.icon className="size-5 shrink-0 text-sp-blue" strokeWidth={1.75} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {service.blurb}
                      </p>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Typical range
                      </p>
                      <p className="font-display text-sm font-black text-sp-red">
                        {formatCad(service.residentialRange[0])}–{formatCad(service.residentialRange[1])}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Areas served                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section id="areas" className="border-b-2 border-ink bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading
            index="02 — Service area"
            title="From Scarborough to Oakville"
            intro="Headquartered in Scarborough, on call across the Greater Toronto Area. Select your city in the calculator — travel is already included in the number."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {LOCATION_ZONES.map((zone, i) => (
              <div key={zone} className="border-t-2 border-ink pt-4">
                <p className="font-display text-sm font-black uppercase tracking-tight">
                  <span className="mr-2 font-mono text-[10px] font-semibold text-sp-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {zone}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {LOCATIONS.filter((l) => l.zone === zone).map((loc) => (
                    <li key={loc.slug}>
                      <a
                        href="#calculator"
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span className="size-1.5 bg-sp-blue opacity-60 transition-opacity group-hover:opacity-100" />
                        {loc.label}
                        <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it works                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading
            index="03 — How it works"
            title="Three steps to a confirmed price"
          />
          <div className="mt-10 grid gap-px border border-ink bg-ink md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Calculate",
                d: "Choose residential or commercial, pick your service and GTA location, and get an instant range.",
              },
              {
                n: "02",
                t: "Request",
                d: "Like the number? Send your details — a licensed plumber confirms your exact written quote, free.",
              },
              {
                n: "03",
                t: "Relax",
                d: "We arrive on schedule, do the work at the quoted price, and back it with our workmanship guarantee.",
              },
            ].map((step) => (
              <div key={step.n} className="bg-background p-6 sm:p-8">
                <p className="font-display text-5xl font-black tracking-tight text-sp-red">{step.n}</p>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild size="lg" className="h-14 px-8 font-display text-base font-extrabold uppercase tracking-wide">
              <a href="#calculator">Calculate my plumbing cost</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section id="faq" className="border-b-2 border-ink bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading index="04 — FAQ" title="Plumbing cost questions, answered" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Can&apos;t find your answer? Call{" "}
              <a href="tel:+17702737246" className="font-semibold text-foreground underline decoration-sp-red underline-offset-4">
                (770) 273-7246
              </a>{" "}
              — a real plumber picks up, 24/7.
            </p>
          </div>
          <Accordion type="single" collapsible className="border-t-2 border-ink">
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-b border-ink">
                <AccordionTrigger className="py-5 text-left font-display text-base font-bold tracking-tight hover:no-underline hover:text-sp-red">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Final CTA                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-ink text-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-sp-red">
                Saving Plumbing · Scarborough HQ
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
                Stop guessing.
                <br />
                Start <span className="text-sp-red">saving.</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-14 bg-sp-red px-8 font-display text-base font-extrabold uppercase tracking-wide hover:bg-sp-red/90">
                <a href="#calculator">Get my estimate</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 border-2 border-background bg-transparent px-8 font-display text-base font-bold uppercase tracking-wide text-background hover:bg-background hover:text-ink">
                <a href="tel:+17702737246">Call (770) 273-7246</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Footer                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t-2 border-ink bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-sp-red p-1.5">
                  <span className="block size-3 bg-white" aria-hidden="true" />
                </span>
                <span className="font-display text-base font-black uppercase tracking-tight">
                  Saving Plumbing
                </span>
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Residential and commercial plumbing contractor headquartered in Scarborough,
                serving the Greater Toronto Area. Licensed, insured, available 24/7.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:gap-16">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sp-red">
                  Tool
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><a href="#calculator" className="text-muted-foreground hover:text-foreground">Plumbing calculator</a></li>
                  <li><a href="/calculator" className="text-muted-foreground hover:text-foreground">Embeddable version</a></li>
                  <li><a href="#faq" className="text-muted-foreground hover:text-foreground">Cost FAQ</a></li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sp-red">
                  Company
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><a href="#services" className="text-muted-foreground hover:text-foreground">Services</a></li>
                  <li><a href="#areas" className="text-muted-foreground hover:text-foreground">Service area</a></li>
                  <li><a href="/dashboard" className="text-muted-foreground hover:text-foreground">Staff leads inbox</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} Saving Plumbing · savingplumbing.com
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Plumbing estimates are typical ranges, not final quotes
            </p>
          </div>
        </div>
      </footer>

      {/* FAQ structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
    </div>
  );
}
