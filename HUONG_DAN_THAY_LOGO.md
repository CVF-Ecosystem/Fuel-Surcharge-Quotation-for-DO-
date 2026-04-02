# 🖼️ Hướng Dẫn Thay Logo Công Ty Trong Báo Giá

> **Tài liệu này ghi lại chi tiết sự cố logo bị mất trong PDF preview và cách khắc phục.**
> Lưu lại để khi cần thay logo công ty khác, làm đúng ngay từ đầu.

---

## 📍 Vị trí file logo

```
Bao_gia_phu_thu_Dau DO/
└── public/
    └── bao-gia/
        ├── logo.png          ← FILE LOGO CHÍNH (được dùng trong báo giá)
        ├── index.html
        └── script.js
```

- Logo được sử dụng trong hàm `generateA4HTML()` bên trong file `script.js`
- Logo được **preload thành base64 data URI** khi ứng dụng khởi động (hàm `preloadLogo()`)
- Kích thước hiển thị trong PDF: `max-width: 100px`, tự co dãn theo tỉ lệ

---

## ⚠️ SỰ CỐ ĐÃ XẢY RA (30/03/2026)

### Triệu chứng
- Bấm "Cập nhật" → Preview hiển thị đầy đủ nội dung NHƯNG **mất logo**
- Hoặc preview hoàn toàn trắng, báo lỗi "Error creating preview"
- Console trình duyệt: `Error loading image http://localhost:3000/bao-gia/logo.png`
- Truy cập trực tiếp URL `http://localhost:3000/bao-gia/logo.png` → **ảnh bị vỡ** (broken image)

### Nguyên nhân gốc rễ
File `logo.png` bị **hỏng header** do quá trình copy/chỉnh sửa trước đó xử lý file ảnh (binary) như file text UTF-8:

| | Header HEX (8 bytes đầu) | Kết quả |
|---|---|---|
| **File hỏng** | `EF BF BD 50 4E 47 0D 0A` | ❌ Trình duyệt không nhận diện là PNG |
| **File đúng** | `89 50 4E 47 0D 0A 1A 0A` | ✅ PNG header chuẩn |

- Byte đầu tiên `89` (hex) bị thay thành `EF BF BD` (UTF-8 replacement character U+FFFD)
- File vẫn có trên ổ đĩa (500KB), server vẫn trả về 200/304, nhưng **nội dung binary bị hỏng**
- `html2canvas` cố render → gặp ảnh invalid → bỏ qua hoặc crash toàn bộ preview

### Cách đã sửa
1. Tìm bản gốc logo sạch từ thư mục `Bao_gia_dich_vu_container_pkd_edit/logo.png`
2. Copy đúng binary (dùng `[System.IO.File]::Copy()` hoặc `Copy-Item`)
3. Xác minh header PNG hợp lệ
4. Thêm cơ chế `preloadLogo()` để convert logo sang base64 data URI — tránh lỗi CORS trong iframe

---

## ✅ CÁCH THAY LOGO ĐÚNG CÁCH

### Bước 1: Chuẩn bị file logo mới

- **Định dạng**: PNG (khuyến nghị) hoặc JPG
- **Kích thước khuyến nghị**: 200x200px đến 400x400px (sẽ được scale xuống 100px trong PDF)
- **Nền**: Trong suốt (transparent) nếu dùng PNG
- **Tên file**: Đặt tên là `logo.png` (giữ nguyên tên)

### Bước 2: Copy file vào đúng thư mục

```powershell
# CÁCH ĐÚNG — dùng binary copy
Copy-Item "đường_dẫn_logo_mới\logo.png" "public\bao-gia\logo.png" -Force

# HOẶC dùng .NET binary copy
[System.IO.File]::Copy("đường_dẫn_logo_mới\logo.png", "public\bao-gia\logo.png", $true)
```

> [!CAUTION]
> **TUYỆT ĐỐI KHÔNG** mở file `.png` bằng Notepad, VS Code text editor, hoặc bất kỳ
> trình soạn thảo văn bản nào rồi Save lại. Điều này sẽ **hỏng file binary** giống
> sự cố đã xảy ra (chuyển byte `89` thành `EF BF BD`).

### Bước 3: Kiểm tra file đã copy đúng

