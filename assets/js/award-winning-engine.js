/**
 * CINEMATIC MOTION ENGINE - AWARD-WINNING ANIMATIONS
 * Performance-optimized vanilla JavaScript animation system
 * Reduced motion support | Accessibility-first design
 */

class CinematicEngine {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };
    
    this.init();
  }

  init() {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupAnimations();
        this.setupScrollNavbar();
        this.setupParallax();
        this.setupHeroAnimations();
        this.setupMobileMenu();
        this.setupFormAnimations();
      });
    } else {
      this.setupAnimations();
      this.setupScrollNavbar();
      this.setupParallax();
      this.setupHeroAnimations();
      this.setupMobileMenu();
      this.setupFormAnimations();
    }
  }

  // SCROLL REVEAL ANIMATIONS
  setupAnimations() {
    if (this.reducedMotion) return;

    // Create intersection observer for scroll reveals
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal, .stagger-children');
    revealElements.forEach(el => this.observer.observe(el));

    // Setup card hover animations
    this.setupCardAnimations();
  }

  animateElement(element) {
    if (element.classList.contains('stagger-children')) {
      this.staggerAnimation(element);
    } else {
      element.classList.add('visible');
    }
  }

  staggerAnimation(container) {
    container.classList.add('visible');
    const children = container.children;
    
    Array.from(children).forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('visible');
      }, index * 100); // 100ms stagger delay
    });
  }

  // CARD HOVER ANIMATIONS
  setupCardAnimations() {
    const cards = document.querySelectorAll('.card-hover, .project-card, .skill-item');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!this.reducedMotion) {
          card.style.transform = 'translateY(-8px) scale(1.02)';
          card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // NAVBAR SCROLL EFFECTS
  setupScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // PARALLAX EFFECTS
  setupParallax() {
    if (this.reducedMotion) return;

    const parallaxElements = document.querySelectorAll('.hero__video, .hero__overlay');
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
    };

    let ticking = false;
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // HERO ENTRANCE ANIMATIONS
  setupHeroAnimations() {
    if (this.reducedMotion) return;

    const heroContent = document.querySelector('.hero__content');
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroDescription = document.querySelector('.hero__description');
    const heroCTA = document.querySelector('.hero__cta');

    // Animate hero elements with staggered timing
    setTimeout(() => {
      if (heroTitle) heroTitle.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
      if (heroSubtitle) heroSubtitle.style.opacity = '1';
    }, 600);
    
    setTimeout(() => {
      if (heroDescription) heroDescription.style.opacity = '1';
    }, 900);
    
    setTimeout(() => {
      if (heroCTA) heroCTA.style.opacity = '1';
    }, 1200);
  }

  // MOBILE MENU ANIMATIONS
  setupMobileMenu() {
    const toggleButton = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.nav-mobile');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    if (!toggleButton || !mobileMenu) return;

    let isOpen = false;

    toggleButton.addEventListener('click', () => {
      isOpen = !isOpen;
      
      // Animate hamburger to X
      if (isOpen) {
        hamburgerLines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        hamburgerLines[1].style.opacity = '0';
        hamburgerLines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        
        mobileMenu.style.display = 'block';
        setTimeout(() => {
          mobileMenu.style.opacity = '1';
          mobileMenu.style.transform = 'translateY(0)';
        }, 10);
      } else {
        hamburgerLines.forEach(line => {
          line.style.transform = '';
          line.style.opacity = '';
        });
        
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 300);
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleButton.contains(e.target) && !mobileMenu.contains(e.target) && isOpen) {
        toggleButton.click();
      }
    });
  }

  // FORM ANIMATIONS
  setupFormAnimations() {
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    
    inputs.forEach(input => {
      const label = input.previousElementSibling;
      
      // Float label animation
      input.addEventListener('focus', () => {
        if (label) {
          label.style.transform = 'translateY(-20px) scale(0.8)';
          label.style.color = '#3b82f6';
        }
      });
      
      input.addEventListener('blur', () => {
        if (label && !input.value) {
          label.style.transform = '';
          label.style.color = '';
        }
      });
      
      // Check for pre-filled values
      if (input.value && label) {
        label.style.transform = 'translateY(-20px) scale(0.8)';
      }
    });
  }

  // UTILITY METHODS
  
  // SMOOTH SCROLL TO SECTIONS
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // LOADING ANIMATIONS
  showLoadingState(element) {
    element.innerHTML = `
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    `;
  }

  hideLoadingState(element, content) {
    element.style.opacity = '0';
    setTimeout(() => {
      element.innerHTML = content;
      element.style.opacity = '1';
    }, 150);
  }

  // TYPING ANIMATION
  typeWriter(element, text, speed = 50) {
    if (this.reducedMotion) {
      element.textContent = text;
      return;
    }

    let i = 0;
    element.textContent = '';
    
    const typing = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      }
    };
    
    typing();
  }

  // COUNTER ANIMATION
  animateCounter(element, start, end, duration = 2000) {
    if (this.reducedMotion) {
      element.textContent = end;
      return;
    }

    const startTimestamp = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }

  // PERFORMANCE MONITORING
  measurePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart + 'ms');
      });
    }
  }
}

// Initialize the cinematic engine
const cinematicEngine = new CinematicEngine();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CinematicEngine;
}
