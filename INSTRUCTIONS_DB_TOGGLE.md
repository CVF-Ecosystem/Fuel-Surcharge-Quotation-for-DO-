# Chọn chế độ Database (PostgreSQL ↔ In-Memory)

Từ phiên bản này, chế độ lưu trữ được chọn bằng **biến môi trường**, không còn sửa tay
file `backend/db.ts` (lần sửa tay đó từng vô tình đưa production về RAM).

| Biến môi trường | Kết quả |
|---|---|
| `DATABASE_URL` có giá trị | **PostgreSQL** |
| `DATABASE_URL` trống | **In-Memory** — dữ liệu mất khi restart, chỉ dùng dev/demo |
| `USE_MEMORY_DB=true` | Ép In-Memory dù đã có `DATABASE_URL` |

Khi khởi động, server log một dòng cho biết đang dùng chế độ nào:

```
[DB] Chế độ lưu trữ: PostgreSQL
[DB] Chế độ lưu trữ: IN-MEMORY (dữ liệu sẽ mất khi restart)
```

và `GET /api/health` trả `"storage": "POSTGRESQL"` hoặc `"MEMORY"`.

## Production (PM2)
`ecosystem.config.cjs` đã đặt `DATABASE_URL`, nên production tự dùng PostgreSQL.

## Chạy local không cần Postgres
```bash
npm run dev          # không đặt DATABASE_URL -> In-Memory, có sẵn dữ liệu mẫu
```

## Chạy local với Postgres
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/logipro npm run dev
```

> Hai chế độ có cùng hợp đồng hàm (xem `backend/db-postgres.ts` và `backend/db-memory.ts`).
> Khi thêm thao tác dữ liệu mới, hãy thêm vào **cả hai** file; route không viết SQL thô.
