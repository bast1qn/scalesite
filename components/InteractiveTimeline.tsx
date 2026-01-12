
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

const gradients = [
    'from-blue-500 to-cyan-400',
    'from-amber-500 to-orange-400',
    'from-emerald-500 to-teal-400',
    'from-violet-500 to-purple-400',
];

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
        <section id="story" className="py-24 sm:py-32 bg-surface dark:bg-dark-surface relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-20 dark:opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                color: 'rgb(148 163 184)'
            }}></div>

            {/* Animated gradient orbs */}
            <div className="absolute top-[20%] left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-0 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center mb-24">
                        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/40 dark:to-violet-900/40 text-sm font-semibold text-blue-700 dark:text-blue-300">
                            Unsere Geschichte
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
                            {t('timeline.title')}
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70 leading-relaxed">
                            {t('timeline.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Sticky Navigation (Left) */}
                    <div className="hidden lg:block relative">
                        {/* Animated timeline connector */}
                        <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent">
                            <div
                                className="absolute inset-0 bg-gradient-to-b from-blue-500 via-violet-500 to-purple-500 transition-all duration-700"
                                style={{
                                    top: `${((activeId - 1) / (milestones.length - 1)) * 100}%`,
                                    height: `${100 / (milestones.length - 1)}%`,
                                }}
                            ></div>
                        </div>

                        <div className="sticky top-32 space-y-12">
                            {milestones.map((milestone, index) => {
                                const isActive = activeId === milestone.id;
                                const gradient = gradients[index % gradients.length];
                                return (
                                    <button
                                        key={milestone.id}
                                        onClick={() => {
                                            const el = document.getElementById(`milestone-${milestone.id}`);
                                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }}
                                        className={`group flex items-center gap-6 w-full text-left transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}`}
                                    >
                                        {/* Timeline dot */}
                                        <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? `bg-gradient-to-br ${gradient} shadow-lg shadow-${gradient.split(' ')[0].split('-')[1]}-500/30` : 'bg-slate-200 dark:bg-slate-700'}`}>
                                            <div className={`w-3 h-3 rounded-full bg-white transition-all duration-500 ${isActive ? 'scale-100' : 'scale-50'}`}></div>
                                            {isActive && (
                                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} animate-ping opacity-30`}></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-4xl font-bold font-serif transition-colors duration-500 block ${isActive ? `text-transparent bg-clip-text bg-gradient-to-r ${gradient}` : 'text-slate-300 dark:text-slate-700'}`}>
                                                {milestone.year}
                                            </span>
                                            <span className={`text-base font-medium transition-colors duration-500 ${isActive ? 'text-dark-text dark:text-light-text' : 'text-slate-500'}`}>
                                                {milestone.title}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scrollable Content (Right) */}
                    <div className="space-y-24 lg:space-y-48">
                        {milestones.map((milestone, index) => {
                            const isActive = activeId === milestone.id;
                            const gradient = gradients[index % gradients.length];
                            const bgGradient = gradient.replace('from-', 'from-').replace(' to-', ' to-');

                            return (
                                <div
                                    key={milestone.id}
                                    id={`milestone-${milestone.id}`}
                                    ref={(el) => { if (refs.current) refs.current[index] = el; }}
                                    className="scroll-mt-32 transition-all duration-500"
                                >
                                    {/* Mobile year display */}
                                    <div className="lg:hidden mb-6 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold`}>
                                            {milestone.year.slice(-2)}
                                        </div>
                                        <span className={`text-3xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                                            {milestone.year}
                                        </span>
                                    </div>

                                    {/* Card */}
                                    <div
                                        className={`group relative p-8 rounded-3xl bg-white dark:bg-slate-900/80 backdrop-blur-sm border transition-all duration-500 ${isActive ? `border-transparent shadow-2xl shadow-${gradient.split(' ')[0].split('-')[1]}-500/20 scale-100` : 'border-slate-200 dark:border-slate-800 scale-95 opacity-70 grayscale'}`}
                                        style={isActive ? {
                                            boxShadow: `0 25px 50px -12px rgba(59, 130, 246, 0.15), 0 0 0 1px transparent`,
                                        } : {}}
                                    >
                                        {/* Animated gradient border for active card */}
                                        {isActive && (
                                            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-20 blur-xl`}></div>
                                        )}

                                        <div className="relative">
                                            {/* Icon container */}
                                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-8 transform transition-transform duration-500 ${isActive ? 'scale-100' : 'scale-90'}`}>
                                                {iconMap[milestone.icon_name]}
                                            </div>

                                            <h3 className="text-2xl font-bold text-dark-text dark:text-light-text mb-4">{milestone.title}</h3>
                                            <p className="text-lg text-dark-text/70 dark:text-light-text/70 leading-relaxed">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};