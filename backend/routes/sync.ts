import { Router } from "express";
import { pool } from "../db.js";
import { getFallbackConfig, saveFallbackConfig, logAudit } from "../config.js";
import { FallbackSchema, validateBody } from "../schemas.js";
import { internalSyncLogic, syncAndSave, clearCache, cronSync } from "../scrapers/petrolimex.js";
import { verifyToken } from "./auth.js";
import { extractBearerToken } from "../utils/sessions.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const isAuthed = (authorization: string | undefined) => Boolean(verifyToken(extractBearerToken(authorization)));

// ─── Health ───────────────────────────────────────────────────────────────────
router.get("/health", async (_req, res) => {
  try {
    if (pool) {
      await pool.query("SELECT 1");
      res.json({ status: "UP", storage: "POSTGRESQL", timestamp: new Date().toISOString() });
    } else {
      res.json({ status: "UP", storage: "MEMORY", timestamp: new Date().toISOString() });
    }
  } catch (e: any) {
    res.status(500).json({ status: "DOWN", error: e.message });
  }
});

// ─── Fallback config ──────────────────────────────────────────────────────────
router.get("/fallback", asyncHandler(async (_req, res) => {
  const cfg = await getFallbackConfig();
  res.json({ success: true, data: cfg });
}));

router.post("/fallback", asyncHandler(async (req, res) => {
  if (!isAuthed(req.headers.authorization)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const body = validateBody(FallbackSchema, req.body, res);
  if (!body) return;
  const { price, date } = body;
  const saved = await saveFallbackConfig(price, date);
  if (saved) {
    await logAudit("UPDATE_FALLBACK", `Đổi giá dự phòng thành ${price} ngày ${date}`);
    res.json({ success: true, message: "Cập nhật fallback thành công." });
  } else {
    res.status(500).json({ success: false, message: "Lỗi ghi dữ liệu." });
  }
}));

// ─── Petrolimex scraper (read-only, does not save) ────────────────────────────
// Ai cũng đọc được kết quả đã cache (6h). Bỏ qua cache (force=true) buộc server
// gọi ra Petrolimex nên chỉ cho người đã đăng nhập, tránh bị lợi dụng spam.
router.get("/petrolimex-sync", asyncHandler(async (req, res) => {
  const wantsForce = req.query.force === "true";
  const force = wantsForce && isAuthed(req.headers.authorization);
  const result = await internalSyncLogic(force);
  res.json(result);
}));

// ─── Petrolimex sync + save to database ───────────────────────────────────────
router.post("/petrolimex-sync", asyncHandler(async (req, res) => {
  if (!isAuthed(req.headers.authorization)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const result = await syncAndSave(true);
  res.json(result);
}));

router.post("/petrolimex-sync/clear-cache", (req, res) => {
  if (!isAuthed(req.headers.authorization)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  clearCache();
  console.log("[Petrolimex Scraper] Cache đã bị xóa thủ công.");
  res.json({ success: true, message: "Cache đã xóa." });
});

// ─── Cron sync (external trigger) ─────────────────────────────────────────────
router.get("/cron/sync", asyncHandler(async (req, res) => {
  const CRON_SECRET = process.env.CRON_SECRET || "logipro_cron_2026";
  if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
    console.warn("[Cron] ❌ Truy cập trái phép vào endpoint Cron");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const result = await syncAndSave(true);
    res.json(result);
  } catch (e: any) {
    console.error("[Cron] 🛑 Lỗi:", e.message);
    await logAudit("CRON_SYNC_ERROR", `Lỗi cào tự động: ${e.message}`);
    res.status(500).json({ success: false, message: e.message });
  }
}));

export { cronSync };
export default router;
