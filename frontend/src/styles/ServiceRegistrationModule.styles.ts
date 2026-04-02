// ServiceRegistrationModule uses inline style objects.
// Shared CSSProperties are imported from shared-inline.ts.

import type { CSSProperties } from 'react';
import { cInput as _cInput } from './shared-inline';
export {
  root, header, headerTitle, headerSub, headerActions, mainGrid, cBtn,
  cLabel, cInput, cTh, cTd,
  modalBackdrop, modalBox, modalHeader, modalTitle, modalClose, modalActionsRow,
  hiddenWrapper, a4Page, previewBorder, previewImg, previewPlaceholder, previewLabel,
} from './shared-inline';

// ─── Form Card ──────────────────────────────────────────────────────────────
export const formCard: CSSProperties = {
  background: '#fff',
  borderRadius: 8,
  padding: '16px 20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
};
export const sectionTitle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: '1px solid #e9ecef',
  color: '#343a40',
};
export const fieldRow2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 };
export const fieldRowSingle: CSSProperties = { marginBottom: 8 };
export const fieldRowNotes: CSSProperties = { marginBottom: 16 };

// ─── Table inline select/input overrides ────────────────────────────────────
export const cInputSm: CSSProperties = { ..._cInput, padding: '3px 6px', fontSize: 12 };
export const cInputSmCenter: CSSProperties = { ..._cInput, padding: '3px 4px', fontSize: 12, textAlign: 'center' };

// ─── Table wrapper ──────────────────────────────────────────────────────────
export const tableScroll: CSSProperties = { overflowX: 'auto', marginBottom: 8 };
export const table: CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12 };
export const theadRow: CSSProperties = { background: '#f8f9fa' };

// ─── Add row button ─────────────────────────────────────────────────────────
export const addRowBtn: CSSProperties = {
  background: '#4361ee', color: '#fff', border: 'none', borderRadius: 5,
  padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 13, marginBottom: 10,
};
export const removeRowBtn: CSSProperties = {
  color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0,
};

// ─── Right Panel ────────────────────────────────────────────────────────────
export const rightCard: CSSProperties = {
  background: '#fff', borderRadius: 8, padding: '16px 20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 12,
};
export const actionGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 };

// ─── Service modal form ─────────────────────────────────────────────────────
export const serviceForm: CSSProperties = {
  background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 16,
  display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end',
};
export const serviceFormName: CSSProperties = { flex: '1 1 200px' };
export const serviceFormUnit: CSSProperties = { flex: '0 0 100px' };

// ─── Button styles for modals ───────────────────────────────────────────────
export const importBtn: CSSProperties = {
  background: '#28a745', color: '#fff', padding: '6px 12px',
  borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600,
};
export const exportBtn: CSSProperties = {
  background: '#4c6ef5', color: '#fff', border: 'none', borderRadius: 4,
  padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
export const saveBtn: CSSProperties = {
  background: '#4361ee', color: '#fff', border: 'none', borderRadius: 4,
  padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
export const cancelBtn: CSSProperties = {
  background: '#6c757d', color: '#fff', border: 'none', borderRadius: 4,
  padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
export const editBtn: CSSProperties = {
  background: '#ffc107', color: '#000', border: 'none', borderRadius: 3,
  padding: '4px 8px', fontSize: 12, marginRight: 6, cursor: 'pointer', fontWeight: 600,
};
export const deleteBtn: CSSProperties = {
  background: '#dc3545', color: '#fff', border: 'none', borderRadius: 3,
  padding: '4px 8px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
};

// History modal
export const historyExportBtn: CSSProperties = {
  background: '#198754', color: '#fff', border: 'none', borderRadius: 4,
  padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
export const historyViewBtn: CSSProperties = {
  background: '#f8f9fa', color: '#000', border: '1px solid #ccc',
  borderRadius: 3, padding: '4px 8px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
};
