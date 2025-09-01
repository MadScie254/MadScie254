/*
===============================================
MOTION ENGINE - AWARD-WINNING ANIMATIONS
===============================================
Comprehensive animation system using GSAP and ScrollTrigger
Inspired by award-winning sites and modern interaction patterns
===============================================
*/

// Initialize GSAP and register plugins
gsap.registerPlugin(ScrollTrigger);

class MotionEngine {
    constructor() {
        this.init();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.handleReducedMotion();
    }

    init() {
        // Set default animation settings
        gsap.defaults({
            duration: 0.8,
            ease: "power2.out"
        });

        // Create main timeline
        this.mainTimeline = gsap.timeline();
        
        // Setup scroll smoother if available
        if (typeof ScrollSmoother !== 'undefined') {
            this.smoother = ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1,
                effects: true
            });
        }
    }

    handleReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            gsap.globalTimeline.timeScale(0.01);
            ScrollTrigger.config({ ignoreMobileResize: true });
        }
    }

    setupScrollAnimations() {
        // Hero title animation with stagger effect
        gsap.fromTo('.hero-title', 
            {
                opacity: 0,
                y: 60,
                rotationX: 45
            },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 1.2,
                ease: "back.out(1.7)",
                delay: 0.3
            }
        );

        // Hero subtitle animation
        gsap.fromTo('.hero-subtitle',
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                delay: 0.6
            }
        );

        // Hero CTA animation
        gsap.fromTo('.hero-cta',
            {
                opacity: 0,
                y: 30,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: 0.9
            }
        );

        // Section reveal animations
        this.animateOnScroll('.fade-in', {
            from: { opacity: 0, y: 50 },
            to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        });

        this.animateOnScroll('.slide-in-left', {
            from: { opacity: 0, x: -60 },
            to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
        });

        this.animateOnScroll('.slide-in-right', {
            from: { opacity: 0, x: 60 },
            to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
        });

        this.animateOnScroll('.scale-in', {
            from: { opacity: 0, scale: 0.8 },
            to: { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
        });

        // Card animations with stagger
        this.setupCardAnimations();
        
        // Parallax effects
        this.setupParallaxEffects();
        
        // Navbar scroll effects
        this.setupNavbarAnimations();
    }

    animateOnScroll(selector, animation) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            gsap.fromTo(element, animation.from, {
                ...animation.to,
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    setupCardAnimations() {
        // Project cards animation
        const projectCards = document.querySelectorAll('.card-project, .card');
        
        projectCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 60,
                    rotationY: 15
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse"
                    },
                    delay: index * 0.1
                }
            );

            // Hover animations
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -8,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Grid animations with stagger
        const grids = document.querySelectorAll('.grid');
        grids.forEach(grid => {
            const children = grid.children;
            gsap.fromTo(children,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: grid,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    setupParallaxEffects() {
        // Hero video parallax
        const heroVideo = document.querySelector('.hero-video-bg');
        if (heroVideo) {
            gsap.to(heroVideo, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-video",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Parallax layers for image hero variant
        const parallaxLayers = document.querySelectorAll('.hero-parallax-layer');
        parallaxLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.5;
            gsap.to(layer, {
                yPercent: -50 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-parallax",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Floating shapes animation
        const floatingShapes = document.querySelectorAll('.floating-shape');
        floatingShapes.forEach((shape, index) => {
            const tl = gsap.timeline({ repeat: -1, yoyo: true });
            tl.to(shape, {
                y: gsap.utils.random(-20, 20),
                x: gsap.utils.random(-10, 10),
                rotation: gsap.utils.random(-15, 15),
                duration: gsap.utils.random(3, 6),
                ease: "sine.inOut",
                delay: index * 0.5
            });
        });
    }

    setupNavbarAnimations() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Navbar scroll behavior
        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            toggleClass: { className: "navbar-scrolled", targets: navbar }
        });

        // Navbar links hover animation
        const navLinks = document.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
    }

    setupIntersectionObserver() {
        // Intersection Observer for performance-optimized animations
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in'
        );
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Button interaction animations
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    y: -2,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            button.addEventListener('mousedown', () => {
                gsap.to(button, {
                    scale: 0.95,
                    duration: 0.1,
                    ease: "power2.out"
                });
            });

            button.addEventListener('mouseup', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.1,
                    ease: "power2.out"
                });
            });
        });
    }

    // Hero video controls animation
    setupVideoControls() {
        const video = document.querySelector('.hero-video-bg');
        const playPauseBtn = document.getElementById('video-play-pause');
        const muteBtn = document.getElementById('video-mute');

        if (video && playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playPauseBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    `;
                } else {
                    video.pause();
                    playPauseBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    `;
                }

                // Button press animation
                gsap.to(playPauseBtn, {
                    scale: 0.9,
                    duration: 0.1,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
            });
        }

        if (video && muteBtn) {
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                
                muteBtn.innerHTML = video.muted ? `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                ` : `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                `;

                // Button press animation
                gsap.to(muteBtn, {
                    scale: 0.9,
                    duration: 0.1,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
            });
        }
    }

    // Page transition animations
    setupPageTransitions() {
        // Create page transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: var(--gradient-hero);
            z-index: var(--z-maximum);
            pointer-events: none;
            opacity: 0;
        `;
        document.body.appendChild(overlay);

        // Handle page transitions for internal links
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            });
        });
    }

    // Smooth scroll to section
    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: "power2.inOut"
            });
        }
    }

    // Initialize all animations
    initializeAll() {
        this.setupButtonAnimations();
        this.setupVideoControls();
        this.setupPageTransitions();
        
        // Refresh ScrollTrigger after all animations are set up
        ScrollTrigger.refresh();
    }

    // Destroy animations (cleanup)
    destroy() {
        ScrollTrigger.killAll();
        gsap.killTweensOf("*");
        this.mainTimeline.kill();
    }
}

// Export for use in other files
window.MotionEngine = MotionEngine;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const motionEngine = new MotionEngine();
    motionEngine.initializeAll();
    
    // Make available globally for debugging
    window.motionEngine = motionEngine;
});

// Handle smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (window.motionEngine) {
            window.motionEngine.scrollToSection(targetId);
        }
    }
});
