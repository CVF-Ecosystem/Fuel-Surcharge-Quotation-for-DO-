import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  msg: string;
  type: ToastType;
}

export function useToast(durationMs = 3000) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), durationMs);
  }, [durationMs]);

  return { toast, showToast };
}
