/* ==========================================================================
   HERO VIDEO MANAGEMENT - EXACT SPECIFICATION
   ========================================================================== */

class HeroManager {
  constructor() {
    this.heroConfig = null;
    this.currentPage = this.getCurrentPage();
    this.heroElement = null;
    this.videoElement = null;
    this.overlayElement = null;
    this.observer = null;
    
    this.init();
  }
  
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '') || 'index';
  }
  
  async init() {
    try {
      console.log(`Initializing hero for page: ${this.currentPage}`);
      await this.loadHeroConfig();
      console.log('Hero config loaded:', this.heroConfig);
      this.setupHero();
      this.setupIntersectionObserver();
    } catch (error) {
      console.error('Hero initialization failed:', error);
      this.fallbackToImage();
    }
  }
  
  async loadHeroConfig() {
    try {
      const response = await fetch('assets/config/hero.json');
      if (!response.ok) {
        throw new Error(`Failed to load hero config: ${response.status}`);
      }
      this.heroConfig = await response.json();
    } catch (error) {
      console.error('Failed to load hero configuration:', error);
      throw error;
    }
  }
  
  setupHero() {
    this.heroElement = document.querySelector('.hero');
    this.videoElement = document.querySelector('.hero__bg');
    this.overlayElement = document.querySelector('.hero__overlay');
    
    if (!this.heroElement || !this.videoElement) {
      console.warn('Hero elements not found on page');
      return;
    }
    
    const pageConfig = this.heroConfig[this.currentPage];
    if (!pageConfig) {
      console.warn(`No hero config found for page: ${this.currentPage}`);
      this.fallbackToImage();
      return;
    }
    
    // Set video source and poster
    this.videoElement.src = pageConfig.video;
    this.videoElement.poster = pageConfig.fallback;
    
    // Also update the source element if it exists
    const sourceElement = this.videoElement.querySelector('source');
    if (sourceElement) {
      sourceElement.src = pageConfig.video;
    }
    
    // Force video to reload with new source
    this.videoElement.load();
    
    // Handle video load errors
    this.videoElement.addEventListener('error', () => {
      console.warn('Video failed to load, falling back to image');
      this.fallbackToImage(pageConfig.fallback);
    });
    
    // Handle successful video load
    this.videoElement.addEventListener('loadeddata', () => {
      console.log(`Hero video loaded successfully for ${this.currentPage}: ${pageConfig.video}`);
    });
    
    // Check if on mobile/narrow screen and use fallback
    if (window.innerWidth < 768) {
      this.fallbackToImage(pageConfig.fallback);
    }
  }
  
  fallbackToImage(fallbackImage = null) {
    if (!this.heroElement) return;
    
    const pageConfig = this.heroConfig?.[this.currentPage];
    const imageUrl = fallbackImage || pageConfig?.fallback || 'assets/images/chris-yang-1tnS_BVy9Jk-unsplash.jpg';
    
    // Hide video element
    if (this.videoElement) {
      this.videoElement.style.display = 'none';
    }
    
    // Set background image on hero element
    this.heroElement.style.backgroundImage = `url(${imageUrl})`;
    this.heroElement.style.backgroundSize = 'cover';
    this.heroElement.style.backgroundPosition = 'center';
  }
  
  setupIntersectionObserver() {
    if (!this.videoElement) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === this.heroElement) {
          if (entry.isIntersecting) {
            // Hero is visible, play video
            if (this.videoElement && !this.videoElement.paused) {
              return; // Already playing
            }
            this.playVideo();
          } else {
            // Hero is off-screen, pause video
            this.pauseVideo();
          }
        }
      });
    }, options);
    
    if (this.heroElement) {
      this.observer.observe(this.heroElement);
    }
  }
  
  playVideo() {
    if (this.videoElement && this.videoElement.style.display !== 'none') {
      this.videoElement.play().catch(error => {
        console.warn('Video autoplay failed:', error);
      });
    }
  }
  
  pauseVideo() {
    if (this.videoElement && !this.videoElement.paused) {
      this.videoElement.pause();
    }
  }
  
  // Handle window resize
  handleResize() {
    if (window.innerWidth < 768 && this.videoElement.style.display !== 'none') {
      const pageConfig = this.heroConfig?.[this.currentPage];
      this.fallbackToImage(pageConfig?.fallback);
    }
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}

// Initialize hero manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const heroManager = new HeroManager();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    heroManager.handleResize();
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    heroManager.destroy();
  });
});
