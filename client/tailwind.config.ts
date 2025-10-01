import type { Config } from "tailwindcss";
import { createThemes } from "tw-colors";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", 
    "./src/components/**/*.{js,ts,jsx,tsx}", 
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Custom semantic colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [
    createThemes({
      light: {
        // Light theme - professional colors
        background: '#ffffff',
        surface: '#f8fafc',
        'surface-hover': '#f1f5f9',
        text: {
          primary: '#1e293b',
          secondary: '#64748b',
          muted: '#94a3b8',
        },
        border: '#e2e8f0',
        accent: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        
        // Base colors for light mode
        gray: colors.gray,
        red: colors.red,
        green: colors.green,
        blue: colors.blue,
        yellow: colors.yellow,
        indigo: colors.indigo,
        purple: colors.purple,
        pink: colors.pink,
      },
      dark: {
        // Dark theme - professional dark colors
        background: '#0f172a',
        surface: '#1e293b',
        'surface-hover': '#334155',
        text: {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          muted: '#64748b',
        },
        border: '#334155',
        accent: '#60a5fa',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        
        // Optimized dark mode colors
        gray: {
          50: '#1e293b',
          100: '#334155',
          200: '#475569',
          300: '#64748b',
          400: '#94a3b8',
          500: '#cbd5e1',
          600: '#e2e8f0',
          700: '#f1f5f9',
          800: '#f8fafc',
          900: '#ffffff',
        },
        red: colors.red,
        green: colors.green,
        blue: colors.blue,
        yellow: colors.yellow,
        indigo: colors.indigo,
        purple: colors.purple,
        pink: colors.pink,
      },
    })
  ],
};

export default config;