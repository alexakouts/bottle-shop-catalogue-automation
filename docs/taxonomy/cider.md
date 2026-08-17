---
id: cider
parent: beverage
label: Cider
status: draft-final
owner: data-team
version: 1.0.0
---

# Cider

## Scope

Fermented apple and pear juice beverages. Pear-based product exists and is sold under its own name — **perry** — but cider's defining base is apple; perry is treated as a labeled variant sharing the identical file schema rather than an equal alternate.

Sibling to `wine.md`, `spirits.md`, `beer.md`, and `rtd.md` under the global `beverage` root. It is explicitly not nested under Beer (juice-fermented, not grain-fermented) and not nested under Wine (different base fruit handling and a distinct commercial retail identity).

## Governance Rule Applied

**The Attribute Relevance Test:** A structural taxonomy fork is justified only when a proposed branch requires a cluster of unique fields that are completely meaningless to its structural siblings.

- **Still vs. Sparkling is NOT a fork:** Originally branched, this carbonation split was collapsed into a conditional property set. Cider's carbonation attribute footprint is simple (`method` and `pressure_atm`), meaning the case for a hard type-level fork is weak. Furthermore, collapsing the fork leaves the `method` facet universally accessible, allowing the ingestion pipeline to cleanly record heritage production techniques like **keeving** on still ciders without schema validation errors.
- **Perry is NOT a fork:** Pear-based cider utilizes the identical production process as apple cider and requires no unique fields. It is captured cleanly via the `base_fruit` facet rather than fracturing the tree.

## Required-Field Policy

In strict alignment with Section 1 of `taxonomy-conventions.md`, no enrichment or classification field in this schema is marked `required: true`. Forcing required fields on raw, unstructured supplier or POS data blocks ingestion or forces data entry teams to guess values. Completeness and confidence are tracked as independent quality metrics downstream.

---

## Shared Facets (Apply across all Cider products)

```yaml
facets:
  base_fruit:
    type: enum
    values: [apple, pear, blended, none, unknown, other]
    default: unknown
    notes: >
      Apple is the file's defining baseline. Pear signifies a traditional perry. 
      Blended applies strictly to apple and pear co-fermentations. True fruit 
      wines (e.g., 100% cherry or elderberry) are out of scope and deferred 
      to `fruit-wine.md`.
  sweetness:
    type: enum
    values: [bone-dry, dry, off-dry, medium-sweet, sweet, unknown, other]
    default: unknown
  style:
    type: enum
    values: [traditional, modern, heritage, ice-cider, unknown, other]
    default: unknown
    notes: >
      traditional = tannic orchard varieties; modern = dessert-apple bases; 
      ice-cider = cryo-concentrated via freeze processing.
  apple_varieties:
    type: array
    item_type: string
    default: ["unknown"]
  fruit_additions:
    type: array
    item_type: string
    default: []
    notes: >
      Secondary fruits used for flavoring (e.g., raspberry, blackcurrant), distinct 
      from the primary fermentable base juice. Free text array. Empty array 
      signifies a verified absence of fruit additions.
  fruit_category:
    type: array
    item_type: enum
    values: [berry, stone-fruit, tropical, citrus, pome-fruit, unknown, other]
    default: []
  fruit_addition_method:
    type: enum
    values:
      [
        co-fermented-juice,
        post-fermentation-juice,
        puree,
        natural-extract,
        none,
        unknown,
        other,
      ]
    default: none
  botanicals:
    type: array
    item_type: string
    default: []
    notes: Herbs, spices, or flowers used to infuse the product (e.g., ginger, hibiscus).
  fortified:
    type: enum
    values: [true, false, unknown]
    default: unknown
    notes: >
      Tri-state property adapting the design lineage established in wine.md. 
      Covers Pommeau-style products (cider blended with apple brandy).
  fortification_notes:
    type: string
    required: false
    depends_on: fortified=true
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
  gluten_free:
    type: enum
    values: [true, false, unknown]
    default: unknown
    notes: Tri-state property used to protect consumer health compliance lines.
  sparkling:
    type: enum
    values: [true, false, unknown]
    default: unknown
    notes: >
      Tri-state property. Governs whether pressure_atm is contextually valid. 
      Based on declared style as sold rather than raw lab measurements.
  method:
    type: enum
    values: [none, keeved, traditional, charmat, carbonated, unknown, other]
    default: unknown
    notes: >
      Deliberately NOT gated to sparkling=true. This ensures that traditional 
      keeving techniques can be tracked natively on sweet, still heritage ciders 
      without failing schema boundary checks.
  pressure_atm:
    type: number
    required: false
    depends_on: sparkling=true
    notes: Physical or labeled carbonation measurement, strictly gated to sparkling items.
```

---

## Design History & Resolved Notes

All items below are resolved — kept as an absolute log to preserve data team design intent and track structural reversals.

1.  **Resolved: Global Namespace Sync.** Parent property rewritten to reference the singular `beverage` node, bringing cider into absolute lockstep with the contiguous, mutually exclusive non-alcoholic calculation pipeline rules outlined in `taxonomy-conventions.md`.
2.  **Resolved: Still vs. Sparkling Flattening.** Reconsidered and reversed a top-level structural process branch fork. Carbonation is handled via a property flag (`sparkling`), leaving `method` universally accessible to preserve production provenance (like keeving) on still craft items.
3.  **Resolved: Ice Cider Placement.** Locked as a specific value inside the global `style` enum rather than a dedicated attribute node. While cryo-concentration is a massive process difference, it introduces no unique secondary fields that would otherwise sit empty for standard ciders.
