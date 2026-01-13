import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { CodeBracketIcon, LightBulbIcon, ArrowTrendingUpIcon, RocketLaunchIcon, AnimatedSection } from './index';
import { useLanguage } from '../contexts';

const iconMap: { [key: string]: ReactNode } = {
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

export const InteractiveTimeline = () => {
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
        let isMounted = true;
        const handleScroll = () => {
            if (!isMounted) return;
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

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            isMounted = false;
            window.removeEventListener('scroll', handleScroll);
        };
    }, [milestones]);

    return (
        <section id="story" className="py-28 sm:py-36 bg-surface dark:bg-dark-surface relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                color: 'rgb(148 163 184)'
            }}></div>

            {/* Animated gradient orbs */}
            <div className="absolute top-[20%] left-0 w-96 h-96 bg-gradient-to-br from-primary-400/5 to-violet-400/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-0 w-96 h-96 bg-gradient-to-br from-violet-400/5 to-secondary-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center mb-20 sm:mb-24">
                        <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-primary-50 to-violet-50 dark:from-primary-900/30 dark:to-violet-900/30 text-sm font-semibold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/30 shadow-sm">
                            Unsere Geschichte
                        </span>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
                            {t('timeline.title')}
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-dark-text/60 dark:text-light-text/60 leading-relaxed">
                            {t('timeline.subtitle')}
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
                    {/* Sticky Navigation (Left) */}
                    <div className="hidden lg:block relative">
                        {/* Animated timeline connector */}
                        <div className="absolute left-[28px] top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent">
                            <div
                                className="absolute inset-0 bg-gradient-to-b from-primary-500 via-violet-500 to-secondary-500 transition-all duration-700 ease-out"
                                style={{
                                    top: `${((activeId - 1) / (milestones.length - 1)) * 100}%`,
                                    height: `${100 / (milestones.length - 1)}%`,
                                }}
                            ></div>
                        </div>

                        <div className="sticky top-28 space-y-10">
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
                                        className={`group flex items-center gap-5 w-full text-left transition-all duration-500 ease-out ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
                                    >
                                        {/* Timeline dot */}
                                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ease-out ${isActive ? `bg-gradient-to-br ${gradient} shadow-lg shadow-primary-500/20` : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`}>
                                            <div className={`w-2.5 h-2.5 rounded-full bg-white transition-all duration-500 ease-out ${isActive ? 'scale-100' : 'scale-50'}`}></div>
                                            {isActive && (
                                                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} animate-ping opacity-20`}></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-3xl sm:text-4xl font-bold font-serif transition-colors duration-500 ease-out block ${isActive ? `text-transparent bg-clip-text bg-gradient-to-r ${gradient}` : 'text-slate-300 dark:text-slate-700'}`}>
                                                {milestone.year}
                                            </span>
                                            <span className={`text-sm font-medium transition-colors duration-500 ease-out truncate block ${isActive ? 'text-dark-text dark:text-light-text' : 'text-slate-500'}`}>
                                                {milestone.title}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scrollable Content (Right) */}
                    <div className="space-y-20 lg:space-y-40">
                        {milestones.map((milestone, index) => {
                            const isActive = activeId === milestone.id;
                            const gradient = gradients[index % gradients.length];
                            const bgGradient = gradient.replace('from-', 'from-').replace(' to-', ' to-');

                            return (
                                <div
                                    key={milestone.id}
                                    id={`milestone-${milestone.id}`}
                                    ref={(el) => { refs.current[index] = el; }}
                                    className="scroll-mt-28 transition-all duration-500 ease-out"
                                >
                                    {/* Mobile year display */}
                                    <div className="lg:hidden mb-5 flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}>
                                            {milestone.year.slice(-2)}
                                        </div>
                                        <span className={`text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                                            {milestone.year}
                                        </span>
                                    </div>

                                    {/* Card */}
                                    <div
                                        className={`group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/90 backdrop-blur-sm border transition-all duration-500 ease-out ${isActive ? `border-primary-200 dark:border-primary-800/50 shadow-premium-lg scale-100` : 'border-slate-200 dark:border-slate-800 scale-[0.98] opacity-60'}`}
                                    >
                                        {/* Animated gradient border for active card */}
                                        {isActive && (
                                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-10 blur-xl -z-10`}></div>
                                        )}

                                        <div className="relative">
                                            {/* Icon container */}
                                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-6 sm:mb-8 transform transition-all duration-500 ease-out ${isActive ? 'scale-100' : 'scale-95'}`}>
                                                <span className="w-8 h-8 sm:w-10 sm:h-10">{iconMap[milestone.icon_name] ?? <CodeBracketIcon />}</span>
                                            </div>

                                            <h3 className="text-xl sm:text-2xl font-bold text-dark-text dark:text-light-text mb-3">{milestone.title}</h3>
                                            <p className="text-base sm:text-lg text-dark-text/60 dark:text-light-text/60 leading-relaxed">
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