import React, { useState } from 'react';
import { AnimatedSection, ClockIcon, PhoneIcon, EnvelopeIcon, ChevronLeftIcon, StarIcon, UserCircleIcon, CalendarDaysIcon, XMarkIcon, MapPinIcon } from '../components';

interface RestaurantPageProps {
  setCurrentPage: (page: string) => void;
}

// Menu data
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    id: 'coffee',
    name: 'Coffee & Espresso',
    items: [
      { id: 'coffee-1', name: 'Espresso', description: 'Double espresso', price: '$4.50' },
      { id: 'coffee-2', name: 'Cappuccino', description: 'Espresso with steamed milk', price: '$5.50' },
      { id: 'coffee-3', name: 'Caffè Latte', description: 'Espresso with extra milk', price: '$6.00' },
      { id: 'coffee-4', name: 'Flat White', description: 'Espresso with micro-foamed milk', price: '$6.50' },
      { id: 'coffee-5', name: 'Matcha Latte', description: 'Green tea with milk', price: '$7.00' },
    ]
  },
  {
    id: 'breakfast',
    name: 'Breakfast',
    items: [
      { id: 'breakfast-1', name: 'Croissant', description: 'Butter croissant, fresh baked', price: '$4.50' },
      { id: 'breakfast-2', name: 'Breakfast Basket', description: '3 rolls with butter & jam', price: '$8.00' },
      { id: 'breakfast-3', name: 'Avocado Toast', description: 'Sourdough toast, avocado, egg', price: '$14.00' },
      { id: 'breakfast-4', name: 'Full English', description: 'Eggs, bacon, sausage, beans, toast', price: '$21.00' },
      { id: 'breakfast-5', name: 'Pancakes', description: '3 pancakes with maple syrup', price: '$12.00' },
    ]
  },
  {
    id: 'cakes',
    name: 'Cakes & Desserts',
    items: [
      { id: 'cake-1', name: 'Cheesecake', description: 'New York style', price: '$8.50' },
      { id: 'cake-2', name: 'Chocolate Cake', description: 'With Belgian chocolate', price: '$7.50' },
      { id: 'cake-3', name: 'Apple Pie', description: 'With vanilla ice cream', price: '$7.00' },
      { id: 'cake-4', name: 'Tiramisu', description: 'Classic Italian', price: '$9.00' },
      { id: 'cake-5', name: 'Crème Brûlée', description: 'With caramelized crust', price: '$8.50' },
    ]
  },
  {
    id: 'snacks',
    name: 'Snacks',
    items: [
      { id: 'snack-1', name: 'Caesar Salad', description: 'With chicken, croutons, parmesan', price: '$16.00' },
      { id: 'snack-2', name: 'Club Sandwich', description: 'Chicken, bacon, tomato, lettuce', price: '$18.00' },
      { id: 'snack-3', name: 'Veggie Bowl', description: 'Quinoa, avocado, vegetables', price: '$19.00' },
      { id: 'snack-4', name: 'Fish & Chips', description: 'With pea puree', price: '$22.00' },
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
              className={`bg-gradient-to-br ${img.color} transition-transform duration-700 hover:scale-[1.02]`}
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
                className="px-8 py-3.5 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                View Menu
              </a>
              <a
                href="#reservation"
                className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Reserve a Table
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Opening Hours & Location */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Opening Hours */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Opening Hours</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex justify-between"><span>Monday - Friday</span><span className="font-medium text-slate-900 dark:text-slate-200">07:00 - 19:00</span></li>
                  <li className="flex justify-between"><span>Saturday</span><span className="font-medium text-slate-900 dark:text-slate-200">08:00 - 20:00</span></li>
                  <li className="flex justify-between"><span>Sunday</span><span className="font-medium text-slate-900 dark:text-slate-200">09:00 - 18:00</span></li>
                </ul>
              </div>

              {/* Location */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                    <MapPinIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Location</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Main Street 123<br />
                  10115 Berlin-Mitte
                </p>
                <p className="mt-2 text-xs text-slate-500">U-Bahn U2/U5 Hausvogteiplatz</p>
              </div>

              {/* Contact */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                    <PhoneIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Contact</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2 group/link">
                    <PhoneIcon className="w-4 h-4 group-hover/link:text-violet-500 transition-colors" />
                    <span className="group-hover/link:text-slate-900 dark:group-hover/link:text-slate-200 transition-colors">+49 30 123 456 78</span>
                  </li>
                  <li className="flex items-center gap-2 group/link">
                    <EnvelopeIcon className="w-4 h-4 group-hover/link:text-violet-500 transition-colors" />
                    <span className="group-hover/link:text-slate-900 dark:group-hover/link:text-slate-200 transition-colors">info@cafe-bistro.de</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Our Menu
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Fresh ingredients, homemade quality
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              {menuCategories.find(cat => cat.id === activeCategory)?.items.map((item, idx, arr) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-start py-4 group ${
                    idx < arr.length - 1
                      ? 'border-b border-slate-100 dark:border-slate-800'
                      : ''
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
                  </div>
                  <span className="ml-4 font-semibold text-blue-600 dark:text-blue-400">{item.price}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
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
                  className={`group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br ${img.color} hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/90 font-medium text-center px-4 group-hover:scale-[1.02] transition-transform duration-300">{img.label}</span>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                What Our Guests Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center text-white group-hover:scale-[1.02] transition-transform duration-300">
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Reserve a Table
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Secure your favorite spot
              </p>
            </div>

            <form onSubmit={handleReservationSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Reservation Confirmed!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    We'll confirm your reservation via email.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reservationForm.name}
                      onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={reservationForm.date}
                        onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Time *
                      </label>
                      <select
                        required
                        value={reservationForm.time}
                        onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Number of Guests *
                    </label>
                    <select
                      required
                      value={reservationForm.guests}
                      onChange={(e) => setReservationForm({ ...reservationForm, guests: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={reservationForm.phone}
                      onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                      placeholder="+49 30 123 456 78"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <CalendarDaysIcon className="w-5 h-5 group-hover:scale-[1.02] transition-transform duration-300" />
                    Reserve Now
                  </button>
                </div>
              )}
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="h-72 bg-slate-100 dark:bg-slate-900">
        <div className="h-full flex items-center justify-center px-4">
          <div className="text-center">
            <MapPinIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Main Street 123, 10115 Berlin
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
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
