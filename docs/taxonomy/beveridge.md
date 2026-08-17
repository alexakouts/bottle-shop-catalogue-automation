---
id: beverage
parent: null
label: Beverage
status: approved
owner: data-team
version: 1.1.0
---
# Beverage (root)
## Scope
The root node for the canonical product taxonomy. Covers fermented and distilled beverage products — specifically the alcoholic and non-alcoholic variants of the same four production families — not general beverages.
A soft drink or plain fruit juice with no alcoholic counterpart is strictly out of scope. A non-alcoholic beer, dealcoholised wine, or botanical zero-proof spirit alternative is explicitly in scope, as it maps directly to the same parent family using the cross-cutting `alcohol_status` facet.
Named `beverage` (singular) rather than `liquor` or `alcoholic-beverage` to ensure non-alcoholic extensions are structurally represented without semantic contradiction at the root node.
## Children
```yaml
children:
  - id: wine
    label: Wine
    file: wine.md
    notes: Grape-fermented base. Forks on Still/Sparkling process branches.
  - id: spirits
    label: Spirits
    file: spirits.md
    notes: >
      Distilled base. Consolidated into a three-branch process architecture 
      (Matured/Wood-Aged, Rectified/Unaged, Liqueurs & Cordials) to prevent 
      identical attribute duplication across distinct material bases.
  - id: beer
    label: Beer
    file: beer.md
    notes: >
      Grain-fermented base. Completely flat single schema. Features like 
      sour_or_wild are treated as conditional property facets rather than 
      structural tree branches.
  - id: cider
    label: Cider
    file: cider.md
    notes: >
      Apple/pear-fermented base (includes perry). Completely flat single schema. 
      Carbonation (sparkling) is handled as a conditional property flag, leaving 
      the `method` facet globally accessible to capture keeving on still items.
  - id: rtd
    label: Ready-To-Drink (RTD)
    file: rtd.md
    notes: >
      Blended retail format — cuts across Wine/Spirits/Beer/sugar-fermented
      bases, same justification pattern as Liqueurs in spirits.md. Flat
      schema, no branches. Cross-references spirits.md's Liqueurs
      categories for products like Aperol Spritz and Espresso Martini.
```
## Deferred / not yet drafted
*   **Mead** (honey-fermented) — Explicitly flagged out of scope for `beer.md`. Deferred to its own future `mead.md` peer file inheriting directly from `parent: beverage`.
## Cross-cutting facets
Fields that apply universally across every single child category, defined globally in `taxonomy-conventions.md` to prevent duplicate schema layout management:
*   `alcohol_status` (enum: `[alcoholic, low-alcohol, non-alcoholic, alcohol-free, unknown]`)
*   `dealcoholization_method` (enum: `[vacuum-distillation, spinning-cone, reverse-osmosis, arrested-fermentation, none, unknown, other]`)
## Governance rule applied
The process-vs-property test dictates that a structural fork at this root layer is justified because Wine, Spirits, Beer, and Cider are built on distinct base materials and production physics. Their respective core attribute profiles (e.g., hop varieties vs. distillation purity vs. oak aging designations) are completely meaningless if cross-applied to sibling branches.
Every child category inherits directly from `parent: beverage`, allowing non-alcoholic variants to cleanly retain their underlying style, ingredient, and process metadata.