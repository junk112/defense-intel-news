/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Intelligence Theme)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a'
        },
        // Secondary Colors (Military Theme)
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          900: '#0f172a'
        },
        // Status Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
        // Category Colors
        defense_policy: '#dc2626',
        international: '#ea580c',
        technology: '#2563eb',
        intelligence: '#7c3aed',
        cyber_security: '#059669',
        space_defense: '#7c2d12',
        maritime: '#0891b2',
        analysis: '#4338ca',
        dashboard: '#be185d'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans JP', 'Hiragino Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  darkMode: 'class',
}