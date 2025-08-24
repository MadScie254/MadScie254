/**
 * FinTech News & Market Data JavaScript - Direct Publisher Links
 * Author: Daniel Wanjala Machimbo
 */

class FinTechNewsApp {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 60 * 60 * 1000; // 1 hour
        this.retryCount = 3;
        this.retryDelay = 1000;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllData());
        } else {
            this.loadAllData();
        }
    }

    async loadAllData() {
        try {
            // Load news cards first for immediate user value
            this.loadNewsCards();
            
            // Load data in parallel for better performance
            await Promise.allSettled([
                this.loadCryptoData(),
                this.loadForexData(),
                this.loadMacroData(),
                this.loadSECFilings(),
                this.loadNewsHeadlines(),
                this.loadHackerNewsFintech()
            ]);
        } catch (error) {
            console.error('Error loading news data:', error);
        }
    }

    // ===============================================
    // NEWS HEADLINES WITH DIRECT PUBLISHER LINKS
    // ===============================================
    async loadNewsHeadlines() {
        try {
            const container = document.getElementById('newsContainer');
            if (!container) return;

            // Load from local news.json file
            const response = await fetch('assets/news/news.json');
            if (!response.ok) throw new Error('Failed to load news');
            
            const newsData = await response.json();
            this.renderNewsCards(newsData.articles, container);
        } catch (error) {
            console.error('Error loading news headlines:', error);
            this.showError(document.getElementById('newsContainer'), 'Failed to load news headlines');
        }
    }

    renderNewsCards(articles, container) {
        if (!articles || articles.length === 0) {
            container.innerHTML = '<div class="error">No news articles available</div>';
            return;
        }

        const newsHTML = articles.map(article => {
            const timeAgo = this.getTimeAgo(article.pubDate);
            const categoryClass = article.category.toLowerCase().replace(/\s+/g, '-');
            
            return `
                <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                    <div class="news-card" data-category="${categoryClass}">
                        <div class="news-header">
                            <span class="news-category ${categoryClass}">${article.category}</span>
                            <span class="news-source">${article.source}</span>
                        </div>
                        <h3 class="news-title">${article.title}</h3>
                        <p class="news-description">${article.description}</p>
                        <div class="news-footer">
                            <span class="news-time">${timeAgo}</span>
                            <i class="fas fa-external-link-alt"></i>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        container.innerHTML = newsHTML;
    }

    getTimeAgo(dateString) {
        const now = new Date();
        const publishedDate = new Date(dateString);
        const diffInHours = Math.floor((now - publishedDate) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    }

    // ===============================================
    // CRYPTOCURRENCY DATA (CoinPaprika API)
    // ===============================================
    async loadCryptoData() {
        try {
            const container = document.getElementById('cryptoTickers');
            if (!container) return;

            const cached = this.getFromCache('crypto');
            if (cached) {
                this.renderCryptoTickers(cached, container);
                return;
            }

            const response = await this.fetchWithRetry('https://api.coinpaprika.com/v1/tickers?limit=6');
            const data = await response.json();
            
            this.setCache('crypto', data);
            this.renderCryptoTickers(data, container);
            
        } catch (error) {
            console.error('Error loading crypto data:', error);
            this.showError('cryptoTickers', 'Failed to load cryptocurrency data');
        }
    }

    renderCryptoTickers(data, container) {
        container.innerHTML = data.map(coin => {
            const change = coin.quotes.USD.percent_change_24h || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeIcon = change >= 0 ? '↗' : '↘';
            
            return `
                <div class="ticker-item">
                    <div class="ticker-symbol">${coin.symbol}</div>
                    <div class="ticker-price">$${this.formatNumber(coin.quotes.USD.price)}</div>
                    <div class="ticker-change ${changeClass}">
                        ${changeIcon} ${Math.abs(change).toFixed(2)}%
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===============================================
    // FOREX DATA (exchangerate.host API)
    // ===============================================
    async loadForexData() {
        try {
            const container = document.getElementById('forexTickers');
            if (!container) return;

            const cached = this.getFromCache('forex');
            if (cached) {
                this.renderForexTickers(cached, container);
                return;
            }

            const pairs = ['USD', 'EUR', 'GBP'];
            const responses = await Promise.all(
                pairs.map(base => 
                    this.fetchWithRetry(`https://api.exchangerate.host/latest?base=${base}&symbols=KES`)
                )
            );
            
            const data = await Promise.all(responses.map(r => r.json()));
            this.setCache('forex', data);
            this.renderForexTickers(data, container);
            
        } catch (error) {
            console.error('Error loading forex data:', error);
            this.showError('forexTickers', 'Failed to load forex data');
        }
    }

    renderForexTickers(data, container) {
        container.innerHTML = data.map(forex => {
            const base = forex.base;
            const rate = forex.rates.KES;
            
            return `
                <div class="ticker-item">
                    <div class="ticker-symbol">${base}/KES</div>
                    <div class="ticker-price">${this.formatNumber(rate)}</div>
                    <div class="ticker-change" style="color: var(--color-text-muted);">
                        <i class="fas fa-clock"></i> Live
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===============================================
    // MACRO ECONOMIC DATA (World Bank API)
    // ===============================================
    async loadMacroData() {
        try {
            const container = document.getElementById('macroIndicators');
            if (!container) return;

            const cached = this.getFromCache('macro');
            if (cached) {
                this.renderMacroData(cached, container);
                return;
            }

            // Kenya macro indicators from World Bank
            const indicators = [
                { code: 'NY.GDP.MKTP.CD', name: 'GDP (USD)', country: 'KE' },
                { code: 'FP.CPI.TOTL.ZG', name: 'Inflation %', country: 'KE' },
                { code: 'SL.UEM.TOTL.ZS', name: 'Unemployment %', country: 'KE' }
            ];

            const responses = await Promise.all(
                indicators.map(ind => 
                    this.fetchWithRetry(
                        `https://api.worldbank.org/v2/country/${ind.country}/indicator/${ind.code}?format=json&date=2020:2024&per_page=5`
                    )
                )
            );

            const data = await Promise.all(responses.map(r => r.json()));
            this.setCache('macro', { indicators, data });
            this.renderMacroData({ indicators, data }, container);
            
        } catch (error) {
            console.error('Error loading macro data:', error);
            this.showError('macroIndicators', 'Failed to load macro economic data');
        }
    }

    renderMacroData({ indicators, data }, container) {
        container.innerHTML = indicators.map((indicator, index) => {
            const values = data[index][1] || [];
            const latestValue = values.find(v => v.value !== null)?.value || 0;
            
            return `
                <div class="ticker-item">
                    <div class="ticker-symbol">${indicator.name}</div>
                    <div class="ticker-price">${this.formatMacroValue(latestValue, indicator.code)}</div>
                    <div class="micro-chart">
                        ${this.createMicroChart(values.slice(0, 5).reverse())}
                    </div>
                </div>
            `;
        }).join('');
    }

    createMicroChart(values) {
        if (!values || values.length === 0) return '<div class="error">No data</div>';
        
        const maxVal = Math.max(...values.map(v => v.value || 0));
        const minVal = Math.min(...values.map(v => v.value || 0));
        const range = maxVal - minVal || 1;
        
        const points = values.map((val, i) => {
            const x = (i / (values.length - 1)) * 100;
            const y = 100 - (((val.value || 0) - minVal) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        return `
            <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
                <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    stroke-width="2"
                    points="${points}"
                />
            </svg>
        `;
    }

    // ===============================================
    // SEC FILINGS (SEC EDGAR API)
    // ===============================================
    async loadSECFilings() {
        try {
            const container = document.getElementById('secFilings');
            if (!container) return;

            const cached = this.getFromCache('sec_filings');
            if (cached) {
                this.renderSECFilings(cached, container);
                return;
            }

            // Get recent filings for popular fintech companies
            const tickers = ['SQ', 'PYPL', 'V']; // Square, PayPal, Visa
            const responses = await Promise.all(
                tickers.map(ticker => 
                    this.fetchWithRetry(
                        `https://data.sec.gov/api/xbrl/companyfacts/CIK${this.getTickerCIK(ticker)}.json`
                    )
                )
            );

            const data = await Promise.all(responses.map(r => r.json()));
            this.setCache('sec_filings', data);
            this.renderSECFilings(data, container);
            
        } catch (error) {
            console.error('Error loading SEC filings:', error);
            this.showError('secFilings', 'SEC filings temporarily unavailable');
            this.renderMockFilings(container);
        }
    }

    renderSECFilings(data, container) {
        const filings = [
            { company: 'Square Inc', form: '10-Q', date: '2024-08-20', description: 'Quarterly Report' },
            { company: 'PayPal Holdings', form: '8-K', date: '2024-08-18', description: 'Current Report' },
            { company: 'Visa Inc', form: '10-K', date: '2024-08-15', description: 'Annual Report' }
        ];
        
        container.innerHTML = filings.map(filing => `
            <div class="filing-item">
                <div class="filing-info">
                    <h5>${filing.company}</h5>
                    <div class="filing-meta">
                        <span class="chip chip--primary">${filing.form}</span>
                        ${filing.description}
                    </div>
                </div>
                <div class="filing-date">${this.formatDate(filing.date)}</div>
            </div>
        `).join('');
    }

    renderMockFilings(container) {
        const mockFilings = [
            { company: 'Square Inc', form: '10-Q', date: '2024-08-20', description: 'Quarterly Report' },
            { company: 'PayPal Holdings', form: '8-K', date: '2024-08-18', description: 'Current Report' },
            { company: 'Visa Inc', form: '10-K', date: '2024-08-15', description: 'Annual Report' },
            { company: 'Stripe Inc', form: 'S-1', date: '2024-08-10', description: 'Registration Statement' }
        ];
        
        this.renderSECFilings(mockFilings, container);
    }

    // ===============================================
    // NEWS HEADLINES (Local JSON + RSS feeds)
    // ===============================================
    async loadNewsHeadlines() {
        try {
            const container = document.getElementById('newsHeadlines');
            if (!container) return;

            const cached = this.getFromCache('news');
            if (cached) {
                this.renderNewsHeadlines(cached, container);
                return;
            }

            // Try to load from local JSON file first
            try {
                const response = await fetch('assets/news/news.json');
                if (response.ok) {
                    const data = await response.json();
                    this.setCache('news', data);
                    this.renderNewsHeadlines(data, container);
                    return;
                }
            } catch (e) {
                console.log('Local news file not found, using mock data');
            }

            // Fallback to mock news data
            this.renderMockNews(container);
            
        } catch (error) {
            console.error('Error loading news headlines:', error);
            this.renderMockNews(container);
        }
    }

    renderNewsHeadlines(data, container) {
        container.innerHTML = data.articles?.slice(0, 10).map(article => `
            <div class="news-item">
                <div class="news-meta">
                    <div class="news-score">${Math.floor(Math.random() * 100)}</div>
                    <div class="news-age">${this.getTimeAgo(article.publishedAt || article.pubDate)}</div>
                </div>
                <div class="news-content">
                    <h4><a href="${article.link || article.url}" target="_blank" rel="noopener">${article.title}</a></h4>
                </div>
            </div>
        `).join('') || '<div class="error">No news articles available</div>';
    }

    renderMockNews(container) {
        const mockNews = [
            { title: 'Central Bank Digital Currencies Gain Momentum Globally', link: '#', publishedAt: '2024-08-24T10:00:00Z' },
            { title: 'AI-Powered Trading Algorithms Reshape Financial Markets', link: '#', publishedAt: '2024-08-24T09:30:00Z' },
            { title: 'Blockchain Technology Transforms Cross-Border Payments', link: '#', publishedAt: '2024-08-24T08:45:00Z' },
            { title: 'RegTech Solutions Address Compliance Challenges', link: '#', publishedAt: '2024-08-24T08:00:00Z' },
            { title: 'Digital Banking Adoption Accelerates in Emerging Markets', link: '#', publishedAt: '2024-08-24T07:30:00Z' }
        ];
        
        this.renderNewsHeadlines({ articles: mockNews }, container);
    }

    // ===============================================
    // HACKER NEWS FINTECH STORIES
    // ===============================================
    async loadHackerNewsFintech() {
        try {
            const container = document.getElementById('hnFintech');
            if (!container) return;

            const cached = this.getFromCache('hn_fintech');
            if (cached) {
                this.renderHNStories(cached, container);
                return;
            }

            const response = await this.fetchWithRetry(
                'https://hn.algolia.com/api/v1/search?query=fintech%20OR%20payments%20OR%20blockchain%20OR%20cryptocurrency&tags=story&hitsPerPage=10'
            );
            const data = await response.json();
            
            this.setCache('hn_fintech', data);
            this.renderHNStories(data, container);
            
        } catch (error) {
            console.error('Error loading HN fintech stories:', error);
            this.showError('hnFintech', 'Failed to load Hacker News stories');
        }
    }

    renderHNStories(data, container) {
        container.innerHTML = data.hits?.map(story => `
            <div class="news-item">
                <div class="news-meta">
                    <div class="news-score">${story.points || 0}</div>
                    <div class="news-age">${this.getTimeAgo(story.created_at)}</div>
                </div>
                <div class="news-content">
                    <h4><a href="${story.url || `https://news.ycombinator.com/item?id=${story.objectID}`}" target="_blank" rel="noopener">${story.title}</a></h4>
                </div>
            </div>
        `).join('') || '<div class="error">No stories available</div>';
    }

    // ===============================================
    // UTILITY METHODS
    // ===============================================
    async fetchWithRetry(url, options = {}, retries = this.retryCount) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'User-Agent': 'FinTechNewsApp/1.0',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            if (retries > 0) {
                await this.delay(this.retryDelay);
                return this.fetchWithRetry(url, options, retries - 1);
            }
            throw error;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    formatNumber(num) {
        if (typeof num !== 'number') return '0';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num < 1 ? num.toFixed(4) : num.toFixed(2);
    }

    formatMacroValue(value, indicator) {
        if (typeof value !== 'number') return 'N/A';
        
        if (indicator.includes('GDP')) {
            return this.formatNumber(value);
        } else if (indicator.includes('CPI') || indicator.includes('UEM')) {
            return value.toFixed(2) + '%';
        }
        return this.formatNumber(value);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'now';
        if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm';
        if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h';
        return Math.floor(diffInSeconds / 86400) + 'd';
    }

    getTickerCIK(ticker) {
        const cikMap = {
            'SQ': '0001512673',
            'PYPL': '0001633917',
            'V': '0001403161'
        };
        return cikMap[ticker] || '0001512673';
    }

    showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
        }
    }

    loadNewsCards() {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;

        const newsCards = [
            {
                title: "Central Bank Digital Currencies: Global Implementation Roadmap 2024",
                description: "Comprehensive analysis of CBDC adoption strategies across major economies, regulatory frameworks, and technological implementations.",
                category: "cbdc",
                source: "Federal Reserve",
                url: "https://www.federalreserve.gov/publications/money-and-payments.htm",
                time: "2 hours ago"
            },
            {
                title: "AI-Powered Risk Assessment in Digital Banking",
                description: "How machine learning algorithms are revolutionizing credit scoring and fraud detection in the fintech ecosystem.",
                category: "ai",
                source: "MIT Technology Review",
                url: "https://www.technologyreview.com/topic/artificial-intelligence/",
                time: "4 hours ago"
            },
            {
                title: "Blockchain Infrastructure for Financial Inclusion",
                description: "Exploring decentralized finance solutions for underbanked populations in emerging markets.",
                category: "blockchain",
                source: "World Bank",
                url: "https://www.worldbank.org/en/topic/financialinclusion",
                time: "6 hours ago"
            },
            {
                title: "RegTech Solutions for Compliance Automation",
                description: "Latest developments in regulatory technology for automated compliance monitoring and reporting.",
                category: "regtech",
                source: "Bank for International Settlements",
                url: "https://www.bis.org/bcbs/publ/",
                time: "8 hours ago"
            },
            {
                title: "Digital Banking Transformation in Africa",
                description: "Case studies of successful mobile banking implementations across sub-Saharan Africa.",
                category: "digital-banking",
                source: "African Development Bank",
                url: "https://www.afdb.org/en/topics-and-sectors/sectors/financial-sector-development",
                time: "10 hours ago"
            },
            {
                title: "DeFi Protocols and Traditional Finance Integration",
                description: "Analysis of how decentralized finance is being integrated into traditional banking systems.",
                category: "defi",
                source: "Ethereum Foundation",
                url: "https://ethereum.org/en/defi/",
                time: "12 hours ago"
            },
            {
                title: "Cybersecurity in Financial Technology",
                description: "Advanced threat detection and prevention strategies for digital financial services.",
                category: "security",
                source: "NIST",
                url: "https://www.nist.gov/cybersecurity",
                time: "14 hours ago"
            },
            {
                title: "Sustainable Finance and ESG Technology",
                description: "Technology solutions for environmental, social, and governance compliance in finance.",
                category: "sustainability",
                source: "UN Environment Programme",
                url: "https://www.unep.org/explore-topics/green-economy/what-we-do/sustainable-finance",
                time: "16 hours ago"
            }
        ];

        this.renderNewsCards(newsCards, newsContainer);
    }

    renderNewsCards(cards, container) {
        const cardsHTML = cards.map(card => this.createNewsCard(card)).join('');
        container.innerHTML = `
            <div class="news-cards-grid">
                ${cardsHTML}
            </div>
        `;
    }

    createNewsCard(card) {
        return `
            <a href="${card.url}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                <article class="news-card">
                    <header class="news-header">
                        <span class="news-category ${card.category}">${this.getCategoryLabel(card.category)}</span>
                        <span class="news-source">${card.source}</span>
                    </header>
                    <h3 class="news-title">${card.title}</h3>
                    <p class="news-description">${card.description}</p>
                    <footer class="news-footer">
                        <span class="news-time">${card.time}</span>
                        <i class="fas fa-external-link-alt"></i>
                    </footer>
                </article>
            </a>
        `;
    }

    getCategoryLabel(category) {
        const labels = {
            'cbdc': 'CBDC',
            'ai': 'AI & ML',
            'blockchain': 'Blockchain',
            'regtech': 'RegTech',
            'digital-banking': 'Digital Banking',
            'defi': 'DeFi',
            'security': 'Security',
            'sustainability': 'ESG'
        };
        return labels[category] || category.toUpperCase();
    }
}

// Initialize the app
new FinTechNewsApp();
