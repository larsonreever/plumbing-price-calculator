import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Building2, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateEstimate,
  formatCad,
  LOCATIONS,
  LOCATION_ZONES,
  SERVICES,
  SERVICE_GROUPS,
  type EstimateResult,
  type PropertyType,
} from "@/lib/plumbingData";
import { cn } from "@/lib/utils";

type Step = "input" | "estimate" | "form" | "done";

const URGENCY_OPTIONS: {
  value: "flexible" | "scheduled" | "emergency";
  label: string;
  hint: string;
}[] = [
  { value: "flexible", label: "Flexible", hint: "Within the next week" },
  { value: "scheduled", label: "Scheduled", hint: "Pick a day that works" },
  { value: "emergency", label: "Emergency", hint: "ASAP, 24/7 (+25%)" },
];

function StepHeader({ index, title, done }: { index: number; title: string; done?: boolean }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-ink pb-2">
      <span
        className={cn(
          "font-mono text-[11px] font-semibold tracking-widest",
          done ? "text-muted-foreground" : "text-sp-red",
        )}
      >
        {done ? "DONE" : `0${index}`}
      </span>
      <h3 className="font-display text-lg font-bold uppercase tracking-tight">{title}</h3>
    </div>
  );
}

function PropertyToggle({
  value,
  onChange,
}: {
  value: PropertyType;
  onChange: (v: PropertyType) => void;
}) {
  const options: { value: PropertyType; label: string; icon: typeof House }[] = [
    { value: "residential", label: "Residential", icon: House },
    { value: "commercial", label: "Commercial", icon: Building2 },
  ];
  return (
    <div className="grid grid-cols-2 border border-ink">
      {options.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-3 font-display text-sm font-bold uppercase tracking-wide transition-colors",
              active
                ? "bg-ink text-background"
                : "bg-transparent text-foreground hover:bg-muted",
            )}
          >
            <Icon className="size-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PlumbingCalculator({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState<Step>("input");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [serviceSlug, setServiceSlug] = useState<string>("");
  const [locationSlug, setLocationSlug] = useState<string>("");
  const [urgency, setUrgency] = useState<"flexible" | "scheduled" | "emergency">("flexible");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitEstimateRequest = useMutation(api.estimates.submitEstimateRequest);

  const canCalculate = Boolean(serviceSlug && locationSlug);
  const estimate: EstimateResult | null = useMemo(
    () => (canCalculate ? calculateEstimate({ serviceSlug, propertyType, locationSlug, urgency }) : null),
    [canCalculate, serviceSlug, propertyType, locationSlug, urgency],
  );

  const handleCalculate = () => {
    if (canCalculate) setStep("estimate");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimate) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitEstimateRequest({
        name,
        phone,
        email: email || undefined,
        propertyType,
        serviceSlug: estimate.service.slug,
        serviceLabel: estimate.service.label,
        locationSlug: estimate.location.slug,
        locationLabel: estimate.location.label,
        estimateLow: estimate.low,
        estimateHigh: estimate.high,
        details: details || undefined,
      });
      setStep("done");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep("input");
    setServiceSlug("");
    setLocationSlug("");
    setUrgency("flexible");
  };

  return (
    <div className="border-2 border-ink bg-card">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2.5 text-background sm:px-6">
        <span className="font-display text-xs font-bold uppercase tracking-[0.2em]">
          Saving Plumbing — Cost Calculator
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-background/70">
          Free · No obligation
        </span>
      </div>

      <div className={cn("grid-lines p-4 sm:p-6", compact && "sm:p-5")}>
        {/* ------------------------------ STEP: INPUT ------------------------------ */}
        {step === "input" && (
          <div className="space-y-7">
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
                What will your plumbing job cost?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Pick a service and your location in the Greater Toronto Area. You&apos;ll get an
                instant price range — then we can confirm it with a free, no-obligation quote.
              </p>
            </div>

            <div className="space-y-3">
              <StepHeader index={1} title="Property type" />
              <PropertyToggle value={propertyType} onChange={setPropertyType} />
            </div>

            <div className="space-y-3">
              <StepHeader index={2} title="Service needed" />
              <Select value={serviceSlug} onValueChange={setServiceSlug}>
                <SelectTrigger className="h-12 w-full border-ink text-base font-medium data-[size=default]:h-12">
                  <SelectValue placeholder="Select a plumbing service…" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_GROUPS.map((group) => (
                    <SelectGroup key={group}>
                      <SelectLabel className="font-mono text-[10px] uppercase tracking-widest text-sp-red">
                        {group}
                      </SelectLabel>
                      {SERVICES.filter((s) => s.group === group).map((service) => (
                        <SelectItem key={service.slug} value={service.slug}>
                          <span className="flex items-center gap-2">
                            <service.icon className="size-4 text-sp-blue" />
                            {service.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {serviceSlug && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {SERVICES.find((s) => s.slug === serviceSlug)?.blurb}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <StepHeader index={3} title="Location" />
              <Select value={locationSlug} onValueChange={setLocationSlug}>
                <SelectTrigger className="h-12 w-full border-ink text-base font-medium data-[size=default]:h-12">
                  <SelectValue placeholder="Select your city or area…" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_ZONES.map((zone) => (
                    <SelectGroup key={zone}>
                      <SelectLabel className="font-mono text-[10px] uppercase tracking-widest text-sp-red">
                        {zone}
                      </SelectLabel>
                      {LOCATIONS.filter((l) => l.zone === zone).map((loc) => (
                        <SelectItem key={loc.slug} value={loc.slug}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <StepHeader index={4} title="How soon?" />
              <div className="grid grid-cols-3 border border-ink">
                {URGENCY_OPTIONS.map((opt) => {
                  const active = urgency === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setUrgency(opt.value)}
                      aria-pressed={active}
                      className={cn(
                        "px-2 py-3 text-center transition-colors",
                        opt.value !== "flexible" && "border-l border-ink",
                        active ? "bg-sp-blue text-white" : "hover:bg-muted",
                      )}
                    >
                      <span className="block font-display text-xs font-bold uppercase tracking-wide sm:text-sm">
                        {opt.label}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block font-mono text-[9px] uppercase tracking-wider",
                          active ? "text-white/80" : "text-muted-foreground",
                        )}
                      >
                        {opt.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleCalculate}
              disabled={!canCalculate}
              className="h-14 w-full font-display text-base font-extrabold uppercase tracking-wide"
            >
              Calculate my estimate
            </Button>
            {!canCalculate && (
              <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Select a service and location to continue
              </p>
            )}
          </div>
        )}

        {/* ---------------------------- STEP: ESTIMATE ----------------------------- */}
        {step === "estimate" && estimate && (
          <div className="space-y-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-sp-red">
                  Your estimate
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
                  {estimate.service.label}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {estimate.location.label}, Ontario ·{" "}
                  {propertyType === "commercial" ? "Commercial" : "Residential"}
                </p>
              </div>
              <estimate.service.icon className="hidden size-10 text-sp-blue sm:block" strokeWidth={1.5} />
            </div>

            <div className="border-2 border-ink">
              <div className="flex items-end justify-between gap-4 px-5 pb-5 pt-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Expected range
                  </p>
                  <p className="mt-1 font-display text-4xl font-black tracking-tight text-sp-red sm:text-5xl">
                    {formatCad(estimate.low)}
                  </p>
                </div>
                <span className="pb-1.5 font-display text-2xl font-bold text-muted-foreground">—</span>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    &nbsp;
                  </p>
                  <p className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">
                    {formatCad(estimate.high)}
                  </p>
                </div>
              </div>
              <div className="border-t border-ink bg-secondary px-5 py-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  CAD · Includes labour &amp; standard materials
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{estimate.note}</p>

            <div className="border border-ink bg-secondary p-4">
              <p className="font-display text-sm font-bold uppercase tracking-wide">
                Want an exact quote in writing?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Send us your details and a licensed plumber will confirm your price — free,
                no obligation, usually within the hour during business hours.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                size="lg"
                onClick={() => setStep("form")}
                className="h-14 font-display text-base font-extrabold uppercase tracking-wide"
              >
                Get my exact quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={reset}
                className="h-14 border-2 border-ink font-display text-base font-bold uppercase tracking-wide hover:bg-muted"
              >
                Start over
              </Button>
            </div>
          </div>
        )}

        {/* ------------------------------ STEP: FORM ------------------------------ */}
        {step === "form" && estimate && (
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-sp-red">
                Last step
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
                Get your exact quote
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {estimate.service.label} · {estimate.location.label} · Estimate{" "}
                <span className="font-semibold text-foreground">
                  {formatCad(estimate.low)}–{formatCad(estimate.high)}
                </span>
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="sp-name" className="font-mono text-[10px] font-semibold uppercase tracking-widest">
                  Name <span className="text-sp-red">*</span>
                </label>
                <Input
                  id="sp-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  minLength={2}
                  className="h-11 border-ink"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sp-phone" className="font-mono text-[10px] font-semibold uppercase tracking-widest">
                  Phone <span className="text-sp-red">*</span>
                </label>
                <Input
                  id="sp-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                  className="h-11 border-ink"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="sp-email" className="font-mono text-[10px] font-semibold uppercase tracking-widest">
                  Email <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="sp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 border-ink"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="sp-details" className="font-mono text-[10px] font-semibold uppercase tracking-widest">
                  Job details <span className="text-muted-foreground">(optional)</span>
                </label>
                <Textarea
                  id="sp-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Second-floor toilet keeps running; house is 15 years old…"
                  rows={3}
                  className="border-ink"
                />
              </div>
            </div>

            {submitError && (
              <p className="border border-ink bg-secondary px-3 py-2 text-sm text-sp-red">{submitError}</p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-14 font-display text-base font-extrabold uppercase tracking-wide"
              >
                {submitting ? "Sending…" : "Request my quote"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("estimate")}
                disabled={submitting}
                className="h-14 border-2 border-ink font-display text-base font-bold uppercase tracking-wide hover:bg-muted"
              >
                Back to estimate
              </Button>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              No spam. No obligation. Licensed &amp; insured plumbers.
            </p>
          </form>
        )}

        {/* ------------------------------ STEP: DONE ------------------------------ */}
        {step === "done" && estimate && (
          <div className="space-y-7 py-4 text-center sm:py-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-sp-red">
              Request received
            </p>
            <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
              We&apos;ll call you shortly
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
              Thanks, {name.split(" ")[0] || "friend"}. A licensed plumber will confirm your{" "}
              {estimate.service.label.toLowerCase()} quote for {estimate.location.label} — usually
              within the hour during business hours.
            </p>
            <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-2">
              <Button
                size="lg"
                onClick={reset}
                variant="outline"
                className="h-12 border-2 border-ink font-display text-sm font-bold uppercase tracking-wide hover:bg-muted"
              >
                Calculate another job
              </Button>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Urgent? Mention it when we call you back — we run 24/7 emergency service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
