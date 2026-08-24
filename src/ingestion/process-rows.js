import { ingestBeverage } from "./ingest-beverage.js";
import { normalizeCsvRow } from "./normalizers/csv-row.js";

export function processRows(rows) {
  const records = [];
  const rejected = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const normalizedRow = normalizeCsvRow(row);
    const result = ingestBeverage(normalizedRow);

    if (result.ok) {
      records.push(result.record);
    } else {
      rejected.push({
        rowNumber,
        errors: result.errors,
      });
    }
  });

  return {
    records,
    rejected,
  };
}
