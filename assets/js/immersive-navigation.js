/* ==========================================================================
   IMMERSIVE NAVIGATION JAVASCRIPT - MOBILE & DESKTOP
   ========================================================================== */

class ImmersiveNavigation {
    constructor() {
        this.navToggle = null;
        this.navMenu = null;
        this.hamburgerLines = null;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
    }
    
    setupElements() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.hamburgerLines = document.querySelectorAll('.hamburger-line');
        this.navbar = document.querySelector('.navbar');
    }
    
    bindEvents() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Handle scroll for navbar transparency
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        this.navToggle.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll on mobile
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    handleScroll() {
        if (!this.navbar) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            this.navbar.style.borderBottom = '1px solid rgba(106, 0, 255, 0.5)';
        } else {
            this.navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            this.navbar.style.borderBottom = '1px solid rgba(106, 0, 255, 0.3)';
        }
    }
    
    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImmersiveNavigation();
    
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImmersiveNavigation;
}
