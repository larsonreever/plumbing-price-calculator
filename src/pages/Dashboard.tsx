import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check, Copy, LogOut, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { formatCad } from "@/lib/plumbingData";
import { cn } from "@/lib/utils";

const EMBED_SNIPPET = `<iframe
  src="https://YOUR-APP-URL/calculator"
  style="width:100%;height:950px;border:0"
  title="Plumbing Cost Calculator — Saving Plumbing"
  loading="lazy"
></iframe>`;

function EmbedCodeCard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMBED_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can still select the text manually
    }
  };

  return (
    <div className="border-2 border-ink">
      <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2">
        <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-background">
          WordPress embed
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={copy}
          className="h-7 gap-1.5 text-background hover:bg-background/15 hover:text-background"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto bg-secondary p-4 font-mono text-xs leading-relaxed">
        {EMBED_SNIPPET}
      </pre>
      <p className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Replace <code className="bg-muted px-1 font-mono">YOUR-APP-URL</code> with this app&apos;s
        deployed URL, then paste into your WordPress page with a Custom HTML block.
      </p>
    </div>
  );
}

function PropertyBadge({ type }: { type: string }) {
  const isCommercial = type === "commercial";
  return (
    <span
      className={cn(
        "inline-block px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest",
        isCommercial ? "bg-sp-blue text-white" : "bg-ink text-background",
      )}
    >
      {isCommercial ? "Commercial" : "Residential"}
    </span>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const leads = useQuery(api.estimates.listEstimateRequests) ?? [];
  const total = leads.length;
  const commercial = leads.filter((l) => l.propertyType === "commercial").length;
  const residential = total - commercial;
  const avgMid = total
    ? Math.round(
        leads.reduce((sum, l) => sum + (l.estimateLow + l.estimateHigh) / 2, 0) / total,
      )
    : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-ink bg-ink text-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-sp-red p-2">
              <span className="block size-3.5 bg-white" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-sm font-black uppercase leading-none tracking-tight">
                Saving Plumbing — Leads
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-background/60">
                Signed in as {user?.email ?? "staff"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="gap-2 border-background/40 bg-transparent font-display text-xs font-bold uppercase tracking-wide text-background hover:bg-background hover:text-ink"
          >
            <LogOut className="size-3.5" /> Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-px border border-ink bg-ink sm:grid-cols-4">
          {[
            { label: "Total leads", value: String(total) },
            { label: "Commercial", value: String(commercial) },
            { label: "Residential", value: String(residential) },
            { label: "Avg estimate", value: total ? formatCad(avgMid) : "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-5">
              <p className="font-display text-3xl font-black tracking-tight">{stat.value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* ------------------------------------------------ Leads list */}
          <section>
            <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
              <h2 className="font-display text-xl font-black uppercase tracking-tight">
                Estimate requests
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Newest first
              </span>
            </div>

            {leads.length === 0 ? (
              <div className="mt-6 border border-dashed border-ink p-10 text-center">
                <p className="font-display text-sm font-bold uppercase tracking-wide">
                  No leads yet
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  When someone calculates an estimate on your WordPress page and requests a
                  quote, it lands here instantly.
                </p>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {leads.map((lead) => (
                  <li key={lead._id} className="border border-ink bg-card">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
                      <div>
                        <p className="font-display text-base font-bold tracking-tight">
                          {lead.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {lead.serviceLabel} · {lead.locationLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PropertyBadge type={lead.propertyType} />
                        <p className="font-display text-sm font-black text-sp-red">
                          {formatCad(lead.estimateLow)}–{formatCad(lead.estimateHigh)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 px-4 py-3">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-sp-red"
                      >
                        <Phone className="size-3.5 text-sp-blue" /> {lead.phone}
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="size-3.5 text-sp-blue" /> {lead.email}
                        </a>
                      )}
                      <p className="ml-auto font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {new Date(lead._creationTime).toLocaleString("en-CA")}
                      </p>
                    </div>
                    {lead.details && (
                      <p className="border-t border-border bg-secondary px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                        {lead.details}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ----------------------------------------------- Embed panel */}
          <aside className="space-y-6">
            <div className="border-b-2 border-ink pb-3">
              <h2 className="font-display text-xl font-black uppercase tracking-tight">
                Put it on your site
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                One snippet embeds the live calculator into your existing WordPress page.
              </p>
            </div>
            <EmbedCodeCard />
            <div className="border border-ink bg-secondary p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sp-red">
                Tip — SEO
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Keep the calculator on a page titled “Plumbing Cost Calculator GTA” and add an
                intro paragraph above the iframe. The landing page in this app also carries the
                FAQ schema Google needs for rich results.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
