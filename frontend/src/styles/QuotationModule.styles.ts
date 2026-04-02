// QuotationModule uses inline style objects instead of Tailwind.
// Shared CSSProperties are imported from shared-inline.ts.

import type { CSSProperties } from 'react';
export { root, header, headerTitle, headerSub, headerActions, mainGrid, cBtn } from './shared-inline';

// ─── Toast (QuotationModule-specific) ────────────────────────────────────────
export const toastBase: CSSProperties = {
  position: 'fixed',
  top: 20,
  right: 20,
  zIndex: 9999,
  padding: '12px 20px',
  borderRadius: 8,
  color: 'white',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};

export const toastBg: Record<string, string> = {
  error: '#dc3545',
  info: '#17a2b8',
  success: '#28a745',
};
