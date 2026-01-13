
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon } from './Icons';
import { useLanguage } from '../contexts';
import { translations } from '../lib/translations';
import { useChatScroll } from '../lib/hooks';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const ChatWidget = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { messagesEndRef, handleScroll, forceScroll } = useChatScroll(
        chatContainerRef,
        messages,
        isOpen
    );

    // Initialize messages when language changes or on mount
    useEffect(() => {
        setMessages([
            { role: 'model', text: t('chat_widget.welcome_message') }
        ]);
    }, [language, t]);

    // Initialize suggestions when language changes
    useEffect(() => {
        // Defensive check for nested translation properties
        const predefinedQuestions = translations[language]?.chat_widget?.predefined_questions;
        if (Array.isArray(predefinedQuestions)) {
            const shuffled = [...predefinedQuestions].sort(() => 0.5 - Math.random());
            setSuggestions(shuffled.slice(0, 4));
        } else {
            // Fallback to empty array if translations are not available
            setSuggestions([]);
        }
    }, [language]);

    const processMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage = text.trim();

        if (userMessage.length > 500) {
             setMessages(prev => [...prev, { role: 'user', text: userMessage }, { role: 'model', text: t('chat_widget.error_too_long') }]);
             forceScroll();
             return;
        }

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        forceScroll();
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const lowerMessage = userMessage.toLowerCase();
            let responseText = t('chat_widget.error_connection');

            if (lowerMessage.includes('preis') || lowerMessage.includes('kosten') || lowerMessage.includes('price')) {
                responseText = language === 'de'
                    ? 'Unsere Preise beginnen bei 99€ für eine Basic Website. Sie können alle Preise und Pakete auf unserer Preise-Seite einsehen. Möchten Sie mehr über ein bestimmtes Paket erfahren?'
                    : 'Our prices start at €99 for a Basic Website. You can view all packages and pricing on our pricing page. Would you like to know more about a specific package?';
            } else if (lowerMessage.includes('kontakt') || lowerMessage.includes('email') || lowerMessage.includes('telefon') || lowerMessage.includes('contact')) {
                responseText = language === 'de'
                    ? 'Sie können uns über das Kontaktformular auf unserer Website erreichen, oder per E-Mail an info@scalesite.de. Wir antworten meist innerhalb von 24 Stunden.'
                    : 'You can reach us through the contact form on our website, or by email at info@scalesite.de. We usually respond within 24 hours.';
            } else if (lowerMessage.includes('dienstleistung') || lowerMessage.includes('service') || lowerMessage.includes('website')) {
                responseText = language === 'de'
                    ? 'Wir bieten folgende Dienstleistungen an: Basic Website (99€), Starter Website (199€), Business Website (399€) sowie verschiedene Hosting-Pakete. Welches Paket interessiert Sie?'
                    : 'We offer the following services: Basic Website (€99), Starter Website (€199), Business Website (€399), and various hosting packages. Which package interests you?';
            } else if (lowerMessage.includes('hilfe') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
                responseText = t('chat_widget.technical_questions');
            } else if (lowerMessage.includes('hallo') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
                responseText = language === 'de'
                    ? 'Hallo! Willkommen bei ScaleSite. Wie kann ich Ihnen heute helfen? Sie können mir Fragen zu unseren Dienstleistungen, Preisen oder Support-Themen stellen.'
                    : 'Hello! Welcome to ScaleSite. How can I help you today? You can ask me about our services, pricing, or support topics.';
            }

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);

        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: t('chat_widget.error_connection') }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            processMessage(input);
            setInput('');
        }
    };

    const handleSuggestionClick = (text: string) => {
        processMessage(text);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[95] flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            <div
                className={`pointer-events-auto mb-4 w-[360px] max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/50 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden transition-all duration-300 ease-out origin-bottom-right flex flex-col ${
                    isOpen
                    ? 'opacity-100 scale-100 translate-y-0 h-[500px]'
                    : 'opacity-0 scale-95 translate-y-4 h-0 pointer-events-none'
                }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-violet-600 p-4 flex items-center justify-between text-white shadow-sm shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                            <SparklesIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="font-semibold font-display tracking-wide block leading-none">{t('chat_widget.bot_name')}</span>
                            <span className="text-[10px] text-white/80 font-medium flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                {t('chat_widget.status')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm"
                        aria-label={t('chat_widget.close_aria')}
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages Area */}
                <div
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-950/50 space-y-3 custom-scrollbar relative"
                >
                     <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex w-full z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-2.5 text-sm rounded-2xl shadow-sm leading-relaxed transition-all duration-200 ${
                                    msg.role === 'user'
                                    ? 'bg-gradient-to-r from-primary to-violet-600 text-white rounded-tr-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-sm hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Suggestions - Show only when it's the initial state */}
                    {messages.length === 1 && !isLoading && (
                        <div className="grid grid-cols-1 gap-2 mt-4 animate-fade-in z-10">
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider ml-1 mb-1">{t('chat_widget.frequent_questions')}</p>
                            {suggestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(question)}
                                    className="text-left text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/40 text-slate-600 dark:text-slate-300 px-3 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-start w-full z-10">
                            <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-700/60 flex gap-2 relative z-20 shrink-0">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chat_widget.placeholder')}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder-slate-400 border border-transparent"
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-primary to-violet-600 text-white p-2.5 rounded-xl hover:from-primary/90 hover:to-violet-600/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                    isOpen
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rotate-90 hover:bg-slate-300 dark:hover:bg-slate-600'
                    : 'bg-gradient-to-br from-primary to-violet-600 text-white shadow-primary/30 hover:shadow-primary/40 hover:shadow-lg'
                }`}
                aria-label={isOpen ? t('chat_widget.close_aria') : t('chat_widget.open_aria')}
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6 transition-transform duration-300 -rotate-90" />
                ) : (
                    <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};
