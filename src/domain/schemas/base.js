import { z } from "zod";

/**
 * Canonical Taxonomy Conventions (docs/taxonomy/taxonomy-conventions.md, v1.0.0)
 *
 * Three universal sentinels — mutually exclusive, never used interchangeably:
 * - `unknown` = insufficient information to classify. The DEFAULT for any
 *   optional classification field when source data doesn't specify a value.
 * - `other`   = classification is known but falls outside the defined
 *   enumerated values. NEVER a default — always an explicit, deliberate
 *   mapping choice made by a factory/mapper, never assumed.
 * - `none`    = a genuine "not applicable" state — confirmed, audited
 *   absence of a property, not merely unrecorded.
 *
 * `required: true` in the taxonomy docs is reserved for fields that are
 * structurally necessary for the canonical record to be valid (Gate 1).
 * Missing classification/enrichment data does NOT make a record invalid —
 * see factories/*.js for how completeness is assessed separately (Gate 2).
 */

/** Append the two universal sentinels (unknown, other) to a set of real enum values. */
export function withSentinels(values) {
  return z.enum([...values, "unknown", "other"]);
}

/** Append all three universal sentinels (unknown, other, none) — use only
 * where a genuine "confirmed not applicable" state is meaningful. */
export function withAllSentinels(values) {
  return z.enum([...values, "unknown", "other", "none"]);
}

/** Tri-state enum for boolean-shaped facets that must represent "not yet
 * audited" distinctly from `false` (e.g. `fortified`, `sourOrWild`,
 * `sparkling`, `glutenFree`). Standard booleans are forbidden for
 * classification fields per the Tri-State Rule (conventions Section 2)
 * — a plain boolean can't express "unrecorded" without conflating it
 * with a false assertion.
 */
export const TriState = z.enum(["true", "false", "unknown"]);

/** Sentinel string for free-text fields that can't use an enum.
 * Literal "unknown" string — never null/empty. */
export const UNKNOWN = "unknown";
export const UNKNOWN_ARRAY = [UNKNOWN];

export const FreeTextField = z.string().default(UNKNOWN);
export const FreeTextArrayField = z
  .array(z.string())
  .default([...UNKNOWN_ARRAY]);

/**
 * Cross-cutting facets (taxonomy-conventions.md Section 4) — apply to
 * every category, defined once here rather than repeated per category.
 */
export const AlcoholStatus = z.enum([
  "alcoholic",
  "low-alcohol",
  "non-alcoholic",
  "alcohol-free",
  "unknown",
]);

export const DealcoholizationMethod = z.enum([
  "vacuum-distillation",
  "spinning-cone",
  "reverse-osmosis",
  "arrested-fermentation",
  "none",
  "unknown",
  "other",
]);

/**
 * Derives alcohol_status from abv using the mutually-exclusive, contiguous
 * thresholds in taxonomy-conventions.md Section 4. WARNING: jurisdiction-
 * dependent fallback defaults — confirm actual regional statutory
 * definitions before this drives compliance/age-gating/excise logic.
 * @param {number|undefined} abv
 * @returns {"alcoholic"|"low-alcohol"|"non-alcoholic"|"alcohol-free"|"unknown"}
 */
export function deriveAlcoholStatus(abv) {
  if (abv === undefined || abv === null) return "unknown";
  if (abv === 0) return "alcohol-free";
  if (abv < 0.5) return "non-alcoholic";
  if (abv <= 1.2) return "low-alcohol";
  return "alcoholic";
}

/**
 * Fields shared by every canonical beverage product record, regardless of
 * category. Category-specific schemas extend this. Named beverageProductBase
 * (not liquorProductBase) to match the taxonomy root rename — beverage.md:
 * named `beverage`, not `liquor`, so non-alcoholic variants aren't
 * structurally misdescribed by the root itself.
 */
export const BeverageProductBaseSchema = z.object({
  /** Internal canonical identifier — structurally required (Gate 1). */
  canonicalId: z.string().min(1),
  /** Source POS SKU — the upsert/idempotency key for the Shopify load stage. */
  posSku: z.string().min(1),
  /** Which taxonomy category this record belongs to. */
  category: z.enum(["wine", "spirits", "beer", "cider", "rtd"]),
  abv: z.number().min(0).max(100).optional(),
  bottleSizeMl: z.number().positive().optional(),
  countryOfOrigin: FreeTextField,
  alcoholStatus: AlcoholStatus.default("unknown"),
  dealcoholizationMethod: DealcoholizationMethod.default("none"),
});
