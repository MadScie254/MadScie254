/**
 * Enhanced UI/UX JavaScript
 * Handles animations, counters, and modern interactions
 */

class EnhancedUI {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupAnimatedCounters();
        this.setupScrollEffects();
        this.setupViewTransitions();
        this.setupPJAXNavigation();
    }

    // Enhanced sticky navbar with scroll effects
    setupNavbar() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let lastScrollY = window.scrollY;
        let isScrolling = false;

        const handleScroll = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    
                    // Add scrolled class for backdrop blur effect
                    if (currentScrollY > 50) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }

                    // Hide/show navbar on scroll direction
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        nav.style.transform = 'translateY(-100%)';
                    } else {
                        nav.style.transform = 'translateY(0)';
                    }

                    lastScrollY = currentScrollY;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Set active nav links
        this.setActiveNavLink();
    }

    // Set active navigation link based on current page
    setActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || 
                (currentPath === '' && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Animated counters for hero stats
    setupAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutCubic);
            
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Enhanced scroll effects for animations
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Add staggered animation delays for children
                    const children = entry.target.querySelectorAll('.grid > *, .card, .project-card');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll, section');
        animatedElements.forEach(el => observer.observe(el));
    }

    // View Transitions API for smooth page transitions
    setupViewTransitions() {
        if (!document.startViewTransition) {
            console.log('View Transitions API not supported');
            return;
        }

        // Handle navigation clicks with view transitions
        const navLinks = document.querySelectorAll('.nav-menu a, .btn[href]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's an external link or same page
                if (!href || href.startsWith('#') || href.startsWith('http')) {
                    return;
                }

                e.preventDefault();
                this.navigateWithTransition(href);
            });
        });
    }

    navigateWithTransition(url) {
        if (!document.startViewTransition) {
            window.location.href = url;
            return;
        }

        document.startViewTransition(() => {
            window.location.href = url;
        });
    }

    // PJAX-style navigation for SPA-like experience
    setupPJAXNavigation() {
        // Only enable PJAX for internal navigation
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.loadPageContent(href);
                });
            }
        });
    }

    async loadPageContent(url) {
        try {
            // Add loading state
            document.body.classList.add('page-loading');
            
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            // Extract main content
            const newMain = newDoc.querySelector('main');
            const currentMain = document.querySelector('main');
            
            if (newMain && currentMain) {
                // Update page title
                document.title = newDoc.title;
                
                // Update main content with transition
                if (document.startViewTransition) {
                    document.startViewTransition(() => {
                        currentMain.innerHTML = newMain.innerHTML;
                        this.reinitialize();
                    });
                } else {
                    currentMain.innerHTML = newMain.innerHTML;
                    this.reinitialize();
                }
                
                // Update URL
                history.pushState({}, '', url);
                
                // Update active nav link
                this.setActiveNavLink();
            }
        } catch (error) {
            console.error('PJAX navigation failed:', error);
            window.location.href = url;
        } finally {
            document.body.classList.remove('page-loading');
        }
    }

    // Reinitialize components after PJAX load
    reinitialize() {
        this.setupAnimatedCounters();
        this.setupScrollEffects();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Utility functions for enhanced interactions
class UIUtils {
    static addParallaxEffect() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * (element.dataset.parallax || 0.5);
                element.style.transform = `translateY(${rate}px)`;
            });
        }, { passive: true });
    }

    static addHoverEffects() {
        // Add magnetic effect to buttons
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    static setupCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    static preloadCriticalResources() {
        const criticalResources = [
            '/assets/css/theme.css',
            '/assets/js/main.js',
            '/assets/images/My_Profile_Photo.jpg'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 
                     resource.endsWith('.js') ? 'script' : 'image';
            document.head.appendChild(link);
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedUI();
    UIUtils.addParallaxEffect();
    UIUtils.addHoverEffects();
    PerformanceOptimizer.lazyLoadImages();
    PerformanceOptimizer.preloadCriticalResources();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    window.location.reload();
});

// Export for external use
window.EnhancedUI = EnhancedUI;
window.UIUtils = UIUtils;
