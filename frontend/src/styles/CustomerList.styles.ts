import {
  pageWrapperLg, pageTitleLg, pageSubtitle,
  btnPrimary, cardHover, searchInput, searchIcon, searchWrapper,
  btnPrimarySm, btnGhost,
  modalBackdrop, modalPanel, modalHeader, modalTitle, modalClose, modalFooter,
  headerRow as _headerRow, headerCol as _headerCol,
  searchBar as _searchBar,
  fieldGroup as _fieldGroup, fieldGroupFull as _fieldGroupFull,
  fieldLabel as _fieldLabel, fieldInput as _fieldInput, fieldSelect as _fieldSelect,
  modalFormBody, formGrid as _formGrid,
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

// ─── Customer Grid ──────────────────────────────────────────────────────────
export const grid = "grid grid-cols-1 md:grid-cols-2 gap-4";
export const customerCard =
  "bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group flex flex-col";
export const cardTop = "flex items-start justify-between mb-3";
export const cardTopLeft = "flex items-center gap-3";
export const cardIconBox = "bg-indigo-50 p-3 rounded-lg text-indigo-600";
export const cardIcon = "w-5 h-5";
export const cardName = "font-bold text-slate-800 text-base leading-tight";
export const cardTax = "text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5";
export const cardBadgeRow = "flex items-center gap-2";
export const cardBadge = (active: boolean) =>
  `text-[10px] font-black px-2 py-0.5 rounded uppercase ${active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`;

// Contact rows
export const contactBlock = "space-y-2 mb-4 flex-1";
export const contactRow = "flex items-center gap-2 text-sm text-slate-500 font-medium";
export const contactIcon = "w-4 h-4 text-slate-300";
export const addressRow =
  "flex items-start gap-2 text-sm text-slate-500 font-medium h-10 overflow-hidden line-clamp-2";
export const addressIcon = "w-4 h-4 text-slate-300 flex-shrink-0 mt-1";

// Action buttons
export const actionRow = "flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto";
export const quoteBtn =
  "flex-[1.5] flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-all";
export const editBtn =
  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-all";
export const deleteBtn =
  "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all";
export const smallIcon = "w-3 h-3";
export const deleteIcon = "w-4 h-4";

// ─── Empty ──────────────────────────────────────────────────────────────────
export const empty = "col-span-full py-12 text-center text-slate-400 font-medium";

// ─── Modal ──────────────────────────────────────────────────────────────────
export const modalBg = modalBackdrop;
export const modalBox = `${modalPanel} max-w-2xl max-h-[90vh]`;
export const modalHead = modalHeader;
export const modalTtl = modalTitle;
export const modalCloseBtn = modalClose;
export const modalBody = modalFormBody;
export const formGrid = _formGrid;
export const fieldGroup = _fieldGroup;
export const fieldGroupFull = _fieldGroupFull;
export const fieldLabel = _fieldLabel;
export const fieldInput = _fieldInput;
export const fieldSelect = _fieldSelect;
export const modalFoot = modalFooter;
export const cancelBtn = btnGhost;
export const saveBtn = btnPrimarySm;
