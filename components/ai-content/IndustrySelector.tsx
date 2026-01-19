// ============================================
// AI CONTENT GENERATOR - Industry Selector
// 25+ Industries with Search & Categories
// ============================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { useDebounce } from '../../lib/hooks/useDebounce';

// ============================================
// TYPES & INTERFACES
// ============================================

interface Industry {
    id: string;
    name: string;
    category: string;
    icon?: string;
}

interface IndustrySelectorProps {
    value?: string;
    onChange: (industry: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

// ============================================
// INDUSTRY DATA (25+ Industries)
// ============================================

const INDUSTRIES: Industry[] = [
    // Technology
    { id: 'software-development', name: 'Software Development', category: 'Technology' },
    { id: 'web-development', name: 'Web Development', category: 'Technology' },
    { id: 'mobile-apps', name: 'Mobile Apps', category: 'Technology' },
    { id: 'cloud-services', name: 'Cloud Services', category: 'Technology' },
    { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology' },
    { id: 'ai-ml', name: 'AI & Machine Learning', category: 'Technology' },
    { id: 'data-analytics', name: 'Data Analytics', category: 'Technology' },
    { id: 'iot', name: 'IoT Solutions', category: 'Technology' },

    // Marketing & Design
    { id: 'digital-marketing', name: 'Digital Marketing', category: 'Marketing & Design' },
    { id: 'branding', name: 'Branding & Identity', category: 'Marketing & Design' },
    { id: 'graphic-design', name: 'Graphic Design', category: 'Marketing & Design' },
    { id: 'content-marketing', name: 'Content Marketing', category: 'Marketing & Design' },
    { id: 'seo-services', name: 'SEO Services', category: 'Marketing & Design' },
    { id: 'social-media', name: 'Social Media Marketing', category: 'Marketing & Design' },

    // Business & Finance
    { id: 'consulting', name: 'Business Consulting', category: 'Business & Finance' },
    { id: 'financial-services', name: 'Financial Services', category: 'Business & Finance' },
    { id: 'accounting', name: 'Accounting', category: 'Business & Finance' },
    { id: 'legal-services', name: 'Legal Services', category: 'Business & Finance' },
    { id: 'real-estate', name: 'Real Estate', category: 'Business & Finance' },
    { id: 'insurance', name: 'Insurance', category: 'Business & Finance' },

    // Healthcare & Wellness
    { id: 'healthcare', name: 'Healthcare', category: 'Healthcare & Wellness' },
    { id: 'medical-devices', name: 'Medical Devices', category: 'Healthcare & Wellness' },
    { id: 'fitness', name: 'Fitness & Wellness', category: 'Healthcare & Wellness' },
    { id: 'mental-health', name: 'Mental Health', category: 'Healthcare & Wellness' },

    // E-Commerce & Retail
    { id: 'ecommerce', name: 'E-Commerce', category: 'E-Commerce & Retail' },
    { id: 'retail', name: 'Retail', category: 'E-Commerce & Retail' },
    { id: 'marketplace', name: 'Online Marketplace', category: 'E-Commerce & Retail' },

    // Education
    { id: 'education', name: 'Education & Training', category: 'Education' },
    { id: 'edtech', name: 'EdTech', category: 'Education' },
    { id: 'online-courses', name: 'Online Courses', category: 'Education' },

    // Other Services
    { id: 'hospitality', name: 'Hospitality', category: 'Other Services' },
    { id: 'restaurants', name: 'Restaurants & Food', category: 'Other Services' },
    { id: 'travel', name: 'Travel & Tourism', category: 'Other Services' },
    { id: 'logistics', name: 'Logistics & Supply Chain', category: 'Other Services' },
    { id: 'construction', name: 'Construction', category: 'Other Services' },
    { id: 'automotive', name: 'Automotive', category: 'Other Services' },
    { id: 'nonprofit', name: 'Non-Profit', category: 'Other Services' }
];

// ============================================
// CATEGORIES (extracted from industries)
// ============================================

const CATEGORIES = Array.from(new Set(INDUSTRIES.map(ind => ind.category)));

// ============================================
// MAIN COMPONENT
// ============================================

export function IndustrySelector({
    value,
    onChange,
    placeholder = 'Wählen Sie eine Branche...',
    disabled = false
}: IndustrySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Debounce search query to improve performance
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Filter industries based on search and category (with debounced search)
    const filteredIndustries = useMemo(() => {
        return INDUSTRIES.filter(industry => {
            const matchesSearch = industry.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || industry.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [debouncedSearchQuery, selectedCategory]);

    // Get selected industry name
    const selectedIndustry = INDUSTRIES.find(ind => ind.id === value);
    const displayValue = selectedIndustry?.name || placeholder;

    // Handle industry selection
    const handleSelectIndustry = (industryId: string) => {
        onChange(industryId);
        setIsOpen(false);
        setSearchQuery('');
    };

    // Handle category selection
    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full px-4 py-3 text-left rounded-lg border-2
                    transition-all duration-200 flex items-center justify-between
                    ${disabled
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-violet-500 dark:hover:border-violet-400 focus:border-violet-500 focus:outline-none'
                    }
                `}
            >
                <span className={`truncate ${!value ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {displayValue}
                </span>

                {/* Arrow Icon */}
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && !disabled && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Content */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden flex flex-col"
                        >
                            {/* Search Input */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <svg
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Branchen suchen..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                                <div className="flex gap-2 min-w-max">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCategory('All')}
                                        className={`
                                            px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                                            ${selectedCategory === 'All'
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }
                                        `}
                                    >
                                        Alle ({INDUSTRIES.length})
                                    </button>

                                    {CATEGORIES.map(category => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => handleSelectCategory(category)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                                                ${selectedCategory === category
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            {category} ({INDUSTRIES.filter(i => i.category === category).length})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Industry List */}
                            <div className="overflow-y-auto max-h-64 p-2">
                                {filteredIndustries.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredIndustries.map((industry) => (
                                            <button
                                                key={industry.id}
                                                type="button"
                                                onClick={() => handleSelectIndustry(industry.id)}
                                                className={`
                                                    w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                                                    flex items-start gap-3 group
                                                    ${value === industry.id
                                                        ? 'bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-500 dark:border-violet-400'
                                                        : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                    }
                                                `}
                                            >
                                                {/* Icon/Initial */}
                                                <div className={`
                                                    flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
                                                    ${value === industry.id
                                                        ? 'bg-violet-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                                                    }
                                                `}>
                                                    {industry.name.charAt(0)}
                                                </div>

                                                {/* Industry Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className={`
                                                        font-medium truncate
                                                        ${value === industry.id
                                                            ? 'text-violet-600 dark:text-violet-400'
                                                            : 'text-gray-900 dark:text-white'
                                                        }
                                                    `}>
                                                        {industry.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {industry.category}
                                                    </div>
                                                </div>

                                                {/* Selected Checkmark */}
                                                {value === industry.id && (
                                                    <svg className="flex-shrink-0 w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Keine Branchen gefunden
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Result Count */}
                            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
                                {filteredIndustries.length} {filteredIndustries.length === 1 ? 'Branche' : 'Branchen'} gefunden
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
