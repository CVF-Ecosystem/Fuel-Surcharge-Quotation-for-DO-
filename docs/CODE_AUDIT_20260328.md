# Báo Cáo Audit Code — Bao_gia_phu_thu_Dau DO

> **CVF Phase:** Review | **Role:** Reviewer | **Risk:** R2  
> **Agent:** AI_FUEL_QUOTATION_V1 | **Ngày:** 2026-03-28  
> **Phạm vi:** Toàn bộ source code (8 components + server + firebase)

---

## 📊 Tổng Quan Điểm Số

| Hạng mục | Điểm | Nhận xét |
|---|:---:|---|
| Architecture & Structure | 7/10 | Tốt, nhưng state management quá tập trung ở App.tsx |
| UI/UX & Design | 9/10 | Rất tốt — modern, clean, consistent |
| Business Logic | 7/10 | Core logic đúng, nhưng còn sơ hở |
| Data Management | 5/10 | File-based JSON không phù hợp cho production |
| Security | 4/10 | Nhiều lỗ hổng nghiêm trọng |
| Code Quality | 6/10 | TypeScript lỏng lẻo, có anti-patterns |
| Feature Completeness | 5/10 | Nhiều tính năng chỉ là UI shell, chưa có logic |

**Điểm tổng thể: 6.1/10** — Tốt cho MVP/prototype, cần nâng cấp trước khi dùng production.

---

## 🔴 Nghiêm Trọng (P0 — Sửa ngay)

### SEC-01: Hard-coded Admin Email
**File:** `src/App.tsx` — Line 82
```tsx
// ❌ HIỆN TẠI — security anti-pattern
if (currentUser?.email === 'nthaingoclam@gmail.com') {
  setIsAdminMode(true);
}
```
**Vấn đề:** Email admin hard-code trong frontend. Bất kỳ ai inspect code đều biết. Không thể thay đổi mà không redeploy.  
**Giải pháp:** Dùng Firebase Custom Claims hoặc Firestore `roles` collection:
```tsx
// ✅ ĐỀ XUẤT
const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
setIsAdminMode(userDoc.data()?.role === 'admin');
```

---

### SEC-02: Không có Authentication trên API Server
**File:** `server.ts` — Lines 70–197
```ts
// ❌ Tất cả API routes đều public, không cần auth
app.post("/api/prices", async (req, res) => { ... });
app.delete("/api/prices/:id", async (req, res) => { ... });
```
**Vấn đề:** Ai cũng có thể gọi `POST /api/prices` hoặc `DELETE /api/prices/1` mà không cần đăng nhập.  
**Giải pháp:** Thêm middleware xác thực Firebase token:
```ts
// ✅ ĐỀ XUẤT — middleware bảo vệ write routes
import { getAuth } from 'firebase-admin/auth';
const requireAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const decoded = await getAuth().verifyIdToken(token);
  if (!decoded.admin) return res.status(403).json({ error: 'Forbidden' });
  next();
};
app.post("/api/prices", requireAdmin, async (req, res) => { ... });
```

---

### DATA-01: File-based JSON Storage — Không phù hợp Production
**File:** `server.ts` — Lines 7–9
```ts
const DATA_FILE = path.join(process.cwd(), "data.json");
const TIERS_FILE = path.join(process.cwd(), "tiers.json");
```
**Vấn đề:**
- Mất dữ liệu khi redeploy/restart server
- Không có backup, không có transaction
- Race condition nếu nhiều request đồng thời write
- Files không nằm trong `.gitignore` → dữ liệu có thể bị commit

**Giải pháp:** Migrate sang Firestore (đã có Firebase setup sẵn):
```ts
// ✅ Dùng Firestore thay JSON files
import { db } from './src/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
```

---

## 🟠 Quan Trọng (P1 — Nên sửa trong sprint tới)

### LOGIC-01: QuotationApp — `useEffect` Dependencies Không Đúng
**File:** `src/components/QuotationApp.tsx` — Line 153
```tsx
// ❌ Thiếu dependencies, gây stale closure
useEffect(() => {
  if (pendingSurcharge) { ... }
}, [pendingSurcharge, language, products, onSurchargeProcessed]);
```
**Vấn đề:** `products` trong deps array gây re-run mỗi khi products thay đổi, dẫn đến infinite loop tiềm năng.  
**Giải pháp:** Dùng `useCallback` cho `onSurchargeProcessed` ở parent, và dùng `useRef` cho `products` bên trong effect.

