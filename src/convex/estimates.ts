import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Public mutation: a visitor submits the lead form at the end of the plumbing
 * calculator. No auth required — the calculator is embedded on a public
 * WordPress page.
 */
export const submitEstimateRequest = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    propertyType: v.string(),
    serviceSlug: v.string(),
    serviceLabel: v.string(),
    locationSlug: v.string(),
    locationLabel: v.string(),
    estimateLow: v.number(),
    estimateHigh: v.number(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.name.trim().length < 2) {
      throw new Error("Please enter your name.");
    }
    if (args.phone.replace(/\D/g, "").length < 10) {
      throw new Error("Please enter a valid phone number.");
    }
    return await ctx.db.insert("estimateRequests", {
      name: args.name.trim(),
      phone: args.phone.trim(),
      email: args.email?.trim() || undefined,
      propertyType: args.propertyType,
      serviceSlug: args.serviceSlug,
      serviceLabel: args.serviceLabel,
      locationSlug: args.locationSlug,
      locationLabel: args.locationLabel,
      estimateLow: args.estimateLow,
      estimateHigh: args.estimateHigh,
      details: args.details?.trim() || undefined,
    });
  },
});

/**
 * Public query: total leads captured (shown as social proof on the landing
 * page). Safe to expose — it returns only a count.
 */
export const leadCount = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("estimateRequests").collect();
    return rows.length;
  },
});
