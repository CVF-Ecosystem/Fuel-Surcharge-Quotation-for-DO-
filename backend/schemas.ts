import { z } from "zod";
import express from "express";

export const USER_ROLES = ["admin", "thuongvu", "guest"] as const;

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required").max(200),
});

export const FallbackSchema = z.object({
  price: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

// ─── Users ────────────────────────────────────────────────────────────────────
export const CreateUserSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(200),
  displayName: z.string().trim().max(100).optional().default(""),
  role: z.enum(USER_ROLES),
});

export const UpdateUserSchema = z.object({
  displayName: z.string().trim().max(100).optional().default(""),
  role: z.enum(USER_ROLES),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(200).optional().or(z.literal("").transform(() => undefined)),
});

// ─── Fuel price ───────────────────────────────────────────────────────────────
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải có dạng YYYY-MM-DD");
// Giá dầu (VND/lít) lưu INTEGER; chặn NaN, số âm và giá vô lý.
const FuelPriceValue = z.coerce.number().int("Giá phải là số nguyên").min(1000).max(1_000_000);

export const PriceUpsertSchema = z.object({
  date: IsoDate,
  fuelType: z.string().trim().min(1).max(50).optional(),
  priceV1: FuelPriceValue,
});

export const PriceEditSchema = z.object({ priceV1: FuelPriceValue });

// ─── Bảng dữ liệu (POST /api/<bảng> ghi đè cả bảng) ───────────────────────────
// Lenient có chủ đích: chỉ chặn dữ liệu chắc chắn làm hỏng DB/tính toán,
// còn lại giữ nguyên field lạ (passthrough) để không phá payload frontend hiện có.
const num = z.coerce.number().finite();
const nonNeg = z.coerce.number().finite().min(0);
const str = z.string().nullish();

const PriceRow = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  fuelType: z.string().max(50).nullish(),
  priceV1: FuelPriceValue,
  effectiveAt: str,
  isPublished: z.boolean().nullish(),
}).passthrough();

const TierRow = z.object({
  minPrice: nonNeg,
  maxPrice: nonNeg,
  surcharge20F: nonNeg.nullish(),
  surcharge40F: nonNeg.nullish(),
  surcharge20E: nonNeg.nullish(),
  surcharge40E: nonNeg.nullish(),
}).passthrough().refine(t => Number(t.maxPrice) >= Number(t.minPrice), { message: "maxPrice phải ≥ minPrice" });

const BulkTierRow = z.object({
  minPrice: nonNeg,
  maxPrice: nonNeg,
  percentSurcharge: nonNeg.max(100).nullish(),
}).passthrough().refine(t => Number(t.maxPrice) >= Number(t.minPrice), { message: "maxPrice phải ≥ minPrice" });

const CustomerRow = z.object({ name: z.string().min(1).max(255) }).passthrough();
const ServiceRow = z.object({ name: z.string().min(1).max(255), price: nonNeg.nullish() }).passthrough();
const RegistrationServiceRow = z.object({ name: z.string().min(1).max(255) }).passthrough();

const QuotationRow = z.object({
  total: num.nullish(),
  items: z.array(z.object({ quantity: num.nullish(), price: num.nullish(), total: num.nullish() }).passthrough()).nullish(),
}).passthrough();

const RegistrationRow = z.object({
  items: z.array(z.object({ quantity: num.nullish() }).passthrough()).nullish(),
}).passthrough();

const ReconLogRow = z.object({
  delta: num.nullish(),
  fuelPriceAtBooking: num.nullish(),
  fuelPriceNow: num.nullish(),
  surchargeAtBooking: num.nullish(),
  surchargeNow: num.nullish(),
}).passthrough();

const MAX_ROWS = 20_000;

const rowSchemas: Record<string, z.ZodType<any>> = {
  prices: PriceRow,
  tiers: TierRow,
  bulk_tiers: BulkTierRow,
  customers: CustomerRow,
  services: ServiceRow,
  registration_services: RegistrationServiceRow,
  quotations: QuotationRow,
  registrations: RegistrationRow,
  reconciliation_logs: ReconLogRow,
};

export const CrudArraySchema = z.array(z.record(z.string(), z.unknown())).max(MAX_ROWS);

/** Schema cho cả bảng `key` (mảng các dòng đã kiểm tra). */
export function tableSchema(key: string): z.ZodType<any[]> {
  const row = rowSchemas[key];
  return (row ? z.array(row) : z.array(z.record(z.string(), z.unknown()))).max(MAX_ROWS) as z.ZodType<any[]>;
}

export function validateBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
  res: express.Response
): T | null {
  const result = schema.safeParse(body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Dữ liệu gửi lên không hợp lệ.",
      errors: result.error.flatten(),
    });
    return null;
  }
  return result.data;
}
