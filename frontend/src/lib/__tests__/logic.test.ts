import { describe, it, expect } from "vitest";
import {
  getSurchargeEffectiveAt,
  getLatestPriceByFuelTypeOnOrBeforeDate,
  getLatestPriceByFuelTypeAt,
  normalizeDateInput,
} from "../fuelPrices";
import {
  inferContainerType,
  getContainerSurchargeFromPrice,
  buildProcessedRows,
  getReconciliationStatus,
  DIESEL_FUEL_TYPE,
  type ImportedOrderRow,
} from "../reconciliation";
import { VAT_MULTIPLIER } from "../constants";
import type { FuelPrice, Tier } from "../../types";

const price = (date: string, priceV1: number, effectiveAt?: string): FuelPrice => ({
  id: date, date, priceV1, effectiveAt, fuelType: DIESEL_FUEL_TYPE,
});

const tiers: Tier[] = [
  { id: "1", minPrice: 0, maxPrice: 23000, surcharge20F: 0, surcharge40F: 0, surcharge20E: 0, surcharge40E: 0 },
  { id: "2", minPrice: 23001, maxPrice: 26000, surcharge20F: 50000, surcharge40F: 60000, surcharge20E: 35000, surcharge40E: 50000 },
  { id: "3", minPrice: 26001, maxPrice: 29000, surcharge20F: 100000, surcharge40F: 120000, surcharge20E: 70000, surcharge40E: 100000 },
];

describe("VAT", () => {
  it("hệ số VAT là 1.08", () => expect(VAT_MULTIPLIER).toBe(1.08));
});

describe("getSurchargeEffectiveAt — quy tắc mốc 08:00", () => {
  const at = (effectiveAt?: string, date = "2026-04-01") => getSurchargeEffectiveAt(price(date, 30000, effectiveAt));

  it("không có effectiveAt → 08:00 cùng ngày", () => {
    expect(at(undefined)).toBe("2026-04-01T08:00:00+07:00");
  });
  it("00:00:00 → 08:00 cùng ngày", () => {
    expect(at("2026-04-01T00:00:00+07:00")).toBe("2026-04-01T08:00:00+07:00");
  });
  it("giờ hành chính 08:00–16:59 → có hiệu lực đúng giờ đó", () => {
    expect(at("2026-04-01T15:00:00+07:00")).toBe("2026-04-01T15:00:00+07:00");
  });
  it("sáng sớm trước 08:00 → 08:00 cùng ngày", () => {
    expect(at("2026-04-01T05:00:00+07:00")).toBe("2026-04-01T08:00:00+07:00");
  });
  it("từ 17:00 trở đi → 08:00 ngày hôm sau (kể cả qua cuối tháng)", () => {
    expect(at("2026-04-01T23:30:00+07:00")).toBe("2026-04-02T08:00:00+07:00");
    expect(at("2026-04-30T22:00:00+07:00")).toBe("2026-05-01T08:00:00+07:00");
  });
});

describe("tra giá theo thời điểm", () => {
  const prices = [
    price("2026-04-03", 40820, "2026-04-03T15:00:00+07:00"),
    price("2026-04-01", 35440, "2026-04-01T08:00:00+07:00"),
    price("2026-04-04", 44780, "2026-04-03T23:00:00+07:00"), // 23h đêm 3/4 → áp dụng 08:00 ngày 4/4
  ];

  it("giá chỉnh lúc 15:00 ngày 3/4 chưa áp dụng cho lệnh làm 08:00 ngày 3/4", () => {
    expect(getLatestPriceByFuelTypeOnOrBeforeDate(prices, DIESEL_FUEL_TYPE, "2026-04-03")?.priceV1).toBe(35440);
  });
  it("lệnh lúc 16:00 ngày 3/4 đã chịu giá 40.820", () => {
    expect(getLatestPriceByFuelTypeAt(prices, DIESEL_FUEL_TYPE, "2026-04-03T16:00:00+07:00")?.priceV1).toBe(40820);
  });
  it("giá điều chỉnh 23h đêm 3/4 áp dụng từ 08:00 ngày 4/4", () => {
    expect(getLatestPriceByFuelTypeAt(prices, DIESEL_FUEL_TYPE, "2026-04-04T07:59:00+07:00")?.priceV1).toBe(40820);
    expect(getLatestPriceByFuelTypeAt(prices, DIESEL_FUEL_TYPE, "2026-04-04T08:00:00+07:00")?.priceV1).toBe(44780);
  });
  it("không có giá trước mốc → undefined", () => {
    expect(getLatestPriceByFuelTypeOnOrBeforeDate(prices, DIESEL_FUEL_TYPE, "2026-03-01")).toBeUndefined();
  });
});

