import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { ChevronRightIcon } from './Icons';

interface ShowcasePreviewProps {
  setCurrentPage: (page: string) => void;
}

const showcases = [
  {
    id: 'restaurant',
    title: 'The Coffee House',
    category: 'Restaurant Website',
    description: 'Menu with categories, online reservations, photo gallery, testimonials',
    gradient: 'from-amber-400 to-orange-500',
    features: ['Interactive Menu', 'Reservations', 'Gallery', 'Testimonials']
  },
  {
    id: 'architecture',
    title: 'Richter Architects',
    category: 'Portfolio Website',
    description: 'Project gallery with filters, team section, contact form, before/after',
    gradient: 'from-slate-400 to-slate-600',
    features: ['Filterable Gallery', 'Project Details', 'Team', 'Contact Form']
  },
  {
    id: 'realestate',
    title: 'Premium Properties',
    category: 'Real Estate Website',
    description: 'Property search with filters, detail views, viewing requests',
    gradient: 'from-blue-400 to-blue-600',
    features: ['Search Filters', 'Property Cards', 'Detail Modal', 'Lead Forms']
  }
];

export const ShowcasePreview: React.FC<ShowcasePreviewProps> = ({ setCurrentPage }) => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
              LIVE DEMOS
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              See What We Can Build
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore our showcase websites. Each one demonstrates different features and design patterns
              you can have for your own business.
            </p>
          </div>

          {/* Showcase Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {showcases.map((showcase, idx) => (
              <AnimatedSection key={showcase.id} stagger delay={idx * 100}>
                <button
                  onClick={() => setCurrentPage(showcase.id as any)}
                  className="group text-left"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:-translate-y-2">
                    {/* Preview Image */}
                    <div className={`aspect-[4/3] bg-gradient-to-br ${showcase.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-3 py-1 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white text-xs font-semibold rounded-full">
                          {showcase.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {showcase.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                        {showcase.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {showcase.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-md"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>View Live Demo</span>
                        <ChevronRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </button>
              </AnimatedSection>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Want a custom website for your business?
            </p>
            <button
              onClick={() => setCurrentPage('preise')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Get Your Free Quote
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
