// Typing Indicator Component
import { motion } from '@/lib/motion';

interface TypingIndicatorProps {
    users: Array<{
        id: string;
        name: string;
    }>;
    isTyping?: boolean;
}

export const TypingIndicator = ({ users, isTyping }: TypingIndicatorProps) => {
    if (users.length === 0) return null;

    const getText = () => {
        if (users.length === 1) {
            return `${users[0].name} tippt...`;
        }
        if (users.length === 2) {
            return `${users[0].name} und ${users[1].name} tippen...`;
        }
        if (users.length === 3) {
            return `${users[0].name}, ${users[1].name} und ${users[2].name} tippen...`;
        }
        return `${users.length} Personen tippen...`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 px-4 py-2"
        >
            {/* Typing Dots Animation */}
            <div className="flex items-center gap-1">
                <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                />
                <motion.div
                    className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                />
            </div>

            {/* Text */}
            <span className="text-xs text-slate-500 dark:text-slate-400">
                {getText()}
            </span>
        </motion.div>
    );
};

// Compact version for inline display
export const CompactTypingIndicator = () => {
    return (
        <div className="flex items-center gap-1 px-2 py-1">
            <div className="flex items-center gap-0.5">
                <motion.div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
            </div>
        </div>
    );
};
