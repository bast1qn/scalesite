<div align="center">
  <h1>ScaleSite</h1>
  <p>A modern, AI-powered web development platform with comprehensive project management, team collaboration, and automated content generation</p>
</div>

## Overview

ScaleSite is a full-featured web development platform built with React 19, TypeScript, and Supabase. It provides end-to-end solutions for website configuration, project tracking, AI content generation, team collaboration, and billing management.

**Current Version**: 1.0.1
**Development Week**: 30 of 32 (Testing & Quality Assurance)
**Build Status**: ✅ PASS (0 TypeScript Errors)
**Last Updated**: 2026-01-13

---

## Features

### Core Platform
- 🚀 **Onboarding Wizard**: 4-step guided onboarding with validation
- 🎨 **Visual Configurator**: Live website configuration with real-time preview
- 💰 **Intelligent Pricing**: Dynamic pricing calculator with discounts and volume tiers
- 📊 **Project Management**: Complete project tracking with milestones and status updates
- 🤖 **AI Content Generation**: Generate headlines, descriptions, and more with Gemini AI
- 🎫 **Ticket Support**: Full support ticket system with file uploads and assignments
- 👥 **Team Collaboration**: Team management with roles, permissions, and activity feeds
- 💳 **Billing System**: Invoice management with PDF generation
- 🔍 **SEO Tools**: Meta tags, sitemap generator, and SEO audit
- 📧 **Newsletter System**: Campaign management with scheduling and analytics
- 🔔 **Real-time Updates**: Live notifications and chat functionality

### User Experience
- 🌍 **Multi-language**: German and English with easy switching
- 💱 **Multi-currency**: 32+ currencies with automatic conversion
- 🌙 **Dark Mode**: Automatic theme switching with system detection
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- ♿ **Accessible**: WCAG 2.1 compliant (foundation)
- ⚡ **Performance**: Code-splitting, lazy loading, and optimistic UI
- 🎭 **Animations**: Smooth transitions with Framer Motion
- 💬 **Chat Widget**: Integrated AI chat support

---

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.8.2 (Strict Mode)
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 3.4.19
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.562.0
- **Charts**: Recharts 3.6.0
- **PDF Generation**: jsPDF 4.0.0 + html2canvas 1.4.1
- **File Uploads**: react-dropzone 14.3.8

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **AI**: Google Gemini 1.30.0
- **Deployment**: Vercel ready

---

## Project Statistics

### Code Metrics
- **Total Components**: 57+
- **Total Lines of Code**: ~25,000+
- **TypeScript Coverage**: 100%
- **Build Status**: ✅ PASS (0 errors)
- **Bundle Size**: 1.8 MB (430 KB gzipped)

### Component Breakdown
- Configurator: 7 components (~1,935 lines)
- Onboarding: 6 components (~2,234 lines)
- Pricing: 6 components (~2,520 lines)
- Projects: 4 components (~1,670 lines)
- AI Content: 6 components (~2,900 lines)
- Tickets: 6 components (~2,655 lines)
- Team: 6 components (~3,110 lines)
- Skeleton UI: 3 components (~835 lines)
- UI Framework: 14+ components

---

## Prerequisites

- **Node.js**: 18+ (recommend 20+)
- **Package Manager**: npm, yarn, or pnpm
- **Supabase Account**: For database, auth, and storage
- **Gemini API Key**: For AI content generation features
- **Git**: For version control

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/scalesite.git
cd scalesite
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI (Optional - for AI content generation)
GEMINI_API_KEY=your_gemini_api_key

# Payment Gateways (Optional - for production)
STRIPE_PUBLIC_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 3. Database Setup

Deploy the database schema to Supabase:

```bash
# Option 1: Using Supabase Dashboard
# 1. Go to your Supabase project
# 2. Navigate to SQL Editor
# 3. Copy and execute the contents of supabase_schema.sql

# Option 2: Using CLI (if installed)
supabase db push
```

**Schema Files:**
- `supabase_schema.sql` - Core schema (Week 1)
- `supabase_schema_week18_billing.sql` - Billing tables
- `supabase_schema_week26_chat.sql` - Chat/realtime tables

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Development Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:5173)

# Building
npm run build           # Build for production
npm run preview         # Preview production build locally

