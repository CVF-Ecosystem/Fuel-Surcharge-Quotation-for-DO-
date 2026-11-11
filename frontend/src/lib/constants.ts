/**
 * Thuế GTGT áp dụng cho phụ thu. Đổi một chỗ này khi thuế suất thay đổi
 * (trước đây số 0.08 / 1.08 nằm rải rác ở nhiều file).
 */
export const VAT_RATE = 0.08;
export const VAT_MULTIPLIER = 1 + VAT_RATE;
