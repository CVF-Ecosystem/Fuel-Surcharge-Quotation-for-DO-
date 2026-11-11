/**
 * Chuẩn hóa ngày về 'YYYY-MM-DD' để ghi vào cột DATE của PostgreSQL.
 * Nhận: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm...', 'dd/mm/yyyy' (định dạng vi-VN mà
 * frontend đang lưu ở báo giá) hoặc Date. Không hợp lệ → null.
 * (Postgres mặc định đọc 'dd/mm/yyyy' theo MDY nên ngày > 12 sẽ lỗi.)
 */
export function toIsoDate(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  const raw = String(value).trim();
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return build(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const vi = raw.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (vi) return build(Number(vi[3]), Number(vi[2]), Number(vi[1]));

  return null;
}

function build(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
