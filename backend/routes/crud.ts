import { Router } from "express";
import type { Request, Response } from "express";
import {
  TABLE_GETTERS, TABLE_SETTERS,
  upsertPrice, setPriceValue, publishPriceById, clearPublishedPrice,
} from "../db.js";
import { logAudit } from "../config.js";
import { PriceEditSchema, PriceUpsertSchema, tableSchema, validateBody } from "../schemas.js";
import { verifyToken } from "./auth.js";
import { extractBearerToken } from "../utils/sessions.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const DEFAULT_FUEL_TYPE = "Dầu DO 0,05S-II";

/** Trả 401 và false nếu chưa đăng nhập. */
function requireAuth(req: Request, res: Response, message = "Unauthorized"): boolean {
  if (verifyToken(extractBearerToken(req.headers.authorization))) return true;
  res.status(401).json({ success: false, message });
  return false;
}

const fmt = (n: number) => n.toLocaleString("vi-VN");

// ─── Single price upsert (1 date = 1 price) ─────────────────────────────────
router.post("/prices/upsert", asyncHandler(async (req, res) => {
  if (!requireAuth(req, res)) return;
  const body = validateBody(PriceUpsertSchema, req.body, res);
  if (!body) return;

  const { date, priceV1 } = body;
  const result = await upsertPrice(date, body.fuelType || DEFAULT_FUEL_TYPE, priceV1);

  const action = result.inserted ? "Thêm" : "Cập nhật";
  await logAudit("ADMIN_PRICE", `${action} giá: ${fmt(priceV1)}đ ngày ${date}`);
  res.json({
    success: true,
    id: result.id,
    message: `✅ ${action} giá ${fmt(priceV1)}đ cho ngày ${date}.`,
  });
}));

// ─── Edit fuel price (only price, date stays) ────────────────────────────────
router.put("/prices/:id", asyncHandler(async (req, res) => {
  if (!requireAuth(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ." });
  }
  const body = validateBody(PriceEditSchema, req.body, res);
  if (!body) return;

  const found = await setPriceValue(id, body.priceV1);
  if (!found) {
    return res.status(404).json({ success: false, message: "Không tìm thấy giá cần sửa." });
  }
  await logAudit("ADMIN_PRICE", `Sửa giá ID ${id} → ${fmt(body.priceV1)}đ`);
  res.json({ success: true, message: `✅ Đã cập nhật giá thành ${fmt(body.priceV1)}đ.` });
}));

// ─── Publish / pin a fuel price ───────────────────────────────────────────────
router.put("/prices/:id/publish", asyncHandler(async (req, res) => {
  if (!requireAuth(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false, message: "ID không hợp lệ." });
  }
  const found = await publishPriceById(id);
  if (!found) {
    return res.status(404).json({ success: false, message: "Không tìm thấy giá cần ghim." });
  }
  await logAudit("ADMIN_PRICE", `Ghim giá ID ${id} lên Trang chủ`);
  res.json({ success: true, message: `✅ Đã ghim giá lên Trang Chủ.` });
}));

// ─── Unpin (revert to latest = default) ───────────────────────────────────────
router.delete("/prices/publish", asyncHandler(async (req, res) => {
  if (!requireAuth(req, res)) return;
  await clearPublishedPrice();
  await logAudit("ADMIN_PRICE", `Bỏ ghim giá — dùng giá mới nhất`);
  res.json({ success: true, message: `✅ Đã bỏ ghim. Trang chủ sẽ hiển thị giá mới nhất.` });
}));

const protectedRoutes = [
  "prices", "tiers", "bulk_tiers", "customers", "services",
  "quotations", "audit", "reconciliation_logs", "registration_services", "registrations"
] as const;

const sensitiveKeys = new Set(["customers", "quotations", "registrations", "audit", "reconciliation_logs"]);

protectedRoutes.forEach(key => {
  const urlSegment = key.replace(/_/g, "-");
  const getter = TABLE_GETTERS[key];
  const setter = TABLE_SETTERS[key];

  router.get(`/${urlSegment}`, asyncHandler(async (req, res) => {
    if (sensitiveKeys.has(key) && !requireAuth(req, res, "Unauthorized. Vui lòng đăng nhập quyền Admin.")) return;
    const data = getter ? await getter() : [];
    res.json({ success: true, data });
  }));

  if (setter) {
    router.post(`/${urlSegment}`, asyncHandler(async (req, res) => {
      if (!requireAuth(req, res)) return;
      const data = validateBody(tableSchema(key), req.body, res);
      if (!data) return;
      await setter(data);
      if (["prices", "tiers", "bulk_tiers"].includes(key)) {
        await logAudit(`SYNC_${key.toUpperCase()}`, `Đồng bộ dữ liệu ${key} từ Admin`);
      }
      res.json({ success: true });
    }));
  }
});

export default router;
