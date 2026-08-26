import { parseCsv } from "./parsers/csv-parser.js";
import { processRows } from "./process-rows.js";

export function processCsv(csvText) {
  console.log("inside processCsv");
  const rows = parseCsv(csvText);
  const result = processRows(rows);

  console.log(
    `CSV processed: ${result.records.length} accepted, ${result.rejected.length} rejected`,
  );

  return result;
}
