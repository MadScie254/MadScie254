/**
 * Modern Portfolio JavaScript - Modular & Performance Optimized
 * Author: GODMODE_X + Human X
 */

// ===== CORE APP MODULE =====
const PortfolioApp = (() => {
  'use strict';

  // Configuration
  const CONFIG = {
    BREAKPOINTS: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    ANIMATION: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      observerOptions: {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      }
    },
    THROTTLE_DELAY: 16, // ~60fps
    DEBOUNCE_DELAY: 250
  };

  // State management
  const state = {
    currentTheme: 'light',
    isScrolled: false,
    isMobileMenuOpen: false,
    activeSection: '',
    isInitialized: false
  };

  // DOM cache
  const dom = {};

  // Utility functions
  const utils = {
    // Throttle function for scroll events
    throttle(func, delay) {
      let timeoutId;
      let lastExecTime = 0;
      return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
          func.apply(this, args);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(this, args), delay);
        }
      };
    },

    // Debounce function for resize events
    debounce(func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    // Check if element is in viewport
    isInViewport(element, offset = 0) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top <= windowHeight - offset && rect.bottom >= offset;
    },

    // Get current breakpoint
    getCurrentBreakpoint() {
      const width = window.innerWidth;
      if (width >= CONFIG.BREAKPOINTS['2xl']) return '2xl';
      if (width >= CONFIG.BREAKPOINTS.xl) return 'xl';
      if (width >= CONFIG.BREAKPOINTS.lg) return 'lg';
      if (width >= CONFIG.BREAKPOINTS.md) return 'md';
      if (width >= CONFIG.BREAKPOINTS.sm) return 'sm';
      return 'xs';
    },

    // Modern event delegation
    delegate(parent, selector, event, handler) {
      parent.addEventListener(event, (e) => {
        if (e.target.matches(selector) || e.target.closest(selector)) {
          handler(e);
        }
      });
    },

    // Smooth scroll with modern API
    smoothScrollTo(target, offset = 0) {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (!element) return;

      const headerHeight = dom.header?.offsetHeight || 0;
      const targetPosition = element.offsetTop - headerHeight - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    },

    // Local storage with error handling
    storage: {
      get(key) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.warn('localStorage not available:', e);
          return null;
        }
      },
      set(key, value) {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          console.warn('localStorage not available:', e);
          return false;
        }
      }
    }
  };

  // Theme management
  const themeManager = {
    init() {
      this.loadTheme();
      this.bindEvents();
    },

    loadTheme() {
      const saved = utils.storage.get('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      this.setTheme(theme);
    },

    setTheme(theme) {
      state.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      utils.storage.set('theme', theme);
      this.updateUI();
    },

    toggleTheme() {
      const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },

    updateUI() {
      const isDark = state.currentTheme === 'dark';
      if (dom.themeToggle) {
        const icon = dom.themeToggle.querySelector('svg');
        if (icon) {
          icon.style.transform = isDark ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    },

    bindEvents() {
      if (dom.themeToggle) {
        dom.themeToggle.addEventListener('click', () => this.toggleTheme());
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!utils.storage.get('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  // Navigation management
  const navigationManager = {
    init() {
      this.bindEvents();
      this.highlightActiveSection();
    },

    bindEvents() {
      // Mobile menu toggle
      if (dom.mobileMenuButton) {
        dom.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
      }

      // Navigation links (both desktop and mobile)
      const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => this.handleNavClick(e));
      });

      // Close mobile menu on outside click
      document.addEventListener('click', (e) => {
        if (state.isMobileMenuOpen && 
            !dom.mobileMenu?.contains(e.target) && 
            !dom.mobileMenuButton?.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    },

    toggleMobileMenu() {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      this.updateMobileMenuUI();
    },

    closeMobileMenu() {
      state.isMobileMenuOpen = false;
      this.updateMobileMenuUI();
    },

    updateMobileMenuUI() {
      if (!dom.mobileMenu || !dom.mobileMenuButton) return;

      dom.mobileMenu.classList.toggle('open', state.isMobileMenuOpen);
      dom.mobileMenuButton.setAttribute('aria-expanded', state.isMobileMenuOpen);

      // Update hamburger icon
      const icon = dom.mobileMenuButton.querySelector('svg');
      if (icon) {
        icon.style.transform = state.isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)';
      }
    },

    handleNavClick(e) {
      const link = e.currentTarget;
      const href = link.getAttribute('href');
      
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          utils.smoothScrollTo(target);
          this.closeMobileMenu();
        }
      }
    },

    highlightActiveSection() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
      
      sections.forEach(section => {
        if (utils.isInViewport(section, 100)) {
          const id = section.getAttribute('id');
          if (id && id !== state.activeSection) {
            state.activeSection = id;
            
            // Update navigation
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              link.classList.toggle('active', href === `#${id}`);
            });
          }
        }
      });
    }
  };

  // Scroll management
  const scrollManager = {
    init() {
      this.bindEvents();
      this.createProgressBar();
    },

    bindEvents() {
      const throttledScroll = utils.throttle(() => this.handleScroll(), CONFIG.THROTTLE_DELAY);
      window.addEventListener('scroll', throttledScroll, { passive: true });
    },

    handleScroll() {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > 50;

      // Update header state
      if (isScrolled !== state.isScrolled) {
        state.isScrolled = isScrolled;
        dom.header?.classList.toggle('scrolled', isScrolled);
      }

      // Update progress bar
      this.updateProgressBar();

      // Update navigation highlighting
      navigationManager.highlightActiveSection();

      // Update back to top button
      this.updateBackToTop();
    },

    createProgressBar() {
      if (!dom.progressBar) {
        dom.progressBar = document.createElement('div');
        dom.progressBar.className = 'progress-bar';
        document.body.appendChild(dom.progressBar);
      }
    },

    updateProgressBar() {
      if (!dom.progressBar) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = scrollTop / (documentHeight - windowHeight);
      
      dom.progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
    },

    updateBackToTop() {
      if (!dom.backToTop) return;
      
      const shouldShow = window.scrollY > 300;
      dom.backToTop.classList.toggle('hidden', !shouldShow);
    }
  };

  // Animation and reveal effects
  const animationManager = {
    init() {
      this.createObserver();
      this.observeElements();
    },

    createObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => this.handleIntersection(entries),
          CONFIG.ANIMATION.observerOptions
        );
      }
    },

    observeElements() {
      if (!this.observer) return;
      
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      elements.forEach(el => this.observer.observe(el));
    },

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation to improve performance
          this.observer.unobserve(entry.target);
        }
      });
    }
  };

  // Performance optimizations
  const performanceManager = {
    init() {
      this.prefetchImages();
      this.lazyLoadImages();
      this.optimizeAnimations();
    },

    prefetchImages() {
      // Prefetch critical images
      const criticalImages = document.querySelectorAll('img[data-priority="high"]');
      criticalImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = img.src;
        document.head.appendChild(link);
      });
    },

    lazyLoadImages() {
      if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading support
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
          img.loading = 'lazy';
        });
      } else {
        // Fallback for older browsers
        const images = document.querySelectorAll('img[data-src]');
        if (this.imageObserver) {
          images.forEach(img => this.imageObserver.observe(img));
        }
      }
    },

    optimizeAnimations() {
      // Respect user's motion preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
      }
    }
  };

  // Utility features
  const featuresManager = {
    init() {
      this.initBackToTop();
      this.initCopyButtons();
      this.initModalHandlers();
    },

    initBackToTop() {
      if (!dom.backToTop) {
        dom.backToTop = document.createElement('button');
        dom.backToTop.className = 'fab hidden';
        dom.backToTop.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
        dom.backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(dom.backToTop);
      }

      dom.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    initCopyButtons() {
      const copyButtons = document.querySelectorAll('[data-copy]');
      copyButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
          const text = button.getAttribute('data-copy');
          try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
          } catch (err) {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy', 'error');
          }
        });
      });
    },

    initModalHandlers() {
      // Close modals on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('.modal.open');
          if (openModal) {
            this.closeModal(openModal);
          }
        }
      });

      // Close modals on backdrop click
      utils.delegate(document, '.modal', 'click', (e) => {
        if (e.target.classList.contains('modal')) {
          this.closeModal(e.target);
        }
      });
    },

    showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);

      // Trigger animation
      setTimeout(() => toast.classList.add('show'), 100);

      // Remove after delay
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },

    closeModal(modal) {
      modal.classList.remove('open');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  };

  // Initialize DOM cache
  function cacheDOMElements() {
    dom.header = document.querySelector('.header');
    dom.mobileMenuButton = document.querySelector('.mobile-menu-button');
    dom.mobileMenu = document.querySelector('.mobile-menu');
    dom.themeToggle = document.querySelector('.theme-toggle');
    dom.backToTop = document.querySelector('.fab');
    dom.progressBar = document.querySelector('.progress-bar');
  }

  // Main initialization
  function init() {
    if (state.isInitialized) return;

    // Cache DOM elements
    cacheDOMElements();

    // Initialize modules
    themeManager.init();
    navigationManager.init();
    scrollManager.init();
    animationManager.init();
    performanceManager.init();
    featuresManager.init();

    // Mark as initialized
    state.isInitialized = true;

    // Fire custom event
    document.dispatchEvent(new CustomEvent('portfolio:ready'));
  }

  // Public API
  return {
    init,
    state,
    utils,
    themeManager,
    navigationManager,
    scrollManager,
    animationManager
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', PortfolioApp.init);
} else {
  PortfolioApp.init();
}

// Make available globally for debugging
window.PortfolioApp = PortfolioApp;