describe("normalizeDateInput", () => {
  it("nhận dd/mm/yyyy kèm giờ và ISO", () => {
    expect(normalizeDateInput("01/04/2026 09:05:44")).toBe("2026-04-01");
    expect(normalizeDateInput("2026-4-1")).toBe("2026-04-01");
    expect(normalizeDateInput("")).toBeNull();
  });
});

describe("loại container & bậc phụ thu", () => {
  it("suy loại từ KC ISO + F/E, L5 tính là 40'", () => {
    expect(inferContainerType("22G1", "F")).toBe("20F");
    expect(inferContainerType("45G1", "E")).toBe("40E");
    expect(inferContainerType("L5G1", "FULL")).toBe("40F");
    expect(inferContainerType("", "F")).toBeUndefined();
    expect(inferContainerType("22G1", "")).toBeUndefined();
  });
  it("tra phụ thu theo bậc, biên bậc thuộc bậc dưới/trên đúng", () => {
    expect(getContainerSurchargeFromPrice(tiers, 23000, "20F")).toBe(0);
    expect(getContainerSurchargeFromPrice(tiers, 23001, "20F")).toBe(50000);
    expect(getContainerSurchargeFromPrice(tiers, 26001, "40E")).toBe(100000);
    expect(getContainerSurchargeFromPrice(tiers, 999999, "20F")).toBe(0); // ngoài mọi bậc
  });
  it("trạng thái chênh lệch", () => {
    expect(getReconciliationStatus(1)).toBe("increase");
    expect(getReconciliationStatus(-1)).toBe("decrease");
    expect(getReconciliationStatus(0)).toBe("same");
  });
});

describe("buildProcessedRows — đối soát", () => {
  const prices = [
    price("2026-04-01", 24000, "2026-04-01T08:00:00+07:00"), // bậc 2
    price("2026-04-03", 27000, "2026-04-03T08:00:00+07:00"), // bậc 3
  ];
  const order = (over: Partial<ImportedOrderRow>): ImportedOrderRow => ({
    orderNo: "A1", pin: "P1",
    bookingDate: "2026-04-01", bookingDateDisplay: "01/04/2026",
    bookingDateTime: "2026-04-01T09:00:00+07:00", bookingDateTimeDisplay: "01/04/2026 09:00:00",
    containerNumber: "ABCD1234567", isoCode: "22G1", fullEmpty: "F", note: "", containerType: "20F",
    ...over,
  });

  it("giá dầu tăng bậc → tăng phụ thu", () => {
    const [row] = buildProcessedRows([order({})], prices, tiers, "2026-04-03");
    expect(row.surchargeAtBooking).toBe(50000);
    expect(row.surchargeAtExecution).toBe(100000);
    expect(row.delta).toBe(50000);
    expect(row.status).toBe("increase");
  });
  it("ngày lệnh sau ngày thực hiện → 'missing', không tính chênh lệch", () => {
    const [row] = buildProcessedRows([order({ bookingDate: "2026-04-05", bookingDateTime: "2026-04-05T09:00:00+07:00" })], prices, tiers, "2026-04-03");
    expect(row.status).toBe("missing");
    expect(row.delta).toBeNull();
    expect(row.adjustmentLabel).toBe("Sai mốc ngày");
  });
  it("không suy được loại container → 'missing'", () => {
    const [row] = buildProcessedRows([order({ containerType: undefined })], prices, tiers, "2026-04-03");
    expect(row.status).toBe("missing");
  });
});
