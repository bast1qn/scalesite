
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { RocketLaunchIcon, PaperAirplaneIcon, ShieldCheckIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

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

                    <div className="relative z-10 px-8 py-16 md:px-20 md:py-28 text-center">

                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-green-500/30 animate-fade-up">
                            <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                            <span className="text-green-300">30 Tage Geld-zurück Garantie</span>
                        </div>

                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            Bereit für deine <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-400 to-orange-400 animate-gradient-xy">professionelle Website?</span>
                        </h2>

                        <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-4 leading-relaxed font-light animate-fade-up" style={{ animationDelay: '0.2s' }}>
                           Starte heute und erhalte deine Website in nur 48 Stunden.
                        </p>

                        {/* Price Anchor */}
                        <p className="text-2xl font-bold text-green-400 mb-8 animate-fade-up" style={{ animationDelay: '0.25s' }}>
                            Ab nur 29€ • Keine versteckten Kosten
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            <button
                                onClick={() => setCurrentPage('preise')}
                                className="btn-glow group bg-white text-dark-bg font-bold px-8 py-4 text-lg rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-white/10 active:scale-95 flex items-center gap-2 relative overflow-hidden"
                            >
                               <RocketLaunchIcon className="w-5 h-5 text-primary group-hover:text-primary-hover" />
                               <span className="relative z-10">Jetzt Angebot sichern</span>
                            </button>
                            <button
                                onClick={() => setCurrentPage('contact')}
                                className="group bg-white/5 border border-white/20 text-white font-semibold px-6 py-4 text-base rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm active:scale-95 flex items-center gap-2"
                            >
                               <PaperAirplaneIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                               <span>Kostenlos beraten lassen</span>
                            </button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-6 opacity-70 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                             <span className="text-xs font-bold tracking-widest uppercase">48h Lieferung</span>
                             <span className="hidden md:block w-1 h-1 bg-white rounded-full"></span>
                             <span className="text-xs font-bold tracking-widest uppercase">100% Zufriedenheitsgarantie</span>
                             <span className="hidden md:block w-1 h-1 bg-white rounded-full"></span>
                             <span className="text-xs font-bold tracking-widest uppercase">Keine Kreditkarte</span>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </section>
    );
};
