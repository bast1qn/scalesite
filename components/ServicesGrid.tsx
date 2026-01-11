
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
    { id: 1, name: t('services.items.webdesign.name'), description: t('services.items.webdesign.desc'), icon_name: "PaintBrushIcon", color: "text-pink-500", bg: "bg-pink-500/10", border: "group-hover:ring-pink-500/50" },
    { id: 2, name: t('services.items.dev.name'), description: t('services.items.dev.desc'), icon_name: "CodeBracketIcon", color: "text-blue-500", bg: "bg-blue-500/10", border: "group-hover:ring-blue-500/50" },
    { id: 3, name: t('services.items.ai.name'), description: t('services.items.ai.desc'), icon_name: "SparklesIcon", color: "text-purple-500", bg: "bg-purple-500/10", border: "group-hover:ring-purple-500/50" },
    { id: 4, name: t('services.items.hosting.name'), description: t('services.items.hosting.desc'), icon_name: "ServerIcon", color: "text-green-500", bg: "bg-green-500/10", border: "group-hover:ring-green-500/50" },
    { id: 5, name: t('services.items.seo.name'), description: t('services.items.seo.desc'), icon_name: "ShieldCheckIcon", color: "text-orange-500", bg: "bg-orange-500/10", border: "group-hover:ring-orange-500/50" },
  ];

  return (
    <section className="py-32 bg-surface dark:bg-dark-surface relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s'}}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-20">
            <span className="text-primary font-bold tracking-widest uppercase text-xs bg-primary/5 border border-primary/20 px-4 py-1.5 rounded-full mb-6 inline-block backdrop-blur-sm">{t('services.badge')}</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight font-serif">
              {t('services.title')}
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('services.subtitle')}
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection stagger>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-container justify-center">
            {services.map((service) => (
              <div 
                key={service.name} 
                className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 hover:-translate-y-1 hover:ring-1 ${service.border}`}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-14 h-14 ${service.bg} ${service.color} border border-current/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                        {iconMap[service.icon_name]}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                        {service.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-grow">
                        {service.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center text-sm font-bold text-primary">
                        {t('services.more')} <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                </div>
              </div>
            ))}
             
             {/* Secondary CTA Card */}
             <div className="group relative bg-primary text-white border border-primary rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-primary/30">
                <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                     <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('services.cta_card.title')}</h3>
                <p className="text-white/90 text-sm mb-8 leading-relaxed">{t('services.cta_card.text')}</p>
                <button className="bg-white text-primary px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg w-full transform active:scale-95">
                    {t('services.cta_card.btn')}
                </button>
             </div>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
