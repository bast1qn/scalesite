import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { CheckBadgeIcon, ClockIcon, ShieldCheckIcon, EuroIcon, RocketLaunchIcon, UserGroupIcon } from './Icons';

const benefits = [
    {
        icon: <ClockIcon className="w-6 h-6" />,
        title: 'In 48h live',
        description: 'Deine Website ist schneller fertig als bei anderen Agenturen, die Wochen brauchen.'
    },
    {
        icon: <EuroIcon className="w-6 h-6" />,
        title: '80% günstiger',
        description: 'Vergleichbare Qualität zu einem Bruchteil der Kosten von herkömmlichen Agenturen.'
    },
    {
        icon: <ShieldCheckIcon className="w-6 h-6" />,
        title: '30 Tage Garantie',
        description: 'Volles Geld-zurück ohne Wenn und Aber, wenn du nicht zufrieden bist.'
    },
    {
        icon: <UserGroupIcon className="w-6 h-6" />,
        title: 'Persönlicher Support',
        description: 'Du hast einen direkten Ansprechpartner, kein Ticket-System oder Wartezeiten.'
    },
    {
        icon: <RocketLaunchIcon className="w-6 h-6" />,
        title: 'Modernste Technik',
        description: 'Built with React, TypeScript und Tailwind - blitzschnell und SEO-optimiert.'
    },
    {
        icon: <CheckBadgeIcon className="w-6 h-6" />,
        title: 'Alles inklusive',
        description: 'SSL, Hosting, Domain, Impressum, Datenschutz - alles fertig eingerichtet.'
    }
];

export const WhyChooseUsSection: React.FC = () => {
    return (
        <section className="py-24 bg-white dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                            <CheckBadgeIcon className="w-4 h-4" />
                            <span>Warum ScaleSite?</span>
                        </div>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                            6 Gründe für die richtige Wahl
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Keine Kompromisse bei Qualität, Geschwindigkeit und Preis
                        </p>
                    </div>
                </AnimatedSection>

                <AnimatedSection stagger>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-container">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{benefit.title}</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Comparison table */}
                <AnimatedSection>
                    <div className="mt-20 max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Feature</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">ScaleSite</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-500 line-through">Andere Agenturen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {[
                                        { feature: 'Lieferzeit', us: '48 Stunden', them: '2-6 Wochen' },
                                        { feature: 'Preis (One-Pager)', us: 'ab 29€', them: '99€ - 299€' },
                                        { feature: 'Geld-zurück Garantie', us: '30 Tage ✓', them: 'Nein ✗' },
                                        { feature: 'Persönlicher Support', us: 'Direkt ✓', them: 'Ticket-System ✗' },
                                        { feature: 'Versteckte Kosten', us: 'Nein ✗', them: 'Oft ja ✓' }
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                                            <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{row.feature}</td>
                                            <td className="px-6 py-4 text-sm text-center font-semibold text-green-600 dark:text-green-400">{row.us}</td>
                                            <td className="px-6 py-4 text-sm text-center text-slate-500 dark:text-slate-500">{row.them}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-4">* Preise basieren auf durchschnittlichen Marktpreisen</p>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};
