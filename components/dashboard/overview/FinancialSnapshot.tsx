// ============================================
// FINANCIAL SNAPSHOT COMPONENT
// Displays financial overview and budget
// ============================================

import React from 'react';
import { CreditCardIcon } from '../../../Icons';
import type { FinanceData } from '../../../../types/dashboard';

export interface FinancialSnapshotProps {
    financeData: FinanceData;
    investedLabel: string;
    openLabel: string;
    nextInvoiceLabel: string;
    titleLabel: string;
    detailsLabel: string;
    onDetailsClick: () => void;
}

/**
 * Financial Snapshot Component
 *
 * Displays financial summary with budget progress
 */
export const FinancialSnapshot = React.memo<FinancialSnapshotProps>(({
    financeData,
    investedLabel,
    openLabel,
    nextInvoiceLabel,
    titleLabel,
    detailsLabel,
    onDetailsClick
}) => {
    const budgetPercentage = financeData.totalBudget > 0
        ? (financeData.spent / financeData.totalBudget) * 100
        : 0;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white">{titleLabel}</h3>
                </div>
                <button onClick={onDetailsClick} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">{detailsLabel}</button>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(financeData.spent)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{investedLabel}</span>
                    </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${budgetPercentage}%` }}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-center">
                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{openLabel}</span>
                        <span className="text-sm font-black text-red-600">{financeData.open} €</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{nextInvoiceLabel}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{financeData.nextInvoice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

FinancialSnapshot.displayName = 'FinancialSnapshot';
