/**
 * Universal Theme and Navigation Script
 * Handles theme switching, View Transitions, and accessibility features
 * Author: Daniel Wanjala Machimbo
 */

class UniversalPortfolioEnhancements {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.initializeTheme();
        this.setupViewTransitions();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    }

    // ===============================================
    // THEME MANAGEMENT
    // ===============================================
    initializeTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        if (!themeToggle || !themeIcon) return;

        // Get saved theme or detect system preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;
        
        // Apply theme
        this.setTheme(currentTheme);
        
        // Set up toggle functionality
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    // ===============================================
    // VIEW TRANSITIONS API
    // ===============================================
    setupViewTransitions() {
        // Only enable if browser supports View Transitions API
        if (!('startViewTransition' in document)) return;

        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            // Skip external links, anchors, and special links
            if (this.shouldSkipTransition(link)) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                document.startViewTransition(() => {
                    window.location.href = link.href;
                });
            });
        });
    }

    shouldSkipTransition(link) {
        const href = link.getAttribute('href');
        return (
            !href ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('http') ||
            link.target === '_blank' ||
            link.hasAttribute('download') ||
            href === window.location.href
        );
    }

    // ===============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ===============================================
    setupAccessibility() {
        // Enhanced focus management
        this.setupFocusManagement();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Reduced motion support
        this.setupReducedMotion();
        
        // Skip link functionality
        this.setupSkipLinks();
    }

    setupFocusManagement() {
        // Add focus-visible polyfill behavior for older browsers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // Enhance focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-nav *:focus {
                outline: 2px solid var(--color-primary);
                outline-offset: 2px;
            }
            
            .keyboard-nav button:focus,
            .keyboard-nav a:focus,
            .keyboard-nav input:focus,
            .keyboard-nav select:focus,
            .keyboard-nav textarea:focus {
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    setupKeyboardNavigation() {
        // Escape key to close modals/dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-menu.active');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    const toggle = document.querySelector('.nav-toggle.active');
                    if (toggle) toggle.classList.remove('active');
                }
            }
        });

        // Arrow key navigation for menu items
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % navLinks.length;
                    navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[prevIndex].focus();
                }
            });
        });
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const updateMotionPreference = (e) => {
            document.documentElement.setAttribute('data-reduced-motion', e.matches);
        };
        
        updateMotionPreference(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', updateMotionPreference);
    }

    setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ===============================================
    // PERFORMANCE OPTIMIZATIONS
    // ===============================================
    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Preload critical pages
        this.setupPreloading();
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupPreloading() {
        // Preload critical pages on hover
        const navLinks = document.querySelectorAll('.nav-menu a[href]');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.preloadPage(link.href);
            }, { once: true });
        });
    }

    preloadPage(url) {
        if (url && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        }
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // ===============================================
    // UTILITY METHODS
    // ===============================================
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the universal enhancements
new UniversalPortfolioEnhancements();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalPortfolioEnhancements;
}
