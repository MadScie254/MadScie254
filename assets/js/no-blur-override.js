/* ==========================================================================
   CINEMATIC ENGINE OVERRIDE - NO BLUR VERSION
   Remove any remaining blur effects while keeping smooth animations
   ========================================================================== */

// Override the original cinematic engine to remove blur effects
document.addEventListener('DOMContentLoaded', () => {
    // Remove any blur from page entrance
    const style = document.createElement('style');
    style.textContent = `
        /* Force remove all blur effects */
        *, *::before, *::after {
            filter: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
        
        /* Keep only essential glass effects on cards */
        .skill-card, .project-card, .card {
            backdrop-filter: blur(3px) !important;
            -webkit-backdrop-filter: blur(3px) !important;
            background: rgba(255, 255, 255, 0.9) !important;
        }
        
        /* Override page entrance animation */
        body {
            animation: pageEntranceClean 1.2s ease forwards !important;
            opacity: 0;
        }
        
        @keyframes pageEntranceClean {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Override reveal animations */
        .reveal {
            opacity: 0 !important;
            transform: translateY(30px) !important;
            transition: all 0.6s ease !important;
        }
        
        .reveal.active {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Ensure text is always readable */
        .hero-title-enhanced, .hero__title, .section-title,
        .hero-subtitle-enhanced, p, h1, h2, h3, h4, h5, h6 {
            filter: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Force remove any existing blur from elements
    setTimeout(() => {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.style.filter && el.style.filter.includes('blur')) {
                el.style.filter = 'none';
            }
            if (el.style.backdropFilter && el.style.backdropFilter.includes('blur')) {
                el.style.backdropFilter = 'none';
            }
        });
    }, 100);
    
    console.log('🎯 Blur effects removed - Crystal clear portfolio loaded!');
});
