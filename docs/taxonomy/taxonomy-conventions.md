---
id: taxonomy-conventions
label: Canonical Taxonomy Conventions
status: draft-final
owner: data-team
version: 1.0.0
---

# Canonical Taxonomy Conventions

Root-level governance conventions that apply universally across all canonical taxonomy files (`beverage.md`, `wine.md`, `spirits.md`, `beer.md`, `cider.md`, and `rtd.md`). These rules dictate schema behavior, enum evolution, and validation pipeline mechanics.

---

## 1. Data Integrity & Validation Pipeline

The system enforces a strict distinction between structural data validity and catalog enrichment. A product record may be perfectly valid against the canonical schema even when critical merchandising or classification attributes are entirely missing.

Taxonomy files must **never** use `required: true` solely because an attribute is desirable for digital shelf merchandising or search engine optimization.

### The Sequential Processing Pipeline
Data flows through a strictly linear, four-stage processing pipeline. Each phase acts as an independent gateway. A later stage must **never** serve as a precondition for an earlier stage (e.g., a record does not need to be publication-ready to be considered schema-valid).

```text
[ Ingestion Influx ]
         ↓
 1. Schema Validity      → Rejects malformed rows (e.g., text in an ABV float field).
         ↓
 2. Classification Complete → Verifies taxonomy assignment and runtime dependencies.
         ↓
 3. Publication Ready    → Evaluates target retailer and e-commerce channel rules.
         ↓
 4. Enrichment Quality   → Audits optional marketing assets (tasting notes, imagery).
```

---

## 2. Universal Value Sentinels

To avoid null-pointer errors and silent data dropping during extract-transform-load (ETL) routines, schemas must handle missing or alternative information using explicit, mutually exclusive system sentinels.

*   **`unknown`**: Indicates a complete absence of source data. There is insufficient information to make a classification choice. This is the mandatory default for optional metadata fields.
*   **`other`**: Confirms that the product's data has been actively reviewed, and the attribute value is known, but it falls outside the system's pre-defined closed enumerations (e.g., an agave spirit made from a rare wild varietal not listed in the enum).
*   **`none`**: Confirms an explicit, verified absence of a property or ingredient (e.g., `fruit_additions: ["none"]` or `specific_base_spirit: none`). This represents an audited clean state, distinct from an unreviewed `unknown` state.

### The Tri-State Rule
Standard database booleans (`true/false`) are forbidden for classification fields that gate runtime validation rules. Schemas must instead utilize an explicit tri-state enumeration:
```yaml
type: enum
values: [true, false, unknown]
default: unknown
```
This forces the ingestion engine to acknowledge when a property's presence has not yet been audited, rather than silently defaulting an unreviewed field to `false`.

---

## 3. The Governance Test: Process vs. Property Forks

To prevent the taxonomy tree from splintering into endless unmaintainable sub-branches driven by retail shelf layout preferences (e.g., creating a separate branch for "Bourbon" or "Hard Seltzer"), the data team applies a strict architectural test:

> **The Attribute Relevance Test:** A structural fork (creating a new file or an internal branch node) is justified **only** when the proposed branch requires a cluster of unique structural fields that are completely meaningless to its structural siblings.

*   **Process Forks (Justified):** `wine.md` forks into `Still` vs `Sparkling` because sparkling production introduces a cluster of fields (`method`, `dosage`, `pressure_atm`) that cannot physically apply to standard still table wine.
*   **Property Facets (Collapsed):** `beer.md` collapses the Sour/Wild distinction into a property flag, and `spirits.md` collapses nine individual liquor styles into three broad process branches. Because a Sour IPA and a standard Hazy IPA both require hop and malt bill matrices, they remain on a single flat schema. The sour fields are turned on at runtime via conditional application logic (`depends_on: sour_or_wild=true`), rather than splitting the type system.

---

## 4. Cross-Cutting Core Facets

The root `beverage` entity handles common attributes across all categories to prevent repetitive definitions across the children leaves.

### Alcohol Status Matrix
All children schemas (Beer, Wine, Cider, Spirits, RTD) inherit from the parent `beverage` root. This means non-alcoholic (NA) product extensions remain on their parent production schemas rather than being exiled to an independent "NA Beverage" branch. An NA Beer retains its `style: ipa` and `malt_bill` metadata; its retail identity is adjusted globally via these two cross-cutting facets:

1.  **`alcohol_status`**
    *   `type`: enum
    *   `values`: `[alcoholic, low-alcohol, non-alcoholic, alcohol-free, unknown]`
    *   `default`: `unknown`
    *   `notes`: >
        Derived programmatically from `abv` at runtime. WARNING: Threshold
        boundaries are strictly jurisdiction-dependent and must be
        localized to regional statutory definitions before driving
        downstream compliance, age-gating, or excise logic. For standard
        global catalog routing, the fallback default calculation
        boundaries are defined as:
        *   `alcohol-free`: 0.0% ABV exactly. Absolute absence of ethanol.
        *   `non-alcoholic`: > 0.0% and < 0.5% ABV. Covers standard
            dealcoholised and micro-fermented products.
        *   `low-alcohol`: ≥ 0.5% and ≤ 1.2% ABV. Covers traditional light
            beer tiers and low-strength variants (localized to 1.15% or
            1.2% depending on region).
        *   `alcoholic`: > 1.2% ABV. Standard full-strength tax and
            age-restricted categories.
            These four ranges are mutually exclusive and contiguous — every
            `abv` value maps to exactly one tier, no boundary ambiguity.
2.  **`dealcoholization_method`**
    *   `type`: enum
    *   `values`: `[vacuum-distillation, spinning-cone, reverse-osmosis, arrested-fermentation, none, unknown, other]`
    *   `default`: `none`

---

## 5. Multi-Base Blends and Ungated Fields

When a retail product cuts across multiple traditional categories (such as an RTD Margarita containing both a spirit and a liqueur, or a canned Spritz blending wine and an aperitif bitter), the schema must prioritize **composition agility over strict hierarchical gating**.

Fields tracking composition modifiers (e.g., `specific_base_spirit` or `specific_base_liqueur`) must remain globally available and ungated by the primary `base_liquid_type` value.

```yaml
notes: >
  Composition modifiers are deliberately ungated at the schema level.
  This ensures that complex craft hybrids (e.g., wine-and-spirit blends) 
  can populate multiple parallel ingredient values simultaneously on a 
  single record without violating structural system dependencies.
```