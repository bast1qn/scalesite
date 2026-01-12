
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { CustomSelect } from '../components/CustomSelect';
import { icons, placeholderContent } from '../lib/blueprintPlaceholders';
import { useLanguage } from '../contexts/LanguageContext';

// --- PREVIEW COMPONENT ---
interface BlueprintPreviewProps {
    companyName: string;
    industry: string;
    primaryColor: string;
    secondaryColor: string;
    blueprintTemplates: any[];
    t: (key: string) => string;
}

const escapeHtml = (unsafe: string) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

const generatePreviewHtml = (
    companyName: string,
    industry: string,
    primaryColor: string,
    secondaryColor: string,
    activePage: string,
    theme: 'light' | 'dark',
    blueprintTemplates: any[],
    t: (key: string) => string,
): string => {
    const defaultTemplate = blueprintTemplates.find(t => t.industry_key === 'dienstleistung');
    const selectedTemplate = blueprintTemplates.find(t => t.industry_key === industry);
    const industryData = selectedTemplate?.content_json || defaultTemplate?.content_json;

    if (!industryData) {
        return `<html><body><h1>Lade Vorlagen...</h1></body></html>`;
    }

    const pageContent = industryData.pages[activePage] || industryData.pages.home;
    // Basic contrast check
    const contrastColor = ((hex: string) => {
        if (hex.startsWith('#')) hex = hex.slice(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#1F1F1F' : '#F8F5F2';
    })(primaryColor);
    
    const safeCompanyName = escapeHtml(companyName);

    const getSectionHtml = (section: any) => {
        const allIcons: { [key: string]: string } = icons;
        const iconHtml = (iconName: string) => {
             if (iconName.trim().startsWith('<svg')) return iconName;
             return allIcons[iconName.replace(/<|>/g, '')] || '';
        }

        switch(section.type) {
            case 'hero':
                return `
                    <section class="text-center px-6 py-24 bg-surface dark:bg-dark-surface">
                        <h2 class="font-serif text-4xl md:text-5xl font-bold text-dark-text dark:text-light-text leading-tight">${section.title.replace('[Firma]', safeCompanyName)}</h2>
                        <p class="max-w-2xl mx-auto mt-6 text-lg text-dark-text/80 dark:text-light-text/80 leading-relaxed">${section.subtitle.replace('[Firma]', safeCompanyName)}</p>
                        <button class="nav-link-btn mt-10 btn-primary px-8 py-3 rounded-full font-semibold text-lg shadow-lg transform hover:scale-105 transition-transform" data-page="contact">Mehr erfahren</button>
                    </section>`;
            case 'services':
                 return `
                    <section class="py-20 px-6 bg-light-bg dark:bg-dark-bg">
                        <div class="max-w-6xl mx-auto">
                            <h3 class="text-center font-serif text-3xl font-bold text-dark-text dark:text-light-text mb-12">${section.title}</h3>
                            <div class="grid md:grid-cols-3 gap-8">
                                ${section.items.map((s: any) => `
                                    <div class="bg-surface dark:bg-dark-surface p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-dark-text/5 dark:border-light-text/5">
                                        <div class="w-14 h-14 flex items-center justify-center bg-primary/10 rounded-xl text-primary mb-6">${iconHtml(s.icon)}</div>
                                        <h4 class="font-bold text-xl text-dark-text dark:text-light-text mb-3">${s.title}</h4>
                                        <p class="text-dark-text/70 dark:text-light-text/70 leading-relaxed">${s.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </section>`;
            case 'products':
                 return `
                    <section class="py-20 px-6 max-w-6xl mx-auto">
                        <h3 class="text-center font-serif text-3xl font-bold text-dark-text dark:text-light-text mb-12">${section.title}</h3>
                        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            ${section.items.map((p: any) => `
                                <div class="bg-surface dark:bg-dark-surface rounded-xl shadow-sm overflow-hidden group border border-dark-text/5 dark:border-light-text/5">
                                    <div class="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                       <div class="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600">IMG</div>
                                       <img src="${p.imageUrl}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 hover:opacity-100" />
                                    </div>
                                    <div class="p-5 text-center">
                                        <h4 class="font-bold text-dark-text dark:text-light-text text-sm">${p.name}</h4>
                                        <p class="text-primary font-bold mt-2">${p.price}</p>
                                        <button class="w-full mt-4 btn-primary px-4 py-2 rounded-lg text-sm font-semibold opacity-90 hover:opacity-100">Details</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>`;
             case 'cta':
                 return `
                    <section class="bg-primary text-center px-6 py-20">
                        <div class="max-w-4xl mx-auto">
                            <h3 class="font-serif text-3xl md:text-4xl font-bold mb-8" style="color: ${contrastColor};">${section.title}</h3>
                            <button class="nav-link-btn bg-white text-primary px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-gray-50 transition-colors" data-page="contact">Jetzt Kontakt aufnehmen</button>
                        </div>
                    </section>`;
            case 'pageHeader':
                return `<header class="py-24 bg-surface dark:bg-dark-surface text-center border-b border-dark-text/5 dark:border-light-text/5"><h1 class="font-serif text-4xl md:text-5xl font-bold text-dark-text dark:text-light-text">${section.title}</h1></header>`;
            case 'textBlock':
                return `<section class="max-w-3xl mx-auto px-6 py-16 text-lg leading-loose text-dark-text/80 dark:text-light-text/80"><p>${section.content.replace('[Firma]', safeCompanyName)}</p></section>`;
            case 'contactForm':
                 return `
                    <section class="py-20 px-6 bg-light-bg dark:bg-dark-bg">
                        <div class="max-w-lg mx-auto bg-surface dark:bg-dark-surface p-8 rounded-2xl shadow-xl border border-dark-text/10 dark:border-light-text/10">
                             <h3 class="font-serif text-2xl font-bold text-dark-text dark:text-light-text mb-6 text-center">${section.title}</h3>
                             <p class="text-sm opacity-60 text-center mb-4">${t('blueprint.preview_not_active')}</p>
                             <form class="space-y-4" onsubmit="event.preventDefault(); alert('${t('blueprint.preview_alert')}');">
                                <div><label class="block text-sm font-medium mb-1 opacity-70">${t('blueprint.your_name')}</label><input type="text" class="form-input" placeholder="${t('blueprint.your_name')}" /></div>
                                <div><label class="block text-sm font-medium mb-1 opacity-70">E-Mail</label><input type="email" class="form-input" placeholder="ihre@email.de" /></div>
                                <div><label class="block text-sm font-medium mb-1 opacity-70">Nachricht</label><textarea rows="4" class="form-input" placeholder="Ihre Nachricht..."></textarea></div>
                                <div><button type="submit" class="btn-primary w-full py-3 rounded-lg font-bold mt-2">Nachricht senden</button></div>
                             </form>
                        </div>
                    </section>
                 `;
            default: return '';
        }
    };

    const mainContentHtml = pageContent.sections.map(getSectionHtml).join('');

    return `
    <!DOCTYPE html>
    <html lang="de" class="${theme}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t('blueprint.preview')}: ${safeCompanyName}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            :root {
                --bp-primary: ${primaryColor};
                --bp-secondary: ${secondaryColor};
                --bp-text-on-primary: ${contrastColor};
                --bp-light-bg: #F8FAFC;
                --bp-dark-bg: #020617;
                --bp-surface: #FFFFFF;
                --bp-dark-surface: #0F172A;
                --bp-dark-text: #0F172A;
                --bp-light-text: #F8FAFC;
            }
            body { 
                font-family: 'Plus Jakarta Sans', sans-serif; 
                background-color: var(--bp-light-bg);
                color: var(--bp-dark-text);
                transition: background-color 0.3s, color 0.3s;
                -webkit-font-smoothing: antialiased;
                overflow-x: hidden;
            }
            .dark body {
                background-color: var(--bp-dark-bg);
                color: var(--bp-light-text);
            }
            h1, h2, h3, h4, .font-serif { font-family: 'Outfit', sans-serif; }
            .bg-primary { background-color: var(--bp-primary); }
            .text-primary { color: var(--bp-primary); }
            .bg-light-bg { background-color: var(--bp-light-bg); }
            .bg-dark-bg { background-color: var(--bp-dark-bg); }
            .bg-surface { background-color: var(--bp-surface); }
            .dark .bg-surface { background-color: var(--bp-dark-surface); }
            .dark .bg-dark-surface { background-color: var(--bp-dark-bg); }
            .text-light-text { color: var(--bp-light-text); }
            .text-dark-text { color: var(--bp-dark-text); }
            .bg-primary\\/10 { background-color: var(--bp-primary); opacity: 0.1; }
            
            /* Fix for Tailwind opacity util usage in string */
            .bg-primary\\/10 { background-color: color-mix(in srgb, var(--bp-primary), transparent 90%); }

            .btn-primary { background-color: var(--bp-primary); color: var(--bp-text-on-primary); transition: filter 0.2s; }
            .btn-primary:hover { filter: brightness(1.1); }
            
            .nav-link { position: relative; opacity: 0.7; transition: opacity 0.2s; }
            .nav-link:hover { opacity: 1; }
            .nav-link-active { opacity: 1; color: var(--bp-primary); }
            
            .form-input {
                width: 100%;
                border-radius: 0.5rem;
                border: 1px solid #e2e8f0;
                padding: 0.75rem 1rem;
                background-color: var(--bp-surface);
                outline: none;
                transition: border-color 0.2s;
            }
            .form-input:focus {
                border-color: var(--bp-primary);
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--bp-primary), transparent 80%);
            }
            .dark .form-input {
                background-color: var(--bp-dark-surface);
                border-color: #1e293b;
                color: white;
            }
            
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
            .dark ::-webkit-scrollbar-thumb { background-color: #334155; }
        </style>
    </head>
    <body>
        <header class="sticky top-0 z-50 bg-surface/90 dark:bg-dark-surface/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
                <button class="nav-link-btn font-extrabold text-xl text-dark-text dark:text-light-text tracking-tight" data-page="home">${safeCompanyName}</button>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold">
                    ${Object.keys(industryData.pages).map(p => `
                        <button class="nav-link-btn nav-link ${activePage === p ? 'nav-link-active' : ''}" data-page="${p}">${p.charAt(0).toUpperCase() + p.slice(1)}</button>
                    `).join('')}
                </nav>
                <div class="flex items-center gap-3">
                    <button id="theme-toggle" class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        ${theme === 'light' ? icons.moon : icons.sun}
                    </button>
                    <button class="nav-link-btn btn-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide hidden sm:block" data-page="contact">Kontakt</button>
                </div>
            </div>
        </header>
        <main>
            ${mainContentHtml}
        </main>
        <footer class="bg-dark-surface text-slate-400 py-12 px-6 text-center text-sm border-t border-slate-800 mt-auto">
            <p class="font-semibold text-white mb-2">${safeCompanyName}</p>
            <p>&copy; ${new Date().getFullYear()} Alle Rechte vorbehalten.</p>
        </footer>
        <script>
            const targetOrigin = window.location.origin;
            document.getElementById('theme-toggle').addEventListener('click', () => {
                const isCurrentlyDark = document.documentElement.classList.contains('dark');
                const newTheme = isCurrentlyDark ? 'light' : 'dark';
                window.parent.postMessage({ type: 'blueprint-theme-toggle', payload: { theme: newTheme } }, targetOrigin);
            });

            document.querySelectorAll('.nav-link-btn').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = e.currentTarget.getAttribute('data-page');
                    if (page) {
                        window.parent.postMessage({ type: 'blueprint-nav', payload: { page } }, targetOrigin);
                    }
                });
            });
        </script>
    </body>
    </html>
    `;
};


const BlueprintPreview: React.FC<BlueprintPreviewProps> = (props) => {
    const [activePage, setActivePage] = useState('home');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data;
            if (type === 'blueprint-nav') {
                setActivePage(payload.page);
                 if (iframeRef.current) {
                    iframeRef.current.contentWindow?.scrollTo(0, 0);
                }
            } else if (type === 'blueprint-theme-toggle') {
                setTheme(payload.theme);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    
    const htmlContent = useMemo(() => {
        return generatePreviewHtml(props.companyName, props.industry, props.primaryColor, props.secondaryColor, activePage, theme, props.blueprintTemplates, props.t);
    }, [props.companyName, props.industry, props.primaryColor, props.secondaryColor, activePage, theme, props.blueprintTemplates, props.t]);

    useEffect(() => {
        setActivePage('home');
        setTheme('light');
    }, [props.companyName, props.industry, props.primaryColor, props.secondaryColor]);

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 ring-1 ring-slate-900/5">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-white dark:bg-slate-900 px-3 py-1 rounded-md text-xs text-slate-500 w-full max-w-[200px] sm:max-w-xs text-center truncate opacity-70 cursor-default select-none">
                    {props.t('blueprint.preview')}: {props.companyName.toLowerCase().replace(/\s/g, '')}.de
                </div>
            </div>
            <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
                 <iframe
                    ref={iframeRef}
                    srcDoc={htmlContent}
                    title="Website Blueprint Preview"
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full border-0 bg-white"
                    style={{ overflow: 'hidden' }}
                />
            </div>
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
const BlueprintPage: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        companyName: '',
        industry: 'dienstleistung',
        primaryColor: '#D84343',
        secondaryColor: '#CE7E5A',
    });
    const [previewProps, setPreviewProps] = useState<Omit<BlueprintPreviewProps, 'blueprintTemplates'> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [industrySearch, setIndustrySearch] = useState('');
    
    // --- STATIC DATA ---
    const blueprintTemplates = useMemo(() => {
        return Object.keys(placeholderContent).map(key => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            return {
                industry_key: key,
                industry_label: label.replace(/_/g, ' '),
                content_json: placeholderContent[key]
            }
        });
    }, []);

    const industryOptions = useMemo(() => {
      return blueprintTemplates.map(t => ({ value: t.industry_key, label: t.industry_label }))
    }, [blueprintTemplates]);

    const filteredIndustryOptions = useMemo(() => 
        industryOptions.filter(opt => 
            opt.label.toLowerCase().includes(industrySearch.toLowerCase())
        ), [industrySearch, industryOptions]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleIndustryChange = (value: string) => {
        setFormData({ ...formData, industry: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.companyName) return;
        setIsLoading(true);
        setPreviewProps(null);
        // Scroll to preview on mobile
        if (window.innerWidth < 1024) {
             setTimeout(() => {
                document.getElementById('preview-container')?.scrollIntoView({ behavior: 'smooth' });
             }, 100);
        }
        
        setTimeout(() => {
            setIsLoading(false);
            setPreviewProps(formData);
        }, 1500);
    };

    const ColorPicker: React.FC<{
        name: string;
        label: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }> = ({ name, label, value, onChange }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-dark-text dark:text-light-text">{label}</label>
            <div className="relative mt-2">
                <div className="flex items-center h-12 w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-light-bg dark:bg-dark-bg shadow-sm overflow-hidden">
                    <div className="w-6 h-6 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: value }}></div>
                    <span className="ml-3 font-mono text-sm text-dark-text dark:text-light-text uppercase">{value}</span>
                    <input 
                        type="color" 
                        name={name}
                        id={name}
                        value={value} 
                        onChange={onChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <main className="py-24 min-h-screen">
            <AnimatedSection>
                <div className="text-center pt-8 pb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dark-text dark:text-light-text tracking-tight font-serif">
                        {t('blueprint.title')}
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
                        {t('blueprint.subtitle')}
                    </p>
                </div>
            </AnimatedSection>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    {/* Form */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-6 lg:sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-bold text-dark-text dark:text-light-text mb-2">{t('blueprint.company_name')}</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('blueprint.your_name')}
                                    className="input-premium"
                                />
                            </div>
                            <div>
                                <label htmlFor="industry-search" className="block text-sm font-bold text-dark-text dark:text-light-text mb-2">{t('blueprint.industry')}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="industry-search"
                                        placeholder={t('blueprint.search_industry')}
                                        value={industrySearch}
                                        onChange={e => setIndustrySearch(e.target.value)}
                                        className="input-premium mb-2 pl-10"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                </div>
                                <CustomSelect
                                    id="industry"
                                    options={filteredIndustryOptions}
                                    value={formData.industry}
                                    onChange={handleIndustryChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <ColorPicker name="primaryColor" label="Hauptfarbe" value={formData.primaryColor} onChange={handleChange} />
                                <ColorPicker name="secondaryColor" label="Akzentfarbe" value={formData.secondaryColor} onChange={handleChange} />
                            </div>
                            <div className="pt-4">
                                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-primary-hover transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25">
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Erstelle Blueprint...
                                        </span>
                                    ) : 'Blueprint generieren'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Area */}
                    <div id="preview-container" className="lg:col-span-2 order-1 lg:order-2 min-h-[500px]">
                        {isLoading && (
                            <div className="h-full flex flex-col items-center justify-center bg-surface dark:bg-dark-surface rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center animate-pulse">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                </div>
                                <p className="text-xl font-semibold text-dark-text dark:text-light-text">{t('blueprint.analyzing')}</p>
                                <p className="text-dark-text/60 dark:text-light-text/60 mt-2">Design-Vorschlag wird generiert.</p>
                            </div>
                        )}

                        {!isLoading && !previewProps && (
                            <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-300"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{t('blueprint.preview_empty')}</h3>
                                <p className="text-dark-text/60 dark:text-light-text/60 mt-2 max-w-md">Füllen Sie das Formular auf der linken Seite aus, um einen individuellen Design-Vorschlag für Ihr Unternehmen zu erhalten.</p>
                            </div>
                        )}

                        {previewProps && blueprintTemplates.length > 0 && (
                            <div className="animate-fade-in">
                                <BlueprintPreview {...previewProps} blueprintTemplates={blueprintTemplates} t={t} />
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 mt-8 text-center">
                                    <h3 className="text-2xl font-bold text-dark-text dark:text-light-text">Gefällt Ihnen dieser Entwurf?</h3>
                                    <p className="mt-2 text-dark-text/70 dark:text-light-text/70 max-w-2xl mx-auto">
                                        Dies ist nur eine erste grobe Skizze. In der realen Umsetzung passe ich jedes Detail pixelgenau an Ihre Marke an, optimiere die Performance und sorge für perfekte mobile Darstellung.
                                    </p>
                                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                                        <button onClick={() => setCurrentPage('preise')} className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1">
                                            {t('blueprint.request_project')}
                                        </button>
                                        <button onClick={() => document.getElementById('companyName')?.focus()} className="bg-white dark:bg-slate-800 text-dark-text dark:text-light-text font-semibold px-8 py-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                            Neuen Blueprint erstellen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BlueprintPage;
