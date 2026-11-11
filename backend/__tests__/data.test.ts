import { describe, it, expect } from "vitest";
import { toIsoDate } from "../utils/dates.js";
import {
  CreateUserSchema,
  UpdateUserSchema,
  PriceUpsertSchema,
  PriceEditSchema,
  tableSchema,
} from "../schemas.js";

describe("toIsoDate", () => {
  it("giữ nguyên ISO và cắt phần giờ", () => {
    expect(toIsoDate("2026-04-10")).toBe("2026-04-10");
    expect(toIsoDate("2026-04-10T08:00:00+07:00")).toBe("2026-04-10");
  });
  it("đổi dd/mm/yyyy (vi-VN) sang ISO, kể cả ngày > 12", () => {
    expect(toIsoDate("25/12/2026")).toBe("2026-12-25");
    expect(toIsoDate("1/4/2026")).toBe("2026-04-01");
  });
  it("trả null với ngày không tồn tại hoặc rỗng", () => {
    expect(toIsoDate("31/02/2026")).toBeNull();
    expect(toIsoDate("2026-13-01")).toBeNull();
    expect(toIsoDate("")).toBeNull();
    expect(toIsoDate(null)).toBeNull();
    expect(toIsoDate("abc")).toBeNull();
  });
});

describe("schemas: users", () => {
  it("chặn mật khẩu quá ngắn và role lạ", () => {
    expect(CreateUserSchema.safeParse({ username: "a", password: "123", role: "guest" }).success).toBe(false);
    expect(CreateUserSchema.safeParse({ username: "a", password: "123456", role: "root" }).success).toBe(false);
    expect(CreateUserSchema.safeParse({ username: "a", password: "123456", role: "guest" }).success).toBe(true);
  });
  it("cập nhật user: mật khẩu rỗng nghĩa là không đổi", () => {
    const r = UpdateUserSchema.safeParse({ role: "guest", password: "" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.password).toBeUndefined();
  });
});

describe("schemas: giá dầu", () => {
  it("chặn NaN, âm, số thập phân, sai định dạng ngày", () => {
    expect(PriceEditSchema.safeParse({ priceV1: "abc" }).success).toBe(false);
    expect(PriceEditSchema.safeParse({ priceV1: -5 }).success).toBe(false);
    expect(PriceEditSchema.safeParse({ priceV1: 28690.5 }).success).toBe(false);
    expect(PriceEditSchema.safeParse({ priceV1: 28690 }).success).toBe(true);
    expect(PriceUpsertSchema.safeParse({ date: "11/11/2026", priceV1: 28690 }).success).toBe(false);
    expect(PriceUpsertSchema.safeParse({ date: "2026-11-11", priceV1: "28690" }).success).toBe(true);
  });
});

describe("schemas: ghi đè bảng", () => {
  it("tiers: chặn max < min và field không phải số", () => {
    const s = tableSchema("tiers");
    expect(s.safeParse([{ minPrice: 100, maxPrice: 50 }]).success).toBe(false);
    expect(s.safeParse([{ minPrice: "x", maxPrice: 50 }]).success).toBe(false);
    expect(s.safeParse([{ minPrice: 0, maxPrice: 23000, surcharge20F: 0 }]).success).toBe(true);
  });
  it("prices: giữ nguyên field lạ (passthrough) và ép kiểu số", () => {
    const r = tableSchema("prices").safeParse([{ id: "17", date: "2026-11-06", priceV1: "28690", isPublished: true, extra: 1 }]);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data[0].priceV1).toBe(28690);
      expect(r.data[0].extra).toBe(1);
    }
  });
  it("customers/services cần có name", () => {
    expect(tableSchema("customers").safeParse([{ name: "" }]).success).toBe(false);
    expect(tableSchema("services").safeParse([{ name: "Cước", price: -1 }]).success).toBe(false);
  });
  it("quotations: total/quantity không phải số bị chặn", () => {
    expect(tableSchema("quotations").safeParse([{ total: "abc" }]).success).toBe(false);
    expect(tableSchema("quotations").safeParse([{ total: 1000, items: [{ quantity: 2, price: 500, total: 1000 }] }]).success).toBe(true);
  });
});
