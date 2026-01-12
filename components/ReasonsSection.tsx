
import React from 'react';
import { ClockIcon, ShieldCheckIcon, SparklesIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const reasons = [
  {
    icon: <ClockIcon className="w-5 h-5" />,
    title: '48h Lieferung',
    description: 'Deine Website ist schneller fertig als bei anderen Agenturen.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    title: '30 Tage Garantie',
    description: 'Volle Geld-zurück Garantie ohne Wenn und Aber.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: <SparklesIcon className="w-5 h-5" />,
    title: 'Alles inklusive',
    description: 'SSL, Hosting, Domain, Impressum, Datenschutz – alles fertig.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  }
];

export const ReasonsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t('reasons.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('reasons.subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${reason.bg} ${reason.color} flex items-center justify-center mb-4`}>
                {reason.icon}
              </div>

              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
