/*
===============================================
MAIN APPLICATION LOGIC
===============================================
Core functionality, API integrations, and interactive features
===============================================
*/

class App {
    constructor() {
        this.apiCache = new Map();
        this.projects = [];
        this.blogPosts = [];
        this.skills = [];
        this.githubData = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupForms();
        this.setupServiceWorker();
        this.initializeComponents();
    }

    async loadData() {
        try {
            // Load all data in parallel for better performance
            await Promise.allSettled([
                this.loadProjects(),
                this.loadBlogPosts(),
                this.loadSkills(),
                this.loadGitHubData(),
                this.loadNewsData()
            ]);
        } catch (error) {
            console.warn('Some data failed to load:', error);
            this.loadFallbackData();
        }
    }

    async loadProjects() {
        try {
            // Try to load from static JSON first
            const response = await fetch('./assets/data/projects.json');
            if (response.ok) {
                this.projects = await response.json();
            } else {
                // Fallback to hardcoded projects
                this.projects = this.getFallbackProjects();
            }
            this.renderProjects();
        } catch (error) {
            console.warn('Failed to load projects:', error);
            this.projects = this.getFallbackProjects();
            this.renderProjects();
        }
    }

    async loadBlogPosts() {
        try {
            // Try to load fintech news from static data
            const response = await fetch('./assets/data/fintech-news.json');
            if (response.ok) {
                const data = await response.json();
                this.blogPosts = data.articles || [];
            } else {
                this.blogPosts = this.getFallbackBlogPosts();
            }
            this.renderBlogPosts();
        } catch (error) {
            console.warn('Failed to load blog posts:', error);
            this.blogPosts = this.getFallbackBlogPosts();
            this.renderBlogPosts();
        }
    }

    async loadSkills() {
        try {
            const response = await fetch('./assets/data/skills.json');
            if (response.ok) {
                this.skills = await response.json();
            } else {
                this.skills = this.getFallbackSkills();
            }
            this.renderSkills();
        } catch (error) {
            console.warn('Failed to load skills:', error);
            this.skills = this.getFallbackSkills();
            this.renderSkills();
        }
    }

    async loadGitHubData() {
        try {
            // Load GitHub activity from static data
            const response = await fetch('./assets/data/github-activity.json');
            if (response.ok) {
                this.githubData = await response.json();
            } else {
                // Fallback data
                this.githubData = this.getFallbackGitHubData();
            }
        } catch (error) {
            console.warn('Failed to load GitHub data:', error);
            this.githubData = this.getFallbackGitHubData();
        }
    }

    async loadNewsData() {
        try {
            // Load news from static data
            const response = await fetch('./assets/data/tech-news.json');
            if (response.ok) {
                const newsData = await response.json();
                // Integrate news into blog posts if available
                if (newsData.articles) {
                    this.blogPosts = [...this.blogPosts, ...newsData.articles.slice(0, 3)];
                    this.renderBlogPosts();
                }
            }
        } catch (error) {
            console.warn('Failed to load news data:', error);
        }
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        const featuredProjects = this.projects.slice(0, 6);
        
        projectsGrid.innerHTML = featuredProjects.map(project => `
            <article class="card card-project card-interactive fade-in" data-project-id="${project.id}">
                <img src="${project.image}" alt="${project.title}" class="card-project-image" loading="lazy">
                <div class="card-project-content">
                    <div>
                        <h3 style="margin-bottom: var(--space-2); color: var(--color-neutral-900);">${project.title}</h3>
                        <p style="color: var(--color-neutral-600); font-size: var(--font-size-sm);">${project.description}</p>
                    </div>
                    <div class="flex justify-between items-center" style="margin-top: var(--space-4);">
                        <div class="flex gap-2">
                            ${project.technologies.slice(0, 3).map(tech => 
                                `<span style="padding: var(--space-1) var(--space-2); background: var(--color-primary-100); color: var(--color-primary-700); border-radius: var(--radius-base); font-size: var(--font-size-xs);">${tech}</span>`
                            ).join('')}
                        </div>
                        <a href="${project.link}" class="btn btn-sm btn-ghost" target="_blank" rel="noopener">
                            View Project
                        </a>
                    </div>
                </div>
            </article>
        `).join('');

        // Add click handlers for project cards
        featuredProjects.forEach(project => {
            const card = projectsGrid.querySelector(`[data-project-id="${project.id}"]`);
            if (card) {
                card.addEventListener('click', () => this.openProjectModal(project));
            }
        });
    }

    renderBlogPosts() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        const featuredPosts = this.blogPosts.slice(0, 6);
        
