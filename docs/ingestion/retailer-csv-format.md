# Retailer CSV Format

## Purpose

This document defines the CSV file-exchange contract used by retailers to submit beverage catalogue data for ingestion.

The format is intentionally standardised. Retailer files must conform to this contract rather than defining retailer-specific column names or representations.

## Version

**Contract version:** 1

## Record Model

Each CSV row represents one beverage and one sellable variant.

During ingestion, each valid row is transformed into the canonical:

- Beverage
- Variant

domain records.

A beverage with multiple sellable variants may therefore appear in multiple rows.

## File Requirements

Files must:

- use CSV format;
- use UTF-8 encoding;
- contain a header row;
- contain the complete column set defined below;
- use the exact canonical column names;
- contain one sellable variant per row.

All defined columns must be present even when a field is not applicable to a particular beverage category.

Category-irrelevant and optional values must be represented by an empty field.

Values such as `N/A`, `null`, `-`, or similar placeholders must not be used.

Additional or unknown columns are not permitted in version 1.

## Column Definition

The required header is:

```csv
brand,category,alcoholStatus,type,fermentationType,style,gtin,sku,abv,liquidVolumeMl,packQuantity,containerType
```

| Column             | Representation   | Requirement                                  |
| ------------------ | ---------------- | -------------------------------------------- |
| `brand`            | String           | Required                                     |
| `category`         | Canonical enum   | Required                                     |
| `alcoholStatus`    | Canonical enum   | Required                                     |
| `type`             | Canonical enum   | Required where applicable; blank for Beer    |
| `fermentationType` | Canonical enum   | Required for Beer; otherwise blank           |
| `style`            | Canonical enum   | Required for Beer; otherwise blank           |
| `gtin`             | String of digits | Required when SKU does not provide identity  |
| `sku`              | String           | Required when GTIN does not provide identity |
| `abv`              | Number           | Required                                     |
| `liquidVolumeMl`   | Number           | Required                                     |
| `packQuantity`     | Positive integer | Required                                     |
| `containerType`    | Canonical enum   | Optional                                     |

At least one of `gtin` or `sku` must provide the retail identity required by the Variant.

## Numeric Values

Numeric fields must contain the value only.

Do not include units, symbols, or descriptive text.

Correct:

```text
6.2
375
6
```

Incorrect:

```text
6.2%
375ml
6-pack
```

`abv` represents the alcohol percentage directly. For example, an ABV of 6.2% is represented as:

```text
6.2
```

`liquidVolumeMl` is always expressed in millilitres.

`packQuantity` represents the number of individual containers in the sellable variant. A single bottle or can must explicitly use:

```text
1
```

## GTIN

GTIN is treated as a string, not as a number.

Leading zeroes must be preserved.

Example:

```text
09312345678901
```

Applications processing the CSV must not perform numeric conversion on this field.

## Category-Specific Fields

### Beer

Beer uses `fermentationType` and `style`.

`type` must be blank.

Example:

```csv
Example Brewing,beer,alcoholic,,ale,ipa,09312345678901,IPA-375-6,6.2,375,6,can
```

### Wine

Wine uses `type`.

`fermentationType` and `style` must be blank.

### Spirits

Spirits use `type`.

`fermentationType` and `style` must be blank.

### RTD

RTD uses `type`.

`fermentationType` and `style` must be blank.

### Cider

Cider uses `type`.

`fermentationType` and `style` must be blank.

## Empty Fields

An empty CSV field represents a value that is not supplied or not applicable.

For example:

```csv
Example Winery,wine,alcoholic,still,,,09312345678902,WINE-750,13.5,750,1,bottle
```

The ingestion layer converts applicable empty fields into `undefined` before canonical domain validation.

## Canonical Values

Fields backed by domain enums must use their canonical values exactly.

The authoritative allowed values are defined by the corresponding domain schemas under:

```text
src/domain/schemas/
```

The CSV contract does not introduce alternative retailer-specific spellings or aliases.

For example, if the canonical value is:

```text
alcoholic
```

the retailer must not supply alternatives such as:

```text
Alcohol
Alcoholic Beverage
ALC
```

## Processing Boundary

The ingestion flow is:

```text
Retailer CSV
    ↓
CSV parser
    ↓
CSV rows
    ↓
CSV row normalisation
    ↓
Canonical candidate
    ↓
ingestBeverage()
    ↓
Beverage + Variant
```

The CSV parser is responsible only for parsing the CSV representation.

The normalisation layer converts CSV string representations into the JavaScript values expected by the canonical domain model.

The domain layer remains responsible for determining whether a Beverage and Variant are valid.

## Validation Behaviour

A valid row produces one canonical Beverage/Variant result.

An invalid row is rejected with validation information.

A rejected row does not prevent other valid rows in the same file from being processed.

The file-processing result therefore contains both:

```text
records
rejected
```

where `records` contains successfully constructed canonical Beverage/Variant records and `rejected` contains source rows that could not cross the canonical validation boundary.
