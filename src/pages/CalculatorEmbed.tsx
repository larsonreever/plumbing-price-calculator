import PlumbingCalculator from "@/components/PlumbingCalculator";

/**
 * Standalone page designed for iframe embedding on savingplumbing.com.
 *
 * WordPress usage:
 *   <iframe
 *     src="https://YOUR-APP-URL/calculator"
 *     style="width:100%;height:900px;border:0"
 *     title="Plumbing Cost Calculator — Saving Plumbing"
 *   />
 */
export default function CalculatorEmbed() {
  return (
    <main className="grid-lines min-h-screen bg-background py-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl px-4">
        <PlumbingCalculator />
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Powered by{" "}
          <a
            href="https://www.savingplumbing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-sp-red underline-offset-4 hover:text-foreground"
          >
            Saving Plumbing
          </a>{" "}
          · Licensed &amp; insured · Scarborough, ON
        </p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Plumbing Cost Calculator — Saving Plumbing",
            url: "https://www.savingplumbing.com/plumbing-calculator/",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
          }),
        }}
      />
    </main>
  );
}
