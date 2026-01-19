import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Monitor as MonitorIcon,
    Smartphone as SmartphoneIcon,
    X as XIcon,
    Maximize2 as Maximize2Icon,
    Minimize2 as Minimize2Icon
} from '@/lib/icons';
import { validateContent } from '../../lib/validation';

/**
 * EmailPreview Component
 *
 * Live preview of newsletter email with desktop/mobile toggle
 *
 * @param subject - Email subject
 * @param previewText - Preview text
 * @param content - HTML content
 * @param isFullscreen - Fullscreen mode
 * @param onClose - Callback for close
 * @param className - Additional CSS classes
 */

export interface EmailPreviewProps {
    subject: string;
    previewText: string;
    content: string;
    isFullscreen?: boolean;
    onClose?: () => void;
    className?: string;
}

type DeviceType = 'desktop' | 'mobile';

const EmailPreview: React.FC<EmailPreviewProps> = ({
    subject,
    previewText,
    content,
    isFullscreen = false,
    onClose,
    className = ''
}) => {
    const [device, setDevice] = useState<DeviceType>('desktop');
    const [fullscreen, setFullscreen] = useState(isFullscreen);

    const wrapperClass = fullscreen
        ? 'fixed inset-0 z-50 bg-slate-900/95 p-6'
        : className;

    const contentClass = fullscreen
        ? 'h-full'
        : 'bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden';

    const deviceWidth = device === 'desktop' ? '100%' : '375px';

    return (
        <div className={wrapperClass}>
            {fullscreen && (
                <button
                    onClick={() => {
                        setFullscreen(false);
                        onClose?.();
                    }}
                    className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            )}

            <div className={`${contentClass} flex flex-col h-full`}>
                {/* Toolbar */}
                <div className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Device Toggle */}
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setDevice('desktop')}
                                className={`p-2 rounded-md transition-colors ${
                                    device === 'desktop'
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                                title="Desktop-Ansicht"
                            >
                                <MonitorIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setDevice('mobile')}
                                className={`p-2 rounded-md transition-colors ${
                                    device === 'mobile'
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                                title="Mobile Ansicht"
                            >
                                <SmartphoneIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Device Label */}
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium ml-2">
                            {device === 'desktop' ? 'Desktop' : 'Mobile'} ({device === 'desktop' ? '1200px' : '375px'})
                        </span>
                    </div>

                    {!fullscreen && (
                        <button
                            onClick={() => setFullscreen(true)}
                            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                            title="Vollbild"
                        >
                            <Maximize2Icon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Preview Frame */}
                <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900 p-6 flex items-start justify-center">
                    <motion.div
                        key={device}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white shadow-2xl transition-all duration-300"
                        style={{
                            width: deviceWidth,
                            maxWidth: device === 'desktop' ? '100%' : '375px',
                            minHeight: '600px'
                        }}
                    >
                        {/* Email Header (Subject & Preview) */}
                        <div className="bg-slate-50 border-b border-slate-200 p-4">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                {subject || '<Kein Betreff>'}
                            </h3>
                            {previewText && (
                                <p className="text-sm text-slate-500 italic">
                                    {previewText}
                                </p>
                            )}
                        </div>

                        {/* Email Content */}
                        <div className="p-0">
                            {!content ? (
                                <div className="p-12 text-center">
                                    <p className="text-slate-400">Kein Inhalt vorhanden</p>
                                    <p className="text-sm text-slate-400 mt-2">
                                        Füge HTML-Inhalt hinzu, um eine Vorschau zu sehen
                                    </p>
                                </div>
                            ) : (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: (() => {
                                            // SECURITY: Sanitize HTML content to prevent XSS
                                            const validation = validateContent(content, {
                                                allowHTML: true,
                                                sanitizeHTML: true,
                                                maxLength: 50000
                                            });

                                            // SECURITY: NEVER fall back to unsanitized content
                                            if (!validation.isValid) {
                                                console.error('[XSS] Invalid HTML content rejected:', validation.errors);
                                                return '<p style="color: red;">[Invalid content - blocked for security reasons]</p>';
                                            }

                                            return validation.sanitized || '<p style="color: #999;">No content</p>';
                                        })()
                                    }}
                                    className="prose prose-slate max-w-none"
                                    style={{
                                        // Reset email client styles
                                        lineHeight: '1.6',
                                        fontSize: '16px',
                                        color: '#334155'
                                    }}
                                />
                            )}
                        </div>

                        {/* Email Footer (simulated) */}
                        <div className="bg-slate-50 border-t border-slate-200 p-4 mt-8">
                            <p className="text-xs text-slate-500 text-center">
                                Du erhältst diese Email, weil du unseren Newsletter abonniert hast.
                            </p>
                            <p className="text-xs text-slate-500 text-center mt-2">
                                <a href="#" className="text-blue-600 hover:underline">Abmelden</a>
                                {' · '}
                                <a href="#" className="text-blue-600 hover:underline">Privatsphäre</a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EmailPreview;
