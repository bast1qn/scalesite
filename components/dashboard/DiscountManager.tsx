
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { TagIcon, PlusCircleIcon, XMarkIcon, PencilIcon } from '../Icons';
import { alertSaveFailed, alertError } from '../../lib/dashboardAlerts';

const DiscountManager: React.FC = () => {
    const { t } = useLanguage();
    const [services, setServices] = useState<any[]>([]);
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Discount Code Form
    const [code, setCode] = useState('');
    const [type, setType] = useState('percent');
    const [value, setValue] = useState('');
    const [showDiscountModal, setShowDiscountModal] = useState(false);

    // Service Edit Modal
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [editLang, setEditLang] = useState<'de' | 'en'>('de');
    
    // Service Form State
    const [serviceForm, setServiceForm] = useState({
        name: '', name_en: '',
        description: '', description_en: '',
        price: 0, sale_price: 0,
        price_details: '', price_details_en: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [servicesRes, discountsRes] = await Promise.all([
                api.getServices(),
                api.getDiscounts()
            ]);
            setServices(servicesRes.data || []);
            setDiscounts(discountsRes.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openServiceModal = (service: any) => {
        setEditingService(service);
        setServiceForm({
            name: service.name || '',
            name_en: service.name_en || '',
            description: service.description || '',
            description_en: service.description_en || '',
            price: service.price || 0,
            sale_price: service.sale_price || 0,
            price_details: service.price_details || '',
            price_details_en: service.price_details_en || ''
        });
        setEditLang('de');
        setShowServiceModal(true);
    };

    const handleServiceSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        try {
            await api.adminUpdateService(editingService.id, {
                ...serviceForm,
                sale_price: serviceForm.sale_price || null
            });
            setShowServiceModal(false);
            fetchData();
        } catch (e: any) {
            alertSaveFailed(e.message);
        }
    };

    const handleCreateCode = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createDiscount(code, type, parseFloat(value));
            setShowDiscountModal(false);
            setCode('');
            setValue('');
            fetchData();
        } catch (e: any) {
            alertError(e.message);
        }
    };

    const handleDeleteCode = async (id: string) => {
        if(!confirm("Code wirklich löschen?")) return;
        try {
            await api.deleteDiscount(id);
            fetchData();
        } catch (e: any) {
            alertError(e.message);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Marketing & Rabatte</h1>
                    <p className="mt-2 text-slate-900/80 dark:text-white/80">Preise anpassen, Übersetzungen pflegen und Gutscheincodes verwalten.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Services Pricing */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t('dashboard.discounts.title')}</h2>
                    <div className="space-y-4">
                        {services.map(service => (
                            <div key={service.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 group hover:border-blue-400/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="font-bold text-slate-900 dark:text-white block">{service.name}</span>
                                        {service.name_en && <span className="text-xs text-slate-400 block italic">EN: {service.name_en}</span>}
                                    </div>
                                    <button 
                                        onClick={() => openServiceModal(service)}
                                        className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
                                    >
                                        <PencilIcon className="w-3 h-3" /> Editieren
                                    </button>
                                </div>
                                
                                <div className="flex gap-4 text-sm">
                                    <div className="flex-1">
                                        <span className="text-xs text-slate-500 block">Preis</span>
                                        <span className="font-mono">{service.price}€</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs text-slate-500 block">Angebot</span>
                                        <span className={`font-mono ${service.sale_price ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                                            {service.sale_price ? `${service.sale_price}€` : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Discount Codes */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gutscheincodes</h2>
                        <button onClick={() => setShowDiscountModal(true)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold hover:bg-blue-700 transition-colors">
                            + Erstellen
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {discounts.map(d => (
                            <div key={d.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <TagIcon className="w-4 h-4 text-blue-600" />
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">{d.code}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        -{d.value}{d.type === 'percent' ? '%' : '€'} • {d.used_count}x genutzt
                                    </p>
                                </div>
                                <button onClick={() => handleDeleteCode(d.id)} className="text-red-500 hover:text-red-700 p-1">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {discounts.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Keine aktiven Codes.</p>}
                    </div>
                </div>
            </div>

            {/* DISCOUNT MODAL */}
             {showDiscountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 animate-scale-in">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Neuen Code erstellen</h3>
                        <form onSubmit={handleCreateCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Code</label>
                                <input required value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="input-premium py-2 font-mono" placeholder="SUMMER2025" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Typ</label>
                                    <select value={type} onChange={e => setType(e.target.value)} className="input-premium py-2">
                                        <option value="percent">Prozent (%)</option>
                                        <option value="fixed">Euro (€)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Wert</label>
                                    <input type="number" required value={value} onChange={e => setValue(e.target.value)} className="input-premium py-2" placeholder="10" />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowDiscountModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">{t('dashboard.alerts.cancel')}</button>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">{t('dashboard.discounts.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SERVICE EDIT MODAL */}
            {showServiceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Service bearbeiten</h3>
                            <button onClick={() => setShowServiceModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleServiceSave} className="space-y-6">
                            {/* Language Switcher */}
                            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                                <button 
                                    type="button"
                                    onClick={() => setEditLang('de')}
                                    className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-colors ${editLang === 'de' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Deutsch (Standard)
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setEditLang('en')}
                                    className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-colors ${editLang === 'en' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Englisch
                                </button>
                            </div>

                            {editLang === 'de' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name</label>
                                        <input required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="input-premium py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Beschreibung</label>
                                        <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="input-premium py-2 resize-none" rows={3} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Preis Details (z.B. 'einmalig')</label>
                                        <input value={serviceForm.price_details} onChange={e => setServiceForm({...serviceForm, price_details: e.target.value})} className="input-premium py-2" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name (EN)</label>
                                        <input value={serviceForm.name_en} onChange={e => setServiceForm({...serviceForm, name_en: e.target.value})} className="input-premium py-2" placeholder={serviceForm.name} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description (EN)</label>
                                        <textarea value={serviceForm.description_en} onChange={e => setServiceForm({...serviceForm, description_en: e.target.value})} className="input-premium py-2 resize-none" rows={3} placeholder={serviceForm.description} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price Details (EN)</label>
                                        <input value={serviceForm.price_details_en} onChange={e => setServiceForm({...serviceForm, price_details_en: e.target.value})} className="input-premium py-2" placeholder={serviceForm.price_details} />
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Preis (€)</label>
                                    <input type="number" required value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: parseFloat(e.target.value)})} className="input-premium py-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Angebotspreis (€)</label>
                                    <input type="number" value={serviceForm.sale_price} onChange={e => setServiceForm({...serviceForm, sale_price: parseFloat(e.target.value)})} className="input-premium py-2" placeholder="0 für kein Angebot" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowServiceModal(false)} className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">{t('dashboard.alerts.cancel')}</button>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                    {t('dashboard.alerts.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountManager;
