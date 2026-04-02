// Shared inline style objects (React.CSSProperties) used by
// QuotationModule and ServiceRegistrationModule.

import type { CSSProperties } from 'react';

// ─── Root ───────────────────────────────────────────────────────────────────
export const root = (isMobile: boolean): CSSProperties => ({
  fontFamily: "'Roboto', sans-serif",
  background: '#f0f2f5',
  minHeight: '100vh',
  padding: isMobile ? '8px' : '16px',
});

// ─── Header ─────────────────────────────────────────────────────────────────
export const header: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 20,
};
export const headerTitle: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 700 };
export const headerSub: CSSProperties = { margin: '2px 0 0', color: '#6c757d', fontSize: 12 };
export const headerActions: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' };

// ─── Main Grid ──────────────────────────────────────────────────────────────
export const mainGrid = (isMobile: boolean): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: isMobile ? 10 : 16,
  alignItems: 'start',
});

// ─── Button helper ──────────────────────────────────────────────────────────
export const cBtn = (bg: string): CSSProperties => ({
  background: bg,
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 13,
});

// ─── Form Elements ──────────────────────────────────────────────────────────
export const cLabel: CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: '#868e96',
  textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3,
};
export const cInput: CSSProperties = {
  width: '100%', border: '1px solid #dee2e6', borderRadius: 4,
  padding: '5px 8px', fontSize: 13, boxSizing: 'border-box',
  outline: 'none', background: '#fff', marginBottom: 0,
};
export const cTh: CSSProperties = {
  textAlign: 'left', padding: '6px 8px', fontSize: 11, fontWeight: 700,
  color: '#6c757d', textTransform: 'uppercase', border: '1px solid #dee2e6',
};
export const cTd: CSSProperties = {
  padding: '5px 8px', border: '1px solid #dee2e6', verticalAlign: 'middle', fontSize: 12,
};

// ─── Modal ──────────────────────────────────────────────────────────────────
export const modalBackdrop: CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
  zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
};
export const modalBox = (maxW: number): CSSProperties => ({
  background: '#fff', borderRadius: 8, width: '90%', maxWidth: maxW,
  padding: 24, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
});
export const modalHeader: CSSProperties = { display: 'flex', justifyContent: 'space-between', marginBottom: 16 };
export const modalTitle: CSSProperties = { margin: 0, fontWeight: 'bold' };
export const modalClose: CSSProperties = { border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 };
export const modalActionsRow: CSSProperties = { display: 'flex', gap: 10, marginBottom: 16 };

// ─── Hidden A4 Print ────────────────────────────────────────────────────────
export const hiddenWrapper: CSSProperties = { position: 'absolute', top: -9999, left: -9999 };
export const a4Page: CSSProperties = {
  width: '210mm', height: '297mm', background: '#fff',
  padding: '15mm', color: '#000', fontFamily: 'Arial, sans-serif',
};

// ─── Preview ────────────────────────────────────────────────────────────────
export const previewBorder: CSSProperties = { border: '1px solid #dee2e6', borderRadius: 6, overflow: 'hidden' };
export const previewImg: CSSProperties = { width: '100%', display: 'block' };
export const previewPlaceholder: CSSProperties = {
  border: '2px dashed #dee2e6', borderRadius: 6, aspectRatio: '1/1.414',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', color: '#adb5bd', gap: 6,
};
export const previewLabel: CSSProperties = { fontWeight: 600, fontSize: 12 };
