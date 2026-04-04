# Tổng hợp các nâng cấp từ Bao_gia_phu_thu_Dau DO lên QD209

Kính gửi tác giả `hoangnmr` (repo gốc QD209),

Pull Request này mang đến hàng loạt các cải tiến **quan trọng** được di chuyển (migrate) và chuẩn hóa từ hệ thống `Bao_gia_phu_thu_Dau DO` (phiên bản cá nhân) sang `QD209`. Mục đích nhằm tăng cường tự động hóa, tăng độ ổn định và đáp ứng 100% nghiệp vụ quy trình tại Cảng.

Không có bất cứ kiến trúc cốt lõi nào (Express + React + Postgres) bị phá vỡ. Phần Frontend được giữ nguyên hoàn toàn tư tưởng kiến trúc, chỉ thay thế component Đối Soát bằng bản mạnh mẽ hơn.

Dưới đây là chi tiết các thay đổi để bạn tiện đối chiếu và duyệt (merge) nhanh chóng:

## 1. Scraper Cào Dữ Liệu 5 Lớp (High Availability)
*   **Vấn đề cũ:** Chức năng cào giá (scraper) cũ chỉ gọi đến 1 API duy nhất. Nếu cấu trúc CMS thay đổi hoặc API hỏng, hệ thống sẽ sập, đòi hỏi phản ứng ngay.
*   **Nâng cấp:** Tích hợp bộ **Scraper 5-Strategy Resilient**. Nó lần lượt thử nghiệm:
    1.  JSON API của VIEApps CMS (Nhanh, chuẩn nhất).
    2.  Bóc tách HTML Table (`cheerio`).
    3.  Regex phần thân bài (Body Text).
    4.  Cấu trúc thẻ Div đặc thù.
    5.  Quét chuỗi rộng (Broad Search).
*   **Kết quả:** Hệ thống có khả năng tự xoay sở tốt đa nền tảng, đảm bảo không bao giờ bị đứt gãy mạch dữ liệu tự động hàng ngày.

## 2. Logic Thời Gian Điều Hành Mới (Offset 08:00 AM)
*   **Vấn đề cũ:** Giá cũ được áp dụng "cắt múi" ngay tại `00:00` phút của ngày điều chỉnh, gây sai số với Ca làm việc thực tế tại Cảng (vốn tính thời gian theo khung 08:00 AM).
*   **Nâng cấp:** Bổ sung trường `effectiveAt` vào Schema Database (`backend/schema.sql` và `frontend/src/types/index.ts`). Tạo thư viện `vietnamTime.ts` xử lý giờ chuẩn VN để xác định mốc áp dụng. Nếu có giá mới, nó chỉ tự động "giật" (offset) mốc tính phụ thu khi qua 08:00 AM của ngày có hiệu lực.
*   **Kết quả:** Sai lệch dòng tiền phụ thu bị triệt tiêu hoàn toàn. Khớp tuyệt đối với thương vụ.

## 3. Mass Reconciliation — Đối Soát Hàng Loạt (Excel Engine)
*   **Vấn đề cũ:** Module Đối soát (`ReconciliationModule.tsx`) trước đây ở mức thủ công, cực kỳ vất vả khi kế toán phải quét QR / nhập từng lệnh một (100 lệnh mất nửa ngày).
*   **Nâng cấp:**
    *   Thay nguyên module Đối Soát bằng bản Excel Batch Processing (hơn 1.000 dòng React code).
    *   Bổ sung tab **Import Excel**. Dùng thư viện `exceljs` để trích xuất file Excel với màu sắc đánh dấu các lô cont có rủi ro, sai sót giá (Xanh = khớp; Đỏ = lệch giá dầu cần đối soát).
    *   Kèm tính năng **Lịch sử Logs** ngay bên trong. Kiểm duyệt bảo mật: Module đã có Admin guard (`canEdit`), chỉ quản lý mới thao tác nâng cao được (tránh nhân sự cấp thấp xả data).
    *   Code CSS cũ được loại bỏ để nhúng trực tiếp dùng bộ Tailwind CSS.

## 4. Bật/Tắt Cơ Sở Dữ Liệu nhanh (In-Memory Toggle)
*   **Hỗ trợ Dev:** Để bạn dễ test bản cập nhật, tôi đã tích hợp sẵn tính năng "In-memory database". Giờ đây bạn có thể kéo code về, vào `backend/db.ts` chuyển sang In-memory Mode và gõ `npm run dev` để chạy test luôn toàn bộ giao diện/chức năng mà **không cần cài PostgreSQL**. Xem `INSTRUCTIONS_DB_TOGGLE.md` để biết thêm chi tiết.

### 🔥 Summary (Git Impact):
*   **Thư viện thêm:** `cheerio`, `exceljs`
*   **Chỉnh sửa backend:** Scraper tự động an toàn hơn, schema thêm 1 cột `effective_at`
*   **Chỉnh sửa frontend:** Module đối soát được lên máy mới chạy cực khỏe bằng Excel, AppContext đã có chức năng Auto-Sync móc thời gian.

Rất mong bạn xem xét, xác nhận kết quả test (có thể xài in-memory để kiểm chứng lẹ module Excel) và Merge Pull Request này.
Trân trọng!
