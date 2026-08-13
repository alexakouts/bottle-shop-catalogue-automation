---
id: wine
parent: alcoholic-beverages
label: Wine
status: draft
owner: data-team
version: 0.1.0
---

# Wine

## Scope

Alcoholic beverages produced by fermentation of grapes (or other fruit, flagged separately). Split at the top level by production process — Still vs. Sparkling — per governance rule below. All other classification (color, sweetness, fortification, varietal, region) is modeled as attributes/facets, not tree branches, to avoid the color/method overlap problem (e.g. a sparkling rosé should not need to choose between a "Sparkling" branch and a "Rosé" branch).

## Governance rule applied

**Process vs. property test:** a taxonomy fork is justified only when the branch requires attributes that don't apply to its sibling (a genuine process difference). Color, sweetness, and fortification are properties — they apply the same way regardless of branch — so they stay as shared facets. Carbonation via secondary fermentation is a process difference — it introduces attributes (dosage, pressure, method) that are meaningless for still wine — so it justifies the top-level split.

- Fortification stays an attribute (not a fork): it adds one optional field (fortified_with, fortification_notes) without changing how color/sweetness/varietal behave. Same logic applied to spirits' Liqueur question — pending confirmation there.
- Fruit wine (non-grape) is out of scope for this file — flag for a separate `fruit-wine.md` or an attribute (`base_fruit`) if volume is low enough not to warrant its own taxonomy.

## Still vs. Sparkling boundary rule

The top-level split is based on the **finished product's declared/labeled style as sold** — how the wine is classified, labeled, and intended to be consumed — not the technical production process or measured CO2 level. This keeps the canonical model aligned to catalogue identity rather than production spec.

- A wine labeled and sold as sparkling (including pétillant/frizzante/pét-nat styles) is classified under **Sparkling Wine**, regardless of which production method produced the carbonation.
- `residual_co2_atm` (under Sparkling Wine, below) is an optional descriptive attribute for products where the producer publishes it — not a classification input.
- If a product's intended style is ambiguous or undeclared, default to the producer's own labeling/marketing category; this is a catalogue judgment call, not a lab measurement.

## Required-field policy

No field in this schema is `required: true`. Given real-world bottle-shop/POS data, forcing a required field either blocks valid ingestion or forces a placeholder value that looks like real data (worse than an explicit `unknown`). Instead, completeness/confidence is tracked as a separate concern (e.g. a data-quality or classification-confidence layer outside this schema), not enforced by the canonical taxonomy schema itself. Every field still has a defined `unknown`/sentinel representation (see global convention below) so "not yet classified" is always expressible.

## Shared facets (apply to both Still and Sparkling)

```yaml
facets:
  color:
    type: enum
    values: [red, white, rosé, orange, unknown]
    required: false
    default: unknown
  sweetness:
    type: enum
    values: [bone-dry, dry, off-dry, medium-sweet, sweet, dessert, unknown]
    required: false
    default: unknown
  fortified:
    type: enum
    values: [true, false, unknown]
    required: false
    default: unknown
    notes: >
      Changed from boolean to tri-state enum — a plain boolean
      cannot represent "not yet classified" without conflating it
      with false, which would be an incorrect assertion, not a
      gap in data.
  fortification_notes:
    type: string
    required: false
    depends_on: fortified=true
  varietal:
    type: array
    item_type: string
    notes: >
      Single varietal or blend components. Use the literal sentinel
      string "unknown" as the sole array element when source data
      doesn't specify varietal — do not leave the array empty/null.
    required: false
    default: ["unknown"]
  region:
    type: string
    notes: >
      Broad geographic origin, e.g. "Barossa Valley", "Yarra Valley",
      "Champagne". Distinct from appellation — region is descriptive
      geography, appellation (below) is a formal legal designation.
      Use literal string "unknown" when not specified in source data.
    required: false
    default: unknown
  appellation:
    type: string
    notes: >
      Formally defined/protected designation, e.g. "Champagne AOC",
      "Barossa Valley GI", "Chianti Classico DOCG", "Napa Valley AVA".
      May be more specific than region, or absent entirely for
      products with no protected designation (not all wine has one —
      use "unknown" only for missing source data, and consider a
      distinct "not_applicable" sentinel if the product genuinely
      has no appellation, e.g. a generic table wine).
    required: false
    default: unknown
  vintage:
    type: number
    notes: null/omit for non-vintage
    required: false
  abv:
    type: number
    unit: percent
    required: false
  bottle_size_ml:
    type: number
    required: false
  country_of_origin:
    type: string
    notes: Use literal string "unknown" when not specified in source data.
    required: false
    default: unknown
```

