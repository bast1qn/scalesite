import React, { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import {
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  StarIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  XMarkIcon
} from '../components/Icons';

// MapPinIcon - simple SVG component
const MapPinIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

interface RestaurantPageProps {
  setCurrentPage: (page: string) => void;
}

// Menu data
const menuCategories = [
  {
    id: 'coffee',
    name: 'Coffee & Espresso',
    items: [
      { name: 'Espresso', description: 'Double espresso', price: '$4.50' },
      { name: 'Cappuccino', description: 'Espresso with steamed milk', price: '$5.50' },
      { name: 'Caffè Latte', description: 'Espresso with extra milk', price: '$6.00' },
      { name: 'Flat White', description: 'Espresso with micro-foamed milk', price: '$6.50' },
      { name: 'Matcha Latte', description: 'Green tea with milk', price: '$7.00' },
    ]
  },
  {
    id: 'breakfast',
    name: 'Breakfast',
    items: [
      { name: 'Croissant', description: 'Butter croissant, fresh baked', price: '$4.50' },
      { name: 'Breakfast Basket', description: '3 rolls with butter & jam', price: '$8.00' },
      { name: 'Avocado Toast', description: 'Sourdough toast, avocado, egg', price: '$14.00' },
      { name: 'Full English', description: 'Eggs, bacon, sausage, beans, toast', price: '$21.00' },
      { name: 'Pancakes', description: '3 pancakes with maple syrup', price: '$12.00' },
    ]
  },
  {
    id: 'cakes',
    name: 'Cakes & Desserts',
    items: [
      { name: 'Cheesecake', description: 'New York style', price: '$8.50' },
      { name: 'Chocolate Cake', description: 'With Belgian chocolate', price: '$7.50' },
      { name: 'Apple Pie', description: 'With vanilla ice cream', price: '$7.00' },
      { name: 'Tiramisu', description: 'Classic Italian', price: '$9.00' },
      { name: 'Crème Brûlée', description: 'With caramelized crust', price: '$8.50' },
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks',
    items: [
      { name: 'Caesar Salad', description: 'With chicken, croutons, parmesan', price: '$16.00' },
      { name: 'Club Sandwich', description: 'Chicken, bacon, tomato, lettuce', price: '$18.00' },
      { name: 'Veggie Bowl', description: 'Quinoa, avocado, vegetables', price: '$19.00' },
      { name: 'Fish & Chips', description: 'With pea puree', price: '$22.00' },
    ]
  }
];

// Gallery images (using placeholder gradients)
const galleryImages = [
  { id: 1, color: 'from-amber-400 to-orange-500', label: 'Café Atmosphere' },
  { id: 2, color: 'from-stone-400 to-stone-600', label: 'Espresso Bar' },
  { id: 3, color: 'from-yellow-400 to-amber-500', label: 'Breakfast Dish' },
  { id: 4, color: 'from-rose-400 to-pink-500', label: 'Latte Art' },
  { id: 5, color: 'from-emerald-400 to-teal-500', label: 'Garden Area' },
  { id: 6, color: 'from-violet-400 to-purple-500', label: 'Dessert Specialty' },
];

// Testimonials
const testimonials = [
  {
    id: 1,
    text: 'Best cappuccino in town! The atmosphere is cozy and the staff is super friendly.',
    author: 'Maria M.',
    rating: 5
  },
  {
    id: 2,
    text: 'Perfect place to work. Fast WiFi, great coffee, and delicious snacks.',
    author: 'Thomas K.',
    rating: 5
  },
  {
    id: 3,
    text: 'The breakfast is excellent. I love coming back here.',
    author: 'Sarah L.',
    rating: 5
  }
];

export const RestaurantPage: React.FC<RestaurantPageProps> = ({ setCurrentPage }) => {
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setReservationForm({ name: '', email: '', phone: '', date: '', time: '', guests: '2' });
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

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Gallery */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
          {galleryImages.map((img, idx) => (
            <div
              key={img.id}
              className={`bg-gradient-to-br ${img.color} transition-transform duration-700 hover:scale-105`}
              style={{
                animationDelay: `${idx * 100}ms`,
                gridColumn: (idx % 3) + 1,
                gridRow: Math.floor(idx / 3) + 1
              }}
            />
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <AnimatedSection>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
              Café & Bistro
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Enjoy handcrafted coffee, homemade cakes, and a relaxed atmosphere
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#menu"
                className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition-colors"
              >
                View Menu
              </a>
              <a
                href="#reservation"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Reserve a Table
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Opening Hours & Location */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Opening Hours */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Opening Hours</h3>
                </div>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex justify-between"><span>Monday - Friday</span><span>07:00 - 19:00</span></li>
                  <li className="flex justify-between"><span>Saturday</span><span>08:00 - 20:00</span></li>
                  <li className="flex justify-between"><span>Sunday</span><span>09:00 - 18:00</span></li>
                </ul>
              </div>

              {/* Location */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MapPinIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Location</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Main Street 123<br />
                  10115 Berlin-Mitte
                </p>
                <p className="mt-2 text-sm text-slate-500">U-Bahn U2/U5 Hausvogteiplatz</p>
              </div>

              {/* Contact */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <PhoneIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact</h3>
                </div>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    <span>+49 30 123 456 78</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>info@cafe-bistro.de</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Our Menu
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Fresh ingredients, homemade quality
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8">
              {menuCategories.find(cat => cat.id === activeCategory)?.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-start py-4 ${
                    idx < menuCategories.find(cat => cat.id === activeCategory)!.items.length - 1
                      ? 'border-b border-slate-200 dark:border-slate-800'
                      : ''
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
                  </div>
                  <span className="ml-4 font-bold text-blue-600 dark:text-blue-400">{item.price}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Gallery
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Take a look inside
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br ${img.color} hover:scale-105 transition-transform duration-300`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/90 font-medium text-center px-4">{img.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-slate-300">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <div
            className={`max-w-2xl w-full aspect-video rounded-2xl bg-gradient-to-br ${
              galleryImages.find(i => i.id === selectedImage)?.color
            } flex items-center justify-center`}
          >
            <span className="text-white text-2xl font-medium">
              {galleryImages.find(i => i.id === selectedImage)?.label}
            </span>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
                What Our Guests Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center text-white">
                      <UserCircleIcon className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{testimonial.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Reservation Form */}
      <section id="reservation" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-2xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Reserve a Table
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Secure your favorite spot
              </p>
            </div>

            <form onSubmit={handleReservationSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Reservation Confirmed!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    We'll confirm your reservation via email.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reservationForm.name}
                      onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={reservationForm.date}
                        onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Time *
                      </label>
                      <select
                        required
                        value={reservationForm.time}
                        onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select time</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Number of Guests *
                    </label>
                    <select
                      required
                      value={reservationForm.guests}
                      onChange={(e) => setReservationForm({ ...reservationForm, guests: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5 People</option>
                      <option value="6">6+ People (Large Group)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={reservationForm.phone}
                      onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="+49 30 123 456 78"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CalendarDaysIcon className="w-5 h-5" />
                    Reserve Now
                  </button>
                </div>
              )}
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="h-80 bg-slate-200 dark:bg-slate-800">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Main Street 123, 10115 Berlin
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-white dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantPage;
