import { parseCsv } from "./parsers/csv-parser.js";
import { processRows } from "./process-rows.js";

export function processCsv(csvText) {
  const rows = parseCsv(csvText);
  return processRows(rows);
}
