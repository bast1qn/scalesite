import React, { useState, useEffect } from 'react';

// Simulated recent purchases for social proof
const recentPurchases = [
    { name: 'Thomas M.', location: 'München', package: 'Basic Website', time: 'vor 2 Minuten' },
    { name: 'Sarah K.', location: 'Berlin', package: 'Starter Website', time: 'vor 5 Minuten' },
    { name: 'Michael B.', location: 'Hamburg', package: 'Business Website', time: 'vor 8 Minuten' },
    { name: 'Julia S.', location: 'Köln', package: 'Basic Website', time: 'vor 12 Minuten' },
    { name: 'Andreas W.', location: 'Frankfurt', package: 'Starter Website', time: 'vor 15 Minuten' },
    { name: 'Lisa M.', location: 'Stuttgart', package: 'One-Page', time: 'vor 18 Minuten' },
];

export const LiveNotification: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [currentPurchase, setCurrentPurchase] = useState(recentPurchases[0]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Show first notification after 3 seconds
        const timer = setTimeout(() => {
            showNextNotification();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const showNextNotification = () => {
        setCurrentPurchase(recentPurchases[index]);
        setVisible(true);

        // Hide after 5 seconds, then show next
        setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % recentPurchases.length);
                showNextNotification();
            }, 8000);
        }, 5000);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 max-w-xs">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {currentPurchase.name.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {currentPurchase.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        {currentPurchase.location} • {currentPurchase.package}
                    </p>
                </div>

                {/* Time indicator */}
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 whitespace-nowrap">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {currentPurchase.time}
                </div>
            </div>
        </div>
    );
};
