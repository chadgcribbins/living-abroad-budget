import { StateCreator } from 'zustand';
import { RootState, UIState } from '../types';

// Adjust the slice creator to work with RootState
export const createUISlice: StateCreator<RootState, [], [], { ui: UIState }> = (set) => ({
  ui: {
    // Initial state
    activeView: 'home',
    sidebarOpen: true,
    theme: 'light',

    // Actions
    setActiveView: (view: string) => {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          activeView: view 
        } 
      }));
    },
    
    toggleSidebar: () => {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          sidebarOpen: !state.ui.sidebarOpen 
        } 
      }));
    },
    
    setTheme: (theme: 'light' | 'dark' | 'system') => {
      set((state) => ({ 
        ui: { 
          ...state.ui, 
          theme 
        } 
      }));
      
      // Apply theme to document
      if (typeof document !== 'undefined') {
        const htmlElement = document.documentElement;
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          htmlElement.setAttribute('data-theme', systemTheme);
        } else {
          htmlElement.setAttribute('data-theme', theme);
        }
      }
    },
  }
}); 