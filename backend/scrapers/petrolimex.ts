import axios from "axios";
import * as cheerio from "cheerio";
import { getFallbackConfig, logAudit } from "../config.js";
import { query, execute } from "../db.js";

// ─── Scraper cache ────────────────────────────────────────────────────────────
interface SyncResult {
  success: boolean;
  data: {
    fuelType: string;
    priceV1: number;
    date: string;
    effectiveDate: string;
    source: string;
    articleUrl: string;
    status: string;
    parsedFromWeb: boolean;
  };
}

interface ScraperCache { data: SyncResult; timestamp: number; }
let scraperCache: ScraperCache | null = null;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function isCacheValid(): boolean {
  return !!scraperCache && (Date.now() - scraperCache.timestamp) < CACHE_TTL_MS;
}

export function clearCache(): void {
  scraperCache = null;
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const FUEL_TYPE = "Dầu DO 0,05S-II";

function todayStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function extractDateFromTitle(title: string): string | null {
  const m = title.match(/ngày\s+(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/i);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return null;
}

// ─── Strategy 1: RSS Feed ─────────────────────────────────────────────────────
async function findLatestAdjustmentFromRSS(): Promise<{
  title: string; url: string; effectiveDate: string;
} | null> {
  try {
    const res = await axios.get("https://www.petrolimex.com.vn/rss", {
      headers: { "User-Agent": UA, "Accept": "application/atom+xml, application/xml, text/xml" },
      timeout: 15000,
    });
    const $ = cheerio.load(res.data, { xml: true });
    let found: { title: string; url: string; effectiveDate: string } | null = null;

    $("entry").each((_i, entry) => {
      if (found) return;
      const title = $(entry).find("title").text().trim();
      const link = $(entry).find("link[rel='alternate']").attr("href") || "";
      if (title.includes("điều chỉnh giá xăng dầu")) {
        const effectiveDate = extractDateFromTitle(title);
        if (effectiveDate) {
          found = { title, url: link, effectiveDate };
        }
      }
    });
    return found;
  } catch (e: any) {
    console.error("[Petrolimex Scraper] RSS error:", e.message);
    return null;
  }
}

// ─── Strategy 2: Press releases page ──────────────────────────────────────────
async function findLatestAdjustmentFromPressPage(): Promise<{
  title: string; url: string; effectiveDate: string;
} | null> {
  try {
    const res = await axios.get("https://www.petrolimex.com.vn/ndi/thong-cao-bao-chi.html", {
      headers: { "User-Agent": UA, "Accept": "text/html" },
      timeout: 15000,
    });
    const $ = cheerio.load(res.data);
    let found: { title: string; url: string; effectiveDate: string } | null = null;

    $("a").each((_i, el) => {
      if (found) return;
      const href = $(el).attr("href") || "";
      const text = $(el).text().trim();
      if (href.includes("dieu-chinh-gia-xang-dau")) {
        const fullUrl = href.startsWith("http") ? href : `https://www.petrolimex.com.vn${href}`;
        const effectiveDate = extractDateFromTitle(text);
        if (effectiveDate) {
          found = { title: text, url: fullUrl, effectiveDate };
        }
      }
    });
    return found;
  } catch (e: any) {
    console.error("[Petrolimex Scraper] Press page error:", e.message);
    return null;
  }
}

// ─── Main sync logic ──────────────────────────────────────────────────────────
export async function internalSyncLogic(force = false): Promise<SyncResult> {
  if (!force && isCacheValid() && scraperCache) {
    console.log("[Petrolimex Scraper] Trả về từ cache (còn hiệu lực)");
    return scraperCache.data;
  }

  const today = todayStr();
  const fallbackCfg = await getFallbackConfig();

  console.log("[Petrolimex Scraper] Đang kiểm tra RSS feed...");
  let article = await findLatestAdjustmentFromRSS();

  if (!article) {
    console.log("[Petrolimex Scraper] RSS không có kết quả, thử trang Thông cáo...");
    article = await findLatestAdjustmentFromPressPage();
  }

  let result: SyncResult;

  if (article) {
    console.log(`[Petrolimex Scraper] ✅ Bài điều chỉnh giá: "${article.title}"`);
    console.log(`[Petrolimex Scraper]    Ngày hiệu lực: ${article.effectiveDate}, Giá fallback: ${fallbackCfg.price.toLocaleString()}đ`);

    result = {
      success: true,
      data: {
        fuelType: FUEL_TYPE,
        priceV1: fallbackCfg.price,
        date: today,
        effectiveDate: article.effectiveDate,
        source: `Petrolimex TCBC ngày ${article.effectiveDate}`,
        articleUrl: article.url,
        status: `OK - Giá điều hành: ${fallbackCfg.price.toLocaleString()}đ (hiệu lực ${article.effectiveDate})`,
        parsedFromWeb: true,
      },
    };
  } else {
    console.log("[Petrolimex Scraper] ⚠️ Không tìm thấy bài điều chỉnh giá → Fallback");
    result = {
      success: true,
      data: {
        fuelType: FUEL_TYPE,
        priceV1: fallbackCfg.price,
        date: today,
        effectiveDate: fallbackCfg.date,
        source: `Fallback (Giá điều hành ${fallbackCfg.date})`,
        articleUrl: "",
        status: `Fallback - ${fallbackCfg.price.toLocaleString()}đ ngày ${fallbackCfg.date}`,
        parsedFromWeb: false,
      },
    };
  }

  scraperCache = { data: result, timestamp: Date.now() };
  return result;
}

// ─── Sync and save to database ────────────────────────────────────────────────
export async function syncAndSave(force = false): Promise<SyncResult & { saved: boolean; message: string }> {
  const result = await internalSyncLogic(force);

  if (!result.success || !result.data.priceV1) {
    return { ...result, saved: false, message: "Không có dữ liệu giá để lưu." };
  }

  const { effectiveDate, fuelType, priceV1 } = result.data;

  // UPSERT: insert or update if date already exists
  const upsertResult = await query(
    `INSERT INTO fuel_prices (date, fuel_type, price_v1) VALUES ($1, $2, $3)
     ON CONFLICT (date) DO UPDATE SET fuel_type = EXCLUDED.fuel_type, price_v1 = EXCLUDED.price_v1
     RETURNING (xmax = 0) AS inserted`,
    [effectiveDate, fuelType, priceV1],
  );
  const wasInserted = upsertResult[0]?.inserted ?? true;

  const action = wasInserted ? "Thêm mới" : "Cập nhật";
  await logAudit("SYNC_PRICE", `${action} giá: ${priceV1.toLocaleString()}đ ngày ${effectiveDate} (${result.data.source})`);

  return {
    ...result,
    saved: true,
    message: wasInserted
      ? `✅ Đã lưu giá ${priceV1.toLocaleString()}đ cho ngày ${effectiveDate}.`
      : `✅ Đã cập nhật giá ${priceV1.toLocaleString()}đ cho ngày ${effectiveDate}.`,
  };
}

// ─── Cron sync (called by daily scheduler) ────────────────────────────────────
export async function cronSync(): Promise<void> {
  console.log("[Cron] 🕖 Bắt đầu đồng bộ giá dầu tự động...");
  try {
    const result = await syncAndSave(true);
    if (result.saved) {
      console.log(`[Cron] ✅ ${result.message}`);
    } else {
      console.log(`[Cron] ℹ️ ${result.message}`);
    }
  } catch (e: any) {
    console.error(`[Cron] ❌ Lỗi đồng bộ: ${e.message}`);
    await logAudit("CRON_SYNC_ERROR", `Lỗi cào tự động: ${e.message}`);
  }
}
