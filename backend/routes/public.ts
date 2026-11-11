import { Router } from "express";
import { getAllPrices, getAllTiers, getAllBulkTiers } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Public API chỉ đọc. Dùng các getter chung của db.ts nên chạy giống nhau
// trên PostgreSQL và in-memory (trước đây dùng SQL thô → memory mode luôn rỗng).
const router = Router();

type PriceRow = { id: number | string; date: string; effectiveAt?: string | null; fuelType: string; priceV1: number; isPublished?: boolean };
type TierRow = { minPrice: number | string; maxPrice: number | string; [k: string]: unknown };

/** Giá áp dụng hiện tại: ưu tiên giá đã ghim, nếu không thì giá mới nhất theo ngày. */
async function getCurrentPrice(): Promise<PriceRow | null> {
  const prices = (await getAllPrices()) as PriceRow[];
  const sorted = [...prices].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return sorted.find(p => p.isPublished) ?? sorted[0] ?? null;
}

const findTier = <T extends TierRow>(tiers: T[], price: number): T | null =>
  tiers.find(t => price >= Number(t.minPrice) && price <= Number(t.maxPrice)) ?? null;

// ─── GET /api/public/fuel-prices?limit=30 ────────────────────────────────────
router.get("/fuel-prices", asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 365);
  const prices = ((await getAllPrices()) as PriceRow[])
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, limit);
  res.json({ success: true, count: prices.length, data: prices });
}));

// ─── GET /api/public/fuel-prices/latest ──────────────────────────────────────
router.get("/fuel-prices/latest", asyncHandler(async (_req, res) => {
  const current = await getCurrentPrice();
  if (!current) {
    return res.status(404).json({ success: false, message: "Chưa có dữ liệu giá dầu" });
  }
  res.json({ success: true, data: current });
}));

// ─── GET /api/public/surcharge-tiers ─────────────────────────────────────────
router.get("/surcharge-tiers", asyncHandler(async (_req, res) => {
  const rows = await getAllTiers();
  res.json({ success: true, count: rows.length, data: rows });
}));

// ─── GET /api/public/surcharge-tiers/bulk ────────────────────────────────────
router.get("/surcharge-tiers/bulk", asyncHandler(async (_req, res) => {
  const rows = await getAllBulkTiers();
  res.json({ success: true, count: rows.length, data: rows });
}));

// ─── GET /api/public/surcharge-summary ───────────────────────────────────────
router.get("/surcharge-summary", asyncHandler(async (_req, res) => {
  const currentPrice = await getCurrentPrice();
  const priceValue = currentPrice ? Number(currentPrice.priceV1) : null;

  const containerTiers = (await getAllTiers()) as TierRow[];
  const bulkTiers = (await getAllBulkTiers()) as TierRow[];

  res.json({
    success: true,
    data: {
      currentFuelPrice: currentPrice,
      activeContainerTier: priceValue !== null ? findTier(containerTiers, priceValue) : null,
      activeBulkTier: priceValue !== null ? findTier(bulkTiers, priceValue) : null,
      containerTiers,
      bulkTiers,
    },
  });
}));

export default router;
