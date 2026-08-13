---
id: taxonomy-conventions
label: Canonical Taxonomy Conventions
status: draft
owner: data-team
version: 0.1.0
---

# Canonical Taxonomy Conventions

Root-level governance conventions that apply across all canonical taxonomy files (`wine.md`, `spirits.md`, `beer.md`, and any future category). These should be referenced from individual taxonomy files rather than restated in each one.

## Canonical Taxonomy Conventions

### Schema validity vs. classification completeness

Canonical schema validity and classification completeness are separate concerns.

A product record may be valid against the canonical schema even when some classification or enrichment fields are unknown or unavailable.

Accordingly:

- `required: true` is reserved for fields that are structurally necessary for the canonical record to be valid.
- Missing enrichment data does not make a product invalid.
- Classification completeness is assessed separately through validation and data-quality rules.
- Publication requirements are also separate and may vary by retailer or target platform.
- Taxonomy files should not use `required: true` merely because a field is desirable for merchandising or enrichment.

### Unknown values

Where a classification value is genuinely unknown, the canonical model should prefer an explicit `unknown` sentinel where this improves processing, validation, or review.

`unknown` must mean that the value is not currently known. It must not be used as a substitute for `other`.

- `unknown` = insufficient information to classify.
- `other` = classification is known but falls outside the defined enumerated values.

### Validation layers

The application should distinguish between:

1. **Schema validity** — whether the record conforms to the canonical data model.
2. **Classification completeness** — whether sufficient taxonomy and attribute information has been established.
3. **Publication readiness** — whether the record satisfies retailer and target-platform requirements.
4. **Enrichment quality** — whether desirable product information is present.

These form a sequential processing pipeline. Each stage is an independent gate — a record can pass stage 1 and stop there indefinitely (valid but not yet classified, published, or enriched), or progress further as data improves over time. A record should never need to satisfy a later stage in order to be considered valid at an earlier one (e.g. classification completeness must never be a precondition for schema validity).

```
Canonical record valid?
        ↓
Classification complete?
        ↓
Publication ready?
        ↓
Enrichment quality?
```
