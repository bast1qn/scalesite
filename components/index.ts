// Central exports for components

// Layout
export { Layout } from './Layout';
export { Header } from './Header';
export { Footer } from './Footer';
export { BackToTopButton } from './BackToTopButton';

// Animation
export { AnimatedSection, StaggerContainer, StaggerItem } from './AnimatedSection';
export { PageTransition } from './PageTransition';

// Hero & Main Sections
export { Hero } from './Hero';
export { UspSection } from './UspSection';
export { ProcessSteps } from './ProcessSteps';
export { ReasonsSection } from './ReasonsSection';
export { TestimonialsSection } from './TestimonialsSection';
export { FinalCtaSection } from './FinalCtaSection';

// Services & Features
export { ServicesGrid } from './ServicesGrid';
export { ServiceFeatures } from './ServiceFeatures';
export { AfterHandoverSection } from './AfterHandoverSection';
export { ResourcesSection } from './ResourcesSection';
export { NotOfferedSection } from './NotOfferedSection';

// Pricing & Offer
export { PricingSection } from './PricingSection';
export { OfferCalculator } from './OfferCalculator';
export * from './pricing';

// AI Content Generator
export * from './ai-content';

// Project Tracking
export * from './projects';

// Projects & Showcase
export { ShowcaseSection } from './ShowcaseSection';
export { ShowcasePreview } from './ShowcasePreview';
export { DeviceMockupCarousel } from './DeviceMockupCarousel';
export { BeforeAfterSlider } from './BeforeAfterSlider';
export { LogoWall } from './LogoWall';
export { BlogSection } from './BlogSection';

// Interactive Components
export { ChatWidget } from './ChatWidget';
export { CountdownTimer } from './CountdownTimer';
export { CustomSelect } from './CustomSelect';
export { InteractiveTimeline } from './InteractiveTimeline';

// Utilities
export { LazyImage, OptimizedBackgroundImage } from './LazyImage';
export { Skeleton, CardSkeleton, PricingCardSkeleton, BlogCardSkeleton, TableSkeleton, LoadingSpinner } from './SkeletonLoader';
export { ErrorBoundary } from './ErrorBoundary';
export { CookieConsent } from './CookieConsent';
export { ThemeToggle } from './ThemeToggle';

// Icons
export * from './Icons';

// Content Components
export { CommonErrors } from './CommonErrors';
export { ChecklistTeaser } from './ChecklistTeaser';
export { NewsletterSection } from './NewsletterSection';

// Dashboard (default exports)
export { default as DashboardLayout } from './dashboard/DashboardLayout';
export { default as Overview } from './dashboard/Overview';
export { default as Services } from './dashboard/Services';
export { default as TicketSupport } from './dashboard/TicketSupport';
export { default as UserManagement } from './dashboard/UserManagement';
export { default as Transactions } from './dashboard/Transactions';
export { default as Settings } from './dashboard/Settings';
export { default as Partner } from './dashboard/Partner';
export { default as Referral } from './dashboard/Referral';
export { default as DiscountManager } from './dashboard/DiscountManager';
export { default as AnalyticsDashboard } from './analytics/AnalyticsDashboard';

// Enhanced Ticket Support (Woche 15)
export * from './tickets';
