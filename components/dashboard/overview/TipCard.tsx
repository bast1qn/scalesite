// ============================================
// TIP CARD COMPONENT
// Displays tip of the day
// ============================================

import React from 'react';
import { LightBulbIcon } from '../../../Icons';

export interface TipCardProps {
    tip: string;
    title: string;
}

/**
 * Tip Card Component
 *
 * Displays a tip with an icon
 */
export const TipCard = React.memo<TipCardProps>(({ tip, title }) => {
    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-xl flex gap-3">
            <div className="shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                    <LightBulbIcon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-sm mb-1">{title}</h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
                    {tip}
                </p>
            </div>
        </div>
    );
});

TipCard.displayName = 'TipCard';
