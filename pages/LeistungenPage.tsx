
import React from 'react';
import { ServicesGrid } from '../components/ServicesGrid';
import { ProcessSteps } from '../components/ProcessSteps';
import { ServiceFeatures } from '../components/ServiceFeatures';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { AnimatedSection } from '../components/AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

interface LeistungenPageProps {
    setCurrentPage: (page: string) => void;
}

const LeistungenPage: React.FC<LeistungenPageProps> = ({ setCurrentPage }) => {
    const { t } = useLanguage();

    return (
        <main>
            <ServicesGrid />
            
            {/* Redesign Section */}
            <section className="py-24 bg-light-bg dark:bg-dark-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-primary font-bold tracking-widest uppercase text-xs">{t('leistungen_page.redesign.badge')}</span>
                                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-dark-text dark:text-light-text font-serif mb-6">
                                    {t('leistungen_page.redesign.title_prefix')} <br/><span className="text-gradient">{t('leistungen_page.redesign.title_highlight')}</span>
                                </h2>
                                <p className="text-lg text-dark-text/70 dark:text-light-text/70 mb-8 leading-relaxed">
                                    {t('leistungen_page.redesign.text_1')}
                                    <br/><br/>
                                    {t('leistungen_page.redesign.text_2')}
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {[
                                        t('leistungen_page.redesign.list.1'),
                                        t('leistungen_page.redesign.list.2'),
                                        t('leistungen_page.redesign.list.3'),
                                        t('leistungen_page.redesign.list.4')
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-dark-text/80 dark:text-light-text/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-70"></div>
                                <BeforeAfterSlider 
                                    beforeImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop&sat=-100" 
                                    afterImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" 
                                    beforeLabel={t('leistungen_page.redesign.slider.before')}
                                    afterLabel={t('leistungen_page.redesign.slider.after')}
                                />
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
