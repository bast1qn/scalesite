
import { useState, type FC, useCallback, useMemo } from 'react';
import { AnimatedSection, CheckBadgeIcon, ClockIcon, ShieldCheckIcon, RocketLaunchIcon } from './index';
import { useLanguage } from '../contexts';

const features = [
    {
        icon: <ClockIcon className="w-7 h-7" />,
        titleKey: 'value_props.delivery_title',
        descKey: 'value_props.delivery_desc',
        gradient: 'from-blue-500 to-cyan-400',
        bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
        glow: 'shadow-blue-500/30',
        borderColor: 'hover:border-blue-200 dark:hover:border-blue-800',
        hexFrom: '#3b82f6',
        hexTo: '#22d3ee',
    },
    {
        icon: <ShieldCheckIcon className="w-7 h-7" />,
        titleKey: 'value_props.guarantee_title',
        descKey: 'value_props.guarantee_desc',
        gradient: 'from-emerald-500 to-teal-400',
        bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30',
        glow: 'shadow-emerald-500/30',
        borderColor: 'hover:border-emerald-200 dark:hover:border-emerald-800',
        hexFrom: '#10b981',
        hexTo: '#14b8a6',
    },
    {
        icon: <RocketLaunchIcon className="w-7 h-7" />,
        titleKey: 'value_props.inclusive_title',
        descKey: 'value_props.inclusive_desc',
        gradient: 'from-violet-500 to-purple-400',
        bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30',
        glow: 'shadow-violet-500/30',
        borderColor: 'hover:border-violet-200 dark:hover:border-violet-800',
        hexFrom: '#8b5cf6',
        hexTo: '#a855f7',
    }
];

// Transcendent feature card with 3D effects
const FeatureCardComponent: FC<{
    feature: typeof features[0];
    index: number;
    t: (key: string) => string;
}> = ({ feature, index, t }) => {
    const [transform, setTransform] = useState('');
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: { currentTarget: HTMLDivElement; clientX: number; clientY: number }) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
        setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
        setIsHovered(false);
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);

    return (
        <div
            className="relative"
            style={{ transform, transition: 'transform 0.1s ease-out' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {/* PRISMATIC 3D glow effect following cursor */}
            <div
                className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${feature.hexFrom}33, ${feature.hexTo}22, transparent 60%)`,
                    opacity: isHovered ? 1 : 0,
                }}
            />

            <div
                className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-10 shadow-glow-prism border-2 border-slate-200/60 dark:border-slate-700/50 ${feature.borderColor} hover:shadow-glow-cosmic hover:-translate-y-4 transition-all duration-500 overflow-hidden hover-prismatic-shine card-prismatic`}
                style={{ transitionDelay: `${index * 80}ms` }}
            >
                {/* PRISMATIC shimmer effect */}
                <div className="absolute inset-0 shimmer-sweep rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Holographic overlay */}
                <div className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-30 rounded-3xl transition-opacity duration-500 animate-holographic-shimmer"></div>

                {/* PRISMATIC animated gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-glow-cosmic-sm animate-prism-refraction`}></div>

                {/* PRISMATIC animated background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.3] transition-opacity duration-500 animate-cosmic-shimmer`}></div>

                {/* PRISMATIC Corner accents */}
                <span className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-glow-cosmic-sm animate-crystal-sparkle`}></span>
                <span className={`absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-glow-cosmic-sm animate-crystal-sparkle`} style={{ transitionDelay: '0.2s' }}></span>

                {/* Icon container with PRISMATIC animated background */}
                <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500 animate-glow-breathe shadow-glow-cosmic`}></div>
                    <div className={`relative w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 hover:shadow-glow-cosmic-md animate-crystal-sparkle`}>
                        <div className="group-hover:animate-icon-bounce">
                            {feature.icon}
                        </div>
                    </div>
                </div>

                <h3 className="relative font-bold text-xl text-slate-900 dark:text-white mb-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:translate-x-1 transition-all duration-300" style={{
                    backgroundImage: `linear-gradient(to right, ${feature.hexFrom}, ${feature.hexTo})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {t(feature.titleKey)}
                </h3>
                <p className="relative text-slate-600 dark:text-slate-400 text-center leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                    {t(feature.descKey)}
                </p>

                {/* PRISMATIC corner accent */}
                <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${feature.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-tl-3xl animate-nebula-pulse`}></div>
            </div>
        </div>
    );
};

const FeatureCard = FeatureCardComponent;

export const TestimonialsSection: FC = () => {
    const { t } = useLanguage();

    return (
        <section className="py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 to-dark-bg relative overflow-hidden">
            {/* COSMIC AURORA LEGENDARY OVERLAY */}
            <div className="absolute inset-0 bg-aurora-gradient animate-aurora-wave opacity-25 pointer-events-none"></div>

            {/* COSMIC NEBULA OVERLAY */}
            <div className="absolute inset-0 animate-nebula-cloud opacity-15 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 30% 20%, rgba(138, 43, 226, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                    animationDuration: '50s',
                }}
            ></div>

            {/* HOLOGRAPHIC overlay */}
            <div className="absolute inset-0 holographic-base opacity-15 pointer-events-none animate-holographic-shimmer"></div>

            {/* COSMIC animated background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/30 animate-cosmic-shimmer"></div>

            {/* COSMIC floating gradient orbs */}
            <div className="absolute top-20 left-[10%] w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/25 rounded-full blur-3xl animate-nebula-cloud shadow-glow-cosmic"></div>
            <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-gradient-to-br from-violet-400/30 to-pink-400/25 rounded-full blur-3xl animate-nebula-cloud shadow-glow-nebula" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-[50%] w-60 h-60 bg-gradient-to-br from-emerald-400/20 to-teal-400/15 rounded-full blur-3xl animate-antigravity shadow-glow-aurora" style={{ animationDelay: '1s' }}></div>

            {/* COSMIC PARTICLES */}
            {useMemo(() => Array.from({ length: 25 }, (_, i) => {
                const isBlue = Math.random() > 0.5;
                const size = 6 + Math.random() * 8;
                return (
                    <div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 rounded-full animate-antigravity shadow-glow-cosmic-sm"
                        style={{
                            left: `${5 + Math.random() * 90}%`,
                            bottom: `${Math.random() * 50}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${5 + Math.random() * 5}s`,
                            background: isBlue
                              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%)',
                            boxShadow: `0 0 ${size}px ${isBlue ? 'rgba(59, 130, 246, 0.6)' : 'rgba(139, 92, 246, 0.6)'}`,
                        }}
                    ></div>
                );
            }), [])}

            {/* COSMIC dot pattern */}
            <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none animate-starfield" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2px)',
                backgroundSize: '40px 40px',
                color: 'rgb(148 163 184)'
            }}></div>

            {/* COSMIC STARDUST FIELD */}
            <div className="absolute inset-0 stardust-field opacity-30 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <span className="inline-block px-6 py-2 mb-8 rounded-2xl glass-prismatic text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/40 shadow-glow-cosmic hover:shadow-glow-aurora hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group hover-prismatic-shine">
                            <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 holographic-base opacity-0 group-hover:opacity-30 rounded-2xl transition-opacity duration-500"></div>
                            <span className="relative z-10">{t('value_props.subtitle')}</span>
                        </span>
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 animate-cosmic-shimmer">
                                {t('value_props.title')}
                            </span>
                        </h2>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-3 gap-10 stagger-container">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.titleKey}
                                feature={feature}
                                index={index}
                                t={t}
                            />
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
