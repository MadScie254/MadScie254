// ==========================================================================
// ADVANCED API INTEGRATIONS - BREATHING LIFE INTO THE PORTFOLIO
// ==========================================================================

class AdvancedAPIManager {
    constructor() {
        this.init();
        this.loadedAPIs = new Set();
        this.dataCache = new Map();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllAPIs());
        } else {
            this.loadAllAPIs();
        }
    }

    async loadAllAPIs() {
        // Load multiple APIs in parallel for maximum performance
        const apiPromises = [
            this.loadRealTimeLocation(),
            this.loadTechNewsAPI(),
            this.loadCryptocurrencyAPI(),
            this.loadMotivationalAPI(),
            this.loadTypingAnimationAPI(),
            this.loadVisitorCounterAPI(),
            this.loadGitHubActivityAPI(),
            this.loadWeatherWithAdvancedFeatures(),
            this.loadRandomFactsAPI(),
            this.loadQuoteOfTheDayAPI()
        ];

        try {
            await Promise.allSettled(apiPromises);
            this.startPeriodicUpdates();
        } catch (error) {
            console.log('Some APIs failed to load, using fallbacks');
        }
    }

    // ==========================================================================
    // REAL-TIME LOCATION & TIME API
    // ==========================================================================
    async loadRealTimeLocation() {
        try {
            const response = await fetch('https://worldtimeapi.org/api/timezone/Africa/Nairobi');
            const timeData = await response.json();
            
            this.displayRealTimeWidget(timeData);
            this.startRealTimeClock(timeData.timezone);
        } catch (error) {
            console.log('Time API fallback');
            this.displayRealTimeWidget({
                datetime: new Date().toISOString(),
                timezone: 'Africa/Nairobi'
            });
        }
    }

    displayRealTimeWidget(timeData) {
        const timeHTML = `
            <div class="real-time-widget glow-on-hover" style="
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                padding: 1rem;
                border-radius: 12px;
                margin: 1rem 0;
                text-align: center;
                box-shadow: 0 8px 32px rgba(30, 60, 114, 0.3);
                position: relative;
                overflow: hidden;
            ">
                <div class="time-header" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <i class="fas fa-clock" style="font-size: 1.2rem;"></i>
                    <h4 style="margin: 0; font-size: 1rem;">Nairobi Time</h4>
                </div>
                <div id="live-time" style="font-size: 1.5rem; font-weight: bold; font-family: 'Courier New', monospace;">
                    ${new Date(timeData.datetime).toLocaleTimeString()}
                </div>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem;">
                    ${new Date(timeData.datetime).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
            </div>
        `;
        
        const targetContainer = document.querySelector('.hero .container') || document.querySelector('.container');
        if (targetContainer) {
            targetContainer.insertAdjacentHTML('beforeend', timeHTML);
        }
    }

    startRealTimeClock(timezone) {
        setInterval(() => {
            const timeElement = document.getElementById('live-time');
            if (timeElement) {
                const now = new Date();
                timeElement.textContent = now.toLocaleTimeString();
                timeElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    timeElement.style.transform = 'scale(1)';
                }, 100);
            }
        }, 1000);
    }

    // ==========================================================================
    // TECH NEWS API
    // ==========================================================================
    async loadTechNewsAPI() {
        try {
            // Using NewsAPI alternative or JSONPlaceholder for demo
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
            const newsData = await response.json();
            
            this.displayTechNews(newsData);
        } catch (error) {
            console.log('News API fallback');
            this.displayTechNews([
                { title: "Latest in AI: Machine Learning Breakthroughs", body: "Exploring the latest developments in artificial intelligence..." },
                { title: "Data Science Trends 2025", body: "Key trends shaping the future of data science..." },
                { title: "Cloud Computing Evolution", body: "How cloud platforms are revolutionizing development..." }
            ]);
        }
    }

    displayTechNews(newsData) {
        const newsHTML = `
            <div class="tech-news-widget" style="
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                padding: 1.5rem;
                margin: 2rem 0;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            ">
                <h3 style="color: #1a202c; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-newspaper"></i> Latest Tech Insights
                </h3>
                <div class="news-scroll" style="max-height: 200px; overflow-y: auto;">
                    ${newsData.map((article, index) => `
                        <div class="news-item" style="
                            padding: 0.75rem;
                            border-left: 3px solid #667eea;
                            margin-bottom: 1rem;
                            background: rgba(102, 126, 234, 0.05);
                            border-radius: 0 8px 8px 0;
                            transition: all 0.3s ease;
                            cursor: pointer;
                        " onmouseover="this.style.background='rgba(102, 126, 234, 0.1)'" 
                           onmouseout="this.style.background='rgba(102, 126, 234, 0.05)'">
                            <h4 style="color: #1a202c; font-size: 0.9rem; margin-bottom: 0.5rem;">
                                ${article.title}
                            </h4>
                            <p style="color: #4a5568; font-size: 0.8rem; margin: 0;">
                                ${article.body ? article.body.substring(0, 100) + '...' : 'Latest developments in technology...'}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        if (window.location.pathname.includes('about.html')) {
            const aboutContainer = document.querySelector('.section .container');
            if (aboutContainer) {
                aboutContainer.insertAdjacentHTML('beforeend', newsHTML);
            }
        }
    }

    // ==========================================================================
    // CRYPTOCURRENCY TRACKER
    // ==========================================================================
    async loadCryptocurrencyAPI() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
            const cryptoData = await response.json();
            
            this.displayCryptoWidget(cryptoData);
        } catch (error) {
            console.log('Crypto API fallback');
            this.displayCryptoWidget({
                bitcoin: { usd: 45000, usd_24h_change: 2.5 },
                ethereum: { usd: 3200, usd_24h_change: -1.2 }
            });
        }
    }

    displayCryptoWidget(cryptoData) {
        const cryptoHTML = `
            <div class="crypto-widget gradient-shift" style="
                padding: 1rem;
                border-radius: 12px;
                margin: 1rem 0;
                color: white;
                text-align: center;
                position: relative;
                overflow: hidden;
            ">
                <h4 style="margin: 0 0 0.5rem 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <i class="fab fa-bitcoin"></i> Crypto Tracker
                </h4>
                <div style="display: flex; justify-content: space-around; align-items: center;">
                    <div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">BTC</div>
                        <div style="font-weight: bold;">$${cryptoData.bitcoin?.usd.toLocaleString() || '45,000'}</div>
                        <div style="font-size: 0.8rem; color: ${(cryptoData.bitcoin?.usd_24h_change || 2.5) >= 0 ? '#4ade80' : '#f87171'};">
                            ${(cryptoData.bitcoin?.usd_24h_change || 2.5) >= 0 ? '↗' : '↘'} ${Math.abs(cryptoData.bitcoin?.usd_24h_change || 2.5).toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">ETH</div>
                        <div style="font-weight: bold;">$${cryptoData.ethereum?.usd.toLocaleString() || '3,200'}</div>
                        <div style="font-size: 0.8rem; color: ${(cryptoData.ethereum?.usd_24h_change || -1.2) >= 0 ? '#4ade80' : '#f87171'};">
                            ${(cryptoData.ethereum?.usd_24h_change || -1.2) >= 0 ? '↗' : '↘'} ${Math.abs(cryptoData.ethereum?.usd_24h_change || -1.2).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.querySelector('.hero .container') || document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('beforeend', cryptoHTML);
        }
    }

    // ==========================================================================
    // VISITOR COUNTER API
    // ==========================================================================
    async loadVisitorCounterAPI() {
        try {
            // Simulate visitor counter (in real implementation, use a backend service)
            const storedCount = localStorage.getItem('visitorCount') || 1247;
            const currentCount = parseInt(storedCount) + Math.floor(Math.random() * 3);
            localStorage.setItem('visitorCount', currentCount);
            
            this.displayVisitorCounter(currentCount);
        } catch (error) {
            console.log('Visitor counter fallback');
            this.displayVisitorCounter(1250);
        }
    }

    displayVisitorCounter(count) {
        const counterHTML = `
            <div class="visitor-counter" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 25px;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                margin: 1rem 0;
                font-size: 0.9rem;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                animation: pulse 2s infinite;
            ">
                <i class="fas fa-eye"></i>
                <span>Visitors: </span>
                <span id="visitor-count" style="font-weight: bold; font-family: 'Courier New', monospace;">
                    ${count.toLocaleString()}
                </span>
            </div>
        `;
        
        const footer = document.querySelector('.footer .container') || document.querySelector('.hero .container');
        if (footer) {
            footer.insertAdjacentHTML('beforeend', counterHTML);
        }
    }

    // ==========================================================================
    // TYPING ANIMATION API
    // ==========================================================================
    loadTypingAnimationAPI() {
        const typingTexts = [
            "Data Scientist & ML Engineer",
            "Turning Data into Insights",
            "Building Intelligent Solutions",
            "Driving Business Innovation",
            "Creating Predictive Models"
        ];
        
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentText = typingTexts[currentTextIndex];
            const typingElement = document.querySelector('.typewriter-text');
            
            if (!typingElement) {
                // Create typing element if it doesn't exist
                const heroSubtitle = document.querySelector('.hero__subtitle, .hero-subtitle');
                if (heroSubtitle) {
                    heroSubtitle.innerHTML = '<span class="typewriter-text"></span>';
                }
                return;
            }
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && currentCharIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
                typeSpeed = 500; // Pause before next text
            }
            
            setTimeout(typeEffect, typeSpeed);
        };
        
        // Start typing effect if on homepage
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            setTimeout(typeEffect, 1000);
        }
    }

    // ==========================================================================
    // PERIODIC UPDATES
    // ==========================================================================
    startPeriodicUpdates() {
        // Update crypto prices every 5 minutes
        setInterval(() => {
            this.loadCryptocurrencyAPI();
        }, 5 * 60 * 1000);
        
        // Update news every 30 minutes
        setInterval(() => {
            this.loadTechNewsAPI();
        }, 30 * 60 * 1000);
        
        // Update visitor count periodically
        setInterval(() => {
            const currentCount = parseInt(localStorage.getItem('visitorCount') || 1250);
            const newCount = currentCount + Math.floor(Math.random() * 2);
            localStorage.setItem('visitorCount', newCount);
            
            const countElement = document.getElementById('visitor-count');
            if (countElement) {
                countElement.textContent = newCount.toLocaleString();
                countElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    countElement.style.transform = 'scale(1)';
                }, 200);
            }
        }, 2 * 60 * 1000);
    }

    // ==========================================================================
    // RANDOM TECH FACTS API
    // ==========================================================================
    async loadRandomFactsAPI() {
        const techFacts = [
            "Python is named after the British comedy group Monty Python",
            "The first computer bug was an actual bug - a moth found in a Harvard computer in 1947",
            "Google processes over 8.5 billion searches per day",
            "The term 'algorithm' comes from the 9th-century mathematician Al-Khwarizmi",
            "Machine Learning was coined in 1959 by Arthur Samuel",
            "The first neural network was created in 1943"
        ];
        
        const randomFact = techFacts[Math.floor(Math.random() * techFacts.length)];
        
        const factHTML = `
            <div class="tech-fact-widget" style="
                background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                padding: 1rem;
                border-radius: 12px;
                margin: 1rem 0;
                border-left: 4px solid #f59e0b;
                position: relative;
                overflow: hidden;
            ">
                <h4 style="color: #92400e; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-lightbulb"></i> Tech Fact
                </h4>
                <p style="color: #92400e; margin: 0; font-style: italic;">
                    "${randomFact}"
                </p>
            </div>
        `;
        
        if (window.location.pathname.includes('skills.html')) {
            const skillsContainer = document.querySelector('.section .container');
            if (skillsContainer) {
                skillsContainer.insertAdjacentHTML('beforeend', factHTML);
            }
        }
    }
}

// Initialize the advanced API manager
new AdvancedAPIManager();
