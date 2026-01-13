
import { AnimatedSection, ShieldCheckIcon, EyeIcon, LockClosedIcon, AdjustmentsHorizontalIcon } from '../components';
import { useLanguage } from '../contexts';

const DatenschutzPage = ({ setCurrentPage }: { setCurrentPage: (page: string) => void; }) => {
    const { t } = useLanguage();

    const privacySections = [
        {
            id: 1,
            icon: ShieldCheckIcon,
            iconGradient: 'from-blue-500 to-cyan-500',
            title: t('datenschutz.section1_title'),
            subtitle: t('datenschutz.section1_subtitle'),
            text: t('datenschutz.section1_text'),
        },
        {
            id: 2,
            icon: EyeIcon,
            iconGradient: 'from-violet-500 to-purple-500',
            title: t('datenschutz.section2_title'),
            items: [
                { q: t('datenschutz.section2_q1'), a: t('datenschutz.section2_a1') },
                { q: t('datenschutz.section2_q2'), a: t('datenschutz.section2_a2') },
            ],
        },
        {
            id: 3,
            icon: LockClosedIcon,
            iconGradient: 'from-emerald-500 to-teal-500',
            title: t('datenschutz.section3_title'),
            text: t('datenschutz.section3_text'),
        },
        {
            id: 4,
            icon: AdjustmentsHorizontalIcon,
            iconGradient: 'from-amber-500 to-orange-500',
            title: t('datenschutz.section4_title'),
            text: t('datenschutz.section4_text'),
        },
    ];

    return (
        <main className="min-h-screen py-24 sm:py-32 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 -z-10"></div>

            {/* Floating decorative elements */}
            <div className="absolute top-32 left-[5%] w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-[5%] w-72 h-72 bg-gradient-to-br from-blue-400/8 to-violet-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <AnimatedSection>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Header with gradient text */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/60 dark:border-emerald-800/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Datenschutz
                        </div>
                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-[length:200%_auto] animate-gradient">
                                {t('datenschutz.title')}
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('datenschutz.subtitle')}
                        </p>
                    </div>

                    {/* Enhanced content cards with glass effect */}
                    <div className="space-y-6">
                        {privacySections.map((section) => {
                            const IconComponent = section.icon;
                            return (
                                <AnimatedSection key={section.id} direction="up" delay={section.id * 100}>
                                    <div className="group relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/30 dark:shadow-black/30 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1">
                                        {/* Animated gradient line at top */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${section.iconGradient} animate-gradient-xy`}></div>

                                        {/* Decorative glow */}
                                        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${section.iconGradient} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`}></div>

                                        <div className="relative">
                                            {/* Icon header */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.iconGradient} flex items-center justify-center text-white shadow-lg group-hover:scale-[1.02] group-hover:rotate-3 transition-all duration-300`}>
                                                    <IconComponent className="w-6 h-6" />
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                                    {section.title}
                                                </h2>
                                            </div>

                                            {/* Content */}
                                            <div className="pl-16 space-y-4">
                                                {section.subtitle && (
                                                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                                        {section.subtitle}
                                                    </h3>
                                                )}
                                                {section.text && (
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                                        {section.text}
                                                    </p>
                                                )}
                                                {section.items && (
                                                    <div className="space-y-4">
                                                        {section.items.map((item, idx) => (
                                                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.iconGradient}`}></span>
                                                                    {item.q}
                                                                </h3>
                                                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                                                    {item.a}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            );
                        })}
                    </div>

                    {/* Trust badge at bottom */}
                    <div className="mt-12 flex justify-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/60 dark:border-emerald-800/30 shadow-lg">
                            <ShieldCheckIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    DSGVO-konform
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Ihre Daten sind bei uns sicher
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </main>
    );
};

export default DatenschutzPage;
