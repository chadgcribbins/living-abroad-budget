declare module 'daisyui' {
  import { PluginCreator } from 'tailwindcss/types/config'
  const daisyui: PluginCreator
  export default daisyui
}

declare module 'daisyui/src/theming/themes' {
  interface Theme {
    primary: string
    secondary: string
    accent: string
    neutral: string
    'base-100': string
    'base-200': string
    'base-300': string
    info: string
    success: string
    warning: string
    error: string
  }

  interface Themes {
    light: Theme
    dark: Theme
  }

  const themes: Themes
  export default themes
} 