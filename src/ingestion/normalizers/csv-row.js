const NUMERIC_FIELDS = ["abv", "liquidVolumeMl", "packQuantity"];

export function normalizeCsvRow(row) {
  const normalized = {};

  for (const [key, value] of Object.entries(row)) {
    normalized[key] = value === "" ? undefined : value;
  }

  for (const field of NUMERIC_FIELDS) {
    if (normalized[field] !== undefined) {
      normalized[field] = Number(normalized[field]);
    }
  }

  return normalized;
}
