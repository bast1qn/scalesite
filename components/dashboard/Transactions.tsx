
import React, { useEffect, useState, useContext } from 'react';
import { DocumentArrowDownIcon } from '../Icons';
import { api } from '../../lib/api';
import { AuthContext } from '../../contexts/AuthContext';

interface Invoice {
    id: string;
    date: string;
    due_date: string;
    amount: number;
    status: 'Bezahlt' | 'Offen' | 'Überfällig';
    description: string;
}

const Transactions: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data } = await api.get('/transactions');
                setTransactions(data || []);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [user]);

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'Bezahlt': return 'bg-green-500/20 text-green-700 dark:text-green-300';
            case 'Offen': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
            case 'Überfällig': return 'bg-red-500/20 text-red-700 dark:text-red-300';
            default: return 'bg-gray-500/20 text-gray-700';
        }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE');
    }

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Transaktionen</h1>
            <p className="mt-2 text-dark-text/80 dark:text-light-text/80">
                Hier finden Sie eine Übersicht aller Ihrer Rechnungen und Zahlungen.
            </p>

            <div className="mt-8 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Rechnungsnr.</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Beschreibung</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Datum</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Fällig am</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Betrag</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Download</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-surface divide-y divide-slate-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12">Lade Daten...</td>
                                </tr>
                            ) : transactions.length > 0 ? transactions.map(invoice => (
                                <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-dark-text dark:text-light-text">{invoice.id}</td>
                                    <td className="px-6 py-4 text-sm text-dark-text/80 dark:text-light-text/80 whitespace-nowrap">{invoice.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text/80 dark:text-light-text/80">{formatDate(invoice.date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text/80 dark:text-light-text/80">{invoice.due_date ? formatDate(invoice.due_date) : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark-text dark:text-light-text font-mono">{formatCurrency(invoice.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button disabled title="Download in Kürze verfügbar." className="p-2 text-slate-400 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                            <DocumentArrowDownIcon />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        Keine Transaktionen gefunden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
