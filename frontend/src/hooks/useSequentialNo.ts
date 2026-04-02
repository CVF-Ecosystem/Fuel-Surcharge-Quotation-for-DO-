import { useCallback } from 'react';

interface UseSequentialNoOptions {
  prefix: string;
  counterKey: string; // e.g. 'logipro_daily_counter' — date suffix appended automatically
}

/**
 * Hook tạo số thứ tự theo ngày: PREFIX_DDMM-NNN
 * peek(): chỉ xem số tiếp theo, KHÔNG tăng counter
 * advance(): tăng counter VÀ trả về số mới
 */
export function useSequentialNo({ prefix, counterKey }: UseSequentialNoOptions) {
  const getDateSuffix = useCallback(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return { dd, mm, key: `${counterKey}_${dd}${mm}` };
  }, [counterKey]);

  const peek = useCallback(() => {
    const { dd, mm, key } = getDateSuffix();
    const next = parseInt(localStorage.getItem(key) || '0', 10) + 1;
    return `${prefix}${dd}${mm}-${String(next).padStart(3, '0')}`;
  }, [prefix, getDateSuffix]);

  const advance = useCallback(() => {
    const { dd, mm, key } = getDateSuffix();
    const next = parseInt(localStorage.getItem(key) || '0', 10) + 1;
    localStorage.setItem(key, String(next));
    return `${prefix}${dd}${mm}-${String(next).padStart(3, '0')}`;
  }, [prefix, getDateSuffix]);

  return { peek, advance };
}
