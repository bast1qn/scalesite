import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { PaintBrushIcon, CodeBracketIcon, ServerIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon, ChatBubbleBottomCenterTextIcon, AnimatedSection } from './index';
import { useLanguage } from '../contexts';

const iconMap: { [key: string]: ReactNode } = {
  'PaintBrushIcon': <PaintBrushIcon />,
  'CodeBracketIcon': <CodeBracketIcon />,
  'ServerIcon': <ServerIcon />,
  'ShieldCheckIcon': <ShieldCheckIcon />,
  'SparklesIcon': <SparklesIcon className="w-6 h-6" />,
};

const HoverCard = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`relative group transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export const ServicesGrid = () => {
  const { t } = useLanguage();

  const services = useMemo(() => [
    { id: 1, name: t('services.items.webdesign.name'), description: t('services.items.webdesign.desc'), icon_name: "PaintBrushIcon", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20", border: "group-hover:border-pink-300 dark:group-hover:border-pink-600" },
    { id: 2, name: t('services.items.dev.name'), description: t('services.items.dev.desc'), icon_name: "CodeBracketIcon", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "group-hover:border-blue-300 dark:group-hover:border-blue-600" },
    { id: 3, name: t('services.items.ai.name'), description: t('services.items.ai.desc'), icon_name: "SparklesIcon", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20", border: "group-hover:border-violet-300 dark:group-hover:border-violet-600" },
    { id: 4, name: t('services.items.hosting.name'), description: t('services.items.hosting.desc'), icon_name: "ServerIcon", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "group-hover:border-emerald-300 dark:group-hover:border-emerald-600" },
    { id: 5, name: t('services.items.seo.name'), description: t('services.items.seo.desc'), icon_name: "ShieldCheckIcon", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "group-hover:border-orange-300 dark:group-hover:border-orange-600" },
  ], [t]);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
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
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/40 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-8">
              {t('services.badge')}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">
                {t('services.title')}
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('services.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <HoverCard key={service.name}>
                <div
                  className={`group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 transition-all duration-300 ${service.border} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 cursor-pointer`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-[1.02]`}>
                      {iconMap[service.icon_name]}
                    </div>

                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {service.name}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-grow">
                      {service.description}
                    </p>

                    <div className="mt-6 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-blue-600 dark:text-blue-400">
                        {t('services.more')}
                      </span>
                      <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </HoverCard>
            ))}

            {/* CTA Card */}
            <HoverCard>
              <div className="group relative bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 dark:border-slate-600 rounded-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 cursor-pointer">
                <div className="w-14 h-14 bg-slate-800 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-[1.02]">
                  <ChatBubbleBottomCenterTextIcon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-3">
                  {t('services.cta_card.title')}
                </h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  {t('services.cta_card.text')}
                </p>
                <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary-500/50 min-h-11">
                  {t('services.cta_card.btn')}
                </button>
              </div>
            </HoverCard>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
