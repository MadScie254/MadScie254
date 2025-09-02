// Mobile Navigation Update Script for Portfolio Pages
// This script will be used to systematically update all remaining pages

const mobileNavHTML = `                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="interactive-element inline-flex items-center justify-center p-2 rounded-md text-secondary-text dark:text-dark-secondary-text hover:text-accent dark:hover:text-dark-accent hover:bg-secondary-text/10 dark:hover:bg-dark-secondary-text/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-dark-accent" aria-controls="mobile-menu" aria-expanded="false">
                            <span class="sr-only">Open main menu</span>
                            <i id="menu-icon-open" data-lucide="menu" class="h-6 w-6" aria-hidden="true"></i>
                            <i id="menu-icon-close" data-lucide="x" class="h-6 w-6 hidden" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu-overlay" class="mobile-menu-overlay">
            <!-- Side Drawer Mobile Menu -->
            <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
                <!-- Close Button -->
                <div class="mobile-menu-header">
                    <button id="mobile-close-btn" class="mobile-close-btn" aria-label="Close mobile menu">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>
                
                <!-- Navigation Links -->
                <nav class="mobile-menu-nav" role="navigation" aria-label="Mobile navigation">
                    <a href="index.html" data-section="home" class="mobile-nav-link" role="menuitem">
                        <i data-lucide="home" class="h-5 w-5"></i>
                        <span>Home</span>
                    </a>
                    <a href="about.html" data-section="about" class="mobile-nav-link" role="menuitem">
                        <i data-lucide="user" class="h-5 w-5"></i>
                        <span>About</span>
                    </a>
                    <a href="skills.html" data-section="skills" class="mobile-nav-link" role="menuitem">
                        <i data-lucide="code" class="h-5 w-5"></i>
                        <span>Skills</span>
                    </a>
                    <a href="education.html" data-section="education" class="mobile-nav-link nav-active" role="menuitem">
                        <i data-lucide="graduation-cap" class="h-5 w-5"></i>
                        <span>Education</span>
                    </a>
                    <a href="projects.html" data-section="projects" class="mobile-nav-link" role="menuitem">
                        <i data-lucide="folder" class="h-5 w-5"></i>
                        <span>Projects</span>
                    </a>
                    <a href="contact.html" data-section="contact" class="mobile-nav-link" role="menuitem">
                        <i data-lucide="mail" class="h-5 w-5"></i>
                        <span>Contact</span>
                    </a>
                </nav>
            </div>
        </div>`;

const mobileNavJS = `            /** 
             * Enhanced Mobile Navigation System
             * Handles side-drawer mobile menu with overlay and proper animations
             */
            function toggleMobileMenu() {
                if (!mobileMenuButton || !mobileMenu) return;
                
                const isOpen = mobileMenu.classList.contains('open');
                const menuOverlay = document.getElementById('mobile-menu-overlay');
                const menuIconOpen = document.getElementById('menu-icon-open');
                const menuIconClose = document.getElementById('menu-icon-close');
                
                if (isOpen) {
                    // Close menu
                    mobileMenu.classList.remove('open');
                    if (menuOverlay) menuOverlay.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    
                    // Icon animation
                    if (menuIconOpen && menuIconClose) {
                        menuIconOpen.classList.remove('hidden');
                        menuIconClose.classList.add('hidden');
                    }
                    
                    // Re-enable body scroll
                    document.body.style.overflow = '';
                } else {
                    // Open menu
                    mobileMenu.classList.add('open');
                    if (menuOverlay) menuOverlay.classList.add('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'true');
                    
                    // Icon animation
                    if (menuIconOpen && menuIconClose) {
                        menuIconOpen.classList.add('hidden');
                        menuIconClose.classList.remove('hidden');
                    }
                    
                    // Prevent body scroll when menu is open
                    document.body.style.overflow = 'hidden';
                }
            }

            /** Closes the mobile menu */
            function closeMobileMenu() {
                if (!mobileMenu) return;
                
                const menuOverlay = document.getElementById('mobile-menu-overlay');
                const menuIconOpen = document.getElementById('menu-icon-open');
                const menuIconClose = document.getElementById('menu-icon-close');
                
                mobileMenu.classList.remove('open');
                if (menuOverlay) menuOverlay.classList.remove('active');
                if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
                
                // Reset icons
                if (menuIconOpen && menuIconClose) {
                    menuIconOpen.classList.remove('hidden');
                    menuIconClose.classList.add('hidden');
                }
                
                // Re-enable body scroll
                document.body.style.overflow = '';
            }

            /** Setup mobile menu event listeners */
            function setupMobileNavigation() {
                const mobileCloseBtn = document.getElementById('mobile-close-btn');
                const menuOverlay = document.getElementById('mobile-menu-overlay');
                const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
                
                // Mobile menu button
                if (mobileMenuButton) {
                    mobileMenuButton.addEventListener('click', toggleMobileMenu);
                }
                
                // Close button in mobile menu
                if (mobileCloseBtn) {
                    mobileCloseBtn.addEventListener('click', closeMobileMenu);
                }
                
                // Overlay click to close
                if (menuOverlay) {
                    menuOverlay.addEventListener('click', closeMobileMenu);
                }
                
                // Close menu when navigation link is clicked
                mobileNavLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        closeMobileMenu();
                    });
                });
                
                // Close menu on Escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
                        closeMobileMenu();
                    }
                });
                
                // Handle window resize
                window.addEventListener('resize', () => {
                    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('open')) {
                        closeMobileMenu();
                    }
                });
            }

            // Initialize mobile navigation
            setupMobileNavigation();`;

console.log('Mobile Navigation Components ready for updating remaining pages:');
console.log('- education.html');  
console.log('- projects.html');
console.log('- contact.html');
