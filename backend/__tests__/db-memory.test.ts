import { describe, it, expect } from "vitest";

// Không đặt DATABASE_URL → db.ts chọn chế độ in-memory.
describe("db.ts chọn backend theo biến môi trường", () => {
  it("không có DATABASE_URL → in-memory, không mở kết nối Postgres", async () => {
    const db = await import("../db.js");
    expect(db.isPostgres).toBe(false);
    expect(db.pool).toBeNull();
  });
});

describe("giá dầu (hợp đồng chung của db.ts)", () => {
  it("upsertPrice: 1 ngày = 1 giá; lần 2 là cập nhật, id giữ nguyên", async () => {
    const { upsertPrice, getAllPrices } = await import("../db.js");
    const a = await upsertPrice("2031-01-01", "Dầu DO 0,05S-II", 30000);
    const b = await upsertPrice("2031-01-01", "Dầu DO 0,05S-II", 31000);
    expect(a.inserted).toBe(true);
    expect(b.inserted).toBe(false);
    expect(b.id).toBe(a.id);
    const rows = (await getAllPrices()).filter((p: any) => p.date === "2031-01-01");
    expect(rows).toHaveLength(1);
    expect(rows[0].priceV1).toBe(31000);
  });

  it("publish/unpublish: chỉ 1 giá được ghim; id không tồn tại trả false", async () => {
    const { upsertPrice, publishPriceById, clearPublishedPrice, getAllPrices } = await import("../db.js");
    const p1 = await upsertPrice("2031-02-01", "Dầu DO 0,05S-II", 30000);
    const p2 = await upsertPrice("2031-02-02", "Dầu DO 0,05S-II", 30500);
    expect(await publishPriceById(Number(p1.id))).toBe(true);
    expect(await publishPriceById(Number(p2.id))).toBe(true);
    expect((await getAllPrices()).filter((p: any) => p.isPublished)).toHaveLength(1);

    // id lạ không được làm mất giá đang ghim
    expect(await publishPriceById(999_999_999)).toBe(false);
    expect((await getAllPrices()).filter((p: any) => p.isPublished)).toHaveLength(1);

    await clearPublishedPrice();
    expect((await getAllPrices()).filter((p: any) => p.isPublished)).toHaveLength(0);
  });

  it("setPriceValue: sửa đúng bản ghi, id lạ trả false", async () => {
    const { upsertPrice, setPriceValue, getAllPrices } = await import("../db.js");
    const p = await upsertPrice("2031-03-01", "Dầu DO 0,05S-II", 30000);
    expect(await setPriceValue(Number(p.id), 33333)).toBe(true);
    expect((await getAllPrices()).find((x: any) => x.id === p.id)?.priceV1).toBe(33333);
    expect(await setPriceValue(999_999_999, 1)).toBe(false);
  });

  it("hasPriceForDate", async () => {
    const { upsertPrice, hasPriceForDate } = await import("../db.js");
    await upsertPrice("2031-04-01", "Dầu DO 0,05S-II", 30000);
    expect(await hasPriceForDate("2031-04-01")).toBe(true);
    expect(await hasPriceForDate("2031-04-02")).toBe(false);
  });
});
