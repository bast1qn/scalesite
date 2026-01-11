/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Outfit', 'sans-serif'],
      },
      colors: {
        // New Blue-Violet Gradient Theme
        primary: '#4F46E5',
        'primary-hover': '#4338CA',
        secondary: '#8B5CF6',
        accent: '#06B6D4',
        'light-bg': '#FFFFFF',
        'dark-bg': '#020617',
        surface: '#F8FAFC',
        'dark-surface': '#0F172A',
        'light-text': '#F1F5F9',
        'dark-text': '#1E293B',
        // Gradient colors
        'gradient-start': '#3B82F6',
        'gradient-mid': '#8B5CF6',
        'gradient-end': '#6366F1',
        // Legacy colors for compatibility
        'rose-primary': '#E11D48',
        'rose-hover': '#BE123C',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.05)',
        'glow': '0 0 30px rgba(99, 102, 241, 0.3)',
        'glow-strong': '0 0 50px rgba(99, 102, 241, 0.5)',
        'glow-sm': '0 0 15px rgba(99, 102, 241, 0.2)',
        'glow-violet': '0 0 40px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.3)',
        'glow-pink': '0 0 40px rgba(236, 72, 153, 0.3)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
        'premium': '0 20px 40px -10px rgba(0,0,0,0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        '4xl': '0 50px 100px -20px rgba(0, 0, 0, 0.4)',
        'glow-xl': '0 0 60px rgba(99, 102, 241, 0.4), 0 0 100px rgba(139, 92, 246, 0.2)',
        'floating': '0 20px 60px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(128, 128, 128, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(128, 128, 128, 0.05) 1px, transparent 1px)",
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #6366F1 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-down': 'fadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-left': 'fadeLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-right': 'fadeRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-out': 'scaleOut 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'progress': 'progress 1s ease-out forwards',
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'scroll-bounce': 'scrollBounce 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-xy': 'gradientXY 15s ease infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'blob': 'blob 7s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'float-3d': 'float3d 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'blur-in': 'blurIn 1s ease-out forwards',
        'scale-pulse': 'scalePulse 2s ease-in-out infinite',
        'tilt': 'tilt 0.5s ease-out forwards',
        // Legacy animation names for compatibility
        fadeIn: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeUp: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progress: {
          '0%': { width: '0%' },
        },
        scrollBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(10px)' },
          '60%': { transform: 'translateY(5px)' },
        },
        gradientXY: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float3d: {
          '0%, 100%': { transform: 'translateY(0) rotateX(0) rotateY(0)' },
          '25%': { transform: 'translateY(-10px) rotateX(2deg) rotateY(2deg)' },
          '50%': { transform: 'translateY(-20px) rotateX(0) rotateY(0)' },
          '75%': { transform: 'translateY(-10px) rotateX(-2deg) rotateY(-2deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        blurIn: {
          '0%': { filter: 'blur(10px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      }
    },
  },
  plugins: [],
}
