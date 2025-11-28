import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== CASTELLO COFFEE OFFICIAL BRAND COLORS =====
        castello: {
          // Primary Brand Colors (extracted from logo)
          primary: '#C62828',       // Main Castello Red from shield
          primaryDark: '#B71C1C',   // Dark Castello Red (gradient end)
          primaryLight: '#D32F2F',  // Light Castello Red
          gold: '#E8C16D',          // Castello Gold Light
          goldDark: '#C9A84C',      // Castello Gold Deep
          black: '#1a1a1a',         // Soft Black from logo
          white: '#FFFFFF',         // Pure White
          smoke: '#F9FAFB',         // Soft Gray background
          
          // Extended Neutral Palette
          neutral: {
            100: '#F9FAFB',
            200: '#F3F4F6',
            300: '#E5E7EB',
            400: '#D1D5DB',
            500: '#9CA3AF',
            600: '#6B7280',
            700: '#4B5563',
            800: '#374151',
            900: '#1F2937',
          },
        },
        
        // Shadcn UI compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      
      // ===== EXECUTIVE BORDER RADIUS SYSTEM =====
      borderRadius: {
        soft: '12px',
        card: '18px',
        xl: '24px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      // ===== EXECUTIVE SHADOW SYSTEM =====
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'gold': '0 4px 20px rgba(232, 193, 109, 0.25)',
        'gold-lg': '0 8px 32px rgba(232, 193, 109, 0.35)',
        'castello': '0 8px 24px rgba(198, 40, 40, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 20px 60px 0 rgba(31, 38, 135, 0.20)',
      },
      
      // ===== BRAND GRADIENTS =====
      backgroundImage: {
        'castello-red': 'linear-gradient(135deg, #C62828 0%, #B71C1C 100%)',
        'castello-gold': 'linear-gradient(135deg, #E8C16D 0%, #C9A84C 100%)',
        'castello-soft': 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
      },
      
      // ===== SPACING SYSTEM =====
      spacing: {
        'card': '28px',
      },
      
      // ===== BACKDROP BLUR =====
      backdropBlur: {
        'xs': '2px',
      },
      
      // ===== ANIMATIONS =====
      animation: {
        'subtle-lift': 'subtleLift 0.3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        subtleLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-4px) scale(1.02)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(232, 193, 109, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 32px rgba(232, 193, 109, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

