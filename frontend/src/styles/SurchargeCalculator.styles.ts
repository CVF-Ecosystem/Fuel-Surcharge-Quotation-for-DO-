import {
  pageWrapper, pageSubtitle, card, cardLg,
  iconBoxIndigo, labelSm, inputLg, select,
  btnPrimary, btnPrimarySm,
  pageTitleUppercase, headerColSm,
  fieldGroup as _fieldGroup,
} from './shared';

// ─── Page ───────────────────────────────────────────────────────────────────
export const wrapper = pageWrapper;
export const headerCol = headerColSm;
export const title = pageTitleUppercase;
export const subtitle = pageSubtitle;
export const subtitleBold = "text-slate-700";

// ─── Current Prices Cards ───────────────────────────────────────────────────
export const pricesGrid = "grid grid-cols-1 md:grid-cols-3 gap-4";
export const priceCardBase = "p-4 rounded-lg border-2 transition-all shadow-sm";
export const priceCardActive = "border-indigo-600 bg-white ring-2 ring-indigo-50";
export const priceCardIdle = "border-transparent bg-white";
export const priceCardHeader = "flex justify-between items-start mb-1";
export const priceCardLabel = "text-xs font-bold text-slate-400 uppercase tracking-widest";
export const priceCardBadge =
  "bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase";
export const priceCardValueRow = "flex items-baseline gap-1";
export const priceCardValueActive = "text-2xl font-black text-indigo-600";
export const priceCardValueIdle = "text-2xl font-black text-slate-700";
export const priceCardUnit = "text-sm font-bold text-slate-400";

// ─── Calculator Panel ───────────────────────────────────────────────────────
export const calcPanel =
  "bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden";
export const calcGrid = "p-4 lg:p-5 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8";
export const calcLeft = "space-y-5";

// Cargo type toggle
export const toggleWrapper = "grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg";
export const toggleBtn = (active: boolean) =>
  `py-2 px-3 rounded-md font-bold text-sm transition-all ${active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`;

// Form fields
export const fieldsGroup = "space-y-4";
export const fieldGroup = _fieldGroup;
export const label = labelSm;
export const input = inputLg;
export const selectInput = select;
export const fieldRow = "grid grid-cols-2 gap-4";

// Info box
export const infoBox =
  "bg-indigo-50 rounded-lg p-4 border border-indigo-100 flex gap-3";
export const infoIconBox = "bg-white p-2.5 rounded-lg shadow-sm text-indigo-600";
export const infoLabel = "text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1";
export const infoText = "text-sm text-slate-700 font-medium";
export const infoTier = "text-sm text-slate-600 mt-1";
export const infoTierValue = "font-bold text-indigo-600";
export const infoEmpty = "text-sm text-slate-400 mt-1 italic";

// ─── Result Panel ───────────────────────────────────────────────────────────
export const resultPanel =
  "bg-slate-50 rounded-xl p-5 lg:p-8 flex flex-col justify-center items-center text-center border border-slate-200 relative";
export const resultLabel =
  "absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]";
export const resultValueBlock = "space-y-1 mb-6";
export const resultValue =
  "text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tighter pb-1";
export const resultCurrency = "text-sm font-bold text-slate-400 uppercase tracking-widest mt-1";
export const resultVatNote =
  "text-xs font-medium text-amber-600 mt-1.5 bg-amber-50 rounded py-1 px-2.5 inline-block";

// Breakdown rows
export const breakdownWrapper = "w-full space-y-3 mb-6";
export const breakdownRow =
  "flex justify-between items-center text-sm font-bold text-slate-500 border-b border-slate-200 pb-2";
export const breakdownValue = "text-slate-800";
export const breakdownSurcharge = "text-indigo-600";
export const breakdownVat = "text-rose-600";
export const breakdownMethod = "text-indigo-600";

// Submit button
export const submitBtn =
  "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 text-base";

// ─── Data Tables ────────────────────────────────────────────────────────────
export const tablesGrid = "grid grid-cols-1 lg:grid-cols-5 gap-4";

// Container tier table
export const tierSection = "lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden";
export const tierHeader = "px-4 py-3 border-b border-slate-200 flex items-center justify-between";
export const tierHeaderLeft = "flex items-center gap-2";
export const tierHeaderIcon = iconBoxIndigo;
export const tierHeaderTitle = "font-bold text-slate-800 text-sm";
export const tierScrollWrapper = "overflow-x-auto pb-2";
export const tierTableInner = "min-w-[600px] px-3";
export const tierTable = "w-full text-left border-collapse border border-slate-200";
export const tierThead = "text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50/80";
export const tierTh = "px-4 py-2.5 border border-slate-200";
export const tierThCenter = "px-4 py-2.5 border border-slate-200 w-12 text-center";
export const tierThRight = "px-4 py-2.5 text-right border border-slate-200";
export const tierRowActive = "bg-indigo-50/50 border-l-4 border-l-indigo-600";
export const tierRowIdle = "hover:bg-slate-50";
export const tierTd = "px-4 py-2.5 border border-slate-200";
export const tierTdCenter = "px-4 py-2.5 border border-slate-200 text-center text-xs font-bold text-slate-500";
export const tierTdName = "px-4 py-2.5 border border-slate-200 text-xs font-bold text-slate-700";
export const tierTdValue = "px-4 py-2.5 border border-slate-200 text-right text-xs font-bold text-slate-600";
export const tierTdPercent = "px-4 py-2.5 border border-slate-200 text-right text-xs font-black text-indigo-600";
export const tierTdDelete = "px-4 py-2.5 border border-slate-200 text-center";
export const deleteBtn = "text-slate-400 hover:text-rose-500 transition-colors mx-auto";
export const deleteIcon = "w-4 h-4 mx-auto";

// Bulk tier table
export const bulkSection = "lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden";
export const bulkTableInner = "min-w-[400px] px-3";
