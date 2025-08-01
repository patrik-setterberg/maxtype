'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

/**
 * Client-side theme provider that initializes the theme system
 * This component should be rendered early in the app to apply theme classes
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize the theme system by calling the hook
  useTheme()

  // The useTheme hook handles all the theme initialization
  // We just need to render children once theme is ready

  return <>{children}</>
}

/**
 * Initial theme script to prevent flash of unstyled content
 * This should be added to the document head before React hydrates
 */
export const THEME_SCRIPT = `
  (function() {
    try {
      // Try to get theme from localStorage first (guest users)
      var stored = localStorage.getItem('maxtype-preferences');
      var theme = 'system'; // default
      
      if (stored) {
        var prefs = JSON.parse(stored);
        if (prefs && prefs.theme) {
          theme = prefs.theme;
        }
      }
      
      // Resolve system theme if needed
      var resolvedTheme = theme;
      if (theme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Apply the resolved theme class
      document.documentElement.classList.add(resolvedTheme);
      
      // Set a temporary inline style to prevent flicker until CSS loads
      if (resolvedTheme === 'dark') {
        document.documentElement.style.backgroundColor = '#262626';
        document.documentElement.style.color = '#ffffff';
      } else {
        document.documentElement.style.backgroundColor = '#ffffff';
        document.documentElement.style.color = '#000000';
      }
      
      // Remove inline styles once the page loads
      window.addEventListener('load', function() {
        document.documentElement.style.backgroundColor = '';
        document.documentElement.style.color = '';
      });
      
    } catch (e) {
      // Fallback to dark theme if anything goes wrong
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#262626';
      document.documentElement.style.color = '#ffffff';
    }
  })();
`
