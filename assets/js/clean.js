// ==========================================================================
// CLEAN PORTFOLIO JAVASCRIPT - SIMPLE AND FUNCTIONAL
// ==========================================================================

class CleanPortfolio {
    constructor() {
        this.init();
        this.progressNotification = null;
        this.readingProgress = null;
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
    }

    // Navigation
    setupNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const header = document.querySelector('.header');

        // Mobile menu toggle
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }

        // Header scroll effect
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }
            });
        }
    }

    // Reading progress bar
    setupReadingProgress() {
        // Create reading progress bar
        this.readingProgress = document.createElement('div');
        this.readingProgress.className = 'reading-progress';
        document.body.appendChild(this.readingProgress);

        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            this.readingProgress.style.width = scrollPercent + '%';
        });
    }

    // Small progress notifications
    setupProgressNotifications() {
        let lastNotificationTime = 0;
        const notificationCooldown = 10000; // 10 seconds

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            const now = Date.now();

            // Show notifications at certain milestones
            if (scrollPercent > 25 && scrollPercent < 30 && now - lastNotificationTime > notificationCooldown) {
                this.showProgressNotification('📖 25% read - Keep going!');
                lastNotificationTime = now;
            } else if (scrollPercent > 50 && scrollPercent < 55 && now - lastNotificationTime > notificationCooldown) {
                this.showProgressNotification('🔥 Halfway there!');
                lastNotificationTime = now;
            } else if (scrollPercent > 75 && scrollPercent < 80 && now - lastNotificationTime > notificationCooldown) {
                this.showProgressNotification('⭐ Almost done!');
                lastNotificationTime = now;
            } else if (scrollPercent > 95 && now - lastNotificationTime > notificationCooldown) {
                this.showProgressNotification('🎉 Page complete!');
                lastNotificationTime = now;
            }
        });
    }

    showProgressNotification(message) {
        // Remove existing notification
        if (this.progressNotification) {
            this.progressNotification.remove();
        }

        // Create new notification
        this.progressNotification = document.createElement('div');
        this.progressNotification.className = 'progress-notification';
        this.progressNotification.textContent = message;
        document.body.appendChild(this.progressNotification);

        // Show notification
        setTimeout(() => {
            this.progressNotification.classList.add('show');
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            if (this.progressNotification) {
                this.progressNotification.classList.add('hide');
                setTimeout(() => {
                    if (this.progressNotification) {
                        this.progressNotification.remove();
                        this.progressNotification = null;
                    }
                }, 300);
            }
        }, 3000);
    }

    // Smooth scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll animations
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Form handling
    setupForms() {
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
        }
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple form validation
        if (!data.name || !data.email || !data.message) {
            this.showProgressNotification('❌ Please fill in all required fields');
            return;
        }

        // Show success message
        this.showProgressNotification('✅ Message sent! Thank you!');
        form.reset();
    }
}

// Initialize
new CleanPortfolio();
