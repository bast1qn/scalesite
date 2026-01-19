import { useState, type FC, type ReactNode, memo, useCallback } from 'react';
import { AnimatedSection } from './AnimatedSection'; import { Icons } from './Icons';
import { useLanguage } from '../contexts';
import { TEXT_GRADIENT_PRIMARY } from '../lib/ui-patterns';

const usps = [
  {
    icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />,
    emoji: '💬',
    nameKey: 'usps.items.personal.name',
    descKey: 'usps.items.personal.desc',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <CheckBadgeIcon className="w-6 h-6" />,
    emoji: '✓',
    nameKey: 'usps.items.quality.name',
    descKey: 'usps.items.quality.desc',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    emoji: '⚡',
    nameKey: 'usps.items.tech.name',
    descKey: 'usps.items.tech.desc',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: <RocketLaunchIcon className="w-6 h-6" />,
    emoji: '🚀',
    nameKey: 'usps.items.goals.name',
    descKey: 'usps.items.goals.desc',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    gradient: 'from-orange-500 to-amber-500',
  },
];

// ✅ PERFORMANCE: Memoized HoverCard to prevent unnecessary re-renders
const HoverCard: FC<{
  children: ReactNode;
  className?: string;
}> = memo(({ children, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // ✅ PERFORMANCE: Use stable callbacks for event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className={`relative transition-all duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
});
HoverCard.displayName = 'HoverCard';

export const UspSection: FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-6">
              <span className={TEXT_GRADIENT_PRIMARY}>
                {t('usps.title')}
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('usps.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {usps.map((usp) => (
              <HoverCard key={usp.nameKey}>
                <div className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus-within:ring-2 focus-within:ring-primary-500/50 cursor-pointer">
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r ${usp.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  {/* Icon container */}
                  <div className={`w-14 h-14 ${usp.bg} ${usp.color} rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-[1.02]`}>
                    {usp.icon}
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 transition-all duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {t(usp.nameKey)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(usp.descKey)}
                  </p>
                </div>
              </HoverCard>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ✅ PERFORMANCE: Memoize UspSection to prevent unnecessary re-renders
export const UspSectionMemo = memo(UspSection);
