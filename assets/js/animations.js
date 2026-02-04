// ==========================================
// ANIMATIONS.JS - Custom GSAP animations
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Animation
    gsap.from('.navbar', {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Hero Content Animation
    gsap.from('.hero-content', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });

    // Stats Animation
    gsap.from('.stat-card', {
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Project Cards Animation
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.featured-projects',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Tech Stack Animation
    gsap.from('.tech-item', {
      scrollTrigger: {
        trigger: '.tech-stack',
        start: 'top 80%'
      },
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    });
  }
});
