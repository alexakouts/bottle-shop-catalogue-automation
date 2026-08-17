---
id: rtd
parent: beverage
label: Ready-To-Drink (RTD)
status: approved
owner: data-team
version: 1.0.0
---

# Ready-To-Drink (RTD)

## Scope

Pre-blended, single-serve alcoholic and non-alcoholic mixed beverages, packaged cocktails, hard seltzers, hard teas/coffees, and flavoured alcoholic beverages (alcopops).

Explicitly includes non-alcoholic mocktail alternatives and zero-proof spirit mixers using the cross-cutting `alcohol_status` facet.

## Governance Rule Applied

**The Attribute Relevance Test:** A distinct top-level schema under the `beverage` root is required because RTD products are defined by their **blended retail format**. They introduce attributes like complex packaging matrices (multi-packs), liquid bases, and mixer arrays that are entirely meaningless to bulk-bottled base liquids like a premium single-malt whisky or an AOC Champagne.

Concretely: a canned Espresso Martini or Hard Seltzer needs `mixer_type`, `carbonation_style`, `container_type` (can vs. bottle), and `pack_size` (multi-pack configuration) — none of which apply to a 700ml bottle of single-malt or an AOC Champagne. Forcing RTD products into `spirits.md` or `wine.md` would mean those files carry fields meaningless to their typical member, the exact failure mode the process-vs-property test exists to catch. This is the same justification that gave Liqueurs its own branch in `spirits.md` — cutting across base materials is what earns the fork, not what disqualifies it.

## Proposed Structure: Single Flat Schema with Conditional Core Facets

Like Beer and Cider, the RTD file operates as a single flat schema with no structural branch forks. The massive style variance between a 4% ABV Lime Hard Seltzer and a 20% ABV canned Negroni is handled via attribute-level conditional property modifiers rather than a deep process tree fork.

---

## Shared Facets (All apply to every RTD product)

```yaml
facets:
  rtd_category:
    type: enum
    values:
      [
        classic-cocktail,
        contemporary-mix,
        hard-seltzer,
        hard-tea-coffee,
        alcopop-soda,
        wine-spritzer,
        unknown,
        other,
      ]
    required: true
    notes: >
      Drives front-end filtering. A canned Gin & Tonic is a contemporary-mix; 
      a canned Margarita or Espresso Martini is a classic-cocktail.
  base_liquid_type:
    type: enum
    values:
      [
        spirit,
        liqueur,
        wine,
        beer,
        malt-fermented,
        sugar-fermented,
        neutral-alcohol,
        unknown,
        other,
      ]
    required: true
    notes: >
      Identifies the PRIMARY/dominant alcoholic base — for front-end
      filtering and excise tax mapping — not necessarily the only one.
      Many RTD products blend two alcoholic components (a Spritz is
      Prosecco + Aperol; a Margarita is tequila + triple sec), so this
      field alone doesn't fully describe composition — see
      specific_base_spirit/specific_base_liqueur below, which are
      independently populated, not strictly gated to matching this value.
  specific_base_spirit:
    type: enum
    values:
      [whisky, vodka, gin, rum, tequila, mezcal, brandy, none, unknown, other]
    notes: >
      NOT strictly gated to base_liquid_type=spirit — deliberately
      ungated (same reasoning as cider.md's `method` field) so a
      wine-based Spritz-style product can still record a spirit
      component if one is present, and a spirit-based cocktail can
      simultaneously record a liqueur component via the field below.
      `none` = confirmed no spirit component; `unknown` = not established
      from source data.
  specific_base_liqueur:
    type: enum
    values:
      [
        aperitif-bitter,
        coffee,
        amaretto-nut,
        triple-sec-orange,
        cream,
        herbal,
        none,
        unknown,
        other,
      ]
    notes: >
      Parallel to specific_base_spirit, same ungating rationale — e.g. a
      Margarita (base_liquid_type=spirit, specific_base_spirit=tequila)
      can also carry specific_base_liqueur=triple-sec-orange; a Spritz
      (base_liquid_type=wine) can carry specific_base_liqueur=aperitif-bitter
      with specific_base_spirit=none. Cross-references spirits.md's
      liqueurs.flavor_profile_category rather than redefining a separate
      taxonomy for the same concept.
  mixer_type:
    type: array
    item_type: enum
    values:
      [
        tonic,
        cola,
        ginger-ale-beer,
        soda-water,
        citrus-juice,
        fruit-juice-other,
        coffee,
        cream,
        none,
        unknown,
        other,
      ]
    default: ["none"]
  primary_flavor_profile:
    type: enum
    values:
      [
        citrus,
        berry,
        tropical,
        herbal-spice,
        sweet-cola,
        dry-bitter,
        coffee-chocolate,
        clean-neutral,
        unknown,
        other,
      ]
    default: unknown
  carbonation_style:
    type: enum
    values: [still, lightly-carbonated, carbonated, unknown, other]
    default: carbonated
  container_type:
    type: enum
    values: [can, glass-bottle, pouch, unknown, other]
    default: unknown
    notes: >
      Softened from required: true — packaging metadata is routinely
      missing from raw supplier/POS data, and forcing it at the schema
      boundary would block otherwise-valid ingestion. Consistent with
      wine.md's founding required-field policy.
  pack_size:
    type: enum
    values: [single, 4-pack, 6-pack, 10-pack, 24-pack, unknown, other]
    default: unknown
    notes: >
      RTD products are highly volume-driven by physical retail multi-pack
      configurations. Default changed from `single` to `unknown` — while
      most SKUs probably are single units, defaulting to `single` makes
      an unconfirmed assumption look like confirmed data (silent
      misclassification), which is exactly what the unknown/other/none
      sentinel convention exists to prevent. Aligned with every other
      classification field in this project.
  abv:
    type: number
    unit: percent
    required: true
  serving_size_ml:
    type: number
    required: true
    notes: Liquid volume of the individual single unit container.
```

