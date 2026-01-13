
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AnimatedSection, BoltIcon, ClockIcon, CpuChipIcon, ChatBubbleBottomCenterTextIcon, RocketLaunchIcon, PhoneIcon, MicrophoneIcon, CalendarDaysIcon, SparklesIcon, CheckBadgeIcon, XMarkIcon, EnvelopeIcon, UserGroupIcon, DocumentMagnifyingGlassIcon, DocumentArrowDownIcon, TagIcon, UserPlusIcon, ArrowRightIcon, PaperAirplaneIcon, ClipboardDocumentCheckIcon, ArrowPathIcon } from '../components';
import { AuthContext, useLanguage, useCurrency } from '../contexts';
import { api } from '../lib';

interface AutomationenPageProps {
    setCurrentPage: (page: string) => void;
}

// --- TYPE DEFINITIONS ---
type FormatPriceFunc = (priceInEur: number, showSymbol?: boolean, decimals?: number) => string;

type PackageColor = 'purple' | 'pink' | 'green' | 'blue';

interface AutomationPackage {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    priceDetail: string;
    monthly: string;
    basePrice: number;
    description: string;
    features: string[];
    icon: React.ReactNode;
    color: PackageColor;
}

interface MicroAutomation {
    title: string;
    price: string;
    basePrice: number;
    desc: string;
    icon: React.ReactNode;
}

type AutomationItem = AutomationPackage | MicroAutomation;

const getAutomationPackages = (language: 'de' | 'en', formatPrice: FormatPriceFunc): AutomationPackage[] => {
    const t = translations[language].automation;
    return [
        {
            id: 'email-ops',
            title: language === 'de' ? "E-Mail Automation" : "Email Automation",
            subtitle: "Inbox Zero System",
            price: formatPrice(59),
            priceDetail: language === 'de' ? "Einmaliges Setup" : "One-time Setup",
            monthly: language === 'de' ? "Keine monatlichen Fixkosten" : "No fixed monthly costs",
            basePrice: 59,
            description: language === 'de'
                ? "Automatische E-Mail-Kategorisierung und Antwort-Entwürfe."
                : "Automatic email categorization and response drafts.",
            features: language === 'de'
                ? ["Auto-Filter für E-Mails", "Antwort-Entwürfe", "Labels & Ordner", "Einfache Integration"]
                : ["Auto email filtering", "Response drafts", "Labels & folders", "Simple integration"],
            icon: <EnvelopeIcon className="w-6 h-6 text-purple-400" />,
            color: "purple"
        },
        {
            id: 'social-content',
            title: language === 'de' ? "Social Media Poster" : "Social Media Poster",
            subtitle: "Auto-Posting Tool",
            price: formatPrice(49),
            priceDetail: language === 'de' ? "Einmaliges Setup" : "One-time Setup",
            monthly: language === 'de' ? "+ Tool-Kosten (ca. 9€)" : "+ Tool costs (approx. 9€)",
            basePrice: 49,
            description: language === 'de'
                ? "Plane deine Social Media Posts einmal und poste überall."
                : "Schedule your social media posts once and post everywhere.",
            features: language === 'de'
                ? ["Auto-Posting (Insta, LinkedIn)", "KI-Caption Generator", "Hashtag-Optimierung"]
                : ["Auto-posting (Insta, LinkedIn)", "AI caption generator", "Hashtag optimization"],
            icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-pink-400" />,
            color: "pink"
        },
        {
            id: 'form-automation',
            title: "Form Automation",
            subtitle: "Smart Forms",
            price: formatPrice(39),
            priceDetail: language === 'de' ? "Einmaliges Setup" : "One-time Setup",
            monthly: language === 'de' ? "Keine monatlichen Fixkosten" : "No fixed monthly costs",
            basePrice: 39,
            description: language === 'de'
                ? "Formulare automatisch mit deinem System synchronisieren."
                : "Automatically sync forms with your system.",
            features: language === 'de'
                ? ["Auto-E-Mail bei Absendung", "CRM Integration", "Daten-Export", "Webhooks"]
                : ["Auto-email on submit", "CRM integration", "Data export", "Webhooks"],
            icon: <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-400" />,
            color: "green"
        },
        {
            id: 'backup-automation',
            title: language === 'de' ? "Automatische Backups" : "Auto Backups",
            subtitle: "Data Safety",
            price: formatPrice(29),
            priceDetail: language === 'de' ? "Einmaliges Setup" : "One-time Setup",
            monthly: language === 'de' ? "+ Storage-Kosten (gering)" : "+ Storage costs (low)",
            basePrice: 29,
            description: language === 'de'
                ? "Automatische Backups deiner wichtigsten Daten."
                : "Automatic backups of your most important data.",
            features: language === 'de'
                ? ["Tägliche Backups", "Cloud Speicher", "30 Tage Aufbewahrung", "E-Mail Benachrichtigung"]
                : ["Daily backups", "Cloud storage", "30 day retention", "Email notifications"],
            icon: <ArrowPathIcon className="w-6 h-6 text-blue-400" />,
            color: "blue"
        }
    ];
};