# Testing (not yet implemented)
npm run test            # Run unit tests (planned)
npm run test:e2e        # Run E2E tests (planned)
npm run lint            # Run linter (planned)
```

---

## Project Structure

```
scalesite/
├── components/              # React components (57+)
│   ├── configurator/        # Visual configurator (7)
│   ├── onboarding/          # Onboarding wizard (6)
│   ├── pricing/             # Pricing calculator (6)
│   ├── projects/            # Project management (4)
│   ├── ai-content/          # AI content generation (6)
│   ├── tickets/             # Ticket support (6)
│   ├── team/                # Team collaboration (6)
│   ├── skeleton/            # Loading skeletons (3)
│   ├── dashboard/           # Dashboard pages
│   └── [UI components]      # Reusable UI components
├── contexts/                # React contexts
│   ├── AuthContext.tsx      # Authentication
│   ├── CurrencyContext.tsx  # Currency management
│   └── LanguageContext.tsx  # Language management
├── lib/                     # Core libraries
│   ├── api.ts               # API functions
│   ├── storage.ts           # File storage
│   ├── realtime.ts          # Real-time subscriptions
│   ├── ai-content.ts        # AI content generation
│   ├── pricing.ts           # Pricing calculations
│   ├── validation.ts        # Form validation
│   ├── supabase.ts          # Supabase client
│   ├── rbac.ts              # Role-based access control
│   └── hooks/               # Custom React hooks
├── pages/                   # Page components
├── assets/                  # Static assets
│   └── images/              # Placeholder images
├── App.tsx                  # Main app component
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

---

## Feature Documentation

### Onboarding Wizard
4-step guided setup process:
1. **Basic Info**: Name, email, password
2. **Business Data**: Company info, logo, industry, website type
3. **Design Preferences**: Colors, layout, fonts
4. **Content Requirements**: Pages, features, timeline, budget

### Visual Configurator
Real-time website configuration:
- 6 color palettes
- 4 layout styles
- 6 font choices
- Live preview on 3 devices
- AI content integration

### Pricing Calculator
Dynamic pricing with:
- 13 available services
- Volume discounts (5-50 units)
- 5 discount codes
- Multi-currency support
- Real-time calculations
- PDF export

### AI Content Generator
Powered by Google Gemini:
- 7 content types
- 40+ industries
- 5 tone options
- Keyword input
- Multiple variations
- Save to project

### Project Management
Complete project tracking:
- Status timeline
- Milestone tracker
- Progress indicators
- Team assignments
- Activity feed

### Ticket Support
Full support system:
- Priority levels (4)
- File uploads (drag & drop)
- Ticket history
- Canned responses (15+)
- Auto-assignment
- Real-time notifications

### Team Collaboration
Team management with:
- 4 roles (Owner, Admin, Member, Viewer)
- Permission system (6 categories)
- Activity feed (14 event types)
- Invitation system
- Role hierarchy

### Billing & Invoices
Invoice management:
- Invoice list with filters
- PDF generation
- Payment history
- Payment methods
- Status tracking

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No* |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | No† |
| `PAYPAL_CLIENT_ID` | PayPal client ID | No† |

*Required for AI content generation features
†Required for payment processing

---

## Development Status

### Completed (Weeks 1-29)

✅ **Week 1-2**: Database & API Foundation
✅ **Week 3-4**: Configurator System
✅ **Week 5-6**: Onboarding Wizard
✅ **Week 7-8**: Pricing System
✅ **Week 9-10**: Project Tracking (UI only)
✅ **Week 11-12**: AI Content Generation
✅ **Week 13-14**: Analytics Dashboard (UI only)
✅ **Week 15-16**: Ticket Support
✅ **Week 17-18**: Billing & Invoices (UI only)
✅ **Week 19-20**: Team Collaboration
✅ **Week 21-22**: SEO Tools (UI only)
✅ **Week 23-24**: Newsletter System (UI only)
✅ **Week 25-26**: Real-time Features (UI only)
✅ **Week 27-28**: UI/UX Enhancements
✅ **Week 29**: Loading States & Skeleton UI

### In Progress (Week 30)

⏳ **Week 30**: Testing & Quality Assurance
- Manual testing checklist created
- QA documentation completed
- Build verification: ✅ PASS

### Pending (Weeks 31-32)

⏳ **Week 31**: Deployment Preparation
⏳ **Week 32**: Launch & Post-Launch

---

## Build & Bundle

### Current Build Status

```bash
npm run build
```

**Output:**
```
✓ 2945 modules transformed
✓ 11 chunks created
✓ Build time: ~13s
```

**Bundle Size:**
- Total: ~1.8 MB
- Gzipped: ~430 KB
- CSS: 252 KB (31 KB gzipped)

**Chunks:**
1. index.html (1.5 KB)
2. CSS (252 KB)
3. contexts (18 KB)
4. ui-framework (78 KB)
5. dashboard (134 KB)
6. supabase (164 KB)
7. pages (197 KB)
8. react-core (202 KB)
9. vendor (408 KB)
10. components (507 KB)

