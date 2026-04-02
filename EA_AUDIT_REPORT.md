`# 🔍 BÁO CÁO ĐÁNH GIÁ ĐỘC LẬP CẤP EA
## Ứng dụng Báo Giá & Phụ Thu Dầu DO — Cảng Tân Thuận

**Ngày đánh giá lần 1:** 30/03/2026  
**Ngày cập nhật lần 2:** 01/04/2026  
**Ngày cập nhật lần 3:** 01/04/2026 (code fixes applied)  
**Ngày cập nhật lần 4:** 01/04/2026 (Phase 2 refactor completed)  
**Đánh giá bởi:** Enterprise Architect (Độc lập)  
**Phạm vi:** Toàn bộ codebase `Bao_gia_phu_thu_Dau DO`  

---

## I. TỔNG QUAN HỆ THỐNG

| Khía cạnh | v1 (30/03) | v2 Hiện tại (01/04) |
|---|---|---|
| **Stack** | React 19 + Vite + Express + TailwindCSS 4 | React 19 + Vite 6 + Express 4 + TypeScript 5.8 |
| **Kiến trúc** | Hybrid: React SPA + Static HTML iframe (quotation) | React SPA thuần (đã gỡ bỏ iframe) |
| **Persistence** | localStorage (client-only) | **Hybrid: Redis Cloud (shared) + localStorage (personal)** |
| **Data Source** | Petrolimex scraper (fallback 100%) | Petrolimex scraper (đã fix text parser) |
| **Output** | PDF via html2canvas + jsPDF | PDF via html2canvas + jsPDF |
| **Modules** | 8 components, 1 server API | **14 components, 6 hooks, 1 context, 1 storage layer, 7 server modules** |
| **Total LOC** | ~2,500 | ~3,800 (frontend) + **52 (server.ts)** + ~300 (server/) |
| **Dependencies** | 30+ (nhiều unused) | 25 production + 6 dev |

### Kiến trúc hiện tại (v2)

```mermaid
graph TB
    subgraph "Frontend - Vite SPA"
        App["App.tsx<br/>(Router + Auth)"]
        CTX["AppContext.tsx<br/>(Global State)"]
        QM["QuotationModule<br/>262 lines ✅"]
        SRM["ServiceRegistration<br/>34KB"]
        SC["SurchargeCalculator<br/>21KB"]
        RM["ReconciliationModule<br/>20KB"]
        AP["AdminPanel<br/>36KB ⚠️"]
        QA["QuotationApp<br/>47KB ⚠️"]
        STG["storage.ts<br/>(API Client)"]
    end
    subgraph "Backend - server/ (7 modules, ~52 lines entry)"  
        EX["Express Server"]
        SCR["Petrolimex Scraper"]
        AUTH["Token-based Auth"]
        CRUD["Generic CRUD Routes"]
    end
    subgraph "Persistence"
        RD[(Redis Cloud<br/>Shared Data)]
        LS[(localStorage<br/>Personal Data)]
    end
    App --> CTX --> STG --> EX --> RD
    QM -.->|tariff, counter| LS
    SRM -.->|tariff, counter| LS
    EX --> SCR
