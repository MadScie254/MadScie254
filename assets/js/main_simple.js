// ==========================================================================
// SIMPLIFIED ENHANCED PORTFOLIO - LIGHT THEME ONLY
// Clean, fast, and user-friendly interactions
// ==========================================================================

class PortfolioEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFeatures());
        } else {
            this.setupFeatures();
        }
    }

    setupFeatures() {
        this.setupSmoothScrolling();
        this.setupNavigation();
        this.setupAnimations();
        this.setupInteractions();
        this.setupPerformance();
    }

    // Smooth scrolling for navigation
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Enhanced navigation
    setupNavigation() {
        const header = document.querySelector('.header');
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');

        // Header scroll effect
        if (header) {
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                // Add/remove scrolled class
                if (currentScroll > 100) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }

                lastScroll = currentScroll;
            });
        }

        // Mobile menu toggle
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('mobile-menu--active');
                menuToggle.classList.toggle('menu-toggle--active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('mobile-menu--active');
                    menuToggle.classList.remove('menu-toggle--active');
                }
            });
        }
    }

    // Scroll animations
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                }
            });
        }, observerOptions);

        // Observe all elements with reveal class
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Add reveal styles
        this.addRevealStyles();
    }

    // Interactive elements
    setupInteractions() {
        // Button hover effects
        document.querySelectorAll('.btn, button').forEach(btn => {
            btn.addEventListener('mouseenter', this.addButtonEffect);
            btn.addEventListener('mouseleave', this.removeButtonEffect);
        });

        // Card hover effects
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', this.addCardEffect);
            card.addEventListener('mouseleave', this.removeCardEffect);
        });

        // Simple cursor enhancement
        this.setupCursor();
    }

    // Button effects
    addButtonEffect(e) {
        e.target.style.transform = 'translateY(-2px) scale(1.02)';
        e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
    }

    removeButtonEffect(e) {
        e.target.style.transform = '';
        e.target.style.boxShadow = '';
    }

    // Card effects
    addCardEffect(e) {
        e.target.style.transform = 'translateY(-8px)';
        e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }

    removeCardEffect(e) {
        e.target.style.transform = '';
        e.target.style.boxShadow = '';
    }

    // Simple cursor enhancement
    setupCursor() {
        let cursor = document.querySelector('.cursor');
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'cursor';
            document.body.appendChild(cursor);
        }

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hide cursor on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            cursor.style.display = 'none';
        }
    }

    // Add reveal animation styles
    addRevealStyles() {
        if (document.querySelector('#reveal-styles')) return;

        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.textContent = `
            .reveal {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }
            
            .reveal--visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .cursor {
                position: fixed;
                width: 20px;
                height: 20px;
                background: rgba(59, 130, 246, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
                mix-blend-mode: difference;
            }
            
            .header--scrolled {
                background: rgba(248, 250, 252, 0.98) !important;
                backdrop-filter: blur(20px);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            @media (max-width: 768px) {
                .cursor {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Performance optimizations
    setupPerformance() {
        // Lazy load images
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

        // Debounced resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Handle resize events
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Adjust layouts for different screen sizes
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('is-mobile', isMobile);
    }
}

// Initialize when ready
new PortfolioEnhancer();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioEnhancer;
}
