import React, { useState } from 'react';
import { AnimatedSection, ChevronLeftIcon, ArrowRightIcon, XMarkIcon, EnvelopeIcon, PhoneIcon, ChevronDownIcon } from '../components';

// MapPinIcon - simple SVG component
const MapPinIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

interface ArchitecturePageProps {
  setCurrentPage: (page: string) => void;
}

// Projects data
const projectCategories = [
  { id: 'all', name: 'All Projects' },
  { id: 'residential', name: 'Residential' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'interior', name: 'Interior' }
];

const projects = [
  {
    id: 1,
    title: 'Lakeside Villa',
    category: 'residential',
    location: 'Lake Müritz, Mecklenburg-Vorpommern',
    year: '2023',
    size: '350 m²',
    description: 'Modern holiday villa with panoramic windows and sustainable timber construction.',
    gradient: 'from-slate-300 to-slate-500',
    images: ['from-slate-300 to-slate-500', 'from-amber-200 to-amber-400', 'from-stone-300 to-stone-500']
  },
  {
    id: 2,
    title: 'TechPark Office Complex',
    category: 'commercial',
    location: 'Berlin-Mitte',
    year: '2022',
    size: '5,200 m²',
    description: 'Innovative office complex with rooftop garden and smart home integration.',
    gradient: 'from-blue-300 to-blue-500',
    images: ['from-blue-300 to-blue-500', 'from-slate-400 to-slate-600', 'from-cyan-300 to-cyan-500']
  },
  {
    id: 3,
    title: 'Loft Apartment',
    category: 'interior',
    location: 'Hamburg-Altona',
    year: '2023',
    size: '120 m²',
    description: 'Industrial-chic loft with open living area and minimalist design.',
    gradient: 'from-rose-300 to-rose-500',
    images: ['from-rose-300 to-rose-500', 'from-orange-200 to-orange-400', 'from-red-300 to-red-500']
  },
  {
    id: 4,
    title: 'Urban Multi-Family',
    category: 'residential',
    location: 'Kreuzberg, Berlin',
    year: '2021',
    size: '1,800 m²',
    description: 'City-compatible multi-family building with green façade.',
    gradient: 'from-green-300 to-green-500',
    images: ['from-green-300 to-green-500', 'from-emerald-300 to-emerald-500', 'from-lime-200 to-lime-400']
  },
  {
    id: 5,
    title: 'Restaurant Interior',
    category: 'interior',
    location: 'Munich-Schwabing',
    year: '2022',
    size: '280 m²',
    description: 'Gourmet restaurant with acoustically optimized ambiance.',
    gradient: 'from-violet-300 to-violet-500',
    images: ['from-violet-300 to-violet-500', 'from-purple-300 to-purple-500', 'from-fuchsia-300 to-fuchsia-500']
  },
  {
    id: 6,
    title: 'Production Hall',
    category: 'commercial',
    location: 'Dresden',
    year: '2023',
    size: '8,500 m²',
    description: 'Sustainable industrial hall with solar roof and heat recovery.',
    gradient: 'from-zinc-300 to-zinc-500',
    images: ['from-zinc-300 to-zinc-500', 'from-gray-400 to-gray-600', 'from-neutral-300 to-neutral-500']
  }
];

// Team members
const team = [
  {
    id: 1,
    name: 'Anna Richter',
    role: 'Founder & Architect',
    description: 'Over 15 years of experience in sustainable building.'
  },
  {
    id: 2,
    name: 'Thomas Bergmann',
    role: 'Associate Partner',
    description: 'Specialist in commercial construction and urban planning.'
  },
  {
    id: 3,
    name: 'Sofia Chen',
    role: 'Interior Design',
    description: 'Focus on minimalist and functional design.'
  },
  {
    id: 4,
    name: 'Marcus Weber',
    role: 'Project Management',
    description: 'Expertise in construction management and coordination.'
  }
];