---

### LOGIC-02: DOM Manipulation Trực Tiếp — Anti-pattern React
**File:** `src/components/QuotationApp.tsx` — Lines 757–766
```tsx
// ❌ Direct DOM manipulation trong React
const name = (document.getElementById('new-prod-name') as HTMLInputElement).value;
```
**Vấn đề:** Vi phạm React paradigm, gây bug khó debug, không testable.  
**Giải pháp:** Dùng `useState` cho từng field trong Tariff form.

---

### LOGIC-03: `updateItem` Dùng `any` Type
**File:** `src/components/QuotationApp.tsx` — Line 163
```tsx
// ❌ Mất type safety
const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
```
**Giải pháp:**
```tsx
// ✅
const updateItem = <K extends keyof QuotationItem>(
  id: string, field: K, value: QuotationItem[K]
) => { ... }
```

---

### FEAT-01: Dashboard — Toàn bộ Dữ liệu là Mock/Hardcode
**File:** `src/components/Dashboard.tsx` — Lines 16–28
```tsx
// ❌ Data cứng, không kết nối thực tế
const stats = [
  { label: 'Doanh thu tháng', value: '1,250,000,000 đ', ... },
  { label: 'Báo giá đã gửi', value: '48', ... },
];
const recentActivities = [
  { title: 'Báo giá mới cho Samsung Vina', ... },
];
```
**Vấn đề:** Dashboard không phản ánh dữ liệu thực. Người dùng thấy số giả.  
**Giải pháp:** Tính toán stats từ dữ liệu thực (prices, quotation history từ Firestore).

---

### FEAT-02: Lịch Sử Báo Giá — Chỉ là Mock Data
**File:** `src/components/History.tsx` — Lines 31–37
```tsx
// ❌ Hardcoded — không lưu báo giá thực
const historyItems: QuotationHistoryItem[] = [
  { id: '1', quotationNo: 'BG2603-001', customerName: 'Samsung Vina...' },
];
```
**Vấn đề:** Khi người dùng tạo báo giá trong `QuotationApp`, nó không được lưu, không hiện ở History.

---

### FEAT-03: Khách Hàng & Danh Mục Dịch Vụ — Không Lưu Được
**Files:** `CustomerList.tsx`, `ServiceCatalog.tsx`
```tsx
// ❌ Các nút Thêm/Chỉnh sửa/Xóa không có logic
<button>Thêm khách hàng</button> // không có onClick handler
<button>Chỉnh sửa</button>       // không có onClick handler
```
**Vấn đề:** 3 module hoàn toàn là UI shell.

---

## 🟡 Cải Thiện (P2 — Backlog)

### CODE-01: Interface Trùng Lặp Nhiều File
Các interfaces `FuelPrice`, `Tier`, `BulkTier` được định nghĩa lại ở nhiều files:
- `App.tsx` (lines 14–37)
- `SurchargeCalculator.tsx` (lines 14–37)
- `AdminPanel.tsx` (lines 9–33)

**Giải pháp:** Tạo `src/types/index.ts` — single source of truth cho all interfaces.

---

### CODE-02: `cn()` Helper Định Nghĩa Lại Nhiều Lần
```tsx
// Định nghĩa ở Dashboard.tsx, SurchargeCalculator.tsx
function cn(...inputs: any[]) { return inputs.filter(Boolean).join(' '); }
```
`src/lib/utils.ts` đã tồn tại nhưng chỉ export `clsx`. Consolidate tất cả.

---

### CODE-03: AdminPanel Props — Quá Nhiều Props (Prop Drilling)
**File:** `src/components/AdminPanel.tsx` — Props interface có **21 props**
```tsx
// ❌ 21 props — quá nhiều, khó maintain
interface AdminPanelProps {
  adminTab, setAdminTab, error, isSubmitting,
  newDate, setNewDate, newFuelType, setNewFuelType, ...
}
```
**Giải pháp:** Tạo `useAdminForm()` custom hook, hoặc dùng `useReducer`.

