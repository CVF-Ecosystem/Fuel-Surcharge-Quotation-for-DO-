import {
  pageWrapper, pageSubtitle, labelSm,
  pageTitleUppercase, headerColSm,
  fieldGroup as _fieldGroup,
} from './shared';

// ─── Page ───────────────────────────────────────────────────────────────────
export const wrapper = pageWrapper;
export const headerCol = headerColSm;
export const title = pageTitleUppercase;
export const subtitle = pageSubtitle;

// ─── Tab Toggle ─────────────────────────────────────────────────────────────
export const tabBar = "flex bg-slate-200/50 p-1 rounded-lg max-w-md";
export const tabBtn = (active: boolean) =>
  `flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`;

// ─── Scan Section ───────────────────────────────────────────────────────────
export const scanGrid = "grid grid-cols-1 lg:grid-cols-2 gap-4";
export const formCard =
  "bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 p-4 lg:p-5";
export const formHeader = "flex justify-between items-center mb-4";
export const formTitle = "text-base font-bold text-slate-800";
export const scanBtnRow = "flex gap-2";
export const scanBtn = (disabled: boolean) =>
  `bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-100"}`;
export const fieldsWrapper = "space-y-3";
export const fieldRow2 = "grid grid-cols-2 gap-3";
export const fieldGroup = _fieldGroup;
export const label = labelSm;
export const input =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm";
export const inputHighlight =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 font-bold text-indigo-600 text-sm";
export const inputDate =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700 text-sm";
export const selectInput =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm";
export const compareBtn =
  "w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-sm flex justify-center items-center gap-2";

// ─── Results Area ───────────────────────────────────────────────────────────
export const resultPanel =
  "bg-slate-50 rounded-xl border border-slate-200 p-4 lg:p-5 flex flex-col justify-center";
export const emptyResult = "text-center text-slate-400";
export const emptyIcon = "w-10 h-10 mx-auto mb-2 opacity-50";
export const emptyText = "font-medium text-sm";

export const resultSpace = "space-y-4";
export const comparisonCard = "flex justify-between items-center bg-white p-3 rounded-lg shadow-sm";
export const comparisonSide = "text-center flex-1";
export const comparisonSideLeft = "text-center flex-1 border-r border-slate-100";
export const comparisonSideRight = "text-center flex-1 border-l border-slate-100";
export const comparisonLabel = "text-[10px] font-bold text-slate-400 uppercase tracking-widest";
export const comparisonValueOld = "text-base font-black text-slate-700";
export const comparisonValueNew = "text-base font-black text-slate-800";
export const comparisonArrow = "px-3 text-slate-300";

export const deltaCard = "bg-white rounded-xl p-4 text-center shadow-sm";
export const deltaLabel = "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1";
export const deltaValue = (status: string) =>
  `text-3xl font-black tracking-tight ${status === "increase" ? "text-rose-500" : status === "decrease" ? "text-emerald-500" : "text-slate-500"}`;
export const deltaNote = "text-sm font-bold text-slate-500 mt-1";

export const saveBtn =
  "w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg font-bold flex justify-center items-center gap-2";

// ─── History Tab ────────────────────────────────────────────────────────────
export const historyCard =
  "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden";
export const historyHeader = "px-4 py-3 border-b border-slate-200 flex justify-between items-center";
export const historyTitle = "font-bold text-slate-800 text-sm";
export const historyScroll = "overflow-x-auto pb-2";
export const historyInner = "min-w-[800px] px-3";
export const historyTable = "w-full text-left border-collapse border border-slate-200";
export const historyThead =
  "bg-slate-50/80 text-[10px] font-black text-slate-500 uppercase tracking-widest";
export const historyTh = "px-4 py-2.5 border border-slate-200";
export const historyThCenter = "px-4 py-2.5 border border-slate-200 text-center";
export const historyThRight = "px-4 py-2.5 border border-slate-200 text-right";
export const historyRow = "hover:bg-slate-50";
export const historyTd = "px-4 py-2.5 border border-slate-200";
export const historyTdCenter = "px-4 py-2.5 border border-slate-200 text-center text-xs font-medium";
export const historyTdRight = "px-4 py-2.5 border border-slate-200 text-right text-xs font-bold text-slate-500";
export const historyTdRightIndigo = "px-4 py-2.5 border border-slate-200 text-right text-xs font-bold text-indigo-600";
export const historyTdRightDelta = "px-4 py-2.5 border border-slate-200 text-right";
export const historyContId = "font-bold text-slate-700 text-xs";
export const historyContType = "text-[10px] text-slate-400";
export const deltaChip = (status: string) =>
  `text-xs font-black ${status === "increase" ? "text-rose-500" : status === "decrease" ? "text-emerald-500" : "text-slate-400"}`;
export const statusChipIncrease = "bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] font-bold";
export const statusChipDecrease = "bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold";
export const statusChipSame = "bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold";
export const historyTdCenterAction = "px-4 py-2.5 border border-slate-200 text-center";
export const historyEmpty = "text-center py-6 text-slate-400 text-sm";