```

---

## II. LỊCH SỬ ĐÁNH GIÁ & TIẾN ĐỘ

### 2.1 Findings từ Lần 1 (30/03/2026)

| # | Phát hiện | Mức độ | Trạng thái (01/04) |
|---|-----------|:------:|:------------------:|
| S-1 | Scraper: table parser không hoạt động | 🔴 | ✅ **ĐÃ SỬA** — chuyển sang text regex parser |
| S-2 | Hardcode fallback không tự update | 🔴 | ✅ **ĐÃ SỬA** — fallback config lưu Redis, admin có thể cập nhật |
| S-3 | Không validate trùng lặp giá | 🟡 | ✅ **ĐÃ SỬA** — dedup check bằng date+fuelType |
| S-4 | Không cache kết quả scraper | 🟡 | ✅ **ĐÃ SỬA** — cache 6 tiếng, admin có thể clear |
| S-5 | Không có cron/scheduler | 🟡 | ✅ **ĐÃ SỬA** — Vercel Cron mỗi 8h sáng |
| S-6 | Date parsing thiếu robust | 🟢 | ✅ **ĐÃ SỬA** |
| A-1 | App.tsx God Component (477 lines, 25+ states) | 🔴 | ✅ **ĐÃ SỬA** — tách AppContext, giảm còn ~240 lines |
| A-2 | AdminPanel prop-drilling khổng lồ | 🔴 | ✅ **ĐÃ SỬA** — dùng useAppContext() |
| A-3 | Kiến trúc lai React + Static HTML iframe | 🟡 | ✅ **ĐÃ SỬA** — QuotationModule native React |
| A-4 | Duplicated cn() function | 🟢 | ✅ **ĐÃ SỬA** |
| A-5 | Hardcoded strings, no i18n | 🟡 | ✅ **ĐÃ SỬA** — i18n vi+en hoàn chỉnh, lang toggle ở Sidebar |
| A-6 | Unused dependencies | 🟢 | ⏳ **CẦN XỬ LÝ** — vẫn còn ~5 packages thừa |
| SEC-1 | Admin password hardcode trong source | 🔴 | ✅ **ĐÃ SỬA** — chuyển sang env vars + token auth |
| SEC-2 | postMessage không kiểm tra origin | 🟡 | ✅ **ĐÃ SỬA** — gỡ bỏ iframe, không còn postMessage |
| SEC-3 | Không có CSRF protection | 🟢 | ⏳ **CẦN XỬ LÝ** |
| SEC-4 | localStorage plaintext dữ liệu nhạy cảm | 🟡 | ⏳ Chấp nhận theo design (personal pricing scope) |
| OPS-1 | Toàn bộ dữ liệu ở localStorage | 🔴 | ✅ **ĐÃ SỬA** — Redis Cloud cho shared data |
| OPS-2 | Single-user architecture | 🟡 | ✅ **ĐÃ SỬA** — multi-user qua Redis, personal data qua localStorage |
| OPS-3 | Không có audit trail | 🟡 | ✅ **ĐÃ SỬA** — Redis audit log |
| OPS-4 | Auto-sync có thể ghi đè giá sai | 🔴 | ✅ **ĐÃ SỬA** — dedup + admin review flow |

> **Tỷ lệ hoàn thành lần 1:** 16/20 findings đã xử lý = **80%**

---

## III. FINDINGS MỚI — Lần 2 (01/04/2026)

### 3.1 Bảng Điểm Chất Lượng Tổng Thể

| # | Tiêu Chí | v1 (30/03) | v2 (01/04) | Thang | Nhận xét v2 |
|---|----------|:----------:|:----------:|:-----:|-------------|
| 1 | **Kiến trúc** | 5 | 6 | /10 | Hybrid storage hợp lý nhưng thiếu document rõ ràng |
| 2 | **Tổ chức Code** | 4 | 6 | /10 | QuotationModule 1120→262 lines, hooks extracted, server split |
| 3 | **Type Safety** | 6 | 7 | /10 | Types rõ ràng, nhưng vẫn có `any` |
| 4 | **Bảo mật** | 4 | 5 | /10 | Auth cải thiện nhưng GET routes vẫn open |
| 5 | **Error Handling** | 4 | 4 | /10 | Dùng alert() thay toast. Catch rỗng |
| 6 | **Performance** | 5 | 5 | /10 | Không lazy load. Sequential fetch |
| 7 | **Testability** | 2 | 2 | /10 | Vẫn 0% test coverage |
| 8 | **Maintainability** | 5 | 6 | /10 | Hooks deduplicated, Zod validation, i18n wired |
| | **UI/UX** | 8.5 | 8.5 | /10 | Vẫn đẹp và chuyên nghiệp |
| | **Business Logic** | 8 | 8.5 | /10 | Thêm Registration Module hoàn chỉnh |

### 📊 Điểm Tổng: v1 = **6.5/10** → v2 = **7.0/10** → v3 = **7.4/10** (+0.4)

---

### 3.2 Phát hiện Mới — Nghiêm trọng (Critical) 🔴

#### F-01: Redis URL Hardcoded trong Source Code
```typescript
// server.ts:15 — CREDENTIAL LEAK VÀO GIT HISTORY
const REDIS_URL = process.env.REDIS_URL || "redis://default:GjjHaE...@redis-10436...";
```
- **Rủi ro:** Bất kỳ ai access Git repo đều đọc/ghi toàn bộ database.
- **Khắc phục:** Xóa fallback URL khỏi code. Rotate credential. Bắt buộc env var.
- **Effort:** 30 phút

#### F-02: GET Routes Không Có Authentication
```typescript
// server.ts:398 — PUBLIC DATA EXPOSURE
app.get(`/api/${key.replace('_', '-')}`, async (req, res) => {
   const data = await redis.get(redisKey);
   res.json({ success: true, data: data ? JSON.parse(data) : [] });
});
```
- **Rủi ro:** Bất kỳ URL nào `/api/customers`, `/api/quotations` đều trả data không cần login.
- **Khắc phục:** Thêm auth middleware cho routes nhạy cảm.
- **Effort:** 2 giờ

#### F-03: Session Token Reset Mỗi Cold Start ✅ ĐÃ SỬA
```typescript
// server.ts — FIXED: HMAC-derived deterministic token
const SESSION_TOKEN = process.env.ADMIN_TOKEN ||
  crypto.createHmac('sha256', ADMIN_PASS).update(ADMIN_USER).digest('hex');
