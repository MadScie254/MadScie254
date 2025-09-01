/**
 * Comprehensive API Data Manager for Daniel Wanjala Portfolio
 * Manages real-time data from multiple APIs with caching and error handling
 */

class APIDataManager {
    constructor() {
        this.baseUrl = './assets/api-snapshots/';
        this.cache = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        this.lastFetch = null;
        
        // API endpoints configuration
        this.endpoints = {
            github: {
                file: 'github-profile.json',
                cacheDuration: 3600000, // 1 hour
                fallback: this.getGitHubFallback.bind(this)
            },
            news: {
                file: 'tech-news.json',
                cacheDuration: 7200000, // 2 hours
                fallback: this.getNewsFallback.bind(this)
            },
            weather: {
                file: 'weather.json',
                cacheDuration: 1800000, // 30 minutes
                fallback: this.getWeatherFallback.bind(this)
            },
            crypto: {
                file: 'crypto.json',
                cacheDuration: 900000, // 15 minutes
                fallback: this.getCryptoFallback.bind(this)
            },
            quotes: {
                file: 'quotes.json',
                cacheDuration: 86400000, // 24 hours
                fallback: this.getQuotesFallback.bind(this)
            },
            wikipedia: {
                file: 'wikipedia.json',
                cacheDuration: 86400000, // 24 hours
                fallback: this.getWikipediaFallback.bind(this)
            },
            time: {
                file: 'worldtime.json',
                cacheDuration: 300000, // 5 minutes
                fallback: this.getTimeFallback.bind(this)
            },
            hackernews: {
                file: 'hackernews.json',
                cacheDuration: 1800000, // 30 minutes
                fallback: this.getHackerNewsFallback.bind(this)
            }
        };

        // Initialize
        this.init();
    }

    async init() {
        console.log('🚀 Initializing API Data Manager...');
        
        // Preload critical data
        await this.preloadCriticalData();
        
        // Set up periodic refresh
        this.setupPeriodicRefresh();
        
        console.log('✅ API Data Manager initialized successfully');
    }

    async preloadCriticalData() {
        const criticalAPIs = ['github', 'quotes', 'time'];
        
        try {
            await Promise.all(
                criticalAPIs.map(api => this.getData(api))
            );
            console.log('📦 Critical data preloaded');
        } catch (error) {
            console.warn('⚠️ Some critical data failed to preload:', error);
        }
    }

    setupPeriodicRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            this.refreshExpiredData();
        }, 300000);
    }

    async refreshExpiredData() {
        const now = Date.now();
        
        for (const [api, data] of this.cache.entries()) {
            if (data.expiresAt && data.expiresAt < now) {
                console.log(`🔄 Refreshing expired data for ${api}`);
                try {
                    await this.getData(api, true); // Force refresh
                } catch (error) {
                    console.warn(`Failed to refresh ${api}:`, error);
                }
            }
        }
    }

    async getData(apiName, forceRefresh = false) {
        const config = this.endpoints[apiName];
        if (!config) {
            throw new Error(`Unknown API: ${apiName}`);
        }

        // Check cache first
        if (!forceRefresh && this.cache.has(apiName)) {
            const cached = this.cache.get(apiName);
            if (cached.expiresAt > Date.now()) {
                return cached.data;
            }
        }

        try {
            const response = await this.fetchWithRetry(config.file);
            const rawData = await response.json();
            
            // Extract data and validate
            const data = rawData.data || rawData;
            const metadata = rawData.metadata || {};
            
            // Cache the data
            this.cache.set(apiName, {
                data,
                metadata,
                fetchedAt: Date.now(),
                expiresAt: Date.now() + config.cacheDuration
            });

            console.log(`📊 Loaded ${apiName} data:`, {
                size: JSON.stringify(data).length,
                fetched: metadata.fetched_at || 'unknown'
            });

            return data;

        } catch (error) {
            console.warn(`Failed to fetch ${apiName} data:`, error);
            
            // Try fallback data
            if (config.fallback) {
                console.log(`🔄 Using fallback data for ${apiName}`);
                return config.fallback();
            }
            
            throw error;
        }
    }

    async fetchWithRetry(file) {
        const url = this.baseUrl + file;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return response;
                
            } catch (error) {
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                
                console.warn(`Attempt ${attempt} failed for ${file}, retrying...`);
                await this.delay(this.retryDelay * attempt);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Fallback data generators
    getGitHubFallback() {
        return {
            profile: {
                login: 'MadScie254',
                name: 'Daniel Wanjala',
                bio: 'Full-stack Developer & FinTech Innovation Specialist',
                location: 'Nairobi, Kenya',
                public_repos: 20,
                followers: 50,
                following: 30
            },
            repositories: [],
            statistics: {
                total_repositories: 20,
                languages: ['JavaScript', 'Python', 'TypeScript', 'CSS'],
                total_stars: 100,
                total_forks: 25
            }
        };
    }

    getNewsFallback() {
        return {
            articles: [
                {
                    title: 'Latest Technology Trends',
                    description: 'Exploring the latest in web development and FinTech',
                    url: '#',
                    source: { name: 'Tech News', category: 'Technology' }
                }
            ],
            sources: ['TechCrunch', 'Ars Technica', 'Wired'],
            categories: ['Technology']
        };
    }

    getWeatherFallback() {
        return {
            location: { city: 'Nairobi', country: 'Kenya' },
            current: {
                temperature: 22,
                weather_description: 'Partly cloudy',
                wind_speed: 15
            }
        };
    }

    getCryptoFallback() {
        return {
            prices: {
                bitcoin: { usd: 45000, usd_24h_change: 2.5 },
                ethereum: { usd: 3000, usd_24h_change: 1.8 }
            },
            trending: []
        };
    }

    getQuotesFallback() {
        return {
            quotes: [
                {
                    content: "The only way to do great work is to love what you do.",
                    author: "Steve Jobs",
                    tags: ["motivation", "work", "success"]
                },
                {
                    content: "Innovation distinguishes between a leader and a follower.",
                    author: "Steve Jobs",
                    tags: ["innovation", "leadership"]
                }
            ]
        };
    }

    getWikipediaFallback() {
        return {
            articles: [
                {
                    title: 'Web Development',
                    extract: 'Web development is the work involved in developing a website for the Internet.',
                    topic: 'Web development'
                }
            ]
        };
    }

    getTimeFallback() {
        return {
            timezones: [
                {
                    timezone: 'Africa/Nairobi',
                    datetime: new Date().toISOString(),
                    abbreviation: 'EAT'
                }
            ]
        };
    }

    getHackerNewsFallback() {
        return {
            stories: [
                {
                    title: 'Latest in Tech',
                    score: 100,
                    by: 'techuser',
                    url: '#'
                }
            ]
        };
    }

    // Public API methods for components
    async getGitHubProfile() {
        const data = await this.getData('github');
        return data.profile;
    }

    async getGitHubRepositories() {
        const data = await this.getData('github');
        return data.repositories || [];
    }

    async getGitHubStatistics() {
        const data = await this.getData('github');
        return data.statistics;
    }

    async getTechNews(limit = 5) {
        const data = await this.getData('news');
        return data.articles.slice(0, limit);
    }

    async getCurrentWeather() {
        const data = await this.getData('weather');
        return data.current;
    }

    async getCryptoPrices() {
        const data = await this.getData('crypto');
        return data.prices;
    }

    async getRandomQuote() {
        const data = await this.getData('quotes');
        const quotes = data.quotes || [];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    async getTimeZones() {
        const data = await this.getData('time');
        return data.timezones || [];
    }

    async getTopStories(limit = 5) {
        const data = await this.getData('hackernews');
        return (data.stories || []).slice(0, limit);
    }

    // Component integration helpers
    async populateHeroSection() {
        try {
            const profile = await this.getGitHubProfile();
            const quote = await this.getRandomQuote();
            
            // Update hero content
            const heroName = document.querySelector('.hero-name');
            const heroBio = document.querySelector('.hero-bio');
            const heroQuote = document.querySelector('.hero-quote');
            
            if (heroName) heroName.textContent = profile.name || 'Daniel Wanjala';
            if (heroBio) heroBio.textContent = profile.bio || 'Full-stack Developer & FinTech Specialist';
            if (heroQuote && quote) {
                heroQuote.innerHTML = `
                    <blockquote>"${quote.content}"</blockquote>
                    <cite>— ${quote.author}</cite>
                `;
            }
            
        } catch (error) {
            console.warn('Failed to populate hero section:', error);
        }
    }

    async populateProjectsSection() {
        try {
            const repositories = await this.getGitHubRepositories();
            const stats = await this.getGitHubStatistics();
            
            // Update project stats
            const statsContainer = document.querySelector('.github-stats');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stat-item">
                        <span class="stat-number">${stats.total_repositories}</span>
                        <span class="stat-label">Repositories</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.total_stars}</span>
                        <span class="stat-label">Stars</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.total_forks}</span>
                        <span class="stat-label">Forks</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.languages.length}</span>
                        <span class="stat-label">Languages</span>
                    </div>
                `;
            }
            
            // Update project list
            const projectsList = document.querySelector('.projects-list');
            if (projectsList && repositories.length > 0) {
                projectsList.innerHTML = repositories.slice(0, 6).map(repo => `
                    <div class="project-card" data-repo="${repo.name}">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available'}</p>
                        <div class="project-meta">
                            <span class="language">${repo.language || 'Mixed'}</span>
                            <span class="stars">⭐ ${repo.stargazers_count}</span>
                            <span class="forks">🍴 ${repo.forks_count}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="project-link">View on GitHub</a>
                    </div>
                `).join('');
            }
            
        } catch (error) {
            console.warn('Failed to populate projects section:', error);
        }
    }

    async populateNewsWidget() {
        try {
            const news = await this.getTechNews(3);
            
            const newsWidget = document.querySelector('.news-widget');
            if (newsWidget && news.length > 0) {
                newsWidget.innerHTML = `
                    <h3>Latest Tech News</h3>
                    <div class="news-list">
                        ${news.map(article => `
                            <div class="news-item">
                                <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
                                <p>${article.description}</p>
                                <small>Source: ${article.source.name}</small>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
        } catch (error) {
            console.warn('Failed to populate news widget:', error);
        }
    }

    async populateWeatherWidget() {
        try {
            const weather = await this.getCurrentWeather();
            
            const weatherWidget = document.querySelector('.weather-widget');
            if (weatherWidget) {
                weatherWidget.innerHTML = `
                    <h3>Current Weather - Nairobi</h3>
                    <div class="weather-info">
                        <div class="temperature">${weather.temperature}°C</div>
                        <div class="condition">${weather.weather_description}</div>
                        <div class="wind">Wind: ${weather.wind_speed} km/h</div>
                    </div>
                `;
            }
            
        } catch (error) {
            console.warn('Failed to populate weather widget:', error);
        }
    }

    // Initialize all widgets
    async initializeAllWidgets() {
        console.log('🎨 Initializing data-driven widgets...');
        
        try {
            await Promise.allSettled([
                this.populateHeroSection(),
                this.populateProjectsSection(),
                this.populateNewsWidget(),
                this.populateWeatherWidget()
            ]);
            
            console.log('✅ All widgets initialized');
        } catch (error) {
            console.error('Failed to initialize widgets:', error);
        }
    }

    // Utility methods
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Health check
    async healthCheck() {
        const results = {};
        
        for (const api of Object.keys(this.endpoints)) {
            try {
                await this.getData(api);
                results[api] = 'healthy';
            } catch (error) {
                results[api] = 'error';
            }
        }
        
        return results;
    }
}

// Global instance
window.APIDataManager = new APIDataManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.APIDataManager.initializeAllWidgets();
        }, 500);
    });
} else {
    setTimeout(() => {
        window.APIDataManager.initializeAllWidgets();
    }, 500);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIDataManager;
}
