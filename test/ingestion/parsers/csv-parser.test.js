// test/ingestion/parsers/csv-parser.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCsv } from "../../../src/ingestion/parsers/csv-parser.js";

test("parses CSV content into row objects", () => {
  const csv = `brand,category,alcoholStatus,type,fermentationType,style,gtin,sku,abv,liquidVolumeMl,packQuantity,containerType
Example Brewing,beer,alcoholic,,ale,ipa,09312345678901,IPA-375-6,6.2,375,6,can
Example Winery,wine,alcoholic,still,,,09312345678902,WINE-750,13.5,750,1,bottle`;

  const rows = parseCsv(csv);

  assert.equal(rows.length, 2);

  assert.deepEqual(rows[0], {
    brand: "Example Brewing",
    category: "beer",
    alcoholStatus: "alcoholic",
    type: "",
    fermentationType: "ale",
    style: "ipa",
    gtin: "09312345678901",
    sku: "IPA-375-6",
    abv: "6.2",
    liquidVolumeMl: "375",
    packQuantity: "6",
    containerType: "can",
  });
});
