
import React from 'react';
import { PaintBrushIcon, CodeBracketIcon, ServerIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon, ChatBubbleBottomCenterTextIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: { [key: string]: React.ReactNode } = {
  'PaintBrushIcon': <PaintBrushIcon />,
  'CodeBracketIcon': <CodeBracketIcon />,
  'ServerIcon': <ServerIcon />,
  'ShieldCheckIcon': <ShieldCheckIcon />,
  'SparklesIcon': <SparklesIcon className="w-6 h-6" />,
};

export const ServicesGrid: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    { id: 1, name: t('services.items.webdesign.name'), description: t('services.items.webdesign.desc'), icon_name: "PaintBrushIcon", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20", border: "group-hover:border-pink-300 dark:group-hover:border-pink-600" },
    { id: 2, name: t('services.items.dev.name'), description: t('services.items.dev.desc'), icon_name: "CodeBracketIcon", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "group-hover:border-blue-300 dark:group-hover:border-blue-600" },
    { id: 3, name: t('services.items.ai.name'), description: t('services.items.ai.desc'), icon_name: "SparklesIcon", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20", border: "group-hover:border-violet-300 dark:group-hover:border-violet-600" },
    { id: 4, name: t('services.items.hosting.name'), description: t('services.items.hosting.desc'), icon_name: "ServerIcon", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "group-hover:border-emerald-300 dark:group-hover:border-emerald-600" },
    { id: 5, name: t('services.items.seo.name'), description: t('services.items.seo.desc'), icon_name: "ShieldCheckIcon", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", border: "group-hover:border-orange-300 dark:group-hover:border-orange-600" },
  ];

  return (
    <section className="py-28 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/5 to-violet-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/4 to-teal-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-6">
              {t('services.badge')}
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('services.title')}
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              {t('services.subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection stagger>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-container">
            {services.map((service) => (
              <div
                key={service.name}
                className={`group relative bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl ${service.border} hover:-translate-y-1`}
              >
                {/* Gradient line on top (appears on hover) */}
                <div className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent ${service.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`}></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {iconMap[service.icon_name]}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-3">
                        {service.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-grow">
                        {service.description}
                    </p>
                    <div className="mt-6 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" style={{color: 'inherit'}}>
                        {t('services.more')} <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                </div>
              </div>
            ))}

             {/* Secondary CTA Card */}
             <div className="group relative bg-slate-900 dark:bg-slate-700 text-white border border-slate-800 dark:border-slate-600 rounded-2xl p-8 flex flex-col justify-center items-center text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                         <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-3">{t('services.cta_card.title')}</h3>
                    <p className="text-slate-300 text-sm mb-8 leading-relaxed">{t('services.cta_card.text')}</p>
                    <button className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg w-full">
                        {t('services.cta_card.btn')}
                    </button>
                </div>
             </div>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
