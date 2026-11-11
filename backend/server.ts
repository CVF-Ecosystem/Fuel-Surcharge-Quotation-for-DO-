import express from "express";
import type { NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import { initDB, isPostgres, hasPriceForDate } from "./db.js";
import { PORT } from "./config.js";
import authRouter from "./routes/auth.js";
import crudRouter from "./routes/crud.js";
import syncRouter from "./routes/sync.js";
import publicRouter from "./routes/public.js";
import { cronSync } from "./scrapers/petrolimex.js";
import { getVietnamDateTimeParts, getVietnamTodayIsoDate } from "./utils/vietnamTime.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const FRONTEND_DIR = path.join(import.meta.dirname, "..", "frontend");

// Mount routers
app.use("/api/auth",   authRouter);
app.use("/api/public", publicRouter);
app.use("/api",        crudRouter);
app.use("/api",        syncRouter);

// /api/* không khớp route nào → 404 JSON (không rơi xuống SPA fallback, không treo request)
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// ─── Error handler: mọi lỗi từ route (kể cả async) và JSON body hỏng ─────────
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  if (res.headersSent) return;
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "JSON không hợp lệ." });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Dữ liệu quá lớn." });
  }
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  res.status(500).json({ success: false, message: err?.message || "Lỗi server" });
});

// Không để một promise bị bỏ quên làm sập server.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

// ─── Daily 6:00 AM (Vietnam time) Scheduler ─────────────────────────────────
function startDailyScheduler() {
  const SYNC_HOUR = 6;
  const SYNC_MINUTE = 0;

  function scheduleNext() {
    const now = new Date();
    const vn = getVietnamDateTimeParts(now);
    const pad = (n: number) => String(n).padStart(2, "0");

    let target = new Date(
      `${vn.year}-${pad(vn.month)}-${pad(vn.day)}T${pad(SYNC_HOUR)}:${pad(SYNC_MINUTE)}:00+07:00`
    );

    // If target is already past, schedule for tomorrow
    if (target.getTime() <= now.getTime()) {
      target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
    }

    const delay = target.getTime() - now.getTime();
    const nextStr = target.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    console.log(`[Scheduler] ⏰ Đồng bộ giá tiếp theo lúc ${nextStr} (sau ${Math.round(delay / 60000)} phút)`);

    setTimeout(async () => {
      try {
        await cronSync();
      } catch (e: any) {
        console.error(`[Scheduler] ❌ Lỗi không mong đợi khi chạy cronSync: ${e.message}`);
      }
      scheduleNext();
    }, delay);
  }

  scheduleNext();

  // ── Sync ngay khi khởi động nếu hôm nay chưa có giá ──────────────────────
  setTimeout(async () => {
    try {
      const today = getVietnamTodayIsoDate();
      if (!(await hasPriceForDate(today))) {
        console.log(`[Scheduler] 🚀 Khởi động: Chưa có giá ngày ${today} → Chạy sync ngay...`);
        await cronSync();
      } else {
        console.log(`[Scheduler] ✅ Khởi động: Đã có giá ngày ${today}, bỏ qua sync.`);
      }
    } catch (e: any) {
      console.error(`[Scheduler] ❌ Lỗi sync khi khởi động: ${e.message}`);
    }
  }, 5_000); // Đợi 5 giây cho server ổn định
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
async function bootstrap() {
  // 1. Init database (PostgreSQL hoặc In-Memory tùy DATABASE_URL, xem db.ts)
  await initDB();

  // 2. Seed default data — chỉ cần với PostgreSQL (memory mode đã có sẵn dữ liệu mẫu)
  if (isPostgres) {
    try {
      const { ensureSeeded } = await import("./seed.js");
      await ensureSeeded();
    } catch (e: any) {
      // Không chặn khởi động: DB có thể đã có dữ liệu, chỉ bước nạp mặc định lỗi.
      console.error("[DB] ❌ Seed dữ liệu mặc định thất bại:", e.message);
    }
  }

  // 3. Start daily price sync scheduler
  const vnNow = getVietnamDateTimeParts();
  console.log(`[Boot] TZ=${process.env.TZ || 'unset'} | UTC=${new Date().toISOString()} | VN=${vnNow.year}-${String(vnNow.month).padStart(2,'0')}-${String(vnNow.day).padStart(2,'0')} ${String(vnNow.hour).padStart(2,'0')}:${String(vnNow.minute).padStart(2,'0')}`);
  startDailyScheduler();

  // 4. Dev or production mode
  if (process.env.NODE_ENV !== "production") {
    const viteModule = await import("vite");
    const vite = await viteModule.createServer({
      root: FRONTEND_DIR,
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[DEV] Server running on http://localhost:${PORT}`);
    });
  } else {
    const distPath = path.join(FRONTEND_DIR, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[PRODUCTION] Server running on http://localhost:${PORT}`);
    });
  }
}

bootstrap().catch((err) => {
  console.error("[FATAL] Server failed to start:", err);
  process.exit(1);
});
