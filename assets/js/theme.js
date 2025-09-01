/**
 * Theme Toggle System with Smooth Transitions
 * Provides seamless dark/light mode switching with system preference detection
 */

class ThemeManager {
  constructor() {
    this.themes = ['light', 'dark', 'auto'];
    this.currentTheme = this.getStoredTheme() || 'auto';
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }
  
  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme === 'auto') {
        this.updateThemeDisplay();
      }
    });
    
    // Initialize theme toggle buttons
    this.initializeToggleButtons();
    
    // Add keyboard shortcuts
    this.initializeKeyboardShortcuts();
    
    // Update page meta theme-color
    this.updateMetaThemeColor();
  }
  
  getStoredTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      console.warn('localStorage not available, using auto theme');
      return 'auto';
    }
  }
  
  setStoredTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('localStorage not available, theme preference not saved');
    }
  }
  
  getSystemTheme() {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }
  
  getEffectiveTheme() {
    if (this.currentTheme === 'auto') {
      return this.getSystemTheme();
    }
    return this.currentTheme;
  }
  
  applyTheme(theme) {
    const root = document.documentElement;
    const effectiveTheme = theme === 'auto' ? this.getSystemTheme() : theme;
    
    // Add transition class to prevent jarring changes
    root.classList.add('theme-transitioning');
    
    // Remove existing theme classes
    root.removeAttribute('data-theme');
    
    // Apply new theme
    if (effectiveTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    }
    // Light theme is default (no attribute needed)
    
    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 150);
    
    this.currentTheme = theme;
    this.setStoredTheme(theme);
    this.updateThemeDisplay();
    this.updateMetaThemeColor();
    
    // Dispatch custom event for other components
    this.dispatchThemeChangeEvent(effectiveTheme);
  }
  
  updateThemeDisplay() {
    const effectiveTheme = this.getEffectiveTheme();
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    
    toggleButtons.forEach(button => {
      const icon = button.querySelector('.theme-icon');
      const text = button.querySelector('.theme-text');
      
      if (icon) {
        // Update icon
        const useElement = icon.querySelector('use');
        if (useElement) {
          useElement.setAttribute('href', `#${effectiveTheme === 'dark' ? 'sun' : 'moon'}`);
        }
      }
      
      if (text) {
        // Update text
        text.textContent = effectiveTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
      
      // Update aria-label
      button.setAttribute('aria-label', 
        `Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`
      );
      
      // Update aria-pressed state
      button.setAttribute('aria-pressed', this.currentTheme !== 'auto');
    });
    
    // Update theme indicator in settings
    const themeIndicators = document.querySelectorAll('[data-theme-indicator]');
    themeIndicators.forEach(indicator => {
      const theme = indicator.dataset.themeIndicator;
      indicator.classList.toggle('active', theme === this.currentTheme);
      indicator.setAttribute('aria-pressed', theme === this.currentTheme);
    });
  }
  
  updateMetaThemeColor() {
    const effectiveTheme = this.getEffectiveTheme();
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      // Update based on current theme
      const colors = {
        light: '#2563eb', // --accent-2 light
        dark: '#60A5FA'   // --accent-2 dark
      };
      
      metaThemeColor.setAttribute('content', colors[effectiveTheme]);
    }
  }
  
  dispatchThemeChangeEvent(effectiveTheme) {
    const event = new CustomEvent('themechange', {
      detail: {
        theme: this.currentTheme,
        effectiveTheme: effectiveTheme,
        isSystemTheme: this.currentTheme === 'auto'
      }
    });
    
    window.dispatchEvent(event);
  }
  
  toggleTheme() {
    const nextTheme = this.getNextTheme();
    this.applyTheme(nextTheme);
  }
  
  getNextTheme() {
    const effectiveTheme = this.getEffectiveTheme();
    
    if (this.currentTheme === 'auto') {
      // Auto -> opposite of system
      return effectiveTheme === 'dark' ? 'light' : 'dark';
    } else {
      // Manual theme -> auto
      return 'auto';
    }
  }
  
  setTheme(theme) {
    if (this.themes.includes(theme)) {
      this.applyTheme(theme);
    } else {
      console.warn(`Invalid theme: ${theme}. Available themes:`, this.themes);
    }
  }
  
  initializeToggleButtons() {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.toggleTheme();
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 100);
      });
      
      // Ensure proper ARIA attributes
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      
      // Add keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    });
    
    // Initialize theme selection buttons
    const themeButtons = document.querySelectorAll('[data-theme-select]');
    themeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.dataset.themeSelect;
        this.setTheme(theme);
      });
    });
  }
  
  initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + T to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
        
        // Show toast notification
        this.showThemeToast();
      }
    });
  }
  
  showThemeToast() {
    const effectiveTheme = this.getEffectiveTheme();
    const themeName = this.currentTheme === 'auto' 
      ? `Auto (${effectiveTheme})` 
      : effectiveTheme.charAt(0).toUpperCase() + effectiveTheme.slice(1);
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'theme-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="toast-content">
        <svg class="icon icon-sm theme-icon">
          <use href="#${effectiveTheme === 'dark' ? 'moon' : 'sun'}"></use>
        </svg>
        <span>Switched to ${themeName} mode</span>
      </div>
    `;
    
    // Add toast styles
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'var(--surface-elevated)',
      color: 'var(--text)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }
  
  // Public API for other components
  getTheme() {
    return {
      current: this.currentTheme,
      effective: this.getEffectiveTheme(),
      system: this.getSystemTheme(),
      isAuto: this.currentTheme === 'auto'
    };
  }
  
  onThemeChange(callback) {
    window.addEventListener('themechange', callback);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('themechange', callback);
    };
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for use in other modules
window.themeManager = themeManager;

// Theme utility functions
window.ThemeUtils = {
  // Get current theme information
  getTheme: () => themeManager.getTheme(),
  
  // Set theme programmatically
  setTheme: (theme) => themeManager.setTheme(theme),
  
  // Toggle between themes
  toggle: () => themeManager.toggleTheme(),
  
  // Listen for theme changes
  onChange: (callback) => themeManager.onThemeChange(callback),
  
  // Check if dark mode is active
  isDark: () => themeManager.getEffectiveTheme() === 'dark',
  
  // Check if light mode is active
  isLight: () => themeManager.getEffectiveTheme() === 'light',
  
  // Check if auto mode is active
  isAuto: () => themeManager.currentTheme === 'auto',
  
  // Get CSS variable value for current theme
  getCSSVar: (variable) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }
};

// Example usage:
/*
// Listen for theme changes
ThemeUtils.onChange((event) => {
  console.log('Theme changed:', event.detail);
});

// Programmatically set theme
ThemeUtils.setTheme('dark');

// Check current theme
if (ThemeUtils.isDark()) {
  console.log('Dark mode is active');
}

// Get theme colors
const primaryColor = ThemeUtils.getCSSVar('--accent-2');
*/
