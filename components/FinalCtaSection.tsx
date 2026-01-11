
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { RocketLaunchIcon, PaperAirplaneIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

// Simple Star Icon
const Star = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

interface FinalCtaSectionProps {
    setCurrentPage: (page: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ setCurrentPage }) => {
    const { t } = useLanguage();

    return (
        <section className="py-24 px-4 bg-light-bg dark:bg-dark-bg">
            <AnimatedSection>
                <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-dark-bg text-white shadow-2xl border border-white/10 group">
                     {/* Background gradients */}
                    <div className="absolute inset-0 z-0 opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
                         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] transform -translate-x-1/3 translate-y-1/3 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-pattern opacity-10"></div>
                    </div>

                    <div className="relative z-10 px-8 py-20 md:px-20 md:py-32 text-center">
                        
                        {/* Reviews Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-white/10 animate-fade-up">
                            <div className="flex gap-0.5 text-yellow-400">
                                <Star className="w-4 h-4" />
                                <Star className="w-4 h-4" />
                                <Star className="w-4 h-4" />
                                <Star className="w-4 h-4" />
                                <Star className="w-4 h-4" />
                            </div>
                            <span className="text-white/90">{t('final_cta.badge')}</span>
                        </div>

                        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            {t('final_cta.title_prefix')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-400 to-orange-400 animate-gradient-xy">{t('final_cta.title_highlight')}</span>
                        </h2>
                        
                        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-12 leading-relaxed font-light animate-fade-up" style={{ animationDelay: '0.2s' }}>
                           {t('final_cta.text')}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            <button
                                onClick={() => setCurrentPage('preise')}
                                className="btn-glow group bg-white text-dark-bg font-bold px-10 py-5 text-lg rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-white/10 active:scale-95 flex items-center gap-3 relative overflow-hidden"
                            >
                               <RocketLaunchIcon className="w-6 h-6 text-primary group-hover:text-primary-hover" />
                               <span className="relative z-10">{t('final_cta.btn_primary')}</span>
                            </button>
                            <button
                                onClick={() => setCurrentPage('contact')}
                                className="group bg-white/5 border border-white/20 text-white font-semibold px-10 py-5 text-lg rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm active:scale-95 flex items-center gap-3"
                            >
                               <PaperAirplaneIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                               {t('final_cta.btn_secondary')}
                            </button>
                        </div>
                        
                        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-8 opacity-60 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                             <span className="text-xs font-bold tracking-widest uppercase">{t('final_cta.trust.1')}</span>
                             <span className="hidden md:block w-1 h-1 bg-white rounded-full"></span>
                             <span className="text-xs font-bold tracking-widest uppercase">{t('final_cta.trust.2')}</span>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </section>
    );
};