const getMicroAutomations = (language: 'de' | 'en', formatPrice: FormatPriceFunc): MicroAutomation[] => {
    return [
        { title: language === 'de' ? "Rechnung zu Dropbox" : "Invoice to Dropbox", price: formatPrice(19), basePrice: 19, desc: language === 'de' ? "Speichert E-Mail Anhänge automatisch." : "Auto-saves email attachments.", icon: <DocumentArrowDownIcon className="w-5 h-5"/> },
        { title: language === 'de' ? "Lead zu Slack" : "Lead to Slack", price: formatPrice(19), basePrice: 19, desc: language === 'de' ? "Benachrichtigung bei neuem Lead." : "Notification for new leads.", icon: <ChatBubbleBottomCenterTextIcon className="w-5 h-5"/> },
        { title: language === 'de' ? "Formular zu E-Mail" : "Form to Email", price: formatPrice(9), basePrice: 9, desc: language === 'de' ? "FormularAbsendungen als E-Mail." : "Form submissions as email.", icon: <EnvelopeIcon className="w-5 h-5"/> },
        { title: language === 'de' ? "Auto-Backup" : "Auto Backup", price: formatPrice(19), basePrice: 19, desc: language === 'de' ? "Tägliche Backups deiner Daten." : "Daily backups of your data.", icon: <ArrowPathIcon className="w-5 h-5"/> },
        { title: language === 'de' ? "Social Post" : "Social Post", price: formatPrice(29), basePrice: 29, desc: language === 'de' ? "Postet automatisch auf LinkedIn." : "Auto-posts to LinkedIn.", icon: <PaperAirplaneIcon className="w-5 h-5"/> },
        { title: language === 'de' ? "Geburtstags-Mail" : "Birthday Email", price: formatPrice(9), basePrice: 9, desc: language === 'de' ? "Automatische Glückwünsche." : "Automatic birthday wishes.", icon: <UserGroupIcon className="w-5 h-5"/> },
    ];
};

