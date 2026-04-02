import {
  pageWrapper, pageTitle, card, sectionHeaderRow, sectionTitle,
  tableHead, thCenter, thLeft as _thLeft, thRight as _thRight,
  tdBase as _tdBase, tdRight, tdCenter as _tdCenter,
  tableRowBorder, tableRowActive, tableRowHover,
  badgeActive, badgeInactive, iconBoxIndigo, iconBoxEmerald,
  tabNum,
} from './shared';

// Re-export shared table tokens so component can use S.thLeft, S.thRight, etc.
export const thLeft = _thLeft;
export const thRight = _thRight;
export const tdBase = _tdBase;
export const tdCenter = _tdCenter;

// ─── Page ───────────────────────────────────────────────────────────────────
export const wrapper = pageWrapper;

// ─── Hero Section ───────────────────────────────────────────────────────────
export const heroTitle = "text-xl lg:text-2xl font-black text-slate-800 tracking-tight mb-0.5";
export const heroSubtitle = "text-slate-400 font-semibold text-xs uppercase tracking-wide mb-4";
export const heroGrid = "grid grid-cols-1 lg:grid-cols-5 gap-4";

// Fuel Index Card
export const fuelCard =
  "lg:col-span-3 relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a2a4a] to-[#0d3b66] text-white p-5 lg:p-6 shadow-lg";
export const fuelCardBubbleTopRight =
  "absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2";
export const fuelCardBubbleBottomLeft =
  "absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2";
export const fuelCardContent = "relative z-10 flex min-h-[200px] flex-col items-center justify-center text-center";
export const fuelBadgeRow = "flex items-center gap-2 mb-3";
export const fuelBadgeIcon = "bg-amber-500/20 p-1.5 rounded-md";
export const fuelBadgeIconInner = "w-5 h-5 text-amber-400";
export const fuelBadgeLabel = "text-xs font-bold uppercase tracking-widest text-amber-400";
export const fuelSubLabel = "text-white/70 font-semibold text-sm mb-1";
export const fuelPriceRow = "flex items-baseline justify-center gap-3 mb-4";
export const fuelPriceValue = "text-4xl lg:text-5xl font-black tracking-tight";
export const fuelPriceUnit = "text-white/60 font-bold text-base";
export const fuelMetaRow = "flex flex-wrap items-center justify-center gap-3 text-sm";
export const fuelDateChip = "flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md";
export const fuelDateIcon = "w-4 h-4 text-white/60";
export const fuelDateText = "font-semibold text-white/80";
export const fuelDeltaBase = "flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold";
export const fuelDeltaUp = "bg-rose-500/20 text-rose-300";
export const fuelDeltaFlat = "bg-yellow-500/20 text-yellow-300";
export const fuelDeltaDown = "bg-emerald-500/20 text-emerald-300";
export const fuelDeltaIcon = "w-4 h-4";

// Tier Status Card
export const tierCard =
  "lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:p-6 flex flex-col items-center justify-center text-center";
export const tierStatusLabel = "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";
export const tierStatusTitle = "text-lg font-black text-slate-800 mb-3";
export const tierBadgeWrapper = "relative mb-3";
export const tierBadgeBox =
  "w-20 h-24 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-center justify-center shadow-md shadow-amber-100";
export const tierBadgeNumber = "text-4xl font-black text-[#0d3b66]";
export const tierBadgeDot = "absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full";
export const tierLabel = "text-base font-extrabold text-[#0d3b66] mb-0.5";
export const tierRange = "text-sm text-slate-500 font-semibold mb-3";
export const tierInfoBox = "bg-slate-50 rounded-lg px-3 py-2.5 flex items-start gap-2 text-left";
export const tierInfoIcon = "w-4 h-4 text-indigo-500 mt-0.5 shrink-0";
export const tierInfoText = "text-xs text-slate-500 font-medium leading-relaxed";

// ─── Surcharge Tables Section ───────────────────────────────────────────────
export const tablesGrid = "grid grid-cols-1 xl:grid-cols-2 gap-4";
export const tableCard = `${card} overflow-hidden`;
export const tableHeaderRow = sectionHeaderRow;
export const tableHeaderIcon = iconBoxIndigo;
export const tableHeaderTitle = "font-bold text-slate-800 text-base";
export const tableScrollWrapper = "overflow-x-auto";
export const table = "w-full text-sm";
export const thead = tableHead;
export const thStt = `${thCenter} w-12`;

// Dynamic row classes (use with cn())
export const rowBase = tableRowBorder;
export const rowActive = tableRowActive;
export const rowIdle = tableRowHover;
export const sttActive = badgeActive;
export const sttIdle = badgeInactive;
export const cellActive = "text-indigo-700";
export const cellIdle = "text-slate-600";
export const cellValueActive = "text-indigo-700";
export const cellValueIdle = "text-slate-700";
export const cellValue = (active: boolean) =>
  `${tdRight} ${tabNum} ${active ? cellValueActive : cellValueIdle}`;
export const cellRange = (active: boolean) =>
  `${tdBase} ${active ? cellActive : cellIdle}`;
export const cellPercent = (active: boolean) =>
  `${tdRight} font-bold ${tabNum} ${active ? "text-indigo-600" : "text-slate-700"}`;

// ─── Chart Section ──────────────────────────────────────────────────────────
export const chartCard = `${card} overflow-hidden`;
export const chartHeader =
  "px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3";
export const chartHeaderLeft = "flex items-center gap-2";
export const chartHeaderIcon = iconBoxEmerald;
export const chartTitle = sectionTitle;

// Range Toggle
export const rangeToggle = "flex bg-slate-100 rounded-lg p-0.5 text-xs font-bold";
export const rangeBtn = "px-3 py-1.5 rounded-md transition-all";
export const rangeBtnActive = "bg-white text-slate-800 shadow-sm";
export const rangeBtnIdle = "text-slate-400 hover:text-slate-600";

export const chartBody = "p-4 min-h-[350px]";
export const chartEmpty = "h-[350px] flex items-center justify-center";
export const chartEmptyText = "text-slate-400 font-bold";

// Tooltip
export const tooltipCard = "bg-white rounded-lg shadow-xl border border-slate-200 px-3 py-2.5 min-w-[160px]";
export const tooltipDate = "text-xs text-slate-400 font-bold mb-1";
export const tooltipPrice = "text-base font-black text-slate-800";
export const tooltipTierRow = "mt-1.5 flex items-center gap-2";
export const tooltipTierBadge =
  "inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold";
export const tooltipTierLabel = "text-xs font-bold text-indigo-600";

// Chart config objects
export const chartColors = {
  stroke: '#0d3b66',
  gradientStart: '#0d3b66',
  gridStroke: '#e2e8f0',
  refLineStroke: '#e2e8f0',
  refLabelFill: '#94a3b8',
  tickFill: '#64748b',
};

export const axisTick = { fontSize: 11, fill: chartColors.tickFill, fontWeight: 600 };
