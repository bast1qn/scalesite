// ============================================
// CLASSNAME PATTERNS - Reusable UI Patterns
// DRY: Extract frequently duplicated className strings
// ============================================

/**
 * Button-style patterns for interactive elements
 * Used across 8+ files for consistent button styling
 */
export const buttonPatterns = {
  /** Primary action button with hover scale effect */
  primary: 'group w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-500/50 min-h-11',

  /** Secondary action button with icon support */
  withIcon: 'group px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-white/50 min-h-11',

  /** Call-to-action button with gradient */
  cta: 'group px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-500/50 min-h-11',
} as const;

/**
 * Card patterns for container elements
 */
export const cardPatterns = {
  /** Standard card with hover effect */
  interactive: 'group p-5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-blue-300/60 dark:hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer',

  /** Static info card */
  static: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-lg shadow-slate-200/50 dark:shadow-black/30',

  /** KPI card with optional click handler */
  kpi: 'group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden transition-all duration-300',
} as const;

/**
 * Input field patterns
 */
export const inputPatterns = {
  /** Standard text input */
  text: 'w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',

  /** Textarea for multi-line input */
  textarea: 'w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none',
} as const;

/**
 * Badge patterns for status indicators
 */
export const badgePatterns = {
  /** Info badge with blue theme */
  info: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 shadow-sm',

  /** Success badge with green theme */
  success: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm',

  /** Warning badge with amber theme */
  warning: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 shadow-sm',

  /** Error badge with red theme */
  error: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40 shadow-sm',
} as const;

/**
 * Animation classes
 */
export const animationPatterns = {
  /** Fade in animation */
  fadeIn: 'animate-fade-in',

  /** Shimmer effect for loading states */
  shimmer: 'animate-shimmer',

  /** Pulse animation */
  pulse: 'animate-pulse',

  /** Gradient position animation */
  gradientXy: 'animate-gradient-xy',

  /** Orb floating animation */
  gradientOrb1: 'animate-gradient-orb-1',
  gradientOrb2: 'animate-gradient-orb-2',
} as const;

/**
 * Layout patterns
 */
export const layoutPatterns = {
  /** Standard section spacing */
  section: 'space-y-8',

  /** Grid for card layouts */
  cardGrid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',

  /** Flex center */
  centerFlex: 'flex items-center justify-center',
} as const;
