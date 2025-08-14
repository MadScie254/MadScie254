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
        
        /* FORCE ALL TEXT TO BE VISIBLE AND READABLE */
        body, main, section, div, p, h1, h2, h3, h4, h5, h6, span, a, li,
        .hero-content, .hero-title-enhanced, .hero-subtitle-enhanced,
        .section-title, .section-subtitle, .about-text, .lead-text,
        .skill-card__title, .project-title, .project-description,
        .contact-info, .education-content {
            color: #1a202c !important;
            opacity: 1 !important;
            visibility: visible !important;
            text-shadow: none !important;
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
            color: #1a202c !important;
        }
        
        /* Fix gradient text to be solid */
        .hero-title-enhanced {
            background: none !important;
            -webkit-background-clip: unset !important;
            -webkit-text-fill-color: #1e293b !important;
            background-clip: unset !important;
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
            // Force text color
            if (el.tagName.match(/^(P|H[1-6]|SPAN|DIV|A|LI)$/)) {
                el.style.color = '#1a202c';
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            }
        });
    }, 100);
    
    // Fix hero title specifically
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title-enhanced');
        if (heroTitle) {
            heroTitle.style.color = '#1e293b';
            heroTitle.style.background = 'none';
            heroTitle.style.webkitBackgroundClip = 'unset';
            heroTitle.style.webkitTextFillColor = '#1e293b';
        }
        
        // Fix all section content
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            const textElements = section.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
            textElements.forEach(el => {
                el.style.color = '#1a202c';
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            });
        });
    }, 200);
    
    console.log('🎯 Text visibility forced - All content should be readable now!');
});
});