// Visualizer for Workflow
const WorkflowVisualizer: React.FC<{ language: 'de' | 'en' }> = ({ language }) => {
    const [step, setStep] = useState(0);
    const t = translations[language].automation.workflow;

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const colorMap = {
        blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', shadow: 'shadow-blue-500/30' },
        purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', shadow: 'shadow-purple-500/30' },
        green: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', shadow: 'shadow-emerald-500/30' },
        pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400', shadow: 'shadow-pink-500/30' }
    } as const;

    return (
        <div className="relative w-full max-w-4xl mx-auto h-48 md:h-64 bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden flex items-center justify-between px-8 md:px-16 shadow-2xl hover:shadow-purple-900/20 transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>

            <div className="absolute top-1/2 left-16 right-16 h-px bg-slate-700/50 -translate-y-1/2 z-0"></div>

            <div
                className="absolute top-1/2 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent w-40 -translate-y-1/2 z-0 transition-all duration-[2000ms] ease-linear blur-[1px]"
                style={{ left: `${(step / 3) * 80}%`, opacity: step === 3 ? 0 : 1 }}
            ></div>

            {[
                { icon: <PhoneIcon className="w-6 h-6" />, label: t.input, color: "blue" as keyof typeof colorMap },
                { icon: <CpuChipIcon className="w-6 h-6" />, label: t.brain, color: "purple" as keyof typeof colorMap },
                { icon: <BoltIcon className="w-6 h-6" />, label: t.action, color: "green" as keyof typeof colorMap },
                { icon: <CheckBadgeIcon className="w-6 h-6" />, label: t.done, color: "pink" as keyof typeof colorMap }
            ].map((node, idx) => {
                const colors = colorMap[node.color];
                const isActive = step >= idx;
                return (
                    <div key={idx} className={`relative z-10 flex flex-col items-center transition-all duration-500 ${isActive ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}>
                        <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center border transition-all duration-500 ${
                            isActive
                                ? `${colors.bg} ${colors.border} ${colors.text} shadow-[0_0_30px_rgba(0,0,0,0.3)]`
                                : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                        }`}>
                            {node.icon}
                        </div>
                        <span className={`mt-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-600'}`}>
                            {node.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// Voice Agent Demo Component
const VoiceAgentDemo: React.FC<{ language: 'de' | 'en' }> = ({ language }) => {
    const t = translations[language].automation;
    const msgs = language === 'de'
        ? ["\"Guten Tag, Praxis Dr. Stein. Wie kann ich helfen?\"", "\"Hi, ich muss meinen Termin am Dienstag leider absagen.\"", "\"Alles klar, ich habe den Termin storniert. Sollen wir direkt einen neuen vereinbaren?\""]
        : ["\"Good day, Dr. Stein's practice. How can I help?\"", "\"Hi, I unfortunately have to cancel my Tuesday appointment.\"", "\"Alright, I've cancelled the appointment. Shall we schedule a new one right away?\""];

    return (
        <div className="w-full max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-purple-900/20 transition-all duration-500 hover:shadow-purple-900/30 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full absolute right-0 bottom-0 border-2 border-slate-900 shadow-[0_0_10px_#10b981]"></div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                            <MicrophoneIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-base">{t.voice_demo_title}</h3>
                        <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            {t.voice_demo_status}
                        </p>
                    </div>
                </div>
                <div className="h-6 flex items-center gap-0.5">
                    {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} className="w-1 bg-purple-400 rounded-full animate-music" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-slate-200 self-start border border-white/5 transition-all duration-300 hover:bg-white/10">
                    {msgs[0]}
                </div>
                <div className="bg-purple-600/20 border border-purple-500/30 p-4 rounded-2xl rounded-tr-none text-white self-end text-right ml-auto max-w-[85%] transition-all duration-300 hover:bg-purple-600/30">
                    {msgs[1]}
                </div>
                 <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-slate-200 self-start border border-white/5 transition-all duration-300 hover:bg-white/10">
                    <div className="flex items-center gap-2 mb-2 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                        <CpuChipIcon className="w-3 h-3" /> {t.voice_demo_processing}
                    </div>
                    {msgs[2]}
                </div>
            </div>
        </div>
    )
};

const AutomationenPage: React.FC<AutomationenPageProps> = ({ setCurrentPage }) => {
    const { user } = useContext(AuthContext);
    const { t, language } = useLanguage();
    const { formatPrice } = useCurrency();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<AutomationItem | null>(null);
    const [formStep, setFormStep] = useState<'form' | 'success'>('form');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const automationPackages = useMemo(() => getAutomationPackages(language as 'de' | 'en', formatPrice), [language, formatPrice]);
    const microAutomations = useMemo(() => getMicroAutomations(language as 'de' | 'en', formatPrice), [language, formatPrice]);

    const openModal = (pkg: AutomationItem) => {
        setSelectedPackage(pkg);
        setFormStep('form');
        setModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // Defensively extract form data with null checks
        const name = formData.get('name')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const message = formData.get('message')?.toString() || '';

        // Validate required fields
        if (!name || !email) {
            setIsSubmitting(false);
            alert(language === 'de' ? "Bitte füllen Sie alle Pflichtfelder aus." : "Please fill in all required fields.");
            return;
        }

        // Safely extract description (MicroAutomation uses 'desc', AutomationPackage uses 'description')
        const getDescription = (pkg: AutomationItem): string => {
            if ('desc' in pkg) return pkg.desc;
            return pkg.description;
        };

        const detailedMessage = `
ANFRAGE AUTOMATISIERUNG
-----------------------
Paket: ${selectedPackage.title}
Preis: ${selectedPackage.price}
Beschreibung: ${getDescription(selectedPackage)}

Kunden-Details:
Name: ${name}
Email: ${email}

Nachricht:
${message || '- Keine Nachricht -'}
        `.trim();

        try {
            if (user) {
                await api.createTicket(
                    `Automation: ${selectedPackage.title}`,
                    'Hoch',
                    detailedMessage
                );
            } else {
                await api.sendContact(
                    name,
                    email,
                    `Anfrage: ${selectedPackage.title}`,
                    detailedMessage
                );
            }
            setFormStep('success');
        } catch (e) {
            alert(language === 'de' ? "Es gab einen Fehler beim Senden der Anfrage." : "There was an error sending your request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden selection:bg-purple-500/30 font-sans">

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-pink-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/15 via-purple-600/10 to-indigo-600/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                <AnimatedSection>
                    <div className="text-center max-w-5xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-xl shadow-lg shadow-blue-900/20 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            {t('automation.hero_badge')}
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white drop-shadow-2xl">
                            {t('automation.hero_title')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-[length:200%_auto] animate-gradient">{t('automation.hero_title_highlight')}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed">
                            {t('automation.hero_subtitle')}
                        </p>

                        <div className="mb-20">
                             <WorkflowVisualizer language={language as 'de' | 'en'} />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => setCurrentPage('contact')} className="group relative bg-white text-slate-900 hover:bg-blue-50 font-semibold px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 btn-press overflow-hidden">
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                <RocketLaunchIcon className="w-5 h-5 text-blue-600" />
                                {t('automation.btn_potential')}
                            </button>
                            <button onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })} className="group bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20 font-semibold px-8 py-4 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                                {t('automation.btn_discover')}
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* --- PACKAGES GRID --- */}
            <section id="packages" className="py-24 bg-gradient-to-b from-slate-950/50 to-black relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <AnimatedSection>
                         <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
                                <SparklesIcon className="w-4 h-4" />
                                Packages
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('automation.packages_title')}</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                {t('automation.packages_subtitle')}
                            </p>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection stagger>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-container">
                            {automationPackages.map((pkg) => {
                                const colorStyles = {
                                    purple: { gradient: 'from-purple-500/10 via-transparent to-pink-500/5', line: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                                    pink: { gradient: 'from-pink-500/10 via-transparent to-rose-500/5', line: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
                                    green: { gradient: 'from-emerald-500/10 via-transparent to-teal-500/5', line: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                                    blue: { gradient: 'from-blue-500/10 via-transparent to-indigo-500/5', line: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
                                } as const;
                                const colors = colorStyles[pkg.color];

                                return (
                                <div key={pkg.id} className="group relative bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-1">
                                    {/* Gradient background on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

                                    {/* Top gradient line */}
                                    <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${colors.line} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full transform scale-x-0 group-hover:scale-x-100`}></div>

                                    <div className="p-8 border-b border-white/5 relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-14 h-14 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center group-hover:scale-[1.02] group-hover:-rotate-6 transition-all duration-500 shadow-lg group-hover:${colors.bg} group-hover:${colors.border}`}>
                                                {pkg.icon}
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all duration-300 ${colors.badge}`}>
                                                {pkg.subtitle}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-colors duration-300" style={{
                                            background: pkg.color === 'purple' ? 'linear-gradient(to right, #a855f7, #ec4899)' :
                                                   pkg.color === 'pink' ? 'linear-gradient(to right, #ec4899, #f43f5e)' :
                                                   pkg.color === 'green' ? 'linear-gradient(to right, #10b981, #14b8a6)' :
                                                   'linear-gradient(to right, #3b82f6, #6366f1)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>{pkg.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed h-10">{pkg.description}</p>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col relative z-10 bg-slate-900/30">
                                        <div className="mb-8">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-semibold text-white tracking-tight">{pkg.price}</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5 mt-3">
                                                <span className="text-xs text-slate-500 font-medium bg-white/5 px-2.5 py-1 rounded-md w-fit">{pkg.priceDetail}</span>
                                                <span className="text-xs text-slate-500 font-medium bg-white/5 px-2.5 py-1 rounded-md w-fit">{pkg.monthly}</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 mb-8 flex-1">
                                            {pkg.features.map((feat, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                                                    <CheckBadgeIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.text}`} />
                                                    <span className="leading-snug">{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => openModal(pkg)}
                                            className="group/btn w-full py-4 bg-white text-slate-950 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl btn-press relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                <TagIcon className="w-4 h-4" />
                                                {t('automation.btn_inquire')}
                                            </span>
                                            <ArrowRightIcon className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                                        </button>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* --- MICRO AUTOMATIONS LIBRARY --- */}
            <section className="py-24 bg-gradient-to-b from-black to-slate-950 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <AnimatedSection>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                                    <BoltIcon className="w-4 h-4" />
                                    Quick Start
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">{t('automation.micro_title')}</h2>
                                <p className="text-slate-400 text-lg">{t('automation.micro_subtitle')}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-amber-500/30 transition-all duration-300">
                                <BoltIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                                <span>{t('automation.micro_setup_time')}</span>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection stagger>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-container">
                            {microAutomations.map((item, idx) => (
                                <div key={idx} className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 cursor-default hover:-translate-y-0.5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:scale-[1.02] group-hover:bg-gradient-to-br group-hover:from-purple-500/20 group-hover:to-pink-500/20 group-hover:border-purple-500/30 transition-all duration-300">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-colors duration-300">{item.title}</h4>
                                            <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openModal(item)}
                                        className="px-4 py-2 bg-slate-800/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 text-white text-xs font-semibold rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/20"
                                    >
                                        {item.price}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* --- SHOWCASE SECTIONS --- */}
            <section className="py-24 relative overflow-hidden border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                     <AnimatedSection>
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-block mb-4 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold tracking-wide border border-blue-500/20">
                                    {t('automation.spotlight_voice')}
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                                    {t('automation.spotlight_title')} <br/>
                                    <span className="text-blue-400">{t('automation.spotlight_title_highlight')}</span>
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    {t('automation.spotlight_subtitle')}
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/10">
                                        <CalendarDaysIcon className="w-8 h-8 text-purple-400" />
                                        <div>
                                            <h4 className="text-white font-semibold">{t('automation.feature_calendar')}</h4>
                                            <p className="text-slate-500 text-sm">{t('automation.feature_calendar_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/10">
                                        <UserGroupIcon className="w-8 h-8 text-emerald-400" />
                                        <div>
                                            <h4 className="text-white font-semibold">{t('automation.feature_forwarding')}</h4>
                                            <p className="text-slate-500 text-sm">{t('automation.feature_forwarding_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-blue-600/20 rounded-[2.5rem] blur-xl transition-opacity duration-500 hover:opacity-70 opacity-50"></div>
                                <VoiceAgentDemo language={language as 'de' | 'en'} />
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Email & Operations */}
            <section className="py-24 relative bg-slate-900/30 border-t border-white/5">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <AnimatedSection>
                        <div className="lg:text-center mb-16">
                             <div className="inline-block mb-4 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full text-xs font-semibold tracking-wide border border-purple-500/20">
                                    {t('automation.spotlight_ops')}
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-6">{t('automation.ops_title')}</h2>
                            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                                {t('automation.ops_subtitle')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all duration-300 group shadow-xl hover:shadow-purple-900/20">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 text-purple-400 group-hover:scale-[1.02] transition-transform duration-300 border border-purple-500/20">
                                    <EnvelopeIcon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">{t('automation.inbox_title')}</h3>
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    {t('automation.inbox_subtitle')}
                                </p>
                                <ul className="space-y-4 text-slate-300 text-sm">
                                    <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><CheckBadgeIcon className="w-4 h-4" /></div>
                                        <span>{t('automation.inbox_feature_1')}</span>
                                    </li>
                                    <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><CheckBadgeIcon className="w-4 h-4" /></div>
                                        <span>{t('automation.inbox_feature_2')}</span>
                                    </li>
                                    <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><CheckBadgeIcon className="w-4 h-4" /></div>
                                        <span>{t('automation.inbox_feature_3')}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group shadow-xl hover:shadow-blue-900/20">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-[1.02] transition-transform duration-300 border border-blue-500/20">
                                    <DocumentMagnifyingGlassIcon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">{t('automation.docs_title')}</h3>
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    {t('automation.docs_subtitle')}
                                </p>
                                <ul className="space-y-4 text-slate-300 text-sm">
                                    <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><CheckBadgeIcon className="w-4 h-4" /></div>
                                        <span>{t('automation.docs_feature_1')}</span>
                                    </li>
                                    <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><CheckBadgeIcon className="w-4 h-4" /></div>
                                        <span>{t('automation.docs_feature_2')}</span>
                                    </li>
                                    <li className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><CheckBadgeIcon className="w-4 h-4" /></div>
                                        <span>{t('automation.docs_feature_3')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

             {/* Final CTA */}
             <section className="py-32 bg-black border-t border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-50"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                     <AnimatedSection>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">{t('automation.cta_title')}</h2>
                        <p className="text-lg sm:text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                            {t('automation.cta_subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => setCurrentPage('contact')} className="bg-white text-black font-semibold px-12 py-5 text-base rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                                {t('automation.btn_start')}
                            </button>
                            <button onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })} className="px-12 py-5 text-base font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                                {t('automation.btn_prices')}
                            </button>
                        </div>
                        <p className="mt-12 text-sm text-slate-500 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            {t('automation.tech_note')}
                        </p>
                     </AnimatedSection>
                </div>
             </section>

             {/* BOOKING MODAL */}
             {modalOpen && selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
                    <div className="bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-scale-in relative">
                        <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all duration-300 hover:bg-slate-700 hover:rotate-90">
                            <XMarkIcon className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            {formStep === 'form' ? (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                            {selectedPackage.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">{t('automation.modal_inquiry')}</p>
                                            <h3 className="text-xl font-semibold text-white">{selectedPackage.title}</h3>
                                            <p className="text-blue-400 font-semibold">{selectedPackage.price}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleFormSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2 ml-1 tracking-wide">{t('automation.modal_name')}</label>
                                            <input name="name" type="text" defaultValue={user?.name} required className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300" placeholder={t('placeholders.name_example')} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2 ml-1 tracking-wide">{t('automation.modal_email')}</label>
                                            <input name="email" type="email" defaultValue={user?.email} required className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300" placeholder={t('placeholders.email_example_alt')} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2 ml-1 tracking-wide">{t('automation.modal_message')}</label>
                                            <textarea name="message" rows={3} className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 resize-none" placeholder={t('automation.modal_message_placeholder')}></textarea>
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-slate-200 transition-all duration-300 mt-4 shadow-lg hover:shadow-xl disabled:opacity-50 flex justify-center items-center gap-2">
                                            {isSubmitting ? (
                                                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                            ) : (
                                                <>
                                                    <span>{t('automation.modal_submit')}</span>
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 animate-scale-in">
                                        <CheckBadgeIcon className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white mb-3">{t('automation.modal_success_title')}</h3>
                                    <p className="text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
                                        {language === 'de'
                                            ? `Wir haben Ihre Anfrage für ${selectedPackage.title} erhalten. ${user ? "Das Ticket wurde in Ihrem Dashboard erstellt." : "Sie erhalten in Kürze eine Bestätigung per E-Mail."}`
                                            : `We received your inquiry for ${selectedPackage.title}. ${user ? "The ticket has been created in your dashboard." : "You will receive a confirmation by email shortly."}`
                                        }
                                    </p>
                                    <button onClick={() => setModalOpen(false)} className="bg-slate-800 text-white font-semibold py-3 px-12 rounded-xl hover:bg-slate-700 transition-all duration-300 border border-white/10 hover:border-white/20">
                                        {t('automation.modal_close')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
             )}

        </main>
    );
};

export default AutomationenPage;