**Warnings:**
- ⚠️ Some chunks > 500 KB (non-critical)
- ⚠️ Mixed import strategy in AI content (non-critical)

---

## Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Environment Variables on Vercel**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database schema deployed
- [ ] Build successful
- [ ] Performance optimized
- [ ] SSL configured
- [ ] Monitoring setup
- [ ] Error tracking configured

---

## Documentation

### Main Documentation
- `README.md` - This file (overview & quick start)
- `MASTER_PLAN.md` - Complete 32-week development plan
- `WOCHE_30_TESTING_GUIDE.md` - Testing guide
- `WOCHE_30_QA_CHECKLIST.md` - QA checklist

### Architecture Documentation
- `docs/adr/001-technology-stack.md` - Technology stack selection rationale
- `docs/adr/002-architecture-patterns.md` - Design patterns & SOLID principles
- `docs/adr/003-database-strategy.md` - Database strategy & migration path
- `docs/api/README.md` - Comprehensive API documentation

### Code Architecture
- `lib/patterns/` - Design pattern implementations (Singleton, Factory, Observer, Strategy)
- `lib/services/` - Service abstraction layers (Dependency Inversion Principle)
- `lib/translations/` - Domain-specific translation modules (Single Responsibility)
- `components/index.ts` - Component barrel exports
- `lib/index.ts` - Library barrel exports

### Weekly Summaries
- `WOCHE_1_DATABASE.md` - Database setup
- `WOCHE_20_SUMMARY.md` - Team collaboration summary
- `WOCHE_24_SUMMARY.md` - Newsletter system summary

### Configuration Files
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Vercel deployment configuration

---

## Contributing

### Development Guidelines

1. **Code Style**
   - Use TypeScript strict mode
   - Follow existing patterns
   - Comment complex logic
   - No over-engineering

2. **Component Structure**
   - Use functional components
   - Implement proper TypeScript types
   - Add PropTypes (if needed)
   - Include error boundaries

3. **State Management**
   - Use React hooks
   - Context for global state
   - Local state for component-specific data
   - Avoid prop drilling

4. **Architecture Principles**
   - **SOLID Principles**: Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion
   - **Design Patterns**: Use appropriate patterns (Singleton, Factory, Observer, Strategy)
   - **Service Abstraction**: Depend on interfaces, not implementations
   - **Barrel Exports**: Organize public APIs with index.ts files
   - **Domain Separation**: Split large modules by domain (e.g., translations)

5. **Testing**
   - Unit tests for utilities
   - Component tests for UI
   - E2E tests for user flows
   - Manual testing for visuals

---

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Supabase connection errors**
- Check `.env.local` file exists
- Verify Supabase URL and key
- Check Supabase project is active

**AI content generation not working**
- Verify `GEMINI_API_KEY` is set
- Check API key is valid
- Verify API quota not exceeded

**Dark mode not working**
- Check system theme setting
- Clear browser cache
- Check `index.css` for theme classes

---

## Roadmap

### v1.0 (Current) - Weeks 1-32
- ✅ Core platform features
- ✅ AI integration
- ✅ Team collaboration
- ✅ Real-time features
- ⏳ Testing & QA
- ⏳ Deployment

### v1.1 (Planned)
- Unit/E2E test suite
- Performance optimization
- Additional payment gateways
- Enhanced analytics
- Mobile app (React Native)

### v2.0 (Future)
- White-label solution
- API for third-party integrations
- Advanced automation
- Marketplace for templates
- Multi-tenant support

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | <1.8s | TBD |
| Largest Contentful Paint | <2.5s | TBD |
| Time to Interactive | <3.8s | TBD |
| Cumulative Layout Shift | <0.1 | TBD |
| Bundle Size (gzipped) | <500KB | 430KB ✅ |

---

## Security

- ✅ Authentication via Supabase Auth
- ✅ Row Level Security (RLS) policies
- ✅ Role-Based Access Control (RBAC)
- ✅ Input validation on all forms
- ✅ XSS prevention (React + sanitization)
- ✅ SQL injection prevention (Supabase)
- ✅ File upload validation
- ✅ Environment-based secrets
- ✅ HTTPS enforcement (production)

---

## License

MIT License - feel free to use this project for your own purposes.

---

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: support@scalesite.com
- Documentation: [Link to docs]

---

## Acknowledgments

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini](https://ai.google.dev/)

---

**Last Updated**: 2026-01-13
**Version**: 1.0.1
**Development Week**: 30 of 32
**Status**: Testing & Quality Assurance ⏳
