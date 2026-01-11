<div align="center">
  <h1>ScaleSite</h1>
  <p>A modern, multi-language website for ScaleSite - Professional web development services</p>
</div>

## Features

- 🌍 **Multi-language Support**: German and English with easy switching
- 💱 **Multi-currency Support**: 32+ currencies with automatic conversion
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- 🌙 **Dark Mode**: Automatic theme switching
- 💬 **AI Chat Widget**: Integrated chat support
- 📊 **Dashboard**: User dashboard with ticket management and analytics
- 📝 **Blog System**: Dynamic blog with case studies
- 🛒 **Pricing Calculator**: Interactive offer calculator

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Custom SVG icons
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend)
- Gemini API key (for AI features)

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scalesite.git
   cd scalesite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy on Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/scalesite.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `GEMINI_API_KEY` (optional)
   - Click "Deploy"

The `vercel.json` configuration file is already included for optimal Vercel deployment.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | No |

## Project Structure

```
scalesite/
├── components/          # React components
│   ├── dashboard/      # Dashboard components
│   ├── Icons.tsx       # SVG icons
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   ├── CurrencyContext.tsx
│   └── LanguageContext.tsx
├── lib/                # Utilities
│   ├── translations.ts # Language translations
│   └── api.ts          # API functions
├── pages/              # Page components
├── public/             # Static assets
├── App.tsx             # Main app component
├── index.html          # HTML entry point
└── vite.config.ts      # Vite configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT License - feel free to use this project for your own purposes.