        blogGrid.innerHTML = featuredPosts.map(post => `
            <article class="card card-blog card-interactive fade-in">
                <img src="${post.image || post.urlToImage || 'assets/images/blog-placeholder.jpg'}" 
                     alt="${post.title}" 
                     style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-lg) var(--radius-lg) 0 0;" 
                     loading="lazy">
                <div style="padding: var(--space-6); flex: 1; display: flex; flex-direction: column;">
                    <div class="card-blog-meta">
                        <span>${this.formatDate(post.publishedAt || post.date)}</span>
                        <span>•</span>
                        <span>${post.source?.name || post.author || 'Tech News'}</span>
                    </div>
                    <h3 style="margin-bottom: var(--space-3); color: var(--color-neutral-900); flex: 1;">
                        ${post.title}
                    </h3>
                    <p style="color: var(--color-neutral-600); margin-bottom: var(--space-4); flex: 1;">
                        ${this.truncateText(post.description || post.content, 120)}
                    </p>
                    <a href="${post.url || post.link}" 
                       class="btn btn-sm btn-ghost" 
                       target="_blank" 
                       rel="noopener"
                       style="align-self: flex-start;">
                        Read More
                    </a>
                </div>
            </article>
        `).join('');
    }

    renderSkills() {
        const skillsGrid = document.getElementById('skills-grid');
        if (!skillsGrid) return;

        skillsGrid.innerHTML = this.skills.map(skill => `
            <div class="card card-feature fade-in" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: var(--color-neutral-0);">
                <div style="font-size: 2.5rem; margin-bottom: var(--space-4);">${skill.icon}</div>
                <h3 style="margin-bottom: var(--space-3); color: var(--color-neutral-0);">${skill.name}</h3>
                <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: var(--space-4);">${skill.description}</p>
                <div class="flex gap-2" style="flex-wrap: wrap;">
                    ${skill.technologies.map(tech => 
                        `<span style="padding: var(--space-1) var(--space-2); background: rgba(255, 255, 255, 0.2); color: var(--color-neutral-0); border-radius: var(--radius-base); font-size: var(--font-size-xs);">${tech}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', this.throttle(() => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            }
        }, 16));

        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navbarNav = document.getElementById('navbar-nav');
        
        if (mobileToggle && navbarNav) {
            mobileToggle.addEventListener('click', () => {
                navbarNav.classList.toggle('mobile-open');
                mobileToggle.classList.toggle('active');
            });

            // Close menu when clicking on a link
            navbarNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navbarNav.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                });
            });
        }
    }

    setupForms() {
        // Enhanced form validation and submission
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (this.validateContactForm(data)) {
            // Simulate form submission
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        }
    }

    validateContactForm(data) {
        const { name, email, message } = data;
        let isValid = true;

        if (!name || name.trim().length < 2) {
            this.showFieldError('name', 'Please enter a valid name');
            isValid = false;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!message || message.trim().length < 10) {
            this.showFieldError('message', 'Please enter a message with at least 10 characters');
            isValid = false;
        }

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;

        switch (input.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(input.id, 'Please enter a valid email address');
                    isValid = false;
                }
                break;
            case 'text':
                if (value.length < 2) {
                    this.showFieldError(input.id, 'This field is required');
                    isValid = false;
                }
                break;
        }

        if (input.tagName === 'TEXTAREA' && value.length < 10) {
            this.showFieldError(input.id, 'Please enter at least 10 characters');
            isValid = false;
        }

        if (isValid) {
            this.clearFieldError(input);
        }
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.style.borderColor = 'var(--color-error-500)';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: var(--color-error-500);
                font-size: var(--font-size-sm);
                margin-top: var(--space-1);
                display: block;
            `;
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(input) {
        input.style.borderColor = '';
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: var(--space-4);
            right: var(--space-4);
            background: var(--color-${type === 'success' ? 'success' : 'primary'}-500);
            color: white;
            padding: var(--space-4) var(--space-6);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-toast);
            transform: translateX(100%);
            transition: transform var(--duration-300) var(--ease-out);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    openProjectModal(project) {
        // Create and show project modal
        const modal = this.createProjectModal(project);
        document.body.appendChild(modal);
        
        // Animate modal in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        });
    }

    createProjectModal(project) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal);
            opacity: 0;
            transition: opacity var(--duration-300) var(--ease-out);
            padding: var(--space-4);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: var(--color-neutral-0);
                border-radius: var(--radius-xl);
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform var(--duration-300) var(--ease-out);
            ">
                <div style="position: relative;">
                    <img src="${project.image}" alt="${project.title}" style="
                        width: 100%;
                        height: 300px;
                        object-fit: cover;
                        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
                    ">
                    <button class="modal-close" style="
                        position: absolute;
                        top: var(--space-4);
                        right: var(--space-4);
                        width: 40px;
                        height: 40px;
                        border-radius: var(--radius-full);
                        background: rgba(0, 0, 0, 0.5);
                        color: white;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                <div style="padding: var(--space-8);">
                    <h2 style="margin-bottom: var(--space-4); color: var(--color-neutral-900);">${project.title}</h2>
                    <p style="margin-bottom: var(--space-6); color: var(--color-neutral-600); line-height: var(--line-height-relaxed);">
                        ${project.fullDescription || project.description}
                    </p>
                    <div style="margin-bottom: var(--space-6);">
                        <h3 style="margin-bottom: var(--space-3); color: var(--color-neutral-900);">Technologies Used</h3>
                        <div class="flex gap-2" style="flex-wrap: wrap;">
                            ${project.technologies.map(tech => 
                                `<span style="padding: var(--space-2) var(--space-3); background: var(--color-primary-100); color: var(--color-primary-700); border-radius: var(--radius-lg); font-size: var(--font-size-sm);">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <a href="${project.link}" class="btn btn-primary" target="_blank" rel="noopener">
                            View Project
                        </a>
                        ${project.github ? `<a href="${project.github}" class="btn btn-secondary" target="_blank" rel="noopener">View Code</a>` : ''}
                    </div>
                </div>
            </div>
        `;

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        return modal;
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    initializeComponents() {
        // Initialize any additional components
        this.setupLazyLoading();
        this.setupPerformanceObserver();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                });
            });

            try {
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Browser doesn't support this metric
            }
        }
    }

    // Fallback data methods
    getFallbackProjects() {
        return [
            {
                id: 1,
                title: "Advanced Customer Analytics Dashboard",
                description: "Real-time analytics platform processing 1M+ customer interactions daily",
                fullDescription: "Comprehensive analytics dashboard built with Python, Django, and React that processes over 1 million customer interactions daily. Features real-time data visualization, predictive analytics, and automated reporting capabilities.",
                image: "assets/images/pexels-energepic-com-27411-159888.jpg",
                technologies: ["Python", "Django", "React", "PostgreSQL", "Redis"],
                link: "https://github.com/MadScie254",
                github: "https://github.com/MadScie254"
            },
            {
                id: 2,
                title: "Machine Learning Risk Assessment",
                description: "AI-powered risk assessment system for financial institutions",
                fullDescription: "Sophisticated machine learning system that evaluates financial risks using ensemble methods, deep learning, and traditional statistical models. Deployed in production serving 50+ financial institutions.",
                image: "assets/images/thisisengineering-0jTZTMyGym8-unsplash.jpg",
                technologies: ["Python", "TensorFlow", "Scikit-learn", "AWS", "Docker"],
                link: "https://github.com/MadScie254",
                github: "https://github.com/MadScie254"
            },
            {
                id: 3,
                title: "Business Intelligence Platform",
                description: "Comprehensive BI solution for data-driven decision making",
                fullDescription: "End-to-end business intelligence platform that integrates multiple data sources, provides automated ETL processes, and delivers actionable insights through interactive dashboards.",
                image: "assets/images/chris-yang-1tnS_BVy9Jk-unsplash.jpg",
                technologies: ["Power BI", "SQL Server", "Python", "Azure", "DAX"],
                link: "https://github.com/MadScie254",
                github: "https://github.com/MadScie254"
            }
        ];
    }

    getFallbackBlogPosts() {
        return [
            {
                title: "The Future of Data Science in Fintech",
                description: "Exploring how machine learning and AI are revolutionizing financial services and creating new opportunities for innovation.",
                image: "assets/images/pexels-tima-miroshnichenko-5380621.jpg",
                date: "2025-01-15",
                author: "Daniel Wanjala",
                url: "#"
            },
            {
                title: "Building Scalable Analytics Pipelines",
                description: "Best practices for designing and implementing data pipelines that can handle massive volumes of real-time data.",
                image: "assets/images/maxim-berg-kE8-rUKjtQU-unsplash.jpg",
                date: "2025-01-10",
                author: "Daniel Wanjala",
                url: "#"
            },
            {
                title: "AI Ethics in Business Intelligence",
                description: "Discussing the importance of ethical AI practices in business intelligence and data-driven decision making.",
                image: "assets/images/sharad-bhat-TzWuSdXMWuk-unsplash.jpg",
                date: "2025-01-05",
                author: "Daniel Wanjala",
                url: "#"
            }
        ];
    }

    getFallbackSkills() {
        return [
            {
                name: "Data Science & Analytics",
                description: "Advanced statistical analysis, machine learning, and predictive modeling",
                icon: "📊",
                technologies: ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn"]
            },
            {
                name: "Machine Learning & AI",
                description: "Deep learning, neural networks, and artificial intelligence solutions",
                icon: "🤖",
                technologies: ["TensorFlow", "PyTorch", "Keras", "OpenCV", "NLP", "Computer Vision"]
            },
            {
                name: "Business Intelligence",
                description: "Data visualization, reporting, and business insights generation",
                icon: "📈",
                technologies: ["Power BI", "Tableau", "Excel", "DAX", "MDX", "SSRS"]
            },
            {
                name: "Cloud & Infrastructure",
                description: "Cloud platforms, containerization, and scalable system architecture",
                icon: "☁️",
                technologies: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Jenkins"]
            }
        ];
    }

    getFallbackGitHubData() {
        return {
            public_repos: 25,
            followers: 150,
            following: 50,
            created_at: "2020-01-01T00:00:00Z"
        };
    }

    loadFallbackData() {
        this.projects = this.getFallbackProjects();
        this.blogPosts = this.getFallbackBlogPosts();
        this.skills = this.getFallbackSkills();
        this.githubData = this.getFallbackGitHubData();
        
        this.renderProjects();
        this.renderBlogPosts();
        this.renderSkills();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