## Hierarchy

```yaml
children:
  - id: still-wine
    label: Still Wine
    definition: >
      Wine labeled and sold as a still (non-sparkling) product.
      This is the default/majority branch. All shared facets
      apply directly, no additional branch-specific attributes.

  - id: sparkling-wine
    label: Sparkling Wine
    notes: >
      Carbonated via secondary fermentation (traditional/method
      champenoise) or tank method (Charmat), or via CO2 injection
      for lower-tier products — method matters for attribute
      accuracy and should not be assumed.
    attributes:
      - name: method
        type: enum
        values: [traditional, charmat, transfer, ancestral, carbonated, unknown]
        required: false
        default: unknown
        notes: >
          'unknown' is an explicit, valid classification — not a
          placeholder for missing data handling. Use it whenever
          source data (POS/raw catalogue feed) doesn't specify
          method rather than leaving the field null or guessing.
      - name: dosage
        type: enum
        values:
          [
            brut-nature,
            extra-brut,
            brut,
            extra-dry,
            dry,
            demi-sec,
            doux,
            unknown,
          ]
        notes: standard Champagne-style dosage scale; map/extend for non-Champagne regions if needed
        required: false
      - name: pressure_atm
        type: number
        required: false
```

## Governance notes / open questions

- **Global convention (applies beyond this file)**: every classification enum across the taxonomy — in this file and all future ones (Spirits, Beer, etc.) — must include an explicit `unknown` value, with `unknown` as the default. For string/array-typed fields that can't use an enum (`varietal`, `region`, `country_of_origin`), the same principle applies via a **literal `"unknown"` sentinel string** (or `["unknown"]` for arrays) rather than null/empty — chosen over a separate `is_classified` flag or making fields optional, to keep "not yet classified" queryable and consistent across both enum and free-text fields without doubling the schema's field count. This is not a data-quality workaround; incoming POS/raw catalogue data frequently lacks enough detail for an authoritative classification, and the canonical model needs to represent "not yet classified" as a distinct, legitimate state rather than forcing a guess, a null, or an incorrect default (e.g. `fortified: false` when fortification status is simply unrecorded). Boolean-typed attributes should be reconsidered as tri-state enums (`[true, false, unknown]`) for the same reason — see `fortified` above. This convention should be documented once at the root (`alcoholic-beverages` level or a shared conventions doc) rather than repeated per file once Spirits/Beer are drafted.
- **Resolved: Champagne/Cava/Prosecco/Crémant are not canonical taxonomy nodes.** They are appellation identities, not structural/process differences, so they're represented via the `appellation` (+ `region`, `country_of_origin`) attributes on Sparkling Wine rather than as tree children — e.g. Champagne = `{region: "Champagne", appellation: "Champagne AOC", country_of_origin: "France"}`. Sparkling Wine is kept flat with no children. If storefronts want "Champagne" as a browsable category, that's a presentation-layer mapping keyed off `appellation`/`region`, not a canonical taxonomy branch — consistent with the original canonical-vs-presentation split for this whole project.
- **Orange wine**: included as a `color` value here (skin-contact white wine) — confirm this is sufficient vs. needing its own attribute for skin-contact duration.
- **Fruit wine**: explicitly out of scope, flagged above — needs a decision before Beer/Cider boundaries are drawn, since some fruit wines overlap conceptually with cider.
- **Open from Spirits thread**: whether Liqueur (Spirits) follows the same "stays as attribute" logic as Fortified here — apply the same process-vs-property test when revisiting `spirits.md`.
