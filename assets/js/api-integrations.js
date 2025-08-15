// API Integrations for Enhanced Functionality
class APIManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadGitHubStats();
        this.loadWeatherInfo();
        this.loadQuoteOfTheDay();
        this.loadCryptoData();
        this.loadTechNews();
    }

    // GitHub Stats API
    async loadGitHubStats() {
        try {
            const response = await fetch('https://api.github.com/users/MadScie254');
            const data = await response.json();
            
            if (data) {
                this.displayGitHubStats({
                    repos: data.public_repos,
                    followers: data.followers,
                    following: data.following,
                    created: new Date(data.created_at).getFullYear()
                });
            }
        } catch (error) {
            console.log('GitHub API not available:', error);
        }
    }

    displayGitHubStats(stats) {
        const container = document.getElementById('github-stats');
        if (container) {
            container.innerHTML = `
                <div class="api-widget github-widget">
                    <h3><i class="fab fa-github"></i> GitHub Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">${stats.repos}</span>
                            <span class="stat-label">Repositories</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${stats.followers}</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${stats.following}</span>
                            <span class="stat-label">Following</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${new Date().getFullYear() - stats.created}+</span>
                            <span class="stat-label">Years Active</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Weather API for location context
    async loadWeatherInfo() {
        try {
            // Using a free weather API (OpenWeatherMap alternative)
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-1.2921&longitude=36.8219&current_weather=true&timezone=Africa/Nairobi');
            const data = await response.json();
            
            if (data && data.current_weather) {
                this.displayWeatherInfo(data.current_weather);
            }
        } catch (error) {
            console.log('Weather API not available:', error);
        }
    }

    displayWeatherInfo(weather) {
        const container = document.getElementById('weather-info');
        if (container) {
            const temp = Math.round(weather.temperature);
            const icon = this.getWeatherIcon(weather.weathercode);
            
            container.innerHTML = `
                <div class="api-widget weather-widget">
                    <h3><i class="fas fa-map-marker-alt"></i> Nairobi, Kenya</h3>
                    <div class="weather-display">
                        <span class="weather-icon">${icon}</span>
                        <span class="temperature">${temp}°C</span>
                    </div>
                    <p class="weather-desc">Current conditions</p>
                </div>
            `;
        }
    }

    getWeatherIcon(code) {
        const weatherIcons = {
            0: '☀️', // Clear sky
            1: '🌤️', // Mainly clear
            2: '⛅', // Partly cloudy
            3: '☁️', // Overcast
            45: '🌫️', // Fog
            48: '🌫️', // Depositing rime fog
            51: '🌦️', // Light drizzle
            61: '🌧️', // Slight rain
            80: '🌦️', // Slight rain showers
            95: '⛈️'  // Thunderstorm
        };
        return weatherIcons[code] || '🌤️';
    }

    // Quote of the Day API
    async loadQuoteOfTheDay() {
        try {
            const response = await fetch('https://api.quotable.io/random?tags=technology,science,success');
            const data = await response.json();
            
            if (data) {
                this.displayQuote(data);
            }
        } catch (error) {
            console.log('Quote API not available:', error);
        }
    }

    displayQuote(quote) {
        const container = document.getElementById('daily-quote');
        if (container) {
            container.innerHTML = `
                <div class="api-widget quote-widget">
                    <h3><i class="fas fa-quote-left"></i> Daily Inspiration</h3>
                    <blockquote>
                        "${quote.content}"
                        <footer>— ${quote.author}</footer>
                    </blockquote>
                </div>
            `;
        }
    }

    // Cryptocurrency Data for Tech Interest
    async loadCryptoData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
            const data = await response.json();
            
            if (data) {
                this.displayCryptoData(data);
            }
        } catch (error) {
            console.log('Crypto API not available:', error);
        }
    }

    displayCryptoData(data) {
        const container = document.getElementById('crypto-data');
        if (container) {
            const btc = data.bitcoin;
            const eth = data.ethereum;
            
            container.innerHTML = `
                <div class="api-widget crypto-widget">
                    <h3><i class="fab fa-bitcoin"></i> Tech Market</h3>
                    <div class="crypto-grid">
                        <div class="crypto-item">
                            <span class="crypto-name">BTC</span>
                            <span class="crypto-price">$${btc.usd.toLocaleString()}</span>
                            <span class="crypto-change ${btc.usd_24h_change > 0 ? 'positive' : 'negative'}">
                                ${btc.usd_24h_change > 0 ? '+' : ''}${btc.usd_24h_change.toFixed(2)}%
                            </span>
                        </div>
                        <div class="crypto-item">
                            <span class="crypto-name">ETH</span>
                            <span class="crypto-price">$${eth.usd.toLocaleString()}</span>
                            <span class="crypto-change ${eth.usd_24h_change > 0 ? 'positive' : 'negative'}">
                                ${eth.usd_24h_change > 0 ? '+' : ''}${eth.usd_24h_change.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Tech News API
    async loadTechNews() {
        try {
            // Using a free news API
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/oreilly/radar/atom');
            const data = await response.json();
            
            if (data && data.items) {
                this.displayTechNews(data.items.slice(0, 3));
            }
        } catch (error) {
            console.log('News API not available:', error);
        }
    }

    displayTechNews(articles) {
        const container = document.getElementById('tech-news');
        if (container) {
            const newsHTML = articles.map(article => `
                <div class="news-item">
                    <h4><a href="${article.link}" target="_blank" rel="noopener noreferrer">${article.title}</a></h4>
                    <p class="news-date">${new Date(article.pubDate).toLocaleDateString()}</p>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="api-widget news-widget">
                    <h3><i class="fas fa-newspaper"></i> Latest Tech News</h3>
                    <div class="news-list">
                        ${newsHTML}
                    </div>
                </div>
            `;
        }
    }
}

// Initialize API Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new APIManager();
});

// Refresh APIs every 5 minutes
setInterval(() => {
    new APIManager();
}, 300000);