```powershell
# Đọc 8 byte đầu tiên của file — phải là PNG header
$stream = [System.IO.File]::OpenRead("public\bao-gia\logo.png")
$bytes = New-Object byte[] 8
$stream.Read($bytes, 0, 8) | Out-Null
$stream.Close()
($bytes | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
```

**Kết quả PHẢI là:**
```
89 50 4E 47 0D 0A 1A 0A
```

Nếu thấy `EF BF BD` ở đầu → file bị hỏng, cần copy lại đúng binary.

| Header bắt đầu bằng | Loại file | Trạng thái |
|---|---|---|
| `89 50 4E 47` | PNG | ✅ Hợp lệ |
| `FF D8 FF` | JPEG/JPG | ✅ Hợp lệ (nhưng đổi extension thành .jpg) |
| `EF BF BD` | UTF-8 corrupted | ❌ File bị hỏng |
| `47 49 46 38` | GIF | ✅ Hợp lệ (nhưng đổi extension thành .gif) |

### Bước 4: Kiểm tra trên trình duyệt

1. Mở trình duyệt, truy cập: `http://localhost:3000/bao-gia/logo.png`
2. **Phải thấy ảnh logo hiển thị bình thường** (không phải ảnh vỡ/broken)
3. Nếu ảnh vỡ → quay lại Bước 2, copy lại

### Bước 5: Xóa cache và test

1. Mở app `http://localhost:3000`
2. Bấm `Ctrl+Shift+R` (hard refresh) để xóa cache
3. Vào tab "Báo giá dịch vụ"
4. Điền thông tin, chọn phương án
5. Bấm "Cập nhật" → **Logo phải hiển thị ở góc trên bên trái preview**
6. Bấm "In / Xuất PDF" → **Logo phải hiển thị trong PDF**

---

## 🔧 Cơ chế kỹ thuật hiện tại

### Luồng xử lý logo trong code (`script.js`):

```
1. init() gọi preloadLogo()
   ↓
2. preloadLogo() fetch('logo.png') → blob → FileReader → base64 data URI
   ↓
3. state.logoBase64 = "data:image/png;base64,iVBOR..." (chuỗi rất dài)
   ↓
4. generateA4HTML() dùng state.logoBase64 làm src cho <img>
   ↓
5. html2canvas render ảnh từ base64 (không cần load lại từ URL)
   ↓
6. ✅ Logo hiển thị trong preview & PDF
```

### Tại sao dùng base64 thay vì URL trực tiếp?

Vì module báo giá chạy trong **iframe** (`/bao-gia/index.html` nhúng trong React app).
Khi `html2canvas` render ảnh từ URL tương đối (`logo.png`), nó có thể gặp:
- **Canvas taint** (cross-origin security restriction)
- **Ảnh chưa kịp load** khi canvas bắt đầu vẽ
- **Cache browser** không nhất quán

Dùng base64 data URI giải quyết tất cả vấn đề trên — ảnh đã được mã hóa sẵn trong
chuỗi JavaScript, không cần request HTTP nào khi render.

---

## 🐛 Debug nếu logo lại bị mất

### Checklist nhanh:

1. **File có tồn tại?**
   ```powershell
   Test-Path "public\bao-gia\logo.png"  # Phải là True
   ```

2. **File có đúng format?**
   ```powershell
   # Đọc header (xem Bước 3 ở trên)
   # Phải bắt đầu bằng 89 50 4E 47
   ```

3. **Trình duyệt có load được?**
   - Truy cập `http://localhost:3000/bao-gia/logo.png`
   - Phải hiển thị ảnh, không phải ảnh vỡ

4. **Console có lỗi?**
   - F12 → Console → Tìm lỗi liên quan đến `logo`, `image`, `canvas`

5. **state.logoBase64 có giá trị?**
   - F12 → Console → Gõ: `document.querySelector('#a4-content-wrapper img')?.src?.substring(0, 50)`
   - Phải bắt đầu bằng `data:image/png;base64,`

---

## 📅 Lịch sử sự cố

| Ngày | Sự cố | Nguyên nhân | Giải pháp |
|---|---|---|---|
| 30/03/2026 | Logo mất trong preview PDF | File `logo.png` bị hỏng header binary (byte `89` → `EF BF BD`) | Copy lại bản gốc sạch từ `Bao_gia_dich_vu_container_pkd_edit/logo.png` + thêm `preloadLogo()` base64 |

---

*Tài liệu được tạo ngày 30/03/2026. Cập nhật khi có thay đổi liên quan.*
