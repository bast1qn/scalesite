
import React from 'react';
import { ServicesGrid, ProcessSteps, ServiceFeatures, BeforeAfterSlider, AnimatedSection, SparklesIcon } from '../components';
import { useLanguage } from '../contexts';

interface LeistungenPageProps {
    setCurrentPage: (page: string) => void;
}

const LeistungenPage: React.FC<LeistungenPageProps> = ({ setCurrentPage }) => {
    const { t } = useLanguage();

    return (
        <main className="overflow-hidden">
            <ServicesGrid />

            {/* Redesign Section */}
            <section className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-primary-400/5 to-violet-400/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/4 to-teal-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <AnimatedSection>
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Content */}
                            <div>
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200/60 dark:border-primary-800/30 mb-6 shadow-sm">
                                    <SparklesIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                                        {t('leistungen_page.redesign.badge')}
                                    </span>
                                </div>

                                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                                    {t('leistungen_page.redesign.title_prefix')}{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-violet-600 to-secondary-600 bg-[length:200%_auto]">
                                        {t('leistungen_page.redesign.title_highlight')}
                                    </span>
                                </h2>

                                <p className="text-base text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                    {t('leistungen_page.redesign.text_1')}
                                </p>
                                <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                    {t('leistungen_page.redesign.text_2')}
                                </p>

                                {/* Features List */}
                                <ul className="space-y-3">
                                    {[
                                        { id: 'redesign-1', text: t('leistungen_page.redesign.list.1') },
                                        { id: 'redesign-2', text: t('leistungen_page.redesign.list.2') },
                                        { id: 'redesign-3', text: t('leistungen_page.redesign.list.3') },
                                        { id: 'redesign-4', text: t('leistungen_page.redesign.list.4') }
                                    ].map((item) => (
                                        <li key={item.id} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group">
                                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Slider */}
                            <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute -inset-6 bg-gradient-to-tr from-primary-500/15 via-violet-500/10 to-emerald-500/15 rounded-[3rem] blur-2xl opacity-60"></div>

                                <div className="relative">
                                    <BeforeAfterSlider
                                        beforeImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop&sat=-100"
                                        afterImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                                        beforeLabel={t('leistungen_page.redesign.slider.before')}
                                        afterLabel={t('leistungen_page.redesign.slider.after')}
                                    />
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            <ProcessSteps />
            <ServiceFeatures />
        </main>
    );
};

export default LeistungenPage;
