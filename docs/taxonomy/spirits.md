---
id: spirits
parent: beverage
label: Spirits
status: draft-final
owner: data-team
version: 1.0.0
---

# Spirits (PROCESS-BASED ARCHITECTURE)

## Scope

Distilled alcoholic beverages derived from grains, fruits, sugars, or agaves. Sibling to `wine.md`, `beer.md`, `cider.md`, and `rtd.md` under the global `beverage` root.

## Governance Rule Applied

A 9-branch structural tree (splitting by Whisky, Rum, Tequila, etc.) creates massive attribute duplication because wood aging metrics apply identically across all dark spirits.

Per the process-vs-property test, a structural fork is justified only when a branch requires a cluster of fields that are completely meaningless to its sibling. Spirits are collapsed into **three distinct structural branches** based on production physics:

```text
Spirits
├── Matured / Wood-Aged Spirits (Whisky, Cognac & Armagnac, Brandy, Aged Rum, Reposado/Añejo Tequila, Aged Mezcal)
├── Rectified / Unaged Spirits   (Vodka, Gin, Blanco Tequila, Mezcal Joven, White Rum)
└── Liqueurs & Cordials          (High-sugar modifiers built over a spirit base)
```

**Note on Tequila/Mezcal**: Unlike the original 9-branch draft, these do not receive their own top-level structural branches — but they are also not merged into a single generic "agave" `spirit_type`. Merging them would lose the ability to record which categorical family a product belongs to once it is aged and filed under matured spirits. The structural fork (Matured vs. Rectified) is orthogonal to the categorical distinction (Tequila vs. Mezcal); both are preserved using independent data attributes.

---

## Shared Facets (Apply to all Spirits at the root)

```yaml
facets:
  spirit_type:
    type: enum
    values: [whisky, cognac_armagnac, brandy, rum, tequila, mezcal, vodka, gin, neutral, unknown, other]
    required: true
    notes: >
      The macro classification. Kept at the granularity of explicit market 
      definitions (tequila/mezcal as distinct values, not merged into "agave") 
      since their production rules and geographic identities genuinely differ. 
      Used at the presentation layer for storefront layout mapping (e.g., 
      "Bourbon" maps from spirit_type=whisky + style=bourbon).
  distillation_purity:
    type: enum
    values: [neutral, aromatic, pit-roasted-smoke, unknown, other]
    default: unknown
    notes: >
      Deliberately NOT restricted to rectified_spirits. This identifies 
      industrial column-still configurations vs traditional pit-roasting (Mezcal) 
      production techniques. This process distinction matters just as much for an 
      aged Añejo as it does for an unaged Blanco; gating it to an unaged branch 
      would strand aged dark agave spirits without a structural process profile.
  agave_type:
    type: string
    default: unknown
    required: false
    depends_on: spirit_type in [tequila, mezcal]
    notes: e.g., blue weber (tequila), espadín/tobalá/madrecuixe (mezcal).
  nom:
    type: string
    required: false
    depends_on: spirit_type=tequila
    notes: NOM registration number — Tequila-specific regulatory traceability code.
  base_material:
    type: enum
    values: [molasses, cane-juice, unknown, other]
    default: unknown
    required: false
    depends_on: spirit_type=rum
    notes: cane-juice matches the traditional rhum agricole style profile.
  abv:
    type: number
    unit: percent
    required: true
  bottle_size_ml:
    type: number
    required: false
  country_of_origin:
    type: string
    default: unknown
```

---

## Branch 1: Matured / Wood-Aged Spirits

*Structural scope: Any spirit whose primary character and data footprint is defined by cask interaction.*

