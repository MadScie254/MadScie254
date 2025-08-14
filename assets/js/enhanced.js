// ==========================================================================
// ENHANCED PORTFOLIO JAVASCRIPT - REACT-LEVEL INTERACTIONS
// ==========================================================================

class EnhancedPortfolio {
    constructor() {
        this.init();
        this.progressNotification = null;
        this.readingProgress = null;
        this.reachedMilestones = [];
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPortfolio());
        } else {
            this.setupPortfolio();
        }
    }

    setupPortfolio() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupForms();
        this.setupReadingProgress();
        this.setupProgressNotifications();
        this.setupParallaxEffects();
        this.setupSkillAnimations();
        this.setupProjectCards();
        this.setupButtonAnimations();
        this.setupIntersectionObserver();
    }

    // Enhanced Navigation with smooth animations
    setupNavigation() {
        const menuToggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.querySelector('.nav-menu');
        const header = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-menu a');

        // Mobile menu toggle with animation
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                
                // Animate menu items
                const menuItems = mobileMenu.querySelectorAll('a');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = mobileMenu.classList.contains('active') 
                            ? 'translateX(0) scale(1)' 
                            : 'translateX(-20px) scale(0.9)';
                        item.style.opacity = mobileMenu.classList.contains('active') ? '1' : '0';
                    }, index * 50);
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }

        // Active link highlighting
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Ripple effect
                this.createRippleEffect(e, link);
            });
        });

        // Header scroll effect
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (header) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                // Add glass effect on scroll
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Create ripple effect for buttons
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple CSS
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Enhanced scroll animations with intersection observer
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger specific animations based on element type
                    if (entry.target.classList.contains('skill-progress')) {
                        this.animateSkillBar(entry.target);
                    }
                    
                    if (entry.target.classList.contains('project-card')) {
                        this.animateProjectCard(entry.target);
                    }
                }
            });
        }, options);

        // Observe all animatable elements
        document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Animate skill bars
    animateSkillBar(skillBar) {
        const percentage = skillBar.dataset.percentage || '0';
        skillBar.style.width = '0%';
        
        setTimeout(() => {
            skillBar.style.width = percentage + '%';
        }, 200);
    }

    // Animate project cards
    animateProjectCard(card) {
        const delay = Math.random() * 200;
        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
        }, delay);
    }

    // Setup skill animations
    setupSkillAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.classList.add('fade-in-on-scroll');
        });
    }

    // Setup project card interactions
    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.classList.add('fade-in-on-scroll');
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(2deg) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) scale(1)';
            });
            
            // Add click animation
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    this.createRippleEffect(e, card);
                }
            });
        });
    }

    // Setup button animations
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.nav-button, .btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
            
            // Add magnetic effect
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    // Setup parallax effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const rate = scrolled * -0.5;
                    element.style.transform = `translateY(${rate}px)`;
                });
            });
        }
    }

    // Enhanced reading progress
    setupReadingProgress() {
        this.readingProgress = document.querySelector('.reading-progress');
        if (!this.readingProgress) {
            this.readingProgress = document.createElement('div');
            this.readingProgress.className = 'reading-progress';
            document.body.appendChild(this.readingProgress);
        }

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            this.readingProgress.style.width = Math.min(progress, 100) + '%';
            
            // Show milestone notifications
            this.checkReadingMilestones(progress);
        });
    }

    // Progress notifications
    setupProgressNotifications() {
        // Create notification container if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showProgressNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `progress-notification ${type}`;
        notification.textContent = message;
        
        const container = document.querySelector('.notification-container') || document.body;
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    checkReadingMilestones(progress) {
        const milestones = [25, 50, 75, 100];
        const currentMilestone = milestones.find(m => 
            progress >= m && !this.reachedMilestones.includes(m)
        );
        
        if (currentMilestone) {
            this.reachedMilestones.push(currentMilestone);
            
            const messages = {
                25: "Great start! Keep reading...",
                50: "Halfway there! You're doing great!",
                75: "Almost done! Final stretch!",
                100: "Excellent! You've read everything!"
            };
            
            this.showProgressNotification(messages[currentMilestone], 'success');
        }
    }

    // Smooth scrolling
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

    // Scroll animations
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // Form handling
    setupForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showProgressNotification('Message sent successfully!', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

// Initialize the enhanced portfolio
const portfolio = new EnhancedPortfolio();