---

### UX-01: Logo Placeholder trong Báo Giá
**File:** `src/components/QuotationApp.tsx` — Line 545
```tsx
// ❌ Dùng ảnh ngẫu nhiên từ picsum — không phù hợp môi trường production
<img src="https://picsum.photos/seed/port/200/200" alt="Logo" />
```
**Giải pháp:** Upload logo thật của Cảng Tân Thuận vào `public/` folder.

---

### UX-02: Nút "Lưu báo giá" — Không Có Logic
**File:** `src/components/QuotationApp.tsx` — Line 522
```tsx
// ❌ Nút lưu không có onClick
<button className="..."><Save />  {t.save}</button>
```

---

### UX-03: Greeting Hard-code Tên Người Dùng
**File:** `src/components/Dashboard.tsx` — Line 33
```tsx
// ❌ Tên người dùng hard-code
<h1>Chào buổi sáng, Lam!</h1>
```
**Giải pháp:** Dùng Firebase Auth user name + đúng thời điểm trong ngày:
```tsx
const greeting = hour < 12 ? 'buổi sáng' : hour < 18 ? 'buổi chiều' : 'buổi tối';
<h1>Chào {greeting}, {user?.displayName?.split(' ').pop()}!</h1>
```

---

## ✅ Điểm Mạnh — Được giữ nguyên

| Điểm mạnh | Mô tả |
|---|---|
| **UI nhất quán** | Color palette, border-radius, spacing đồng đều toàn app |
| **Animations** | Framer Motion được dùng đúng chỗ, không overuse |
| **PDF Export** | html2canvas + jsPDF implementation hoàn chỉnh, scale tốt |
| **Excel Import/Export** | Hỗ trợ import nhiều format field name (vi/en), có preview modal |
| **Số tiền bằng chữ** | `numberToWords()` đúng logic tiếng Việt (mốt, lăm, lẻ...) |
| **Responsive Sidebar** | Collapse/expand mượt mà |
| **QR Code thanh toán** | Auto-generate từ số tài khoản, dynamic theo tổng tiền |
| **Tier-based logic** | Tính phụ thu theo bậc giá dầu đúng nghiệp vụ |
| **Bilingual support** | VI/EN toggle trong QuotationApp |
| **Error boundaries** | Loading/error states được xử lý ở App level |

---

## 📋 Lộ Trình Cải Thiện (Ưu tiên)

### Sprint 1 — Security & Data Foundation
- [ ] SEC-01: Chuyển admin auth sang Firebase Custom Claims
- [ ] SEC-02: Thêm auth middleware cho API write routes
- [ ] DATA-01: Migrate data storage sang Firestore

### Sprint 2 — Feature Completion
- [ ] FEAT-01: Kết nối Dashboard với dữ liệu thực
- [ ] FEAT-02: Implement lưu báo giá vào Firestore + hiển thị ở History
- [ ] FEAT-03: Implement CRUD cho Khách hàng & Danh mục dịch vụ
- [ ] UX-02: Kết nối nút "Lưu báo giá"

### Sprint 3 — Code Quality
- [ ] CODE-01: Tạo `src/types/index.ts` — shared interfaces
- [ ] CODE-03: Refactor AdminPanel với custom hook
- [ ] LOGIC-02: Xóa DOM manipulation, dùng controlled state
- [ ] UX-01: Thay thế logo placeholder bằng logo thật
- [ ] UX-03: Dynamic greeting với Firebase Auth user

---

## 🏗️ Kiến Trúc Đề Xuất (Target State)

```
src/
├── types/
│   └── index.ts          ← Tất cả interfaces
├── hooks/
│   ├── useAdminForm.ts   ← Admin form state
│   ├── usePrices.ts      ← Firestore data fetching
│   └── useQuotations.ts  ← Quotation CRUD
├── services/
│   ├── firestore.ts      ← Firestore operations
│   └── auth.ts           ← Auth helpers
├── components/           ← UI components (giữ nguyên structure)
└── App.tsx               ← Chỉ routing + auth state
```

---

*Báo cáo này được tạo theo CVF Review Phase. Mọi thay đổi code cần Skill Preflight trước khi Build.*
