import { describe, it, expect, vi, beforeAll } from "vitest";

// ─── 1. Config module tests ─────────────────────────────────────────────────
describe("backend/config", () => {
  it("generateToken returns consistent HMAC hex", async () => {
    const { generateToken } = await import("../config.js");
    const token1 = generateToken("admin", "hash123");
    const token2 = generateToken("admin", "hash123");
    expect(token1).toBe(token2);
    expect(token1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("generateToken differs for different inputs", async () => {
    const { generateToken } = await import("../config.js");
    const t1 = generateToken("admin", "hash1");
    const t2 = generateToken("admin", "hash2");
    expect(t1).not.toBe(t2);
  });

  it("PORT defaults to 3000", async () => {
    const { PORT } = await import("../config.js");
    expect(PORT).toBe(3000);
  });
});

// ─── 2. Schemas validation tests ────────────────────────────────────────────
describe("backend/schemas", () => {
  it("LoginSchema accepts valid input", async () => {
    const { LoginSchema } = await import("../schemas.js");
    const result = LoginSchema.safeParse({ username: "admin", password: "pass123" });
    expect(result.success).toBe(true);
  });

  it("LoginSchema rejects empty username", async () => {
    const { LoginSchema } = await import("../schemas.js");
    const result = LoginSchema.safeParse({ username: "", password: "pass" });
    expect(result.success).toBe(false);
  });

  it("FallbackSchema accepts valid date and price", async () => {
    const { FallbackSchema } = await import("../schemas.js");
    const result = FallbackSchema.safeParse({ price: 35440, date: "2026-03-26" });
    expect(result.success).toBe(true);
  });

  it("FallbackSchema rejects invalid date format", async () => {
    const { FallbackSchema } = await import("../schemas.js");
    const result = FallbackSchema.safeParse({ price: 35440, date: "26-03-2026" });
    expect(result.success).toBe(false);
  });

  it("FallbackSchema rejects negative price", async () => {
    const { FallbackSchema } = await import("../schemas.js");
    const result = FallbackSchema.safeParse({ price: -100, date: "2026-03-26" });
    expect(result.success).toBe(false);
  });

  it("CrudArraySchema accepts array of objects", async () => {
    const { CrudArraySchema } = await import("../schemas.js");
    const result = CrudArraySchema.safeParse([{ id: "1", name: "test" }]);
    expect(result.success).toBe(true);
  });

  it("CrudArraySchema rejects non-array", async () => {
    const { CrudArraySchema } = await import("../schemas.js");
    const result = CrudArraySchema.safeParse({ id: "1" });
    expect(result.success).toBe(false);
  });
});

// ─── 3. Scraper module tests (pure functions) ───────────────────────────────
describe("backend/scrapers/petrolimex", () => {
  it("isCacheValid returns false when no cache exists", async () => {
    const { isCacheValid, clearCache } = await import("../scrapers/petrolimex.js");
    clearCache();
    expect(isCacheValid()).toBe(false);
  });

  it("clearCache resets cache state", async () => {
    const { isCacheValid, clearCache } = await import("../scrapers/petrolimex.js");
    clearCache();
    expect(isCacheValid()).toBe(false);
  });
});

// ─── 4. Auth route token management tests ───────────────────────────────────
describe("backend/routes/auth - verifyToken", () => {
  it("verifyToken returns null for unknown tokens", async () => {
    const { verifyToken } = await import("../routes/auth.js");
    expect(verifyToken("nonexistent-token")).toBeNull();
  });

  it("verifyToken returns null for empty string", async () => {
    const { verifyToken } = await import("../routes/auth.js");
    expect(verifyToken("")).toBeNull();
  });
});

// ─── 5. DB module structure tests ───────────────────────────────────────────
describe("backend/db - exports", () => {
  it("TABLE_GETTERS has all expected keys", async () => {
    const { TABLE_GETTERS } = await import("../db.js");
    const expectedKeys = [
      "prices", "tiers", "bulk_tiers", "customers", "services",
      "quotations", "audit", "reconciliation_logs",
      "registration_services", "registrations"
    ];
    for (const key of expectedKeys) {
      expect(TABLE_GETTERS).toHaveProperty(key);
      expect(typeof TABLE_GETTERS[key]).toBe("function");
    }
  });

  it("TABLE_SETTERS has expected keys (no setter for audit)", async () => {
    const { TABLE_SETTERS } = await import("../db.js");
    expect(TABLE_SETTERS).toHaveProperty("prices");
    expect(TABLE_SETTERS).toHaveProperty("tiers");
    expect(TABLE_SETTERS).toHaveProperty("customers");
    expect(TABLE_SETTERS).not.toHaveProperty("audit");
  });
});

// ─── 6. File structure integrity tests ──────────────────────────────────────
describe("project structure", () => {
  it("backend/schema.sql exists", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const schemaPath = path.join(import.meta.dirname, "..", "schema.sql");
    expect(fs.existsSync(schemaPath)).toBe(true);
  });

  it("schema.sql contains all 14 table definitions", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const schemaPath = path.join(import.meta.dirname, "..", "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf-8");
    const tables = [
      "users", "fuel_prices", "tiers", "bulk_tiers", "customers",
      "services", "quotations", "quotation_items", "reconciliation_logs",
      "registration_services", "registrations", "registration_items",
      "audit_logs", "app_config"
    ];
    for (const table of tables) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
  });

  it("frontend/index.html exists", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const htmlPath = path.join(import.meta.dirname, "..", "..", "frontend", "index.html");
    expect(fs.existsSync(htmlPath)).toBe(true);
  });

  it("frontend/src/App.tsx exists", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const appPath = path.join(import.meta.dirname, "..", "..", "frontend", "src", "App.tsx");
    expect(fs.existsSync(appPath)).toBe(true);
  });

  it("frontend/vite.config.ts exists", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const vitePath = path.join(import.meta.dirname, "..", "..", "frontend", "vite.config.ts");
    expect(fs.existsSync(vitePath)).toBe(true);
  });
});
