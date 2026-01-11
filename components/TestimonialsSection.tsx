
import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { CheckBadgeIcon, ClockIcon, ShieldCheckIcon, RocketLaunchIcon } from './Icons';

const features = [
    {
        icon: <ClockIcon className="w-6 h-6" />,
        title: '48h Lieferung',
        description: 'Ihre Website ist schneller fertig als bei anderen Agenturen.'
    },
    {
        icon: <ShieldCheckIcon className="w-6 h-6" />,
        title: '30 Tage Garantie',
        description: 'Volles Geld-zurück ohne Wenn und Aber.'
    },
    {
        icon: <RocketLaunchIcon className="w-6 h-6" />,
        title: 'Alles inklusive',
        description: 'SSL, Hosting, Domain, Impressum, Datenschutz – alles fertig.'
    }
];

export const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 to-dark-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatedSection>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                            Das bekommen Sie
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Transparente Preise, keine versteckten Kosten
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-3 gap-8 stagger-container">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white mx-auto mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