---

## Design History & Resolved Notes

All items below are resolved — kept as a log to preserve design intent and the reasoning behind reversals, not as active open questions.

1.  **Resolved: The Hard Seltzer Dilemma.** Hard seltzers are structurally integrated into this flat model using `rtd_category: hard-seltzer` and `base_liquid_type: sugar-fermented` or `neutral-alcohol`. This keeps them completely out of `beer.md`, where they would otherwise pollute grain and hop tracking fields.
2.  **Resolved: Cross-Cutting Non-Alcoholic Mocktails.** Non-alcoholic canned cocktails (e.g., a zero-proof canned Amaretti Sour) sit natively on this schema with `alcohol_status: non-alcoholic`. They retain their full `mixer_type` and `classic-cocktail` style attributes seamlessly.
3.  **Resolved: Naming Convention ID.** Settled on `id: rtd` and `label: Ready-To-Drink (RTD)` to match global beverage market research standards (IWSR/Euromonitor) while keeping the database key to a clean, lowercase single-word string.
4.  **Resolved: Liqueur Split.** `liqueur` was split out of `base_liquid_type`, with a parallel `specific_base_liqueur` field. Real gap in the original draft — Aperol Spritz and Espresso Martini-style products are liqueur-defined, not spirit-defined, and forcing them under `spirit` would have lost that distinction. Cross-references `spirits.md`'s Liqueurs branch rather than duplicating its taxonomy.
5.  **Resolved: Sentinel Mapping.** `other` was added to `specific_base_spirit`, `carbonation_style`, and `container_type` — every enum elsewhere pairs `unknown`/`other`.
6.  **Resolved: Multi-Base Blends Representable.** Fixed a limitation where specific-base fields being gated to a single `base_liquid_type` value meant a Spritz (wine + liqueur) or Margarita (spirit + liqueur) couldn't record both alcoholic components. By completely ungating both fields, `base_liquid_type` now records the primary/dominant base only, while the two specific-base fields populate independently.
7.  **Resolved: Field Constraints Softened.** `container_type` and `pack_size` are softened to protect the ingestion boundary from messy distributor manifests, tracking unconfirmed configurations explicitly via the `unknown` default.
