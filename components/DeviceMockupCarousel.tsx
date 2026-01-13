
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { AnimatedSection } from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

const mockups = [
    {
        id: 1,
        client_name: "Lumina Art Gallery",
        desktop_image_url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
        tablet_image_url: "https://images.unsplash.com/photo-1550503999-3229e447a115?q=80&w=800&auto=format&fit=crop",
        phone_image_url: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 2,
        client_name: "EcoMarket Organic",
        desktop_image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop",
        tablet_image_url: "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=800&auto=format&fit=crop",
        phone_image_url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 3,
        client_name: "TechFlow SaaS",
        desktop_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
        tablet_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        phone_image_url: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?q=80&w=400&auto=format&fit=crop",
    }
];

export const DeviceMockupCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  const nextSlide = useCallback(() => {
    if (mockups.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockups.length);
  }, []);

  const prevSlide = useCallback(() => {
    if (mockups.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mockups.length) % mockups.length);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  const currentMockup = mockups[currentIndex];

  if (mockups.length === 0) {
    return null; 
  }

  return (
    <AnimatedSection>
      <section
          className="py-24 sm:py-32 bg-surface dark:bg-dark-surface overflow-hidden"
          aria-roledescription="carousel"
          aria-label={t('device_carousel_labels.aria_label')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text tracking-tight">
              {t('device_carousel.title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text/70 dark:text-light-text/70">
              {t('device_carousel.subtitle')}
            </p>
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {t('device_carousel_labels.project_label')} {currentMockup?.client_name}
            </div>
          </div>

          <div className="mt-16 relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center">
            {mockups.map((mockup, index) => (
              <div
                key={mockup.id}
                className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
                  index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                aria-hidden={index !== currentIndex}
              >
                {/* Device Mockups */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Desktop */}
                  <div className="absolute z-10 w-[70%] max-w-4xl h-auto bg-dark-surface dark:bg-dark-bg rounded-t-lg shadow-2xl p-2 sm:p-3 border-b-4 border-dark-text/30 dark:border-light-text/20 transform translate-y-4 sm:translate-y-0">
                    <div className="aspect-video w-full rounded-sm overflow-hidden bg-dark-text/10">
                        <img src={mockup.desktop_image_url} alt={`${mockup.client_name} Desktop`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  </div>

                  {/* Tablet */}
                  <div className="absolute z-20 bottom-0 -right-4 sm:right-0 lg:right-10 w-[30%] sm:w-[25%] max-w-xs bg-light-bg/90 dark:bg-dark-surface rounded-lg shadow-xl p-1.5 sm:p-2 border-2 border-dark-text/20 dark:border-light-text/20 transform translate-x-2 translate-y-2 sm:translate-x-0 sm:translate-y-0">
                    <div className="aspect-[3/4] w-full rounded overflow-hidden bg-dark-text/10">
                        <img src={mockup.tablet_image_url} alt={`${mockup.client_name} Tablet`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="absolute z-30 bottom-0 -left-2 sm:left-0 lg:left-10 w-[16%] sm:w-[12%] max-w-[120px] bg-light-bg/90 dark:bg-dark-surface rounded-lg shadow-xl p-1 sm:p-1.5 border-2 border-dark-text/20 dark:border-light-text/20 transform -translate-x-2 translate-y-2 sm:translate-x-0 sm:translate-y-0">
                    <div className="aspect-[9/16] w-full rounded-sm overflow-hidden bg-dark-text/10">
                        <img src={mockup.phone_image_url} alt={`${mockup.client_name} Phone`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-0 sm:left-4 z-40 p-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-950 backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 sm:right-4 z-40 p-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-950 backdrop-blur-sm"
              aria-label="Next"
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-12" role="tablist">
              {mockups.map((_, index) => (
                  <button
                      key={index}
                      role="tab"
                      aria-selected={currentIndex === index}
                      aria-controls={`slide-${index + 1}`}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-600 scale-125 w-8' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'} focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-950`}
                  />
              ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};