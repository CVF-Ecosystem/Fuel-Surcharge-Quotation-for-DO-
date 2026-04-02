import {
  pageWrapperLg, pageTitleLg, pageSubtitle,
  btnSecondary, searchInput, searchIcon, searchWrapper,
  badgeInfo, badgeSuccess, badgeDanger, badgeDefault,
  headerRow as _headerRow, headerCol as _headerCol,
  searchBar as _searchBar, cardLgOverflow,
} from './shared';

// ─── Page ───────────────────────────────────────────────────────────────────
export const wrapper = pageWrapperLg;
export const headerRow = _headerRow;
export const headerCol = _headerCol;
export const title = pageTitleLg;
export const subtitle = pageSubtitle;
export const exportBtn = btnSecondary;

// ─── Search ─────────────────────────────────────────────────────────────────
export const searchBar = _searchBar;
export const searchWrap = searchWrapper;
export const searchIcn = searchIcon;
export const searchInp = searchInput;
export const filterBtn =
  "px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all flex items-center gap-2 text-sm";

// ─── Table ──────────────────────────────────────────────────────────────────
export const tableCard = cardLgOverflow;
export const tableScroll = "overflow-x-auto";
export const table = "w-full text-left border-collapse";
export const thead =
  "bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest";
export const th = "px-4 py-2.5";
export const thRight = "px-4 py-2.5 text-right";
export const thCenter = "px-4 py-2.5 text-center";
export const tbody = "divide-y divide-slate-100";
export const row = "hover:bg-slate-50/50 transition-colors group";

// Row cells
export const tdQuoteNo = "px-4 py-2.5";
export const quoteNoRow = "flex items-center gap-2";
export const quoteNoIcon = "bg-indigo-50 p-1.5 rounded-md text-indigo-600";
export const quoteNoText = "font-bold text-slate-800 text-sm";
export const tdCustomer = "px-4 py-2.5";
export const customerName = "font-bold text-slate-700 text-sm";
export const customerCreator =
  "text-[10px] text-slate-400 font-medium flex items-center gap-1";
export const tdDate = "px-4 py-2.5";
export const dateText = "text-sm font-medium text-slate-500 flex items-center gap-1.5";
export const dateIcon = "w-3.5 h-3.5 text-slate-300";
export const tdTotal = "px-4 py-2.5 text-right";
export const totalText = "font-black text-slate-800 text-sm";
export const tdStatus = "px-4 py-2.5 text-center";
export const statusCenter = "flex justify-center";
export const tdActions = "px-4 py-2.5 text-center";
export const actionRow = "flex items-center justify-center gap-1.5";
export const viewBtn =
  "p-1.5 rounded-md bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all";
export const downloadBtn =
  "p-1.5 rounded-md bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all";
export const deleteBtn =
  "p-1.5 rounded-md bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all";

// Status badges
export { badgeInfo, badgeSuccess, badgeDanger, badgeDefault };

// ─── Empty State ────────────────────────────────────────────────────────────
export const emptyWrapper = "p-12 flex flex-col items-center justify-center text-center";
export const emptyIconBox = "bg-slate-50 p-4 rounded-full mb-3";
export const emptyIcon = "w-10 h-10 text-slate-200";
export const emptyTitle = "text-base font-bold text-slate-800 mb-1";
export const emptyText = "text-sm text-slate-400 max-w-xs";
