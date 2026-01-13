
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, useLanguage } from '../../contexts';
import { CheckBadgeIcon, PlusCircleIcon, XMarkIcon, TicketIcon, ArrowRightIcon, ClockIcon, BriefcaseIcon, ShieldCheckIcon } from '../Icons';
import { api } from '../../lib';
import type { DashboardView } from '../../pages/DashboardPage';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    price_details: string;
}

interface UserService {
    id: string;
    service_id: number;
    status: string;
    services?: Service | null;
}

interface ServicesProps {
    setActiveView?: (view: DashboardView) => void;
}

// Modal State Interface
interface BookingModalState {
    isOpen: boolean;
    serviceId: number | null;
    serviceName: string;
    servicePrice: number | null;
    step: 'confirm' | 'processing' | 'success' | 'error';
    errorMessage?: string;
}

const Services: React.FC<ServicesProps> = ({ setActiveView }) => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [activeServices, setActiveServices] = useState<UserService[]>([]); 
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [bookingModal, setBookingModal] = useState<BookingModalState>({
        isOpen: false,
        serviceId: null,
        serviceName: '',
        servicePrice: null,
        step: 'confirm'
    });

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: allServices } = await api.getServices();
            const { data: userBookings } = await api.getUserServices();

            // Safely cast and validate user bookings
            const booked = Array.isArray(userBookings)
                ? userBookings.filter((b): b is UserService =>
                    b && typeof b === 'object' && 'id' in b && 'service_id' in b && 'status' in b
                )
                : [];
            setActiveServices(booked);

            const bookedIds = booked.map(b => b.service_id).filter((id): id is number => id != null);
            const available = Array.isArray(allServices)
                ? allServices.filter((s): s is Service => s && typeof s === 'object' && 'id' in s && !bookedIds.includes(s.id))
                : [];
            setAvailableServices(available);

        } catch (err) {
            setError("Dienste konnten nicht geladen werden.");
        } finally {
            setLoading(false);
        }
    };

    const openBookingModal = (service: Service) => {
        setBookingModal({
            isOpen: true,
            serviceId: service.id,
            serviceName: service.name,
            servicePrice: service.price,
            step: 'confirm'
        });
    };

    const closeBookingModal = () => {
        setBookingModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirmBooking = async () => {
        if (!user || !bookingModal.serviceId) return;
        
        setBookingModal(prev => ({ ...prev, step: 'processing' }));
        
        try {
             const { data } = await api.bookService(bookingModal.serviceId);
             if(data.success) {
                 setBookingModal(prev => ({ ...prev, step: 'success' }));
                 // Refresh list in background
                 fetchData();
             } else {
                 throw new Error("Unbekannter Fehler");
             }
        } catch (err) {
            setBookingModal(prev => ({
                ...prev,
                step: 'error',
                errorMessage: err instanceof Error ? err.message : "Fehler bei der Buchung."
            }));
        }
    }

    const handleSuccessAction = () => {
        closeBookingModal();
        if (setActiveView) {
            setActiveView('ticket-support');
        }
    };

    // Filter services based on status
    const confirmedServices = activeServices.filter(s => s.status === 'active' || s.status === 'completed');
    const pendingServices = activeServices.filter(s => s.status === 'pending');

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Ihre Dienstleistungen</h1>
                <p className="mt-2 text-slate-900/80 dark:text-white/80">Lade Dienste...</p>
                <div className="mt-8 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
         return (
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Ihre Dienstleistungen</h1>
                 <div className="mt-8 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Fehler!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                        <BriefcaseIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">{t('dashboard.services.title')}</h1>
                        <p className="text-white/80 text-sm mt-1 font-medium">
                            Verwalten Sie Ihre gebuchten Pakete und entdecken Sie weitere Möglichkeiten.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pending Requests Section */}
            {pendingServices.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Offene Anfragen</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-bold">
                            {pendingServices.length}
                        </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {pendingServices.map((item) => (
                            <div key={item.id} className="group bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/30 flex items-start gap-3 hover:border-yellow-300 dark:hover:border-yellow-700/50 transition-all duration-300 hover:shadow-md">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{item.services?.name || 'Unbekannter Service'}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.services?.description || ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Services Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Aktive Dienste</h2>
                </div>
                {confirmedServices.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {confirmedServices.map((item) => (
                            <div key={item.id} className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 hover:border-green-200 dark:hover:border-green-800/50 hover:shadow-md hover:shadow-green-500/5 transition-all duration-300">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{item.services?.name || 'Unbekannter Service'}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.services?.description || ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400">Sie haben derzeit keine aktiven Dienste.</p>
                    </div>
                )}
            </div>

             {/* Available Services Section */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                    <PlusCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.alerts.book_more_services')}</h2>
                </div>
                {availableServices.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {availableServices.map((service) => (
                            <div key={service.id} className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 -translate-y-0 hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.name}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{service.description}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(service.price)}
                                        </p>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{service.price_details}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openBookingModal(service)}
                                    className="group/btn w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-lg hover:opacity-90 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <PlusCircleIcon className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                                    Anfragen
                                </button>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Alle verfügbaren Dienste sind bereits aktiv oder angefragt.</p>
                    </div>
                 )}
            </div>

            {/* BOOKING MODAL */}
            {bookingModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl shadow-blue-500/10 border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {bookingModal.step === 'confirm' && 'Dienst anfragen'}
                                {bookingModal.step === 'processing' && 'Wird bearbeitet...'}
                                {bookingModal.step === 'success' && 'Erfolgreich'}
                                {bookingModal.step === 'error' && 'Fehler'}
                            </h3>
                            {bookingModal.step !== 'processing' && (
                                <button onClick={closeBookingModal} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 hover:scale-110 active:scale-95">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {/* CONFIRMATION STEP */}
                            {bookingModal.step === 'confirm' && (
                                <div className="space-y-5">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                                                <PlusCircleIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide">Auswahl</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{bookingModal.serviceName}</p>
                                                {bookingModal.servicePrice && (
                                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(bookingModal.servicePrice)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Möchten Sie diesen Dienst verbindlich anfragen? Ein Support-Ticket wird automatisch erstellt.
                                    </p>

                                    <div className="flex gap-3">
                                        <button onClick={closeBookingModal} className="group flex-1 py-3 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
                                            {t('dashboard.alerts.cancel')}
                                        </button>
                                        <button onClick={handleConfirmBooking} className="group flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-bold hover:opacity-90 hover:shadow-md hover:shadow-blue-500/20 text-sm transition-all duration-200 active:scale-[0.98]">
                                            <span className="flex items-center justify-center gap-2">
                                                Anfragen
                                                <PlusCircleIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PROCESSING STEP */}
                            {bookingModal.step === 'processing' && (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin"></div>
                                    <p className="font-bold text-slate-900 dark:text-white mt-4">Anfrage wird erstellt...</p>
                                </div>
                            )}

                            {/* SUCCESS STEP */}
                            {bookingModal.step === 'success' && (
                                <div className="flex flex-col items-center text-center space-y-4 py-4">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                                        <CheckBadgeIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Vielen Dank!</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                                        Ihre Anfrage für <strong>{bookingModal.serviceName}</strong> wurde erfolgreich übermittelt.
                                    </p>

                                    <button onClick={handleSuccessAction} className="group w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-bold hover:opacity-90 hover:shadow-md hover:shadow-blue-500/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]">
                                        <TicketIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                        Zum Ticket wechseln
                                    </button>
                                    <button onClick={closeBookingModal} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors">
                                        Hier bleiben
                                    </button>
                                </div>
                            )}

                            {/* ERROR STEP */}
                            {bookingModal.step === 'error' && (
                                <div className="flex flex-col items-center text-center space-y-4 py-4">
                                     <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 shadow-sm">
                                        <XMarkIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Fehler</h4>
                                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg w-full font-medium">
                                        {bookingModal.errorMessage}
                                    </p>
                                    <button onClick={() => setBookingModal(prev => ({ ...prev, step: 'confirm' }))} className="w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-200 active:scale-[0.98]">
                                        Erneut versuchen
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Services;
