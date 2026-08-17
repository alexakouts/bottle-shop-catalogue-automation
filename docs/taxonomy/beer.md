---
id: beer
parent: beverage
label: Beer
status: draft-final
owner: data-team
version: 1.0.0
---

# Beer

## Scope

Fermented, grain-based alcoholic and non-alcoholic beverages. Primarily derived from malted barley, with wheat, rye, corn, and oats treated as adjuncts or bases within specific styles.

**Cider (apple/pear-based) and Mead (honey-based) are explicitly out of scope** — per the global root boundaries defined in `beverage.md`, they are juice- and honey-fermented products, making grain and bittering metrics entirely meaningless to them. They are handled independently in their own peer taxonomy files.

## Governance Rule Applied

**The Attribute Relevance Test:** A structural taxonomy fork is justified only when a proposed branch requires a cluster of unique fields that are completely meaningless to its structural siblings.

- **Ale vs. Lager is NOT a fork:** Fermentation type (top-fermenting/warm vs. bottom-fermenting/cold) does not alter which data metrics apply. Fields tracking IBU, hop bills, malt bills, and SRM color apply identically to both. It is modeled as a shared property facet (`fermentation_type`) rather than a structural tree branch, aligning cleanly with commercial POS retail data.
- **Sour/Wild is NOT a fork:** Originally branched, this distinction was collapsed into a flat property set. Splitting the tree would create severe data degradation for modern craft hybrid styles (such as a "Sour Hazy IPA"), forcing data entry teams to choose between an IPA style node or a Sour branch. Instead, the schema is flat, and sour-specific fields are conditionally activated at runtime via application logic (`depends_on: sour_or_wild=true`), letting a hybrid cleanly carry both hop bills and souring methods simultaneously on a single record.

## Required-Field Policy

In strict alignment with Section 1 of `taxonomy-conventions.md`, no enrichment or classification field in this schema is marked `required: true`. Forcing required fields on raw, unstructured supplier or POS data either completely blocks valid ingestion lines or forces data entry teams to guess values. Completeness is tracked as an independent quality metric downstream.

---

## Shared Facets (Apply across all Beer products)

```yaml
facets:
  fermentation_type:
    type: enum
    values: [ale, lager, hybrid, unknown, other]
    default: unknown
    notes: >
      Top-fermenting (ale) vs. bottom-fermenting (lager) vs. hybrid 
      production (e.g., Kölsch, Altbier). Property facet, not a structural fork.
  style:
    type: enum
    values:
      [
        ipa-american,
        ipa-hazy,
        pale-ale,
        amber-ale,
        brown-ale,
        porter,
        stout,
        pilsner,
        helles-lager,
        marzen,
        amber-lager,
        dark-lager,
        wheat-beer,
        saison-farmhouse,
        belgian-ale,
        strong-ale,
        unknown,
        other,
      ]
    default: unknown
    notes: >
      High-volume retail macro-categories. Traditional European sour styles 
      and modern craft sour hybrids are explicitly isolated to the conditional 
      `sour_type` facet below so that base style data (like stout or IPA metrics) 
      remains intact for multi-style analytics.
  abv:
    type: number
    unit: percent
    required: false
  ibu:
    type: number
    notes: International Bitterness Units.
    required: false
  srm_color:
    type: number
    notes: Standard Reference Method color scale.
    required: false
  hop_varieties:
    type: array
    item_type: string
    default: ["unknown"]
    notes: Array of dominant hop profiles. Use literal ["unknown"] if unstated.
  malt_bill:
    type: array
    item_type: string
    default: ["unknown"]
    notes: Array of base grains/malts. Use literal ["unknown"] if unstated.
  gluten_free:
    type: enum
    values: [true, false, unknown]
    default: unknown
    notes: >
      Tri-state property. Enforced to prevent unverified gluten status from 
      silently defaulting to false, protecting consumers and compliance lines.
  bottle_size_ml:
    type: number
    required: false
  country_of_origin:
    type: string
    default: unknown
  sour_or_wild:
    type: enum
    values: [true, false, unknown]
    default: unknown
    notes: >
      Tri-state property. Gates runtime evaluation rules for the conditional 
      sour attributes below.
  sour_type:
    type: enum
    values:
      [
        lambic,
        gueuze,
        fruit-lambic,
        gose,
        berliner-weisse,
        flanders-red,
        flanders-brown,
        modern-sour-hybrid,
        wild-ale,
        unknown,
        other,
      ]
    required: false
    depends_on: sour_or_wild=true
    notes: >
      Captures the specific sour tradition or hybrid modification. A modern 
      Sour IPA maps cleanly to style=ipa-hazy AND sour_type=modern-sour-hybrid.
  souring_method:
    type: enum
    values: [kettle-sour, spontaneous, mixed-culture, unknown, other]
    required: false
    depends_on: sour_or_wild=true
  culture_type:
    type: string
    required: false
    depends_on: sour_or_wild=true
    notes: e.g., Brettanomyces, Lactobacillus, Pediococcus — free text.
  fruit_additions:
    type: array
    item_type: string
    default: []
    required: false
    notes: >
      Free text array (e.g., ["cherry", "raspberry"]). Kept completely ungated 
      at the root level so it can apply equally to traditional sours (Kriek) and 
      standard fruited beers (Grapefruit IPAs or Fruited Stouts).
```

---

## Design History & Resolved Notes

All items below are resolved — kept as an absolute log to preserve data team design intent and track structural reversals.

1.  **Resolved: Global Namespace Sync.** Parent property rewritten to reference the singular `beverage` node, bringing beer into absolute alignment with the contiguous, mutually exclusive non-alcoholic calculation boundaries defined in `taxonomy-conventions.md`.
2.  **Resolved: Flat Tree Architecture Over Branches.** An earlier proposal forked the tree into Standard Beer vs. Sour/Wild Beer branches. This was reversed because it broke analytics tracking and inventory classification for modern craft hybrids (like Sour IPAs). Moving validation dependencies to application runtime gating keeps the schema agile.
3.  **Resolved: Style Enum Expansion.** The style enumeration was expanded from a basic starter list to explicitly include high-volume commercial retail macro-categories (such as splitting out `ipa-hazy` and partitioning lagers into `helles-lager`, `amber-lager`, and `dark-lager`), preventing generic data pollution in the `other` bucket.
