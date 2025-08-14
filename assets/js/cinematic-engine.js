/* ==========================================================================
   ULTIMATE REACT-LEVEL JAVASCRIPT ENGINE
   Advanced cinematic interactions and API integrations
   ========================================================================== */

class CinematicPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initAdvancedAnimations();
        this.loadAPIs();
    }

    init() {
        console.log('🎬 Initializing Cinematic Portfolio Engine...');
        this.setupIntersectionObserver();
        this.initParticleSystem();
        this.setupMagneticCursor();
        this.initPageTransitions();
    }

    /* ==========================================================================
       INTERSECTION OBSERVER FOR CINEMATIC REVEALS
       ========================================================================== */
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('active');
                        this.triggerElementAnimation(entry.target);
                    }, index * 100);
                }
            });
        }, options);

        // Observe all reveal elements
        document.querySelectorAll('.reveal, .skill-card, .project-card, .card').forEach(el => {
            observer.observe(el);
        });
    }

    triggerElementAnimation(element) {
        // Add extra visual effects on reveal
        element.style.transform += ' scale(1.02)';
        setTimeout(() => {
            element.style.transform = element.style.transform.replace(' scale(1.02)', '');
        }, 300);
    }

    /* ==========================================================================
       PARTICLE SYSTEM - REACT-LEVEL EFFECTS
       ========================================================================== */
    
    initParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.3';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;

        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.speed = Math.random() * 2 + 0.5;
                this.radius = Math.random() * 3 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = `hsla(${Math.random() * 60 + 200}, 70%, 60%, ${this.opacity})`;
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    /* ==========================================================================
       MAGNETIC CURSOR INTERACTIONS
       ========================================================================== */
    
    setupMagneticCursor() {
        const magneticElements = document.querySelectorAll('.magnetic, .btn, .nav-button, .skill-card__icon');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.2;
                const deltaY = (e.clientY - centerY) * 0.2;
                
                element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }

    /* ==========================================================================
       PAGE TRANSITION SYSTEM
       ========================================================================== */
    
    initPageTransitions() {
        const navLinks = document.querySelectorAll('nav a[href*=".html"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.performPageTransition(link.href);
            });
        });
    }

    performPageTransition(url) {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            transition: left 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        document.body.appendChild(overlay);

        // Animate overlay in
        setTimeout(() => {
            overlay.style.left = '0';
        }, 50);

        // Navigate to new page
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    }

    /* ==========================================================================
       ADVANCED HOVER EFFECTS
       ========================================================================== */
    
    initAdvancedAnimations() {
        // Ripple effect for buttons
        this.setupRippleEffects();
        
        // Parallax scrolling
        this.setupParallaxScrolling();
        
        // Dynamic text effects
        this.setupTextEffects();
        
        // Skill card enhancements
        this.enhanceSkillCards();
    }

    setupRippleEffects() {
        const rippleElements = document.querySelectorAll('.btn, .nav-button, .skill-card');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    background-color: rgba(255, 255, 255, 0.3);
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple CSS animation
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupParallaxScrolling() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupTextEffects() {
        // Typewriter effect for hero text
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '3px solid #667eea';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i > text.length) {
                    clearInterval(typeInterval);
                    element.classList.add('typing-complete');
                }
            }, 100);
        });
    }

    enhanceSkillCards() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach((card, index) => {
            // Add staggered entrance animation
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Enhanced hover interactions
            card.addEventListener('mouseenter', () => {
                this.createHoverParticles(card);
            });
            
            // Add tilt effect based on mouse position
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const rotateX = (e.clientY - centerY) / 20;
                const rotateY = -(e.clientX - centerX) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    createHoverParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #667eea;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleFloat 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
        
        // Add particle animation CSS if not exists
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100px) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ==========================================================================
       API INTEGRATIONS - DYNAMIC CONTENT
       ========================================================================== */
    
    loadAPIs() {
        this.loadGitHubStats();
        this.loadWeatherAPI();
        this.loadQuoteAPI();
    }

    async loadGitHubStats() {
        try {
            const response = await fetch('https://api.github.com/users/MadScie254');
            const data = await response.json();
            
            const statsContainer = document.getElementById('github-stats');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stat-item reveal">
                        <i class="fab fa-github"></i>
                        <span>${data.public_repos} Repositories</span>
                    </div>
                    <div class="stat-item reveal">
                        <i class="fas fa-users"></i>
                        <span>${data.followers} Followers</span>
                    </div>
                    <div class="stat-item reveal">
                        <i class="fas fa-star"></i>
                        <span>Active Since ${new Date(data.created_at).getFullYear()}</span>
                    </div>
                `;
            }
        } catch (error) {
            console.log('GitHub API not available, using static content');
        }
    }

    async loadWeatherAPI() {
        try {
            // Using a free weather API for location-based greeting
            const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Nairobi&appid=demo&units=metric');
            const data = await response.json();
            
            const weatherContainer = document.getElementById('weather-widget');
            if (weatherContainer) {
                weatherContainer.innerHTML = `
                    <div class="weather-info reveal">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Currently in ${data.name || 'Nairobi'}</span>
                    </div>
                `;
            }
        } catch (error) {
            console.log('Weather API not available');
        }
    }

    async loadQuoteAPI() {
        try {
            const quotes = [
                "Code is poetry written in logic.",
                "Innovation distinguishes between a leader and a follower.",
                "The future belongs to those who believe in the beauty of their dreams.",
                "Technology is nothing. What's important is that you have a faith in people.",
                "The only way to do great work is to love what you do."
            ];
            
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const quoteContainer = document.getElementById('daily-quote');
            
            if (quoteContainer) {
                quoteContainer.innerHTML = `
                    <div class="quote-text reveal">
                        <i class="fas fa-quote-left"></i>
                        <span>${randomQuote}</span>
                        <i class="fas fa-quote-right"></i>
                    </div>
                `;
            }
        } catch (error) {
            console.log('Quote API not available');
        }
    }

    /* ==========================================================================
       SMOOTH SCROLL IMPLEMENTATION
       ========================================================================== */
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /* ==========================================================================
       EVENT LISTENERS SETUP
       ========================================================================== */
    
    setupEventListeners() {
        // Page load optimizations
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            this.setupSmoothScroll();
        });

        // Scroll performance optimization
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Update navbar background on scroll
        const navbar = document.querySelector('.navbar, nav');
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Parallax effects
        this.updateParallax(scrollTop);
    }

    updateParallax(scrollTop) {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleResize() {
        // Recalculate dimensions for responsive animations
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            // Reset any inline transforms
            card.style.transform = '';
        });
    }
}

/* ==========================================================================
   INITIALIZE WHEN DOM IS READY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    new CinematicPortfolio();
    
    // Add reveal class to elements that should animate in
    const revealElements = document.querySelectorAll('section > *, .hero > *, .container > *');
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });
});

/* ==========================================================================
   PERFORMANCE MONITORING
   ========================================================================== */

// Monitor performance and adjust animations if needed
const performanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
        if (entry.duration > 16.67) { // More than 60fps
            console.warn('Performance warning: Animation frame took', entry.duration, 'ms');
        }
    });
});

if ('PerformanceObserver' in window) {
    performanceObserver.observe({ entryTypes: ['measure'] });
}
