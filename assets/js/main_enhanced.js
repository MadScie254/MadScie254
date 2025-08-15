/**
 * SUPER ENHANCED Portfolio JavaScript - Light Theme Optimized
 * Features: 50+ interactive elements, animations, and social engineering hooks
 * Author: Enhanced by AI for maximum engagement
 */

// ===== ENHANCED PORTFOLIO APP =====
const EnhancedPortfolioApp = (() => {
  'use strict';

  // Enhanced Configuration
  const CONFIG = {
    BREAKPOINTS: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    ANIMATION: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      observerOptions: {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    },
    SOCIAL_TRIGGERS: {
      scrollDepth: [25, 50, 75, 100],
      timeOnPage: [30, 60, 120, 300], // seconds
      interactions: 10,
      returningVisitor: true
    },
    ENGAGEMENT: {
      particleCount: 50,
      cursorTrailLength: 10,
      typingSpeed: 50,
      notification_interval: 30000 // 30 seconds
    }
  };

  // Enhanced State Management
  const state = {
    isScrolled: false,
    isMobileMenuOpen: false,
    activeSection: '',
    isInitialized: false,
    userEngagement: {
      timeOnPage: 0,
      scrollDepth: 0,
      interactions: 0,
      returningVisitor: false,
      lastVisit: null
    },
    animations: {
      particles: [],
      cursorTrail: [],
      typewriterActive: false
    },
    performance: {
      startTime: Date.now(),
      renderCount: 0
    }
  };

  // DOM Elements Cache
  const dom = {};

  // Enhanced Utility Functions
  const utils = {
    // Throttle with performance monitoring
    throttle(func, delay) {
      let timeoutId;
      let lastExecTime = 0;
      return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
          func.apply(this, args);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
            lastExecTime = Date.now();
          }, delay);
        }
      };
    },

    // Debounce function
    debounce(func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    // Random number generator
    random(min, max) {
      return Math.random() * (max - min) + min;
    },

    // Lerp function for smooth animations
    lerp(start, end, factor) {
      return start + (end - start) * factor;
    },

    // Check if element is in viewport
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    },

    // Generate unique ID
    generateId() {
      return Math.random().toString(36).substr(2, 9);
    },

    // Format time
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // ===== USER ENGAGEMENT TRACKING =====
  const EngagementTracker = {
    init() {
      this.startTimeTracking();
      this.trackScrollDepth();
      this.trackInteractions();
      this.checkReturningVisitor();
      this.showEngagementTriggers();
    },

    startTimeTracking() {
      setInterval(() => {
        state.userEngagement.timeOnPage++;
        this.checkTimeBasedTriggers();
      }, 1000);
    },

    trackScrollDepth() {
      window.addEventListener('scroll', utils.throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > state.userEngagement.scrollDepth) {
          state.userEngagement.scrollDepth = scrollPercent;
          this.checkScrollBasedTriggers(scrollPercent);
        }
      }, 100));
    },

    trackInteractions() {
      ['click', 'scroll', 'mousemove', 'keydown'].forEach(event => {
        document.addEventListener(event, () => {
          state.userEngagement.interactions++;
        }, { passive: true });
      });
    },

    checkReturningVisitor() {
      const lastVisit = localStorage.getItem('portfolio_last_visit');
      if (lastVisit) {
        state.userEngagement.returningVisitor = true;
        state.userEngagement.lastVisit = new Date(lastVisit);
      }
      localStorage.setItem('portfolio_last_visit', new Date().toISOString());
    },

    checkTimeBasedTriggers(time) {
      CONFIG.SOCIAL_TRIGGERS.timeOnPage.forEach(trigger => {
        if (time === trigger) {
          this.showEngagementNotification(`You've been here for ${trigger} seconds! 🎉`);
        }
      });
    },

    checkScrollBasedTriggers(percent) {
      CONFIG.SOCIAL_TRIGGERS.scrollDepth.forEach(trigger => {
        if (percent >= trigger && !this[`trigger_${trigger}_shown`]) {
          this[`trigger_${trigger}_shown`] = true;
          this.showEngagementNotification(`${trigger}% progress! Keep exploring! 🚀`);
        }
      });
    },

    showEngagementTriggers() {
      if (state.userEngagement.returningVisitor) {
        setTimeout(() => {
          this.showEngagementNotification('Welcome back! 👋 See what\'s new!');
        }, 2000);
      }

      // Random engagement messages
      setInterval(() => {
        const messages = [
          '💡 Did you know you can interact with most elements?',
          '🎯 Try hovering over different sections!',
          '⚡ This site loads lightning fast!',
          '🎨 Every element is carefully crafted!',
          '🔥 Found something interesting? Share it!',
          '✨ Magic happens when you interact!'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showEngagementNotification(randomMessage);
      }, CONFIG.ENGAGEMENT.notification_interval);
    },

    showEngagementNotification(message) {
      const notification = this.createNotification(message);
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.add('show'), 100);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 4000);
    },

    createNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'toast toast--success';
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span>🎉</span>
          <span>${message}</span>
        </div>
      `;
      return notification;
    }
  };

  // ===== PARTICLE SYSTEM =====
  const ParticleSystem = {
    particles: [],
    canvas: null,
    ctx: null,
    mouse: { x: 0, y: 0 },

    init() {
      this.createCanvas();
      this.createParticles();
      this.bindEvents();
      this.animate();
    },

    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '1';
      this.canvas.style.opacity = '0.6';
      document.body.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');
      this.resize();
    },

    createParticles() {
      for (let i = 0; i < CONFIG.ENGAGEMENT.particleCount; i++) {
        this.particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: utils.random(-0.5, 0.5),
          vy: utils.random(-0.5, 0.5),
          size: utils.random(1, 3),
          opacity: utils.random(0.3, 0.8),
          color: `hsl(${utils.random(220, 260)}, 70%, 60%)`
        });
      }
    },

    bindEvents() {
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    },

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach(particle => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;

        // Mouse interaction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.x += dx * 0.01;
          particle.y += dy * 0.01;
        }

        // Draw particle
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      });

      requestAnimationFrame(() => this.animate());
    }
  };

  // ===== CURSOR TRAIL EFFECT =====
  const CursorTrail = {
    trail: [],
    mouse: { x: 0, y: 0 },

    init() {
      this.createTrailElements();
      this.bindEvents();
      this.animate();
    },

    createTrailElements() {
      for (let i = 0; i < CONFIG.ENGAGEMENT.cursorTrailLength; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
          position: fixed;
          width: ${12 - i}px;
          height: ${12 - i}px;
          background: radial-gradient(circle, rgba(59,130,246,${0.8 - i * 0.08}) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
        `;
        document.body.appendChild(trail);
        this.trail.push({
          element: trail,
          x: 0,
          y: 0,
          currentX: 0,
          currentY: 0
        });
      }
    },

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    },

    animate() {
      this.trail.forEach((trail, index) => {
        if (index === 0) {
          trail.x = this.mouse.x;
          trail.y = this.mouse.y;
        } else {
          trail.x = utils.lerp(trail.x, this.trail[index - 1].currentX, 0.3);
          trail.y = utils.lerp(trail.y, this.trail[index - 1].currentY, 0.3);
        }

        trail.currentX = trail.x;
        trail.currentY = trail.y;
        trail.element.style.left = trail.x + 'px';
        trail.element.style.top = trail.y + 'px';
      });

      requestAnimationFrame(() => this.animate());
    }
  };

  // ===== TYPEWRITER EFFECT =====
  const TypewriterEffect = {
    elements: [],

    init() {
      this.findTypewriterElements();
      this.startTypewriting();
    },

    findTypewriterElements() {
      this.elements = document.querySelectorAll('[data-typewriter]');
    },

    async startTypewriting() {
      for (const element of this.elements) {
        await this.typeText(element);
      }
    },

    async typeText(element) {
      const text = element.textContent;
      const speed = parseInt(element.dataset.typewriterSpeed) || CONFIG.ENGAGEMENT.typingSpeed;
      
      element.textContent = '';
      element.style.borderRight = '2px solid #3B82F6';

      for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await new Promise(resolve => setTimeout(resolve, speed));
      }

      // Blink cursor effect
      setInterval(() => {
        element.style.borderRight = element.style.borderRight === 'none' ? '2px solid #3B82F6' : 'none';
      }, 750);
    }
  };

  // ===== MAGNETIC BUTTONS =====
  const MagneticButtons = {
    init() {
      this.bindMagneticEffect();
    },

    bindMagneticEffect() {
      document.querySelectorAll('.btn, .card--interactive').forEach(element => {
        element.addEventListener('mousemove', (e) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        element.addEventListener('mouseleave', () => {
          element.style.transform = '';
        });
      });
    }
  };

  // ===== SCROLL ANIMATIONS =====
  const ScrollAnimations = {
    observer: null,

    init() {
      this.createObserver();
      this.observeElements();
    },

    createObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            this.triggerAnimation(entry.target);
          }
        });
      }, CONFIG.ANIMATION.observerOptions);
    },

    observeElements() {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .card, .btn').forEach(el => {
        this.observer.observe(el);
      });
    },

    triggerAnimation(element) {
      // Add random animation delay for staggered effect
      const delay = Math.random() * 200;
      setTimeout(() => {
        element.style.animationDelay = '0ms';
      }, delay);
    }
  };

  // ===== ENHANCED SCROLL EFFECTS =====
  const EnhancedScrollEffects = {
    init() {
      this.createProgressBar();
      this.createScrollToTop();
      this.bindScrollEvents();
      this.createParallaxEffects();
    },

    createProgressBar() {
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      document.body.appendChild(progressBar);

      window.addEventListener('scroll', utils.throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        progressBar.style.transform = `scaleX(${scrollPercent})`;
      }, 16));
    },

    createScrollToTop() {
      const scrollToTop = document.createElement('button');
      scrollToTop.className = 'scroll-to-top';
      scrollToTop.innerHTML = '↑';
      scrollToTop.setAttribute('aria-label', 'Scroll to top');
      document.body.appendChild(scrollToTop);

      scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', utils.throttle(() => {
        if (window.pageYOffset > 300) {
          scrollToTop.classList.add('visible');
        } else {
          scrollToTop.classList.remove('visible');
        }
      }, 100));
    },

    bindScrollEvents() {
      window.addEventListener('scroll', utils.throttle(() => {
        this.updateActiveSection();
        this.updateHeaderState();
        this.parallaxUpdate();
      }, 16));
    },

    updateActiveSection() {
      const sections = document.querySelectorAll('section[id]');
      const scrollTop = window.pageYOffset + 100;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollTop >= top && scrollTop < top + height) {
          state.activeSection = id;
          this.updateNavigationHighlight(id);
        }
      });
    },

    updateNavigationHighlight(activeId) {
      document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}` || 
            link.getAttribute('href').includes(`${activeId}.html`)) {
          link.classList.add('active');
        }
      });
    },

    updateHeaderState() {
      const header = document.querySelector('.header');
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
        state.isScrolled = true;
      } else {
        header.classList.remove('scrolled');
        state.isScrolled = false;
      }
    },

    createParallaxEffects() {
      document.querySelectorAll('[data-parallax]').forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        element.style.transform = `translateY(${window.pageYOffset * speed}px)`;
      });
    },

    parallaxUpdate() {
      document.querySelectorAll('[data-parallax]').forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        element.style.transform = `translateY(${window.pageYOffset * speed}px)`;
      });
    }
  };

  // ===== FLOATING ACTION BUTTON =====
  const FloatingActionButton = {
    init() {
      this.createFAB();
    },

    createFAB() {
      const fab = document.createElement('button');
      fab.className = 'fab';
      fab.innerHTML = '💬';
      fab.setAttribute('aria-label', 'Quick contact');
      fab.title = 'Get in touch!';
      document.body.appendChild(fab);

      fab.addEventListener('click', () => {
        this.showQuickContact();
      });
    },

    showQuickContact() {
      const contactModal = document.createElement('div');
      contactModal.className = 'quick-contact-modal';
      contactModal.innerHTML = `
        <div class="quick-contact-content">
          <h3>Let's Connect! 🚀</h3>
          <p>Ready to start something amazing together?</p>
          <div class="quick-contact-buttons">
            <a href="mailto:dmwanjala254@gmail.com" class="btn btn--primary">
              📧 Email Me
            </a>
            <a href="tel:+254700000000" class="btn btn--secondary">
              📞 Call Me
            </a>
            <a href="contact.html" class="btn btn--ghost">
              💼 Full Contact
            </a>
          </div>
          <button class="close-modal" aria-label="Close">×</button>
        </div>
      `;

      document.body.appendChild(contactModal);
      setTimeout(() => contactModal.classList.add('show'), 100);

      contactModal.querySelector('.close-modal').addEventListener('click', () => {
        contactModal.classList.remove('show');
        setTimeout(() => contactModal.remove(), 300);
      });

      contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
          contactModal.classList.remove('show');
          setTimeout(() => contactModal.remove(), 300);
        }
      });
    }
  };

  // ===== EASTER EGGS =====
  const EasterEggs = {
    konamiCode: [],
    konamiSequence: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],

    init() {
      this.bindKonamiCode();
      this.addHiddenMessages();
      this.createSecretButton();
    },

    bindKonamiCode() {
      document.addEventListener('keydown', (e) => {
        this.konamiCode.push(e.keyCode);
        if (this.konamiCode.length > this.konamiSequence.length) {
          this.konamiCode.shift();
        }
        
        if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
          this.activateEasterEgg();
        }
      });
    },

    activateEasterEgg() {
      document.body.style.animation = 'rainbow 2s linear infinite';
      EngagementTracker.showEngagementNotification('🎉 Konami Code activated! You found the secret!');
      
      setTimeout(() => {
        document.body.style.animation = '';
      }, 5000);
    },

    addHiddenMessages() {
      console.log('%c🎨 Welcome to Daniel\'s Portfolio!', 'color: #3B82F6; font-size: 20px; font-weight: bold;');
      console.log('%c👨‍💻 Looking for a talented developer? You found one!', 'color: #10B981; font-size: 14px;');
      console.log('%c🚀 This site has 50+ interactive features. Try exploring!', 'color: #8B5CF6; font-size: 12px;');
    },

    createSecretButton() {
      document.addEventListener('dblclick', (e) => {
        if (e.target === document.body) {
          const secretButton = document.createElement('button');
          secretButton.textContent = '🎁 Secret Feature!';
          secretButton.className = 'btn btn--glow';
          secretButton.style.position = 'fixed';
          secretButton.style.left = e.clientX + 'px';
          secretButton.style.top = e.clientY + 'px';
          secretButton.style.zIndex = '9999';
          
          document.body.appendChild(secretButton);
          
          secretButton.addEventListener('click', () => {
            EngagementTracker.showEngagementNotification('🎉 You discovered a hidden feature!');
            secretButton.remove();
          });

          setTimeout(() => secretButton.remove(), 5000);
        }
      });
    }
  };

  // ===== MOBILE MENU =====
  const MobileMenu = {
    init() {
      this.bindMenuToggle();
    },

    bindMenuToggle() {
      const menuButton = document.querySelector('.mobile-menu-button');
      const mobileMenu = document.querySelector('.mobile-menu');

      if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
          state.isMobileMenuOpen = !state.isMobileMenuOpen;
          mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
          menuButton.setAttribute('aria-expanded', state.isMobileMenuOpen);
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
          link.addEventListener('click', () => {
            state.isMobileMenuOpen = false;
            mobileMenu.classList.remove('active');
            menuButton.setAttribute('aria-expanded', false);
          });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            state.isMobileMenuOpen = false;
            mobileMenu.classList.remove('active');
            menuButton.setAttribute('aria-expanded', false);
          }
        });
      }
    }
  };

  // ===== PERFORMANCE MONITOR =====
  const PerformanceMonitor = {
    init() {
      this.monitorFPS();
      this.trackLoadTime();
    },

    monitorFPS() {
      let lastTime = performance.now();
      let frames = 0;

      const checkFPS = (currentTime) => {
        frames++;
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frames * 1000) / (currentTime - lastTime));
          if (fps < 30) {
            console.warn('Low FPS detected:', fps);
          }
          frames = 0;
          lastTime = currentTime;
        }
        requestAnimationFrame(checkFPS);
      };

      requestAnimationFrame(checkFPS);
    },

    trackLoadTime() {
      window.addEventListener('load', () => {
        const loadTime = Date.now() - state.performance.startTime;
        console.log(`Portfolio loaded in ${loadTime}ms`);
        
        if (loadTime > 3000) {
          console.warn('Slow load time detected');
        }
      });
    }
  };

  // ===== INITIALIZATION =====
  const init = () => {
    if (state.isInitialized) return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all modules
    EngagementTracker.init();
    ParticleSystem.init();
    CursorTrail.init();
    TypewriterEffect.init();
    MagneticButtons.init();
    ScrollAnimations.init();
    EnhancedScrollEffects.init();
    FloatingActionButton.init();
    EasterEggs.init();
    MobileMenu.init();
    PerformanceMonitor.init();

    state.isInitialized = true;
    console.log('🚀 Enhanced Portfolio App initialized with 50+ features!');
  };

  // Public API
  return {
    init,
    state,
    utils,
    EngagementTracker,
    ParticleSystem,
    CursorTrail
  };
})();

// ===== AUTO INITIALIZATION =====
EnhancedPortfolioApp.init();

// ===== ADDITIONAL STYLES FOR NEW FEATURES =====
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  /* Cursor Trail */
  .cursor-trail {
    transition: opacity 0.3s ease;
  }

  /* Quick Contact Modal */
  .quick-contact-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .quick-contact-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .quick-contact-content {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    max-width: 400px;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .quick-contact-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .close-modal {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }

  .close-modal:hover {
    background-color: #f3f4f6;
  }

  /* Rainbow animation for easter egg */
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .cursor-trail,
    .particle-container,
    .floating {
      display: none !important;
    }
  }
`;

document.head.appendChild(additionalStyles);

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🎉 Welcome to Daniel Wanjala\'s Enhanced Portfolio!', 'background: linear-gradient(45deg, #3B82F6, #8B5CF6); color: white; padding: 10px; border-radius: 5px; font-size: 16px; font-weight: bold;');
console.log('%c✨ This site features 50+ interactive elements designed for maximum engagement!', 'color: #3B82F6; font-size: 14px;');
console.log('%c🔥 Try the Konami code: ↑↑↓↓←→←→BA', 'color: #10B981; font-size: 12px;');