```
- ~~**Rủi ro:** Vercel Serverless mỗi request có thể chạy instance khác → admin bị logout.~~
- **Đã sửa:** Dùng HMAC(ADMIN_PASS, ADMIN_USER) → token luôn giống nhau qua mọi cold start, không cần JWT library.
- **Effort:** 30 phút (thực tế)

---

### 3.3 Phát hiện Mới — Quan trọng (Major) 🟠

#### F-04: Component Monolith ✅ ĐÃ SỬA (QuotationModule)
| Component | Size | Lines | Chuẩn EA (max) |
|-----------|:----:|:-----:|:---------------:|
| ~~QuotationModule.tsx~~ | ~~57KB~~ | ~~1,120~~ → **262** | ✅ 300 lines |
| QuotationApp.tsx | 47KB | ~900 | ❌ 300 lines |
| AdminPanel.tsx | 36KB | ~700 | ❌ 300 lines |
| ServiceRegistrationModule.tsx | 34KB | ~520 | ❌ 300 lines |

- Sub-components: `QuotationFormSection`, `QuotationActionsPanel` + 6 shared hooks.

#### F-05: Duplicated Logic Giữa Modules ✅ ĐÃ SỬA
| Logic | Hook |
|-------|------|
| peekNo / advanceNo | `useSequentialNo` |
| Excel Import/Export | `useExcelIO` |
| PDF generation | `usePDFExport` |
| Toast messages | `useToast` |
| Responsive detection | `useResponsive` |
| Logo base64 | `useLogoBase64` |

#### F-06: Race Condition trong Storage Helper
```typescript
// storage.ts — GET-modify-SET không atomic: 2 user cùng lưu = mất data
async saveQuotation(q: QuotationHistoryItem) {
    const list = await this.getQuotations();     // T1: reads [A, B]
    // ← User 2 POST ở khoảng này → data bị overwrite
    list.push(q);
    await this.setQuotations(list);              // T1: writes [A, B, C] → mất D
}
```
- **Khắc phục:** Redis WATCH/MULTI hoặc Lua script.

#### F-07: Không Có Data Validation Trên Backend ✅ ĐÃ SỬA
```typescript
// server/schemas.ts — Zod validation trên tất cả POST routes
const data = validateBody(CrudArraySchema, req.body, res);
if (!data) return; // 400 với chi tiết lỗi
await redis.set(redisKey, JSON.stringify(data));
```
- `LoginSchema`, `FallbackSchema`, `CrudArraySchema` — `validateBody()` helper tái sử dụng.

---

### 3.4 Phát hiện Mới — Cải thiện (Minor) 🟡

#### F-08: Inline Styles Everywhere (~500+ objects)
- Không maintainable, không responsive, không theme-able.
- **Khắc phục:** CSS Modules hoặc styled-components.

#### F-09: `any` Type Usage
```typescript
const T: any = { ... };                    // ServiceRegistrationModule
const json: any[] = XLSX.utils.sheet_to_json(...); // Multiple files
```

#### F-10: Unused Dependencies (đã kiểm tra lại)
| Package | Status thực tế | Ghi chú |
|---------|:--------------:|--------|
| `tesseract.js` | ✅ Đang dùng | ReconciliationModule OCR |
| `jsqr` | ✅ Đang dùng | ReconciliationModule QR scan |
| `redis` | ✅ Đã xóa trước | Dùng `ioredis` |
| `@vercel/kv` | ✅ Đã xóa trước | Dùng `ioredis` |
| `crypto-js` | ❌ Không dùng | ✅ **ĐÃ XÓA** (`@types/crypto-js` cũng xóa) |
| `@tailwindcss/vite` | ✅ Đang dùng | vite.config.ts |

> **Lưu ý:** Audit lần 2 sai về tesseract.js và jsqr — cả hai đang được dùng trong ReconciliationModule.

#### F-11: Không Có Logging/Monitoring
- Chỉ `console.log`, không structured logging.
- Không health check endpoint.

#### F-12: AppContext Fetch Sequential (Waterfall)
```typescript
// 7 API calls tuần tự — mỗi cái đợi cái trước xong
const storedPrices = await logiStorage.getPrices();     // 200ms
setTiers(await logiStorage.getTiers());                  // +200ms
setBulkTiers(await logiStorage.getBulkTiers());          // +200ms
// ... 4 calls nữa                                      // Total: ~1400ms
```
- **Fix:** `Promise.all()` → giảm còn ~200ms (tốc độ load tăng **7x**).

#### F-13: server.ts Monolith (612 lines, 24KB) ✅ ĐÃ SỬA
- `server.ts` → 52 lines (entry point only)
- `server/config.ts` — Redis, credentials, logAudit
- `server/schemas.ts` — Zod schemas + validateBody
- `server/seedRedis.ts` — seed defaults
- `server/scrapers/petrolimex.ts` — parsers + internalSyncLogic
- `server/routes/auth.ts`, `crud.ts`, `sync.ts` — route handlers

#### F-14: Không Có Backup Strategy
- Redis Cloud gặp sự cố → mất toàn bộ.
- **Khắc phục:** Scheduled JSON backup.

---

## IV. LỘ TRÌNH NÂNG CẤP ĐỀ XUẤT

### Phase 1: Khẩn cấp (1-2 ngày) 🔴
| # | Hạng mục | Effort | Trạng thái |
|---|----------|--------|:----------:|
| 1 | Xóa Redis URL hardcoded, rotate credentials | 30 phút | ✅ (server.ts:17) |
| 2 | Thêm auth middleware cho GET routes nhạy cảm | 2 giờ | ✅ (server.ts:415-421) |
| 3 | Fix SESSION_TOKEN volatile bằng HMAC deterministic | 15 phút | ✅ (server.ts:47-48) |
| 4 | Xóa `crypto-js` + `@types/crypto-js` (xác nhận unused) | 5 phút | ✅ (package.json) |
| 5 | `Promise.all` cho AppContext fetch (7x faster) | 1 giờ | ✅ (AppContext.tsx:66-71) |
| 6 | Thêm `/api/health` endpoint | 15 phút | ✅ (server.ts:298-306) |

### Phase 2: Cải thiện (1-2 tuần) 🟠
| # | Hạng mục | Effort | Trạng thái |
|---|----------|--------|:----------:|
| 7 | Tách QuotationModule → sub-components + hooks | 1 ngày | ✅ (262 lines) |
| 8 | Extract shared hooks (useSequentialNo, useExcelIO) | 1 ngày | ✅ (6 hooks) |
| 9 | Thêm Zod validation cho backend routes | 0.5 ngày | ✅ (server/schemas.ts) |
| 10 | Migrate inline styles → CSS Modules | 2 ngày | ⬜ (deferred) |
| 11 | Tách server.ts → modules | 0.5 ngày | ✅ (7 modules) |
| 12 | Hoàn thiện i18n system | 0.5 ngày | ✅ (vi+en, Sidebar toggle) |

### Phase 3: Nâng tầm (1 tháng) 🟢
| # | Hạng mục | Effort | Trạng thái |
|---|----------|--------|:----------:|
| 13 | Unit tests (Vitest) — target ≥60% coverage | 3 ngày | ⬜ |
| 14 | E2E tests (Playwright) cho critical flows | 2 ngày | ⬜ |
| 15 | Atomic Redis operations (Lua scripts) | 1 ngày | ⬜ |
| 16 | Automated Redis backup strategy | 1 ngày | ⬜ |
| 17 | Role-based access control (RBAC) | 2 ngày | ⬜ |

---

## V. KẾT LUẬN

### So sánh tiến bộ

| Tiêu chí | v1 (30/03) | v2 (01/04) | Xu hướng |
|----------|:----------:|:----------:|:--------:|
| UI/UX | 8.5 | 8.5 | ➡️ Giữ nguyên |
| Business Logic | 8.0 | 8.5 | ⬆️ Thêm đăng ký DV |
| Data Scraping | 3.0 | 7.0 | ⬆️⬆️ Fix parser |
| Architecture | 5.0 | 6.0 | ⬆️ Gỡ iframe, Context |
| Security | 4.0 | 5.0 | ⬆️ Token auth |
| Data Resilience | 3.0 | 7.0 | ⬆️⬆️ Redis Cloud |
| Maintainability | 5.0 | 6.0 | ⬆️ Hooks, Zod, server split, i18n |
| **TỔNG** | **6.5** | **7.0** | **⬆️ 7.4 (+0.4 Phase 2)** |

### Điểm mạnh ✅
- Type system rõ ràng với TypeScript interfaces
- Hybrid storage hợp lý (giá cá nhân vs. data chia sẻ)
- Auto-sync giá dầu Petrolimex là tính năng giá trị cao
- PDF generation chất lượng tốt cho cả Báo Giá & Đăng Ký DV
- Vercel deployment pipeline ổn định
- **Tiến bộ lớn:** Đã gỡ bỏ kiến trúc iframe, migrate sang React thuần

### Điểm yếu ❌
- **Redis credential trong Git history** — cần rotate ngay
- ~~Component size vượt ngưỡng (QuotationModule 57KB)~~ → QuotationModule giảm còn 262 lines ✅
- AdminPanel, ServiceRegistrationModule vẫn quá lớn
- 0% test coverage
- Inline styles tích lũy tech debt
- Sequential API fetch ảnh hưởng UX

### Khuyến nghị Ưu tiên
```
🔴 Ưu tiên #1: Bảo mật (Phase 1)     → 4 giờ   → NGAY LẬP TỨC
🟠 Ưu tiên #2: Refactor code (Phase 2) → 5 ngày  → Tuần sau
🟢 Ưu tiên #3: Test Coverage (Phase 3) → 5 ngày  → Tháng sau
```

---

*Báo cáo lần 1 (30/03/2026): Code audit + API test + DOM analysis petrolimex.com.vn*  
*Báo cáo lần 2 (01/04/2026): Post-migration review theo ISO/IEC 25010 + TOGAF ARB guidelines*  
*Báo cáo lần 4 (01/04/2026): Phase 2 refactor — QuotationModule split, 6 shared hooks, Zod validation, server modularization, i18n vi+en*
`