// ============================================
// AI CONTENT GENERATOR - Tone Selector
// 5 Tone Options with Visual Preview
// ============================================

import { motion } from 'framer-motion';

// ============================================
// TYPES & INTERFACES
// ============================================

export type ToneType = 'professional' | 'casual' | 'formal' | 'friendly' | 'persuasive';

interface ToneOption {
    id: ToneType;
    name: string;
    description: string;
    icon: string;
    example: string;
    color: string;
}

interface ToneSelectorProps {
    value: ToneType;
    onChange: (tone: ToneType) => void;
    disabled?: boolean;
    layout?: 'grid' | 'list';
}

// ============================================
// TONE OPTIONS
// ============================================

const TONES: ToneOption[] = [
    {
        id: 'professional',
        name: 'Professionell',
        description: 'Sachlich, kompetent und geschäftsmäßig',
        icon: '👔',
        example: 'Wir bieten Ihnen erstklassige Lösungen für Ihre Geschäftsanforderungen.',
        color: 'blue'
    },
    {
        id: 'casual',
        name: 'Locker',
        description: 'Entspannt, unverbindlich und modern',
        icon: '😊',
        example: 'Hey! Schau mal, was wir für dich haben.',
        color: 'purple'
    },
    {
        id: 'formal',
        name: 'Formell',
        description: 'Höflich, distanziert und seriös',
        icon: '🎩',
        example: 'Sehr geehrte Damen und Herren, gestatten Sie uns, Ihnen unsere Dienste vorzustellen.',
        color: 'slate'
    },
    {
        id: 'friendly',
        name: 'Freundlich',
        description: 'Warm, einladend und persönlich',
        icon: '🤗',
        example: 'Hallo! Wir freuen uns, dich kennenzulernen und zu helfen.',
        color: 'green'
    },
    {
        id: 'persuasive',
        name: 'Überzeugend',
        description: 'Dynamisch, motivierend und handlungsorientiert',
        icon: '💪',
        example: 'Verpassen Sie nicht diese Gelegenheit – handeln Sie jetzt!',
        color: 'orange'
    }
];

// ============================================
// COLOR MAPPINGS
// ============================================

const COLOR_CLASSES = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-500 dark:border-blue-400',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-500 dark:border-purple-400',
        text: 'text-purple-600 dark:text-purple-400',
        hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
    },
    slate: {
        bg: 'bg-slate-50 dark:bg-slate-900/20',
        border: 'border-slate-500 dark:border-slate-400',
        text: 'text-slate-600 dark:text-slate-400',
        hover: 'hover:bg-slate-100 dark:hover:bg-slate-900/30'
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-500 dark:border-green-400',
        text: 'text-green-600 dark:text-green-400',
        hover: 'hover:bg-green-100 dark:hover:bg-green-900/30'
    },
    orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-500 dark:border-orange-400',
        text: 'text-orange-600 dark:text-orange-400',
        hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
    }
};

// ============================================
// TONE CARD COMPONENT
// ============================================

interface ToneCardProps {
    tone: ToneOption;
    isSelected: boolean;
    onClick: () => void;
    disabled: boolean;
}

function ToneCard({ tone, isSelected, onClick, disabled }: ToneCardProps) {
    const colors = COLOR_CLASSES[tone.color];

    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`
                relative p-4 rounded-lg border-2 text-left transition-all duration-200
                ${disabled
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    : isSelected
                        ? `${colors.bg} ${colors.border} border-2 shadow-md`
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
            `}
        >
            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
                {/* Icon */}
                <span className="text-2xl">{tone.icon}</span>

                {/* Name & Description */}
                <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm ${isSelected ? colors.text : 'text-gray-900 dark:text-white'}`}>
                        {tone.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {tone.description}
                    </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`flex-shrink-0 w-5 h-5 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center`}
                    >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.div>
                )}
            </div>

            {/* Example */}
            <div className="relative mt-3 p-2.5 rounded bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    "{tone.example}"
                </p>
            </div>
        </motion.button>
    );
}

// ============================================
// TONE ROW COMPONENT (List Layout)
// ============================================

interface ToneRowProps {
    tone: ToneOption;
    isSelected: boolean;
    onClick: () => void;
    disabled: boolean;
}

function ToneRow({ tone, isSelected, onClick, disabled }: ToneRowProps) {
    const colors = COLOR_CLASSES[tone.color];

    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileHover={{ x: disabled ? 0 : 4 }}
            className={`
                relative w-full p-3 rounded-lg border-2 text-left transition-all duration-200
                flex items-center gap-3
                ${disabled
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    : isSelected
                        ? `${colors.bg} ${colors.border} border-2`
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
            `}
        >
            {/* Icon */}
            <span className="text-2xl flex-shrink-0">{tone.icon}</span>

            {/* Name & Description */}
            <div className="flex-1 min-w-0">
                <div className={`font-semibold ${isSelected ? colors.text : 'text-gray-900 dark:text-white'}`}>
                    {tone.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {tone.description}
                </div>
            </div>

            {/* Selected Radio */}
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected
                    ? `${colors.border} ${colors.bg}`
                    : 'border-gray-300 dark:border-gray-600'
                }
            `}>
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-2.5 h-2.5 rounded-full ${colors.text.replace('text', 'bg')}`}
                    />
                )}
            </div>
        </motion.button>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ToneSelector({
    value,
    onChange,
    disabled = false,
    layout = 'grid'
}: ToneSelectorProps) {
    const isGrid = layout === 'grid';

    return (
        <div>
            {/* Label & Description */}
            <div className="mb-3">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Tonfall wählen
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Wie soll der generierte Inhalt klingen?
                </p>
            </div>

            {/* Tone Options */}
            <div className={`
                ${isGrid
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
                    : 'space-y-2'
                }
            `}>
                {TONES.map((tone) => (
                    isGrid ? (
                        <ToneCard
                            key={tone.id}
                            tone={tone}
                            isSelected={value === tone.id}
                            onClick={() => !disabled && onChange(tone.id)}
                            disabled={disabled}
                        />
                    ) : (
                        <ToneRow
                            key={tone.id}
                            tone={tone}
                            isSelected={value === tone.id}
                            onClick={() => !disabled && onChange(tone.id)}
                            disabled={disabled}
                        />
                    )
                ))}
            </div>

            {/* Selected Tone Preview */}
            {value && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border border-violet-200 dark:border-violet-800"
                >
                    <div className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 mb-2">
                        <span className="text-lg">
                            {TONES.find(t => t.id === value)?.icon}
                        </span>
                        <span>Aktiv: {TONES.find(t => t.id === value)?.name}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Beispiel: "{TONES.find(t => t.id === value)?.example}"
                    </p>
                </motion.div>
            )}
        </div>
    );
}
