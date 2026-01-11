
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CodeBracketIcon, LightBulbIcon, ArrowTrendingUpIcon, RocketLaunchIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: { [key: string]: React.ReactNode } = {
    'CodeBracketIcon': <CodeBracketIcon />,
    'LightBulbIcon': <LightBulbIcon />,
    'ArrowTrendingUpIcon': <ArrowTrendingUpIcon />,
    'RocketLaunchIcon': <RocketLaunchIcon />,
};

export const InteractiveTimeline: React.FC = () => {
    const { t } = useLanguage();
    const [activeId, setActiveId] = useState(1);
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    const milestones = useMemo(() => [
        { id: 1, year: "2015", title: t('timeline.milestones.1.title'), description: t('timeline.milestones.1.desc'), icon_name: "CodeBracketIcon" },
        { id: 2, year: "2018", title: t('timeline.milestones.2.title'), description: t('timeline.milestones.2.desc'), icon_name: "LightBulbIcon" },
        { id: 3, year: "2021", title: t('timeline.milestones.3.title'), description: t('timeline.milestones.3.desc'), icon_name: "ArrowTrendingUpIcon" },
        { id: 4, year: "2023", title: t('timeline.milestones.4.title'), description: t('timeline.milestones.4.desc'), icon_name: "RocketLaunchIcon" },
    ], [t]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            refs.current.forEach((ref, index) => {
                if (ref) {
                    const { offsetTop, offsetHeight } = ref;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveId(milestones[index].id);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [milestones]);

    return (
        <section id="story" className="py-24 sm:py-32 bg-surface dark:bg-dark-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="text-center mb-24">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
                            {t('timeline.title')}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
                            {t('timeline.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Sticky Navigation (Left) */}
                    <div className="hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            {milestones.map((milestone) => (
                                <button 
                                    key={milestone.id}
                                    onClick={() => {
                                        const el = document.getElementById(`milestone-${milestone.id}`);
                                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }}
                                    className={`group flex items-center gap-6 w-full text-left transition-all duration-500 ${activeId === milestone.id ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}`}
                                >
                                    <span className={`text-5xl font-bold font-serif transition-colors duration-500 ${activeId === milestone.id ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>
                                        {milestone.year}
                                    </span>
                                    <span className={`text-lg font-medium transition-colors duration-500 ${activeId === milestone.id ? 'text-dark-text dark:text-light-text' : 'text-slate-500'}`}>
                                        {milestone.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Content (Right) */}
                    <div className="space-y-24 lg:space-y-48">
                        {milestones.map((milestone, index) => (
                            <div 
                                key={milestone.id} 
                                id={`milestone-${milestone.id}`}
                                ref={(el) => { if (refs.current) refs.current[index] = el; }}
                                className="scroll-mt-32 transition-opacity duration-500"
                            >
                                <div className="lg:hidden mb-4 text-primary font-bold text-3xl font-serif">{milestone.year}</div>
                                
                                <div className={`p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl transition-all duration-500 ${activeId === milestone.id ? 'ring-2 ring-primary/20 shadow-primary/10 scale-100' : 'scale-95 opacity-80 grayscale'}`}>
                                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                                        {iconMap[milestone.icon_name]}
                                    </div>
                                    <h3 className="text-2xl font-bold text-dark-text dark:text-light-text mb-4">{milestone.title}</h3>
                                    <p className="text-lg text-dark-text/70 dark:text-light-text/70 leading-relaxed">
                                        {milestone.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};