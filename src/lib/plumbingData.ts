import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Droplets,
  Flame,
  Gauge,
  Hammer,
  ShowerHead,
  Thermometer,
  Waves,
  Wrench,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type PropertyType = "residential" | "commercial";

export interface PlumbingService {
  slug: string;
  label: string;
  group: "Repairs" | "Installations" | "Drains & Sewer" | "Emergency";
  icon: LucideIcon;
  /** Typical GTA price range, Canadian dollars. */
  residentialRange: [number, number];
  /** Commercial jobs cost more on average than residential. */
  commercialMultiplier: number;
  blurb: string;
}

export interface GtaLocation {
  slug: string;
  label: string;
  zone: "Toronto" | "Scarborough & East" | "North York & Vaughan" | "Mississauga & West";
  /** Travel-time premium: +0% near HQ, up to +8% at the edge of the GTA. */
  multiplier: number;
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const SERVICES: PlumbingService[] = [
  {
    slug: "toilet-repair",
    label: "Toilet Repair",
    group: "Repairs",
    icon: Bath,
    residentialRange: [180, 380],
    commercialMultiplier: 1.2,
    blurb: "Running, clogged or leaking toilets, fill valves, flappers and wax rings.",
  },
  {
    slug: "faucet-repair-replacement",
    label: "Faucet Repair & Replacement",
    group: "Repairs",
    icon: Wrench,
    residentialRange: [150, 350],
    commercialMultiplier: 1.25,
    blurb: "Dripping taps, cartridge replacement, kitchen and bath fixture swaps.",
  },
  {
    slug: "leak-detection",
    label: "Leak Detection & Repair",
    group: "Repairs",
    icon: Droplets,
    residentialRange: [220, 650],
    commercialMultiplier: 1.3,
    blurb: "Pinpoint hidden leaks in walls, ceilings and slabs, then repair them.",
  },
  {
    slug: "water-heater-repair",
    label: "Water Heater Repair",
    group: "Installations",
    icon: Flame,
    residentialRange: [180, 450],
    commercialMultiplier: 1.35,
    blurb: "Thermostats, elements, thermocouples and tankless diagnostics.",
  },
  {
    slug: "water-heater-replacement",
    label: "Water Heater Replacement",
    group: "Installations",
    icon: Thermometer,
    residentialRange: [1450, 3400],
    commercialMultiplier: 1.45,
    blurb: "Tank and tankless installs, 40–75 gallon units, code-compliant venting.",
  },
  {
    slug: "sump-pump-installation",
    label: "Sump Pump Installation & Repair",
    group: "Installations",
    icon: Gauge,
    residentialRange: [650, 1800],
    commercialMultiplier: 1.4,
    blurb: "Submersible pumps, battery backups and pit upgrades for basements.",
  },
  {
    slug: "drain-cleaning",
    label: "Drain Cleaning",
    group: "Drains & Sewer",
    icon: Waves,
    residentialRange: [180, 500],
    commercialMultiplier: 1.3,
    blurb: "Kitchen, bath and laundry drains snaked and flushed clear.",
  },
  {
    slug: "main-drain-backup",
    label: "Main Drain Backup Clearing",
    group: "Drains & Sewer",
    icon: ShowerHead,
    residentialRange: [350, 900],
    commercialMultiplier: 1.4,
    blurb: "Sewer camera inspection and power rodding of the main line.",
  },
  {
    slug: "pipe-replacement",
    label: "Pipe Repair & Repiping",
    group: "Repairs",
    icon: Hammer,
    residentialRange: [450, 3200],
    commercialMultiplier: 1.5,
    blurb: "Copper, PEX and galvanized line repair, partial and full repiping.",
  },
];

export const SERVICE_GROUPS = [
  "Repairs",
  "Installations",
  "Drains & Sewer",
] as const;

/* ------------------------------------------------------------------ */
/* Locations (Greater Toronto Area)                                    */
/* ------------------------------------------------------------------ */

export const LOCATIONS: GtaLocation[] = [
  // HQ zone — no travel premium
  { slug: "scarborough", label: "Scarborough", zone: "Scarborough & East", multiplier: 1.0 },
  { slug: "east-york", label: "East York", zone: "Scarborough & East", multiplier: 1.0 },
  { slug: "pickering", label: "Pickering", zone: "Scarborough & East", multiplier: 1.03 },
  { slug: "ajax", label: "Ajax", zone: "Scarborough & East", multiplier: 1.04 },
  { slug: "markham", label: "Markham", zone: "Scarborough & East", multiplier: 1.03 },

  // Toronto
  { slug: "downtown-toronto", label: "Downtown Toronto", zone: "Toronto", multiplier: 1.05 },
  { slug: "midtown-toronto", label: "Midtown Toronto", zone: "Toronto", multiplier: 1.04 },
  { slug: "north-york", label: "North York", zone: "North York & Vaughan", multiplier: 1.02 },
  { slug: "etobicoke", label: "Etobicoke", zone: "Toronto", multiplier: 1.05 },
  { slug: "vaughan", label: "Vaughan", zone: "North York & Vaughan", multiplier: 1.05 },
  { slug: "richmond-hill", label: "Richmond Hill", zone: "North York & Vaughan", multiplier: 1.06 },
  { slug: "aurora", label: "Aurora", zone: "North York & Vaughan", multiplier: 1.07 },
  { slug: "newmarket", label: "Newmarket", zone: "North York & Vaughan", multiplier: 1.08 },

  // West
  { slug: "mississauga", label: "Mississauga", zone: "Mississauga & West", multiplier: 1.04 },
  { slug: "brampton", label: "Brampton", zone: "Mississauga & West", multiplier: 1.05 },
  { slug: "oakville", label: "Oakville", zone: "Mississauga & West", multiplier: 1.07 },
  { slug: "milton", label: "Milton", zone: "Mississauga & West", multiplier: 1.08 },
];

export const LOCATION_ZONES = [
  "Scarborough & East",
  "Toronto",
  "North York & Vaughan",
  "Mississauga & West",
] as const;

/* ------------------------------------------------------------------ */
/* Estimate engine                                                     */
/* ------------------------------------------------------------------ */

export interface EstimateInput {
  serviceSlug: string;
  propertyType: PropertyType;
  locationSlug: string;
  urgency: "flexible" | "scheduled" | "emergency";
}

export interface EstimateResult {
  service: PlumbingService;
  location: GtaLocation;
  low: number;
  high: number;
  note: string;
}

const ROUNDING_STEP = 10;

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Calculates a realistic GTA price range.
 *
 * Base service range × property-type multiplier × location travel premium,
 * with a +25% rush premium on emergency calls.
 */
export function calculateEstimate(input: EstimateInput): EstimateResult | null {
  const service = SERVICES.find((s) => s.slug === input.serviceSlug);
  const location = LOCATIONS.find((l) => l.slug === input.locationSlug);
  if (!service || !location) return null;

  const propertyMultiplier =
    input.propertyType === "commercial" ? service.commercialMultiplier : 1;
  const urgencyMultiplier = input.urgency === "emergency" ? 1.25 : 1;

  const lowRaw = service.residentialRange[0] * propertyMultiplier * location.multiplier;
  const highRaw = service.residentialRange[1] * propertyMultiplier * location.multiplier * urgencyMultiplier;

  const low = roundToStep(lowRaw, ROUNDING_STEP);
  const high = roundToStep(highRaw, ROUNDING_STEP);

  const urgencyNote =
    input.urgency === "emergency"
      ? "Includes the 24/7 emergency response premium."
      : input.urgency === "scheduled"
        ? "Based on a booking made in advance with a 2-hour arrival window."
        : "Based on our standard next-available scheduling.";

  const propertyNote =
    input.propertyType === "commercial"
      ? "Commercial properties are quoted after a brief on-site assessment; this range reflects typical job sizes."
      : "Typical residential job in this area. Complex installs can exceed the top of the range.";

  return {
    service,
    location,
    low,
    high,
    note: `${urgencyNote} ${propertyNote}`,
  };
}

export function formatCad(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}