// Services
const services = [
  {
    id: 1,
    title: 'Architecture',
    description: 'From the first sketch to turnkey construction.',
    items: ['New Build', 'Renovation', 'Extension', 'Interior Design']
  },
  {
    id: 2,
    title: 'Planning',
    description: 'Comprehensive planning services for all phases.',
    items: ['Design', 'Permitting', 'Construction', 'Site Supervision']
  },
  {
    id: 3,
    title: 'Consulting',
    description: 'Consulting for construction projects and real estate development.',
    items: ['Property Search', 'Feasibility', 'Sustainability', 'Smart Home']
  }
];

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ setCurrentPage }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('home')}
        className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Hero Section - Minimalist */}
      <section className="relative h-[85vh] flex items-center">
        {/* Large Background Image Area */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Minimal Content */}
        <div className="relative z-10 w-full px-8 md:px-16">
          <AnimatedSection>
            <div className="max-w-4xl">
              <p className="text-white/80 text-lg mb-4 tracking-widest uppercase">Architecture Studio</p>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-8">
                Richter<br/>Architects
              </h1>
              <p className="text-white/90 text-xl md:text-2xl max-w-xl">
                Sustainable building with vision and precision.
              </p>
              <div className="mt-12 flex items-center gap-3 text-white/80">
                <div className="w-16 h-px bg-white/50"></div>
                <span>Since 2015</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDownIcon className="w-8 h-8" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 tracking-widest uppercase">About Us</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                  We design spaces<br/>for people.
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Our architecture studio in Berlin-Mitte creates sustainable, aesthetic,
                  and functional buildings. Each project is a unique response to
                  location, context, and our clients' requirements.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  With over 50 completed projects and numerous awards,
                  we are among the leading studios for contemporary architecture in Germany.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-8 text-center">
                  <p className="font-serif text-5xl font-bold text-blue-600 dark:text-blue-400">50+</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Projects</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-8 text-center">
                  <p className="font-serif text-5xl font-bold text-blue-600 dark:text-blue-400">8</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Years Experience</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-8 text-center">
                  <p className="font-serif text-5xl font-bold text-blue-600 dark:text-blue-400">12</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Awards</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-8 text-center">
                  <p className="font-serif text-5xl font-bold text-blue-600 dark:text-blue-400">100%</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 tracking-widest uppercase">Services</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                What We Offer
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-slate-800 rounded-2xl p-8">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
              <div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 tracking-widest uppercase">Projects</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                  Our Work
                </h2>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                {projectCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2 rounded-full font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => (
                <button
                  key={project.id}
                  onClick={() => { setSelectedProject(project); setCurrentImageIndex(0); }}
                  className="group text-left"
                >
                  <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${project.gradient} mb-4 overflow-hidden relative`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 px-6 py-3 rounded-full font-medium">
                        View Project
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{project.location}</p>
                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 z-10"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            {/* Image Gallery */}
            <div className={`aspect-video bg-gradient-to-br ${selectedProject.images[currentImageIndex] ?? ''} relative`}>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : (selectedProject.images?.length ?? 1) - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800 rounded-full flex items-center justify-center"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev < (selectedProject.images?.length ?? 1) - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800 rounded-full flex items-center justify-center"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedProject.images?.map((_, idx) => (
                  <button
                    key={`project-image-${selectedProject.id}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="p-8">
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {selectedProject.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">{selectedProject.location}</p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {selectedProject.description}
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Year:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{selectedProject.year}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Size:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{selectedProject.size}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                    {projectCategories.find(c => c.id === selectedProject.category)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 tracking-widest uppercase">Team</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Our Architects
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">{member.role}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4 tracking-widest uppercase">Contact</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                  Start Your Project.
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Address</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        Linienstraße 123<br/>10115 Berlin-Mitte
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PhoneIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Phone</h4>
                      <p className="text-slate-600 dark:text-slate-400">+49 30 123 456 78</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <EnvelopeIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Email</h4>
                      <p className="text-slate-600 dark:text-slate-400">kontakt@richter-architekten.de</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8">
                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ArchitecturePage;
