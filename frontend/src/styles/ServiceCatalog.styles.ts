import {
  pageWrapperLg, pageTitleLg, pageSubtitle,
  btnPrimary, searchInput, searchIcon, searchWrapper,
  btnPrimarySm, btnGhost, btnIcon, btnIconDanger,
  modalBackdrop, modalPanel, modalHeader, modalTitle, modalClose, modalFooter,
  headerRow as _headerRow, headerCol as _headerCol,
  searchBar as _searchBar,
  fieldGroup as _fieldGroup, fieldLabel as _fieldLabel, fieldInput as _fieldInput,
  modalFormBodyCompact, formSpace as _formSpace, formFieldRow as _formFieldRow,
  cardLgOverflow,
} from './shared';

// ─── Page ───────────────────────────────────────────────────────────────────
export const wrapper = pageWrapperLg;
export const headerRow = _headerRow;
export const headerCol = _headerCol;
export const title = pageTitleLg;
export const subtitle = pageSubtitle;
export const addBtn = btnPrimary;

// ─── Search ─────────────────────────────────────────────────────────────────
export const searchBar = _searchBar;
export const searchWrap = searchWrapper;
export const searchIcn = searchIcon;
export const searchInp = searchInput;

// ─── Table ──────────────────────────────────────────────────────────────────
export const tableCard = cardLgOverflow;
export const tableScroll = "overflow-x-auto px-3 pb-3";
export const table = "w-full text-left border-separate border-spacing-y-1 mt-2";
export const thead =
  "text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50";
export const thFirst = "px-4 py-2.5 rounded-l-lg";
export const th = "px-4 py-2.5";
export const thRight = "px-4 py-2.5 text-right";
export const thAction = "px-4 py-2.5 text-center rounded-r-lg";

export const rowBase = "group hover:bg-slate-50 transition-all";
export const tdFirst = "px-4 py-3 rounded-l-lg";
export const tdNameRow = "flex items-center gap-3";
export const tdNameIcon = "bg-indigo-50 p-2 rounded-md text-indigo-600";
export const tdNameText = "font-bold text-slate-800 text-sm";
export const td = "px-4 py-3";
export const tdCategory =
  "flex items-center gap-2 text-xs font-bold text-slate-500 px-2.5 py-0.5 bg-slate-100 rounded w-fit";
export const tdUnit = "text-sm font-bold text-slate-400";
export const tdPriceRow = "flex items-center justify-end gap-1 text-indigo-600 font-black text-sm";
export const tdAction = "px-4 py-3 rounded-r-lg text-center";
export const actionRow = "flex items-center justify-center gap-2";
export const editBtnIcon = btnIcon;
export const deleteBtnIcon = btnIconDanger;

// Empty
export const empty = "py-8 text-center text-slate-400 font-medium";

// ─── Modal ──────────────────────────────────────────────────────────────────
export const modalBg = modalBackdrop;
export const modalBox = `${modalPanel} max-w-xl`;
export const modalHead = modalHeader;
export const modalTtl = modalTitle;
export const modalCloseBtn = modalClose;
export const modalBody = modalFormBodyCompact;
export const formSpace = _formSpace;
export const fieldGroup = _fieldGroup;
export const fieldLabel = _fieldLabel;
export const fieldInput = _fieldInput;
export const fieldRow = _formFieldRow;
export const modalFoot = modalFooter;
export const cancelBtn = btnGhost;
export const saveBtn = btnPrimarySm;
