// ============================================
// PREVIEW FRAME
// Live preview of the website configuration
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import type { ProjectConfig, DeviceType } from './Configurator';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from '../Icons';

interface PreviewFrameProps {
    config: ProjectConfig;
}

export const PreviewFrame = ({ config }: PreviewFrameProps) => {
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px'
    };

    const width = deviceWidths[config.device];

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 1.5));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleResetZoom = () => {
        setZoom(1);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className={isFullscreen ? "fixed inset-0 z-50 bg-black/90 p-4" : "space-y-4"}>
            {/* Control Bar */}
            <div className={`flex items-center justify-between ${isFullscreen ? 'bg-slate-900 rounded-lg p-3 mb-4' : ''}`}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
                        title="Verkleinern"
                    >
                        <ZoomOut className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <span className="text-sm font-medium text-slate-900 dark:text-white min-w-[60px] text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 1.5}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
                        title="Vergrößern"
                    >
                        <ZoomIn className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                        onClick={handleResetZoom}
                        disabled={zoom === 1}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
                        title="Zurücksetzen"
                    >
                        <RotateCcw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
                <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    title={isFullscreen ? "Vollbild verlassen" : "Vollbild"}
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-5 h-5 text-white" />
                    ) : (
                        <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    )}
                </button>
            </div>

            {/* Device Frame */}
            <motion.div
                key={config.device}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative mx-auto border-4 border-dark-text/20 dark:border-light-text/20 rounded-lg overflow-hidden bg-white shadow-2xl"
                style={{
                    width: isFullscreen ? '100%' : (config.device === 'desktop' ? '100%' : width),
                    height: isFullscreen ? 'calc(100vh - 80px)' : (config.device === 'desktop' ? '600px' : '700px'),
                    maxWidth: '100%',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center'
                }}
            >
                {/* Browser Chrome (only for desktop) */}
                {config.device === 'desktop' && (
                    <div className="bg-gray-100 dark:bg-gray-800 border-b border-dark-text/10 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 mx-4">
                            <div className="bg-white dark:bg-gray-700 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400 text-center">
                                www.ihre-website.de
                            </div>
                        </div>
                    </div>
                )}

                {/* Website Preview */}
                <div
                    className="h-full overflow-y-auto"
                    style={{
                        backgroundColor: config.colors.background,
                        color: config.colors.text
                    }}
                >
                    {config.layout === 'modern' && (
                        <ModernLayoutPreview config={config} />
                    )}
                    {config.layout === 'classic' && (
                        <ClassicLayoutPreview config={config} />
                    )}
                    {config.layout === 'bold' && (
                        <BoldLayoutPreview config={config} />
                    )}
                </div>
            </motion.div>

            {/* Device Info (only in normal mode) */}
            {!isFullscreen && (
                <div className="text-center">
                    <span className="text-xs text-dark-text/50 dark:text-light-text/50 uppercase tracking-wide">
                        {config.device} Preview
                    </span>
                </div>
            )}
        </div>
    );
};

// ============================================
// LAYOUT PREVIEWS
// ============================================

interface LayoutPreviewProps {
    config: ProjectConfig;
}

