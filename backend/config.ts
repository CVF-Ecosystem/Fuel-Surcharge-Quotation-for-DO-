import crypto from "crypto";
import { getConfig, setConfig, insertAuditLog } from "./db.js";

// ─── Environment config ──────────────────────────────────────────────────────
export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/logipro";

// ─── Token generation helper ─────────────────────────────────────────────────
export function generateToken(username: string, passwordHash: string): string {
  return crypto.createHmac("sha256", passwordHash).update(username).digest("hex");
}

// ─── Fallback config ─────────────────────────────────────────────────────────
const DEFAULT_FALLBACK = { price: 35440, date: "2026-03-26" };

export async function getFallbackConfig(): Promise<{ price: number; date: string }> {
  try {
    const data = await getConfig("fallback");
    if (data) return data;
  } catch (e) {
    console.error("[DB] Error reading fallback config", e);
  }
  return DEFAULT_FALLBACK;
}

export async function saveFallbackConfig(price: number, date: string): Promise<boolean> {
  try {
    await setConfig("fallback", { price, date });
    return true;
  } catch (e) {
    console.error("[DB] Error saving fallback config", e);
    return false;
  }
}

// ─── Audit log ───────────────────────────────────────────────────────────────
export async function logAudit(action: string, details: string): Promise<void> {
  try {
    await insertAuditLog(action, details);
  } catch (e) {
    console.error("[DB] Audit log error", e);
  }
}
