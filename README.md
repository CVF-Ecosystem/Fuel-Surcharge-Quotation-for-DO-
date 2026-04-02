# Công cụ Tính & Báo Giá Phụ Thu Nhiên Liệu (Logi-Pro)

Ứng dụng web toàn diện giúp tự động hóa quá trình tính toán phụ thu nhiên liệu (Dầu DO 0,05S-II) và lập báo giá dịch vụ Logistics chuyên nghiệp.

## Các tính năng chính

- **Tự động đồng bộ giá nhiên liệu:** Tích hợp bộ cào dữ liệu (scraper) tự động truy xuất giá dầu mới nhất từ website chính thức của Petrolimex.
- **Tính toán bậc phụ thu minh bạch:** Hỗ trợ tính toán chính xác cả 2 loại: Hàng Container (20F, 40F, 20E, 40E) và Hàng Ngoài (Bulk cargo) theo quy định.
- **Tích hợp sẵn VAT 8%:** Hệ thống tự động tính toán khoản thuế VAT bắt buộc cho mục phụ thu nhiên liệu.
- **Quản lý Báo giá:** Chuyển kết quả tính toán thành module báo giá chuyên nghiệp chỉ bằng một nút bấm.
- **Phân quyền người dùng:** Hệ thống users với role-based access (admin / editor / viewer).

## Kiến trúc Hệ thống

```
QD209_WS/
├── backend/                  # Express API server
│   ├── server.ts             # Entry point
│   ├── db.ts                 # PostgreSQL connection + query helpers
│   ├── config.ts             # Environment config, token, audit
│   ├── schema.sql            # 14 tables DDL
│   ├── seed.ts               # Default data seeding
│   ├── schemas.ts            # Zod validation schemas
│   ├── routes/
│   │   ├── auth.ts           # Login / verify (bcrypt + users table)
│   │   ├── crud.ts           # CRUD cho tất cả bảng dữ liệu
│   │   └── sync.ts           # Health, fallback, scraper, cron
│   ├── scrapers/
│   │   └── petrolimex.ts     # Petrolimex price scraper
│   └── __tests__/
│       └── api.test.ts       # Unit tests (vitest)
├── frontend/                 # React SPA (Vite)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── lib/storage.ts    # API client
│       └── types/
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

- **Frontend:** React 19, Vite 6, Tailwind CSS 4 + `lucide-react`
- **Backend:** Node.js + Express + `tsx` + `cheerio` + `axios`
- **Database:** PostgreSQL (14 bảng, schema tự động khởi tạo)
- **Auth:** bcrypt password hashing + HMAC token

*Lưu ý: Các thiết lập mốc cước phí mặc định được dựa trên **Quyết định số 209/QĐ-CSG ngày 24/03/2026**.*

## Yêu cầu

- **Node.js** >= 18
- **PostgreSQL** >= 14

## Hướng dẫn Cài đặt & Sử dụng

### 1. Tạo database PostgreSQL
```bash
createdb logipro
```

### 2. Development (Local)
```bash
npm install
npm run dev
```
Ứng dụng mặc định chạy tại `http://localhost:3000` (Frontend Vite HMR + Backend API).
Schema tự động được khởi tạo và seed dữ liệu mặc định khi server khởi động.

### 3. Production (VPS)
```bash
npm install
npm run build
npm start
```

### 4. Chạy tests
```bash
npm test
```

### Biến môi trường
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logipro
PORT=3000
NODE_ENV=production
CRON_SECRET=logipro_cron_2026
```

## Thông tin Đăng nhập Quản trị viên (Admin)

Tài khoản mặc định (được seed khi server khởi động):
- **Tên đăng nhập:** `admin`
- **Mật khẩu:** `admin@@@@`

Dưới quyền Admin, phần sidebar sẽ hiển thị menu **Cài đặt hệ thống**. Từ đây, người dùng có thể xóa, thêm, hoặc ép hệ thống scrape lại dữ liệu từ web.
