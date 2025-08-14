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
        
        // Load API data
        this.loadWeatherAPI();
        this.loadGitHubStats();
        this.loadQuoteAPI();
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
                        if (mobileMenu.classList.contains('active')) {
                            item.style.transform = 'translateX(0)';
                            item.style.opacity = '1';
                        } else {
                            item.style.transform = 'translateX(-20px)';
                            item.style.opacity = '0.7';
                        }
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
                // Don't prevent default for actual navigation
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                const href = link.getAttribute('href');
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                
                if (href === currentPage || (href === 'index.html' && currentPage === '')) {
                    link.classList.add('active');
                }
                
                // Ripple effect
                this.createRippleEffect(e, link);
            });
        });

        // Set active link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (href === 'index.html' && currentPage === '')) {
                link.classList.add('active');
            }
        });

        // Header scroll effect
        let lastScrollTop = 0;
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    if (header) {
                        // Add scrolled class for styling
                        if (scrollTop > 50) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                        
                        // Hide/show header on scroll
                        if (scrollTop > lastScrollTop && scrollTop > 100) {
                            header.style.transform = 'translateY(-100%)';
                        } else {
                            header.style.transform = 'translateY(0)';
                        }
                    }
                    
                    lastScrollTop = scrollTop;
                    ticking = false;
                });
                ticking = true;
            }
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

    // ==========================================================================
    // API INTEGRATIONS
    // ==========================================================================

    // Weather API Integration
    async loadWeatherAPI() {
        try {
            // Using a free weather API for Nairobi, Kenya
            const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Nairobi,KE&appid=demo_key&units=metric');
            const data = await response.json();
            
            // Create weather widget if on homepage
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                this.displayWeatherWidget(data);
            }
        } catch (error) {
            console.log('Weather API not available, using fallback data');
            // Fallback to static data
            this.displayWeatherWidget({
                name: 'Nairobi',
                main: { temp: 22, humidity: 65 },
                weather: [{ main: 'Partly Cloudy', description: 'partly cloudy' }]
            });
        }
    }

    displayWeatherWidget(data) {
        const weatherHTML = `
            <div class="weather-widget" style="
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                padding: 1rem;
                border-radius: 12px;
                margin: 1rem 0;
                text-align: center;
                box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
            ">
                <h4 style="margin: 0 0 0.5rem 0;"><i class="fas fa-map-marker-alt"></i> ${data.name}</h4>
                <div class="weather-info" style="display: flex; justify-content: space-around; align-items: center;">
                    <span class="temp" style="font-size: 1.5rem; font-weight: bold;">${Math.round(data.main?.temp || 22)}°C</span>
                    <span class="condition">${data.weather?.[0]?.main || 'Partly Cloudy'}</span>
                </div>
            </div>
        `;
        
        // Add to hero section
        const hero = document.querySelector('.hero .container');
        if (hero) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = weatherHTML;
            hero.appendChild(tempDiv.firstElementChild);
        }
    }

    // GitHub API Integration
    async loadGitHubStats() {
        try {
            const username = 'MadScie254'; // Your GitHub username
            const response = await fetch(`https://api.github.com/users/${username}`);
            const userData = await response.json();
            
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
            const reposData = await reposResponse.json();
            
            if (window.location.pathname.includes('projects.html')) {
                this.updateProjectsWithGitHubData(reposData);
            }
            
            // Add GitHub stats to about page
            if (window.location.pathname.includes('about.html')) {
                this.displayGitHubStats(userData);
            }
        } catch (error) {
            console.log('GitHub API not available, using fallback data');
            // Use fallback data
            if (window.location.pathname.includes('about.html')) {
                this.displayGitHubStats({
                    public_repos: 15,
                    followers: 25,
                    following: 30
                });
            }
        }
    }

    displayGitHubStats(userData) {
        const statsHTML = `
            <div class="github-stats" style="
                background: #f8fafc;
                padding: 2rem;
                border-radius: 12px;
                margin: 2rem 0;
                border: 1px solid #e2e8f0;
            ">
                <h3 style="color: #1a202c; margin-bottom: 1rem;"><i class="fab fa-github"></i> GitHub Activity</h3>
                <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
                    <div class="stat-item">
                        <span class="stat-number" style="display: block; font-size: 2rem; font-weight: bold; color: #3b82f6;">${userData.public_repos || 15}</span>
                        <span class="stat-label" style="color: #64748b;">Repositories</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" style="display: block; font-size: 2rem; font-weight: bold; color: #3b82f6;">${userData.followers || 25}</span>
                        <span class="stat-label" style="color: #64748b;">Followers</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" style="display: block; font-size: 2rem; font-weight: bold; color: #3b82f6;">${userData.following || 30}</span>
                        <span class="stat-label" style="color: #64748b;">Following</span>
                    </div>
                </div>
            </div>
        `;
        
        const aboutSection = document.querySelector('.section .container');
        if (aboutSection) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = statsHTML;
            aboutSection.appendChild(tempDiv.firstElementChild);
        }
    }

    // Inspirational Quote API
    async loadQuoteAPI() {
        try {
            const response = await fetch('https://api.quotable.io/random?tags=technology,science,success');
            const quoteData = await response.json();
            
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                this.displayQuoteWidget(quoteData);
            }
        } catch (error) {
            console.log('Quote API not available, using fallback');
            // Fallback quote
            this.displayQuoteWidget({
                content: "The best way to predict the future is to create it.",
                author: "Peter Drucker"
            });
        }
    }

    displayQuoteWidget(quote) {
        const quoteHTML = `
            <div class="quote-widget" style="
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 2rem;
                border-radius: 12px;
                margin: 2rem 0;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            ">
                <blockquote style="margin: 0;">
                    <p style="font-style: italic; font-size: 1.1rem; color: #1a202c; margin-bottom: 1rem;">"${quote.content}"</p>
                    <footer style="text-align: right; color: #64748b; font-weight: 500;">— ${quote.author}</footer>
                </blockquote>
            </div>
        `;
        
        const hero = document.querySelector('.hero .container');
        if (hero) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = quoteHTML;
            hero.appendChild(tempDiv.firstElementChild);
        }
    }

    updateProjectsWithGitHubData(repos) {
        // Update project cards with real GitHub data
        const projectCards = document.querySelectorAll('.project-card');
        
        repos.slice(0, projectCards.length).forEach((repo, index) => {
            const card = projectCards[index];
            if (card) {
                const titleElement = card.querySelector('h3');
                const descElement = card.querySelector('p');
                const linkElement = card.querySelector('a');
                
                if (titleElement) titleElement.textContent = repo.name;
                if (descElement) descElement.textContent = repo.description || 'No description available';
                if (linkElement) linkElement.href = repo.html_url;
                
                // Add GitHub stats
                const statsHTML = `
                    <div class="github-project-stats" style="margin-top: 1rem; display: flex; gap: 1rem; font-size: 0.9rem; color: #64748b;">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span><i class="fas fa-circle" style="color: #f1c40f;"></i> ${repo.language || 'Unknown'}</span>
                    </div>
                `;
                
                if (!card.querySelector('.github-project-stats')) {
                    card.insertAdjacentHTML('beforeend', statsHTML);
                }
            }
        });
    }
}

// Initialize the enhanced portfolio
const portfolio = new EnhancedPortfolio();
