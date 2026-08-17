---
id: wine
parent: beverage
label: Wine
status: draft-final
owner: data-team
version: 1.0.0
---

# Wine

## Scope

Alcoholic and non-alcoholic beverages produced exclusively by the fermentation of grapes. Split at the top level by production process — Still Wine vs. Sparkling Wine — per the governance rule below.

All other classifications (color, sweetness, fortification, varietal, geographic origin) are modeled as property attributes and facets rather than tree branches. This cleanly avoids the multi-tier overlap problem (e.g., a sparkling rosé does not need to choose between a "Sparkling" branch and a "Rosé" branch).

## Governance Rule Applied

**The Attribute Relevance Test:** A structural taxonomy fork is justified only when the proposed branch requires a cluster of unique fields that are completely meaningless to its structural siblings.

Color, sweetness, and fortification are properties — they apply identically regardless of carbonation — so they stay as shared root facets. Carbonation via secondary fermentation or pressurized tank methods is a genuine process difference. It introduces a highly specific cluster of attributes (`method`, `dosage`, `pressure_atm`) that are physically meaningless for still table wine, which rigorously justifies the top-level split.

*   **Fortification stays a property:** It adds a conditional field (`fortification_notes`) without altering how underlying color, sweetness, or varietal structures behave. This is a native, core wine pattern (originating here for Port/Sherry data models) and serves as the architectural blueprint adapted by `cider.md` for pommeau-style products.
*   **Fruit Wine Excluded:** Non-grape fruit fermentations (e.g., cherry wine, elderberry wine, blackberry wine) are strictly out of scope for this file. They cannot be routed to `cider.md` (which is restricted to apple and pear bases) and are explicitly deferred to a future, independent `fruit-wine.md` peer file.

## Still vs. Sparkling Boundary Rule

The top-level split is based strictly on the **finished product's declared/labeled style as sold** — how the wine is classified, marketed, and intended to be consumed — not on strict internal laboratory CO2 measurements. This keeps the canonical model aligned directly with retail catalog identity.

*   A wine labeled and sold as sparkling (including pétillant, frizzante, spumante, and pét-nat styles) is classified under the **Sparkling Wine** branch, regardless of the underlying production technique.
*   `pressure_atm` is an optional descriptive attribute for products where the producer publishes it — it is never used as an automated classification input.

## Required-Field Policy

In strict alignment with Section 1 of `taxonomy-conventions.md`, no enrichment or classification field in this schema is marked `required: true`. Forcing required fields on raw, unstructured supplier or POS data either completely blocks valid ingestion lines or forces data entry teams to guess values.

Completeness and digital shelf confidence are tracked as independent quality metrics downstream. Every field uses your established system sentinels to ensure that an unclassified state is cleanly and safely queryable.

---

## Shared Facets (Apply across all Wine products)

```yaml
facets:
  color:
    type: enum
    values: [red, white, rosé, orange, unknown, other]
    default: unknown
  sweetness:
    type: enum
    values: [bone-dry, dry, off-dry, medium-sweet, sweet, dessert, unknown, other]
    default: unknown
  fortified:
    type: enum
    values: [true, false, unknown]
    default: unknown
    notes: >
      Tri-state property. Standard database booleans are forbidden here to 
      prevent an unaudited field from silently defaulting to false.
  fortification_notes:
    type: string
    required: false
    depends_on: fortified=true
  varietal:
    type: array
    item_type: string
    default: ["unknown"]
    notes: >
      Single varietal or blend components. Uses the literal sentinel string 
      "unknown" as the sole array element when source data doesn't specify 
      composition — do not leave empty or null.
  region:
    type: string
    default: unknown
    notes: >
      Broad geographic origin (e.g., "Barossa Valley", "Marlborough"). Distinct 
      from legal appellations. Uses the string "unknown" when missing from source data.
  appellation:
    type: string
    default: unknown
    notes: >
      Formally defined/legally protected designation (e.g., "Chianti Classico DOCG", 
      "Napa Valley AVA"). Use "none" if a product has been explicitly audited 
      and confirmed to have no protected designation (e.g., a generic table wine).
  vintage:
    type: number
    notes: Omit or leave null for non-vintage (NV) products.
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
    default: unknown
```

---

## Hierarchy & Branch-Specific Nodes

```yaml
children:
  - id: still-wine
    label: Still Wine
    notes: >
      Wine labeled and sold as a still, non-sparkling product. This represents 
      the baseline default branch. All shared facets apply directly with no 
      additional branch-specific attributes required.

  - id: sparkling-wine
    label: Sparkling Wine
    notes: >
      Wine carbonated via secondary fermentation, tank methods, or direct CO2 injection.
    attributes:
      - name: method
        type: enum
        values: [traditional, charmat, transfer, ancestral, carbonated, unknown, other]
        default: unknown
        notes: >
          Explicit system sentinel. Populated when raw feeds do not specify the 
          carbonation technique, preventing forced structural guessing.
      - name: dosage
        type: enum
        values: [brut-nature, extra-brut, brut, extra-dry, dry, demi-sec, doux, unknown, other]
        default: unknown
        notes: Standard international sparkling scale.
      - name: pressure_atm
        type: number
        required: false
```

---

## Design History & Resolved Notes

All items below are resolved — kept as an absolute log to preserve data team design intent and track structural reversals.

1.  **Resolved: Root Namespace Alignment.** Parent reference switched from `alcoholic-beverages` to `beverage` to ensure compliance with the singular root convention. Non-alcoholic and dealcoholised wines are safely categorized under this single file utilizing global cross-cutting facets.
2.  **Resolved: Sentinel Completeness.** Added the explicit `other` sentinel to the `color`, `sweetness`, `method`, and `dosage` enums, satisfying the universal sentinel rules outlined in Section 2 of your conventions.
3.  **Resolved: Fortified Lineage Correction.** Corrected historical design documentation to reflect that fortification properties natively originated within `wine.md`, serving as the architectural pattern blueprint later inherited by `cider.md`.
4.  **Resolved: Fruit Wine Classification Gap.** Re-established the strict boundary isolating non-grape fruit wines from this schema, cleanly documenting that they are completely deferred to a future `fruit-wine.md` file rather than being incorrectly routed to the pomme-only `cider.md` layout.
