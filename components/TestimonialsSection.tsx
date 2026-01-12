
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { CheckBadgeIcon, ClockIcon, ShieldCheckIcon, RocketLaunchIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const features = [
    {
        icon: <ClockIcon className="w-7 h-7" />,
        titleKey: 'value_props.delivery_title',
        descKey: 'value_props.delivery_desc',
        gradient: 'from-blue-500 to-cyan-400',
        bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
        glow: 'shadow-blue-500/30',
        borderColor: 'hover:border-blue-200 dark:hover:border-blue-800',
    },
    {
        icon: <ShieldCheckIcon className="w-7 h-7" />,
        titleKey: 'value_props.guarantee_title',
        descKey: 'value_props.guarantee_desc',
        gradient: 'from-emerald-500 to-teal-400',
        bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30',
        glow: 'shadow-emerald-500/30',
        borderColor: 'hover:border-emerald-200 dark:hover:border-emerald-800',
    },
    {
        icon: <RocketLaunchIcon className="w-7 h-7" />,
        titleKey: 'value_props.inclusive_title',
        descKey: 'value_props.inclusive_desc',
        gradient: 'from-violet-500 to-purple-400',
        bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30',
        glow: 'shadow-violet-500/30',
        borderColor: 'hover:border-violet-200 dark:hover:border-violet-800',
    }
];

export const TestimonialsSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 to-dark-bg relative overflow-hidden">
            {/* Legendary animated mesh gradient overlay */}
            <div className="absolute inset-0 bg-aurora-legendary opacity-20 pointer-events-none"></div>

            {/* Enhanced animated background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/30"></div>

            {/* Enhanced floating gradient orbs */}
            <div className="absolute top-20 left-[10%] w-80 h-80 bg-blue-400/25 rounded-full blur-3xl animate-morph-deluxe shadow-glow-legendary-sm"></div>
            <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-violet-400/25 rounded-full blur-3xl animate-morph-deluxe shadow-glow-legendary-sm" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-[50%] w-60 h-60 bg-emerald-400/15 rounded-full blur-3xl animate-float-deluxe" style={{ animationDelay: '1s' }}></div>

            {/* Enhanced dot pattern */}
            <div className="absolute inset-0 opacity-35 dark:opacity-15 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
                backgroundSize: '32px 32px',
                color: 'rgb(148 163 184)'
            }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <span className="inline-block px-6 py-2 mb-8 rounded-2xl bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/40 dark:to-violet-900/40 text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/40 shadow-legendary hover:shadow-glow-legendary-sm hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 relative overflow-hidden group">
                            <div className="absolute inset-0 shimmer-sweep opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <span className="relative z-10">{t('value_props.subtitle')}</span>
                        </span>
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                            {t('value_props.title')}
                        </h2>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-3 gap-10 stagger-container">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-10 shadow-legendary border-2 border-slate-200/60 dark:border-slate-700/50 ${feature.borderColor} hover:shadow-glow-legendary-lg hover:shadow-${feature.glow} hover:-translate-y-3 transition-all duration-500 overflow-hidden hover-3d-lift`}
                                style={{ transitionDelay: `${index * 80}ms` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 shimmer-sweep rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                {/* Enhanced animated gradient accent */}
                                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-glow-legendary-sm`}></div>

                                {/* Enhanced animated background glow on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 animate-gradient-deluxe`}></div>

                                {/* Icon container with enhanced animated background */}
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-glow-breathe`}></div>
                                    <div className={`relative w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 hover:shadow-glow-legendary-md`}>
                                        <div className="group-hover:animate-icon-bounce">
                                            {feature.icon}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="relative font-bold text-xl text-slate-900 dark:text-white mb-4 text-center group-hover:translate-x-1 transition-transform duration-300">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="relative text-slate-600 dark:text-slate-400 text-center leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                                    {t(feature.descKey)}
                                </p>

                                {/* Enhanced corner accent */}
                                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-glow-legendary-sm`}></div>

                                {/* Bottom accent */}
                                <div className={`absolute bottom-4 left-4 w-3 h-3 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-glow-legendary-sm`} style={{ transitionDelay: '0.2s' }}></div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
