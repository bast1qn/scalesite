import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'JPY' | 'CAD' | 'AUD' | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'HRK' | 'RUB' | 'TRY' | 'CNY' | 'INR' | 'BRL' | 'MXN' | 'ZAR' | 'SGD' | 'HKD' | 'KRW' | 'IDR' | 'MYR' | 'PHP' | 'THB' | 'NZD' | 'ILS' | 'AED';

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    name: string;
    flag: string;
    rate: number;
}

const currencies: Record<CurrencyCode, Currency> = {
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 1 },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.08 },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.86 },
    CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: 0.94 },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 162.5 },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.47 },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.65 },
    SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪', rate: 11.2 },
    NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴', rate: 11.5 },
    DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰', rate: 7.45 },
    PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', flag: '🇵🇱', rate: 4.35 },
    CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', flag: '🇨🇿', rate: 25.2 },
    HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', flag: '🇭🇺', rate: 385 },
    RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', flag: '🇷🇴', rate: 4.95 },
    BGN: { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', flag: '🇧🇬', rate: 1.95 },
    HRK: { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', flag: '🇭🇷', rate: 7.55 },
    RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', rate: 98 },
    TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷', rate: 34.5 },
    CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rate: 7.8 },
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 89.5 },
    BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', rate: 5.35 },
    MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽', rate: 18.5 },
    ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', rate: 19.8 },
    SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.45 },
    HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰', rate: 8.45 },
    KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', rate: 1450 },
    IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩', rate: 16800 },
    MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾', rate: 5.1 },
    PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭', rate: 60 },
    THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭', rate: 38 },
    NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿', rate: 1.78 },
    ILS: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', flag: '🇮🇱', rate: 4.05 },
    AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.95 },
};

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    getCurrencyInfo: () => Currency;
    formatPrice: (priceInEur: number, showSymbol?: boolean, decimals?: number) => string;
    convertFromEur: (priceInEur: number) => number;
    currenciesList: Currency[];
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

interface CurrencyProviderProps {
    children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
    const [currency, setCurrencyState] = useState<CurrencyCode>('EUR');

    useEffect(() => {
        try {
            const savedCurrency = localStorage.getItem('app_currency') as CurrencyCode | null;
            if (savedCurrency && currencies[savedCurrency]) {
                setCurrencyState(savedCurrency);
            }
        } catch (error) {
            // localStorage not available (private browsing, quota exceeded, etc.)
            console.warn('Failed to read currency from localStorage:', error);
        }
    }, []);

    const setCurrency = (newCurrency: CurrencyCode) => {
        setCurrencyState(newCurrency);
        try {
            localStorage.setItem('app_currency', newCurrency);
        } catch (error) {
            console.warn('Failed to save currency to localStorage:', error);
        }
    };

    const getCurrencyInfo = (): Currency => {
        return currencies[currency];
    };

    const convertFromEur = (priceInEur: number): number => {
        return priceInEur * currencies[currency].rate;
    };

    const formatPrice = (priceInEur: number, showSymbol = true, decimals = 0): string => {
        const converted = convertFromEur(priceInEur);
        const curr = currencies[currency];

        let formatted: string;

        if (['JPY', 'KRW', 'IDR'].includes(currency)) {
            formatted = Math.round(converted).toLocaleString('de-DE');
        } else if (currency === 'EUR') {
            formatted = converted.toFixed(decimals).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        } else {
            formatted = converted.toFixed(decimals);
            const parts = formatted.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            formatted = parts.join('.');
        }

        if (!showSymbol) return formatted;

        switch (currency) {
            case 'EUR': return `${formatted.replace('.', ',')} €`;
            case 'GBP': return `£${formatted}`;
            case 'CHF': return `CHF ${formatted}`;
            case 'USD':
            case 'CAD':
            case 'AUD':
            case 'SGD':
            case 'HKD':
            case 'NZD':
            case 'BRL':
            case 'MXN':
            case 'ZAR':
                return `${curr.symbol}${formatted}`;
            case 'CNY':
            case 'JPY':
                return `${curr.symbol}${formatted}`;
            case 'KRW': return `₩${formatted}`;
            case 'INR': return `₹${formatted}`;
            case 'ILS': return `₪${formatted}`;
            case 'TRY': return `${formatted} ₺`;
            case 'AED': return `${formatted} د.إ`;
            default: return `${formatted} ${curr.symbol}`;
        }
    };

    const value: CurrencyContextType = useMemo(() => ({
        currency,
        setCurrency,
        getCurrencyInfo,
        formatPrice,
        convertFromEur,
        currenciesList: Object.values(currencies),
    }), [currency]); // Functions are stable within the provider scope

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
