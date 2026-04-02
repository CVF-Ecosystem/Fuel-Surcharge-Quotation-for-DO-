// ─── Shared Style Tokens ────────────────────────────────────────────────────
// Reusable Tailwind class strings used across multiple components.
// Import these in component-specific .styles.ts files to stay DRY.

// ─── Layout ─────────────────────────────────────────────────────────────────
export const pageWrapper = "p-3 lg:p-5 space-y-4 lg:space-y-5 max-w-7xl mx-auto";
export const pageWrapperLg = "p-5 space-y-5 max-w-7xl mx-auto";

// ─── Typography ─────────────────────────────────────────────────────────────
export const pageTitle = "text-xl lg:text-2xl font-black text-slate-800 tracking-tight";
export const pageTitleLg = "text-2xl font-black text-slate-800 tracking-tight";
export const pageSubtitle = "text-slate-500 font-medium text-sm";
export const sectionTitle = "font-bold text-slate-800 text-base";
export const labelXs = "text-[10px] font-bold text-slate-400 uppercase tracking-widest";
export const labelSm = "text-xs font-bold text-slate-400 uppercase tracking-widest";

// ─── Cards ──────────────────────────────────────────────────────────────────
export const card = "bg-white rounded-lg shadow-sm border border-slate-200";
export const cardLg = "bg-white rounded-xl shadow-sm border border-slate-200";
export const cardHover = "bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all";

// ─── Icon Containers ────────────────────────────────────────────────────────
export const iconBox = (color: string) =>
  `bg-${color}-50 p-2 rounded-md text-${color}-600`;
export const iconBoxIndigo = "bg-indigo-50 p-2 rounded-md text-indigo-600";
export const iconBoxEmerald = "bg-emerald-50 p-2 rounded-md text-emerald-600";
export const iconBoxAmber = "bg-amber-50 p-2 rounded-md text-amber-600";
export const iconBoxRose = "bg-rose-50 p-2 rounded-md text-rose-600";

// ─── Buttons ────────────────────────────────────────────────────────────────
export const btnPrimary =
  "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2";
export const btnPrimarySm =
  "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm";
export const btnSecondary =
  "bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-5 rounded-lg shadow-sm border border-slate-200 transition-all flex items-center gap-2 text-sm";
export const btnGhost =
  "px-5 py-2.5 rounded-lg font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm";
export const btnIcon =
  "p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all";
export const btnIconDanger =
  "p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all";

// ─── Form Inputs ────────────────────────────────────────────────────────────
export const input =
  "w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium";
export const inputLg =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium";
export const select =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700";
export const searchInput =
  "w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm";
export const searchWrapper = "relative flex-1";
export const searchIcon = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

// ─── Modal ──────────────────────────────────────────────────────────────────
export const modalBackdrop =
  "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4";
export const modalPanel =
  "bg-white rounded-xl shadow-2xl w-full overflow-hidden flex flex-col";
export const modalHeader =
  "px-5 py-4 flex items-center justify-between border-b border-slate-200 bg-slate-50/50";
export const modalTitle = "text-lg font-black text-slate-800";
export const modalClose =
  "p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors";
export const modalFooter =
  "px-5 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-end gap-3 mt-auto";

// ─── Table ──────────────────────────────────────────────────────────────────
export const tableHead =
  "bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500";
export const th = "px-4 py-2.5";
export const thCenter = "px-4 py-2.5 text-center";
export const thRight = "px-4 py-2.5 text-right";
export const thLeft = "px-4 py-2.5 text-left";
export const tdBase = "px-4 py-2.5";
export const tdCenter = "px-4 py-2.5 text-center";
export const tdRight = "px-4 py-2.5 text-right";
export const tableRowBorder = "border-t border-slate-100 transition-colors";
export const tableRowActive = "bg-indigo-50/50 border-l-4 border-l-indigo-600 font-bold";
export const tableRowHover = "hover:bg-slate-50/50";

// ─── Badge ──────────────────────────────────────────────────────────────────
export const badgeActive =
  "inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold";
export const badgeInactive = "text-slate-400";
export const badgeSuccess =
  "bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1";
export const badgeDanger =
  "bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1";
export const badgeInfo =
  "bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1";
export const badgeDefault =
  "bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1";

// ─── Status Colors ──────────────────────────────────────────────────────────
export const statusActive = "bg-emerald-50 text-emerald-600";
export const statusInactive = "bg-slate-100 text-slate-400";

// ─── Empty State ────────────────────────────────────────────────────────────
export const emptyState =
  "col-span-full py-12 text-center text-slate-400 font-medium";

// ─── Motion Presets ─────────────────────────────────────────────────────────
export const motionFadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
export const motionFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
export const motionScaleIn = {
  initial: { scale: 0.95, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.95, opacity: 0, y: 20 },
};

// ─── Divider ────────────────────────────────────────────────────────────────
export const sectionHeaderRow =
  "px-4 py-3 border-b border-slate-200 flex items-center gap-2";

// ─── Tabular Numbers ────────────────────────────────────────────────────────
export const tabNum = "tabular-nums";

// ─── Page Header (shared across list pages) ─────────────────────────────────
export const pageTitleUppercase = `${pageTitle} uppercase`;
export const headerRow = "flex items-center justify-between";
export const headerCol = "flex flex-col gap-1";
export const headerColSm = "flex flex-col";

// ─── Search Bar Kit (CustomerList, ServiceCatalog, History) ─────────────────
export const searchBar = `${card} p-3 flex items-center gap-3`;

// ─── Form Field Kit ─────────────────────────────────────────────────────────
export const fieldGroup = "space-y-1";
export const fieldGroupFull = "space-y-1 md:col-span-2";
export const fieldLabel = labelXs;
export const fieldInput = input;
export const fieldSelect =
  "w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium";

// ─── Input Variants ─────────────────────────────────────────────────────────
export const inputLgBold =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700";

// ─── Card Variants ──────────────────────────────────────────────────────────
export const cardLgOverflow =
  "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden";

// ─── Modal Form Kit (CustomerList, ServiceCatalog) ──────────────────────────
export const modalFormBody = "p-5 overflow-y-auto";
export const modalFormBodyCompact = "p-5";
export const formGrid = "grid grid-cols-1 md:grid-cols-2 gap-4";
export const formSpace = "space-y-4";
export const formFieldRow = "grid grid-cols-2 gap-4";
