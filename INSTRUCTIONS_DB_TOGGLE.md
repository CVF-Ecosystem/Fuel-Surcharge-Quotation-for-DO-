# Hướng dẫn chuyển đổi chế độ Database (In-Memory ↔ PostgreSQL)

Trong quá trình phát triển (đặc biệt là test local hoặc test giao diện nhanh), project cung cấp một chế độ **In-Memory Storage**. Chế độ này KHÔNG cần cài đặt PostgreSQL, giúp chạy ứng dụng lên ngay lập tức với dữ liệu giả lập có sẵn.

## Các bước chuyển đổi

Bác chỉ cần thao tác **DUY NHẤT** tại file `backend/db.ts`.

### 1. Muốn chạy In-Memory (Test local nhanh, không cần DB thật)
Mở file `backend/db.ts` và thiết lập phần export ở cuối file như sau:
```typescript
export {
  // ... (danh sách các hàm export)
  pool,
} from "./db-memory.js"; // <--- BẬT DÒNG NÀY (Bỏ comment)
//} from "./db-postgres.js";  // <--- TẮT DÒNG NÀY (Thêm comment)
```

Sau đó chạy lại server:
```bash
npm run dev
```
*Lưu ý: Bạn sẽ thấy dòng log `[DB-MEMORY] ✅ In-memory database initialized`.*

---

### 2. Muốn chạy PostgreSQL (Môi trường Staging / Production)
Mở file `backend/db.ts` và đảo ngược lại:
```typescript
export {
  // ... (danh sách các hàm export)
  pool,
//} from "./db-memory.js"; // <--- TẮT DÒNG NÀY (Thêm comment)
} from "./db-postgres.js";  // <--- BẬT DÒNG NÀY (Bỏ comment)
```

Sau đó chạy lại server:
```bash
npm run dev
```
*Lưu ý: Bạn cần cấu hình chuỗi kết nối PostgreSQL (ví dụ `DATABASE_URL`) hoặc để mặc định trong code (user `postgres`, password `postgres`).*
