import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
import daisyuiThemes from 'daisyui/src/theming/themes'

// Using @egoist/tailwindcss-icons plugin
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    iconsPlugin({
      // Specify the collections you want to use
      collections: getIconCollections(["lucide"]),
    }),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes.light,
          primary: '#2563eb',
          secondary: '#4f46e5',
          accent: '#0891b2',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f3f4f6',
          info: '#3b82f6',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        dark: {
          ...daisyuiThemes.dark,
          primary: '#3b82f6',
          secondary: '#6366f1',
          accent: '#06b6d4',
          neutral: '#374151',
          'base-100': '#1f2937',
          'base-200': '#111827',
          'base-300': '#030712',
          info: '#60a5fa',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
        },
      },
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
} satisfies Config

export default config 