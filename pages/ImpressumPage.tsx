
import React from 'react';
import { AnimatedSection, EnvelopeIcon, PhoneIcon } from '../components';
import { useLanguage } from '../contexts';

const ImpressumPage: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen py-24 sm:py-32 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20 -z-10"></div>

            {/* Floating decorative elements */}
            <div className="absolute top-20 right-[10%] w-72 h-72 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <AnimatedSection>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Header with gradient text */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200/60 dark:border-blue-800/30 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Rechtliches
                        </div>
                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">
                                {t('impressum.title')}
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('impressum.subtitle')}
                        </p>
                    </div>

                    {/* Enhanced content card with glass effect */}
                    <div className="space-y-0">
                        {/* Main card with gradient border */}
                        <div className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/30 dark:shadow-black/30 overflow-hidden">
                            {/* Animated gradient line at top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500 animate-gradient-xy"></div>

                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-violet-400/5 rounded-full blur-3xl"></div>

                            <div className="relative space-y-10 text-slate-700 dark:text-slate-300">
                                {/* Company Info Section */}
                                <section className="group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <span className="font-bold text-lg">S</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {t('impressum.section_tmg')}
                                        </h2>
                                    </div>
                                    <div className="pl-13 space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <p style={{ whiteSpace: 'pre-line' }} className="text-base">
                                            {t('impressum.address')}
                                        </p>
                                    </div>
                                </section>

                                {/* Contact Section with enhanced styling */}
                                <section className="group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <EnvelopeIcon className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {t('impressum.section_contact')}
                                        </h2>
                                    </div>
                                    <div className="pl-13 space-y-3 text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                            <PhoneIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                            <span className="text-base">{t('impressum.phone')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                            <EnvelopeIcon className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                                            <span className="text-base">
                                                <span className="text-slate-500 dark:text-slate-500">{t('impressum.email_label')}</span>{' '}
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">{t('impressum.email')}</span>
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                {/* VAT Section */}
                                <section className="group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <span className="font-bold text-lg">%</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {t('impressum.section_vat')}
                                        </h2>
                                    </div>
                                    <div className="pl-13 space-y-2 text-slate-600 dark:text-slate-400 text-base">
                                        <p>{t('impressum.section_vat_text')}</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{t('impressum.vat_number')}</p>
                                    </div>
                                </section>

                                {/* Responsible Section */}
                                <section className="group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <span className="font-bold text-lg">R</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {t('impressum.section_responsible')}
                                        </h2>
                                    </div>
                                    <div className="pl-13 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                        <p style={{ whiteSpace: 'pre-line' }}>
                                            {t('impressum.responsible_text')}
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Disclaimer Section - Separate card */}
                        <div className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/30 dark:shadow-black/30 overflow-hidden mt-8">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 animate-gradient-xy"></div>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                                        <span className="font-bold text-lg">!</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {t('impressum.section_disclaimer')}
                                    </h2>
                                </div>

                                <div className="space-y-6 text-slate-600 dark:text-slate-400">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {t('impressum.liability_content')}
                                        </h3>
                                        <p className="text-base leading-relaxed">{t('impressum.liability_content_text')}</p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                                            {t('impressum.liability_links')}
                                        </h3>
                                        <p className="text-base leading-relaxed">{t('impressum.liability_links_text')}</p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            {t('impressum.copyright')}
                                        </h3>
                                        <p className="text-base leading-relaxed">{t('impressum.copyright_text')}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </main>
    );
};

export default ImpressumPage;