const ModernLayoutPreview = ({ config }: LayoutPreviewProps) => (
    <div className="min-h-full">
        {/* Header */}
        <header className="p-4 md:p-6 border-b" style={{ borderColor: `${config.colors.primary}20` }}>
            <div className="flex items-center justify-between">
                <div className="font-bold text-lg" style={{ color: config.colors.primary }}>
                    Logo
                </div>
                <nav className="hidden md:flex gap-4 text-sm">
                    {['Home', 'Über uns', 'Services', 'Kontakt'].map(item => (
                        <a key={item} href="#" className="hover:opacity-70" style={{ color: config.colors.text }}>
                            {item}
                        </a>
                    ))}
                </nav>
            </div>
        </header>

        {/* Hero Section */}
        <section
            className="p-6 md:p-12"
            style={{
                background: `linear-gradient(135deg, ${config.colors.primary}10 0%, ${config.colors.secondary}10 100%)`
            }}
        >
            <div className="max-w-2xl">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-bold mb-4"
                    style={{ color: config.colors.primary }}
                >
                    {config.content.headline}
                </motion.h1>
                <p className="text-lg opacity-80" style={{ color: config.colors.text }}>
                    {config.content.subheadline}
                </p>
                <button
                    className="mt-6 px-6 py-3 rounded-lg text-white font-medium"
                    style={{ backgroundColor: config.colors.primary }}
                >
                    Jetzt starten
                </button>
            </div>
        </section>

        {/* Services Section */}
        <section className="p-6 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: config.colors.text }}>
                Unsere Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {config.content.services.slice(0, 3).map((service, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-lg border-2"
                        style={{
                            borderColor: `${config.colors.accent}30`,
                            backgroundColor: `${config.colors.accent}05`
                        }}
                    >
                        <div className="font-semibold mb-2" style={{ color: config.colors.primary }}>
                            {service}
                        </div>
                        <p className="text-sm opacity-70" style={{ color: config.colors.text }}>
                            Professionelle Lösungen für Ihre Anforderungen.
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* About Section */}
        <section className="p-6 md:p-12" style={{ backgroundColor: `${config.colors.secondary}05` }}>
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4" style={{ color: config.colors.primary }}>
                    Über uns
                </h2>
                <p className="opacity-80" style={{ color: config.colors.text }}>
                    {config.content.aboutText.substring(0, 150)}...
                </p>
            </div>
        </section>

        {/* Footer */}
        <footer className="p-6 text-center text-sm opacity-60" style={{ color: config.colors.text }}>
            © 2025 Ihr Unternehmen. Alle Rechte vorbehalten.
        </footer>
    </div>
);

const ClassicLayoutPreview = ({ config }: LayoutPreviewProps) => (
    <div className="min-h-full">
        {/* Header - Classic Centered */}
        <header className="p-6 border-b-2 text-center" style={{ borderColor: config.colors.primary }}>
            <div className="font-bold text-2xl mb-2" style={{ color: config.colors.primary }}>
                Ihr Logo
            </div>
            <p className="text-sm opacity-70" style={{ color: config.colors.text }}>
                Tradition & Qualität seit 2025
            </p>
        </header>

        {/* Hero - Centered */}
        <section className="p-8 md:p-16 text-center" style={{ backgroundColor: `${config.colors.primary}05` }}>
            <h1
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: config.colors.primary }}
            >
                {config.content.headline}
            </h1>
            <p className="text-lg mb-6 max-w-xl mx-auto" style={{ color: config.colors.text }}>
                {config.content.subheadline}
            </p>
            <div className="flex justify-center gap-3">
                <button
                    className="px-6 py-3 rounded-lg text-white font-medium"
                    style={{ backgroundColor: config.colors.primary }}
                >
                    Mehr erfahren
                </button>
                <button
                    className="px-6 py-3 rounded-lg font-medium border-2"
                    style={{
                        borderColor: config.colors.primary,
                        color: config.colors.primary
                    }}
                >
                    Kontakt
                </button>
            </div>
        </section>

        {/* Services - Symmetrical */}
        <section className="p-6 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: config.colors.primary }}>
                Unsere Leistungen
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {config.content.services.slice(0, 4).map((service, index) => (
                    <div key={index} className="text-center p-4">
                        <div className="font-semibold mb-1" style={{ color: config.colors.text }}>
                            {service}
                        </div>
                        <div className="w-12 h-1 mx-auto" style={{ backgroundColor: config.colors.accent }} />
                    </div>
                ))}
            </div>
        </section>

        {/* About - Classic */}
        <section className="p-6 md:p-12 bg-light-bg dark:bg-dark-bg">
            <div className="max-w-xl mx-auto">
                <h2 className="text-xl font-bold mb-4 text-center" style={{ color: config.colors.primary }}>
                    Über uns
                </h2>
                <p className="text-center opacity-80" style={{ color: config.colors.text }}>
                    {config.content.aboutText.substring(0, 200)}...
                </p>
            </div>
        </section>

        {/* Footer */}
        <footer className="p-4 text-center text-sm border-t" style={{ borderColor: `${config.colors.primary}30` }}>
            <div style={{ color: config.colors.text }}>
                © 2025 Ihr Unternehmen
            </div>
        </footer>
    </div>
);

const BoldLayoutPreview = ({ config }: LayoutPreviewProps) => (
    <div className="min-h-full">
        {/* Hero - Big Bold */}
        <section
            className="p-6 md:p-12"
            style={{
                background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`
            }}
        >
            <div className="flex items-center justify-between mb-8">
                <div className="font-bold text-xl text-white">LOGO</div>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-1 bg-white/50 rounded" />
                    ))}
                </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                {config.content.headline}
            </h1>
            <p className="text-xl text-white/90 mb-6 max-w-lg">
                {config.content.subheadline}
            </p>
            <button
                className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg text-lg shadow-lg"
                style={{ color: config.colors.primary }}
            >
                JETZT STARTEN
            </button>
        </section>

        {/* Services - High Contrast */}
        <section className="p-6 md:p-12">
            <h2 className="text-3xl font-black mb-6" style={{ color: config.colors.text }}>
                SERVICES
            </h2>
            <div className="space-y-4">
                {config.content.services.slice(0, 3).map((service, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-lg flex items-center justify-between"
                        style={{
                            backgroundColor: index % 2 === 0 ? config.colors.text : config.colors.accent,
                            color: index % 2 === 0 ? config.colors.background : config.colors.text
                        }}
                    >
                        <span className="font-bold text-lg">{service}</span>
                        <div className="text-2xl">→</div>
                    </div>
                ))}
            </div>
        </section>

        {/* About - Bold */}
        <section
            className="p-6 md:p-12"
            style={{
                backgroundColor: config.colors.text,
                color: config.colors.background
            }}
        >
            <div className="max-w-xl">
                <h2 className="text-3xl font-black mb-4">
                    ÜBER UNS
                </h2>
                <p className="text-lg opacity-90">
                    {config.content.aboutText.substring(0, 200)}...
                </p>
            </div>
        </section>

        {/* CTA Section */}
        <section className="p-8 md:p-12 text-center" style={{ backgroundColor: config.colors.accent }}>
            <h2 className="text-3xl font-black text-white mb-4">
                BEREIT?
            </h2>
            <button className="px-8 py-4 bg-white font-bold rounded-lg text-lg">
                KONTAKT AUFNEHMEN
            </button>
        </section>
    </div>
);
