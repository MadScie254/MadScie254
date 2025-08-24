/**
 * Global JavaScript functionality for MadScie254 Portfolio
 * Handles: WhatsApp floater, dark mode, responsive navbar, and shared utilities
 */

class PortfolioGlobal {
    constructor() {
        this.whatsappNumber = '254742007277';
        this.emailjsServiceId = 'service_madscie254';
        this.emailjsTemplateId = 'template_contact';
        this.emailjsPublicKey = 'user_madscie254';
        
        this.init();
    }

    init() {
        this.initDarkMode();
        this.initWhatsAppFloater();
        this.initResponsiveNavbar();
        this.initAdaptiveTypography();
        this.initAnimations();
    }

    // Dark Mode Management
    initDarkMode() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                if (themeIcon) {
                    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            });
        }
    }

    // WhatsApp Floater with Fallback - Injected on every page
    initWhatsAppFloater() {
        // Only create if not already exists
        if (!document.getElementById('whatsapp-floater')) {
            this.createWhatsAppFloater();
            this.createWhatsAppModal();
        }
    }

    createWhatsAppFloater() {
        const floater = document.createElement('div');
        floater.id = 'whatsapp-floater';
        floater.className = 'whatsapp-floater';
        floater.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            transition: all 0.3s ease;
        `;
        
        floater.innerHTML = `
            <div class="whatsapp-icon" style="color: white;">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.190z"/>
                </svg>
            </div>
        `;

        floater.addEventListener('click', () => this.handleWhatsAppClick());
        floater.addEventListener('mouseenter', () => {
            floater.style.transform = 'scale(1.1)';
        });
        floater.addEventListener('mouseleave', () => {
            floater.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(floater);
    }

    async handleWhatsAppClick() {
        const message = 'Hello Daniel! I visited your portfolio and would like to connect.';
        const encodedMessage = encodeURIComponent(message);
        
        // Primary WhatsApp URL
        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
        // Fallback Web WhatsApp URL
        const webWhatsappUrl = `https://web.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`;
        
        try {
            // Detect if on mobile/desktop
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Try mobile WhatsApp first
                const whatsappWindow = window.open(whatsappUrl, '_blank');
                
                // Fallback if can't open
                setTimeout(() => {
                    if (!whatsappWindow || whatsappWindow.closed) {
                        // Try web WhatsApp
                        const webWindow = window.open(webWhatsappUrl, '_blank');
                        setTimeout(() => {
                            if (!webWindow || webWindow.closed) {
                                this.showWhatsAppModal();
                            }
                        }, 1500);
                    }
                }, 1000);
            } else {
                // Desktop: try web WhatsApp first
                const webWindow = window.open(webWhatsappUrl, '_blank');
                
                // Fallback to modal if web WhatsApp fails
                setTimeout(() => {
                    if (!webWindow || webWindow.closed) {
                        this.showWhatsAppModal();
                    }
                }, 2000);
            }
        } catch (error) {
            console.log('WhatsApp failed, showing modal fallback');
            this.showWhatsAppModal();
        }
    }

    createWhatsAppModal() {
        const modal = document.createElement('div');
        modal.id = 'whatsapp-modal';
        modal.className = 'whatsapp-modal';
        modal.innerHTML = `
            <div class="whatsapp-modal-content">
                <div class="whatsapp-header">
                    <div class="whatsapp-header-info">
                        <img src="assets/images/My_Profile_Photo.jpg" alt="Daniel" class="whatsapp-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjY2NjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDNjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtM3MxLjM0LTMgMy0zem0wIDE0LjJjLTIuNSAwLTQuNzEtMS4yOC02LTMuMjIuMDMtMS45OSA0LTMuMDggNi0zLjA4czUuOTcgMS4wOSA2IDMuMDhjLTEuMjkgMS45NC0zLjUgMy4yMi02IDMuMjJ6Ii8+Cjwvc3ZnPgo8L3N2Zz4='">
                        <div class="whatsapp-info">
                            <h4>Daniel Wanjala</h4>
                            <span class="whatsapp-status">Data Scientist • Online</span>
                        </div>
                    </div>
                    <button class="whatsapp-close" onclick="portfolioGlobal.hideWhatsAppModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="whatsapp-body">
                    <div class="whatsapp-messages" id="whatsapp-messages">
                        <div class="whatsapp-message bot-message">
                            <p>👋 Hi! I'm Daniel. Type your message below and I'll take you to WhatsApp to continue our conversation!</p>
                            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                </div>
                <div class="whatsapp-footer">
                    <div class="whatsapp-input-container">
                        <input type="text" id="whatsapp-input" placeholder="Type a message..." maxlength="500">
                        <button id="whatsapp-send" onclick="portfolioGlobal.sendWhatsAppMessage()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 11L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add enter key listener
        const input = document.getElementById('whatsapp-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendWhatsAppMessage();
                }
            });
        }
    }

    showWhatsAppModal() {
        const modal = document.getElementById('whatsapp-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            
            // Focus input
            const input = document.getElementById('whatsapp-input');
            if (input) {
                setTimeout(() => input.focus(), 300);
            }
        }
    }

    hideWhatsAppModal() {
        const modal = document.getElementById('whatsapp-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }

    sendWhatsAppMessage() {
        const input = document.getElementById('whatsapp-input');
        const messagesContainer = document.getElementById('whatsapp-messages');
        
        if (!input || !messagesContainer) return;
        
        const message = input.value.trim();
        if (!message) return;

        // Add user message to chat
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'whatsapp-message user-message';
        userMessageDiv.innerHTML = `
            <p>${message}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        messagesContainer.appendChild(userMessageDiv);

        // Clear input
        input.value = '';

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Redirect to WhatsApp with the user's message
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
        
        // Add confirmation message
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'whatsapp-message bot-message';
        botMessageDiv.innerHTML = `
            <p>✅ Redirecting to WhatsApp now...</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Open WhatsApp after a brief delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            this.hideWhatsAppModal();
        }, 1000);
    }

    sendEmailFallback(message) {
        const subject = 'Portfolio Contact - WhatsApp Fallback';
        const body = `Hi Daniel,\n\n${message}\n\nBest regards,\nPortfolio Visitor`;
        const mailtoUrl = `mailto:daniel.machimbo@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open mailto link
        window.location.href = mailtoUrl;
    }

    // Responsive Navbar
    initResponsiveNavbar() {
        this.createMobileMenuToggle();
        this.highlightActivePage();
    }

    createMobileMenuToggle() {
        const nav = document.querySelector('nav');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!nav || !navMenu) return;

        // Create mobile toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
        mobileToggle.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;

        // Insert after logo
        const logo = nav.querySelector('.logo');
        if (logo) {
            logo.parentNode.insertBefore(mobileToggle, logo.nextSibling);
        }

        // Toggle functionality
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Adaptive Typography
    initAdaptiveTypography() {
        // Typography is handled in CSS with clamp() functions
        // This function can be used for any JS-based font adjustments
        this.adjustFontSizes();
    }

    adjustFontSizes() {
        // Monitor viewport changes and adjust if needed
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleViewportChange = (e) => {
            // Add any dynamic font size adjustments here if needed
            document.documentElement.style.setProperty(
                '--dynamic-scale', 
                e.matches ? '0.9' : '1'
            );
        };

        mediaQuery.addListener(handleViewportChange);
        handleViewportChange(mediaQuery);
    }

    // Smooth Animations
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll, .card, .project-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility Functions
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioGlobal = new PortfolioGlobal();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioGlobal;
}
