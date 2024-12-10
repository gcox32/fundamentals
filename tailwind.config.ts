import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        'foreground': 'var(--foreground)',
        'text': 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'nav': {
          bg: 'var(--nav-bg)',
          text: 'var(--nav-text)',
        },
        'sidebar': {
          bg: 'var(--sidebar-bg)',
          text: 'var(--sidebar-text)',
        },
        'active': {
          accent: 'var(--active-accent)',
          'accent-dark': 'var(--active-accent-dark)',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