```yaml
matured_spirits:
  attributes:
    - name: style
      type: enum
      values: [bourbon, rye, scotch, irish, japanese, canadian, cognac-appellation, armagnac-appellation, pisco, calvados, grappa, aged-rum, reposado, anejo, extra-anejo, unknown, other]
      default: unknown
      notes: >
        Contextually driven by the root `spirit_type` — e.g., only whisky 
        records use bourbon/rye/scotch; only cognac_armagnac records use 
        cognac-appellation/armagnac-appellation. This cross-field consistency 
        is handled as a runtime check by factory validation functions rather 
        than type-level schemas, keeping the schema flat and agile.
    - name: age_statement_years
      type: number
      unit: years
      notes: Omit or leave null for No-Age-Statement (NAS) products.
      required: false
    - name: age_designation_tier
      type: enum
      values: [vs, vsop, xo, napoleon, hors-dage, unknown, none]
      default: none
      notes: >
        Strictly meaningful for cognac_armagnac. Defaults to `none` for 
        whiskies, rum, and agave spirits. Modeled as a conditional property 
        rather than a hard gated schema dependency.
    - name: cask_type
      type: array
      item_type: enum
      values: [virgin-oak, ex-bourbon, sherry, port, wine, rum-cask, unaged, unknown, other]
      default: ["unknown"]
    - name: wood_species
      type: enum
      values: [american-white-oak, french-oak, mizunara-oak, unknown, other]
      default: unknown
    - name: peated
      type: enum
      values: [true, false, unknown]
      default: unknown
      notes: Only populated if spirit_type=whisky.
```

---

## Branch 2: Rectified / Unaged Spirits

*Structural scope: Spirits defined by distillation purity, botanical infusion, or unaged raw material profile.*

```yaml
rectified_spirits:
  attributes:
    - name: style
      type: enum
      values: [london-dry, old-tom, contemporary, navy-strength, white-rum, spiced-rum, rhum-agricole, blanco, joven, cristalino, generic-vodka, flavored-vodka, unknown, other]
      default: unknown
      notes: >
        Follows the identical runtime validation checking pattern established
        in matured_spirits.
    - name: botanical_infusion_style
      type: enum
      values: [distilled, compounded, vapor-infused, none, unknown]
      default: none
    - name: botanicals
      type: array
      item_type: string
      default: []
      notes: Conditionally active if botanical_infusion_style is evaluated as not `none`.
    - name: flavored
      type: enum
      values: [true, false, unknown]
      default: unknown
      notes: Handles flavored vodkas or modern infusions without breaking base properties.
```

---

## Branch 3: Liqueurs & Cordials

*Structural scope: High-sugar modifiers. This branch solves the crossover problem by inheriting global constraints while introducing a specific sugar modifier gate.*

```yaml
liqueurs:
  attributes:
    - name: base_spirit_category
      type: enum
      values: [whisky, cognac_armagnac, brandy, rum, tequila, mezcal, vodka, gin, neutral, unknown, other]
      default: unknown
      notes: Cross-references the root spirit_type values to preserve base spirit provenance.
    - name: flavor_profile_category
      type: enum
      values: [herbal-botanical, fruit, nut-spice, cream-emulsion, coffee-chocolate, unknown, other]
      default: unknown
    - name: sugar_content_g_l
      type: number
      unit: grams-per-liter
      required: false
      notes: Key technical mapping attribute for strict statutory definitions of liqueurs.
```

---

## Design History & Resolved Notes

All items below are resolved — kept as a log to preserve design intent and the reasoning behind reversals, not as active open questions.

1. **Resolved: The Crossover Hybrid Fix (Liqueurs).** By decoupling liqueurs into their own process branch with a `base_spirit_category` reference attribute, a product like Grand Marnier cleanly records its liqueur classification without breaking or leaving empty the strict wood-aging attributes of the `matured_spirits` branch.
2. **Resolved: Tequila and Mezcal Co-Location within Wood-Aged/Unaged Branches.** Tequila and Mezcal are handled within the single cross-cutting Matured/Rectified process split based purely on aging status rather than material base alone. This safeguards the physical process details (like smoky pit-roasting via `distillation_purity`) without fracturing or duplicating the root `spirit_type` identifiers.
3. **Resolved: Nine-Branch Collapse.** The previous architecture using nine distinct branches was abandoned because it forced structural replication of identical aging schemas across six different sibling leaves, violating the core process-vs-property governance rule.
4. **Resolved: Global Namespace Sync.** Parent property rewritten to reference the singular `beverage` node, bringing spirits into absolute lockstep with the non-alcoholic calculation pipeline rules outlined in `taxonomy-conventions.md`.
5. **Resolved: `mezcal-joven` dropped from `rectified_spirits.style`.** Redundant with `joven` given `spirit_type` already disambiguates Tequila vs. Mezcal — keeping both risked "attribute intersection pollution," where a logically impossible record (`spirit_type: tequila` + `style: mezcal-joven`) could be constructed without any structural guard catching it.