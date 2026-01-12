
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
        <section className="py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 to-dark-bg relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20"></div>

            {/* Floating gradient orbs */}
            <div className="absolute top-20 left-[10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-[10%] w-64 h-64 bg-violet-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                color: 'rgb(148 163 184)'
            }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/40 dark:to-violet-900/40 text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {t('value_props.subtitle')}
                        </span>
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                            {t('value_props.title')}
                        </h2>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-3 gap-8 stagger-container">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/50 ${feature.borderColor} hover:shadow-2xl hover:shadow-${feature.glow} hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
                            >
                                {/* Animated gradient accent */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

                                {/* Animated background glow on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                {/* Icon container with animated background */}
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
                                    <div className={`relative w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        {feature.icon}
                                    </div>
                                </div>

                                <h3 className="relative font-bold text-xl text-slate-900 dark:text-white mb-4 text-center">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="relative text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                                    {t(feature.descKey)}
                                </p>

                                {/* Corner accent */}
                                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
