/**
 * Live Now Panel JavaScript
 * Handles location-based greeting, weather, and public holidays
 * Author: Daniel Wanjala Machimbo
 */

class LiveNowPanel {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 60 * 60 * 1000; // 1 hour for most data
        this.weatherCacheTimeout = 30 * 60 * 1000; // 30 minutes for weather
        this.retryCount = 3;
        this.retryDelay = 1000;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadLiveData());
        } else {
            this.loadLiveData();
        }
    }

    async loadLiveData() {
        try {
            // Start with location detection
            const locationData = await this.getLocationData();
            if (locationData) {
                await Promise.allSettled([
                    this.displayGreeting(locationData),
                    this.loadWeatherData(locationData),
                    this.loadPublicHolidays(locationData.country_code)
                ]);
            }
        } catch (error) {
            console.error('Error loading live data:', error);
            this.showFallbackContent();
        }
    }

    // ===============================================
    // LOCATION DETECTION
    // ===============================================
    async getLocationData() {
        try {
            const cached = this.getFromCache('location');
            if (cached) return cached;

            let locationData = null;

            // Try ipapi.co first
            try {
                const response = await this.fetchWithRetry('https://ipapi.co/json/');
                locationData = await response.json();
                
                if (locationData && !locationData.error) {
                    this.setCache('location', locationData);
                    return locationData;
                }
            } catch (error) {
                console.log('ipapi.co failed, trying ip-api.com');
            }

            // Fallback to ip-api.com
            try {
                const response = await this.fetchWithRetry('http://ip-api.com/json/');
                const data = await response.json();
                
                if (data && data.status === 'success') {
                    // Convert to ipapi.co format
                    locationData = {
                        city: data.city,
                        region: data.regionName,
                        country_name: data.country,
                        country_code: data.countryCode,
                        latitude: data.lat,
                        longitude: data.lon,
                        timezone: data.timezone
                    };
                    this.setCache('location', locationData);
                    return locationData;
                }
            } catch (error) {
                console.log('ip-api.com also failed, using JSONP fallback');
            }

            // JSONP fallback for ip-api.com
            try {
                locationData = await this.getLocationViaJSONP();
                if (locationData) {
                    this.setCache('location', locationData);
                    return locationData;
                }
            } catch (error) {
                console.error('All location methods failed:', error);
            }

            // Default fallback
            return {
                city: 'Unknown',
                country_name: 'Kenya',
                country_code: 'KE',
                latitude: -1.2921,
                longitude: 36.8219,
                timezone: 'Africa/Nairobi'
            };

        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    }

    getLocationViaJSONP() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callbackName = 'locationCallback_' + Date.now();
            
            window[callbackName] = function(data) {
                delete window[callbackName];
                document.head.removeChild(script);
                
                if (data && data.status === 'success') {
                    resolve({
                        city: data.city,
                        region: data.regionName,
                        country_name: data.country,
                        country_code: data.countryCode,
                        latitude: data.lat,
                        longitude: data.lon,
                        timezone: data.timezone
                    });
                } else {
                    reject(new Error('JSONP request failed'));
                }
            };
            
            script.src = `http://ip-api.com/json/?callback=${callbackName}`;
            script.onerror = () => {
                delete window[callbackName];
                document.head.removeChild(script);
                reject(new Error('JSONP script failed to load'));
            };
            
            document.head.appendChild(script);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    if (script.parentNode) {
                        document.head.removeChild(script);
                    }
                    reject(new Error('JSONP request timeout'));
                }
            }, 10000);
        });
    }

    // ===============================================
    // GREETING DISPLAY
    // ===============================================
    displayGreeting(locationData) {
        const container = this.getOrCreateLivePanel();
        const greetingSection = container.querySelector('.live-greeting') || this.createGreetingSection();
        
        const timeOfDay = this.getTimeOfDay();
        const cityName = locationData.city !== 'Unknown' ? locationData.city : locationData.country_name;
        
        greetingSection.innerHTML = `
            <div class="greeting-content">
                <div class="greeting-icon">
                    <i class="fas ${this.getGreetingIcon(timeOfDay)}"></i>
                </div>
                <div class="greeting-text">
                    <h3>${timeOfDay} from ${cityName}!</h3>
                    <p>Welcome to my portfolio</p>
                </div>
            </div>
        `;
        
        if (!container.contains(greetingSection)) {
            container.appendChild(greetingSection);
        }
    }

    createGreetingSection() {
        const section = document.createElement('div');
        section.className = 'live-greeting';
        return section;
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }

    getGreetingIcon(timeOfDay) {
        switch (timeOfDay) {
            case 'Good morning': return 'fa-sun';
            case 'Good afternoon': return 'fa-cloud-sun';
            default: return 'fa-moon';
        }
    }

    // ===============================================
    // WEATHER DATA
    // ===============================================
    async loadWeatherData(locationData) {
        try {
            const cached = this.getFromCache('weather', this.weatherCacheTimeout);
            if (cached) {
                this.displayWeather(cached);
                return;
            }

            const lat = locationData.latitude;
            const lon = locationData.longitude;
            
            // Open-Meteo API (free, no API key required)
            const response = await this.fetchWithRetry(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            
            const weatherData = await response.json();
            this.setCache('weather', weatherData, this.weatherCacheTimeout);
            this.displayWeather(weatherData);
            
        } catch (error) {
            console.error('Error loading weather data:', error);
            this.displayWeatherError();
        }
    }

    displayWeather(weatherData) {
        const container = this.getOrCreateLivePanel();
        const weatherSection = container.querySelector('.live-weather') || this.createWeatherSection();
        
        const current = weatherData.current_weather;
        const daily = weatherData.daily;
        
        const weatherIcon = this.getWeatherIcon(current.weathercode);
        const condition = this.getWeatherCondition(current.weathercode);
        
        weatherSection.innerHTML = `
            <div class="weather-chip">
                <div class="weather-icon">
                    <i class="fas ${weatherIcon}"></i>
                </div>
                <div class="weather-info">
                    <div class="weather-temp">${Math.round(current.temperature)}°C</div>
                    <div class="weather-condition">${condition}</div>
                    <div class="weather-range">
                        ${Math.round(daily.temperature_2m_min[0])}° / ${Math.round(daily.temperature_2m_max[0])}°
                    </div>
                </div>
            </div>
        `;
        
        if (!container.contains(weatherSection)) {
            container.appendChild(weatherSection);
        }
    }

    createWeatherSection() {
        const section = document.createElement('div');
        section.className = 'live-weather';
        return section;
    }

    displayWeatherError() {
        const container = this.getOrCreateLivePanel();
        const weatherSection = container.querySelector('.live-weather') || this.createWeatherSection();
        
        weatherSection.innerHTML = `
            <div class="weather-chip error">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Weather unavailable</span>
            </div>
        `;
        
        if (!container.contains(weatherSection)) {
            container.appendChild(weatherSection);
        }
    }

    getWeatherIcon(weathercode) {
        const iconMap = {
            0: 'fa-sun',           // Clear sky
            1: 'fa-sun',           // Mainly clear
            2: 'fa-cloud-sun',     // Partly cloudy
            3: 'fa-cloud',         // Overcast
            45: 'fa-smog',         // Fog
            48: 'fa-smog',         // Depositing rime fog
            51: 'fa-cloud-drizzle', // Light drizzle
            53: 'fa-cloud-drizzle', // Moderate drizzle
            55: 'fa-cloud-drizzle', // Dense drizzle
            61: 'fa-cloud-rain',   // Slight rain
            63: 'fa-cloud-rain',   // Moderate rain
            65: 'fa-cloud-rain',   // Heavy rain
            71: 'fa-snowflake',    // Slight snow
            73: 'fa-snowflake',    // Moderate snow
            75: 'fa-snowflake',    // Heavy snow
            95: 'fa-bolt',         // Thunderstorm
            96: 'fa-bolt',         // Thunderstorm with hail
            99: 'fa-bolt'          // Thunderstorm with heavy hail
        };
        
        return iconMap[weathercode] || 'fa-question';
    }

    getWeatherCondition(weathercode) {
        const conditionMap = {
            0: 'Clear',
            1: 'Mostly Clear',
            2: 'Partly Cloudy',
            3: 'Cloudy',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light Drizzle',
            53: 'Drizzle',
            55: 'Heavy Drizzle',
            61: 'Light Rain',
            63: 'Rain',
            65: 'Heavy Rain',
            71: 'Light Snow',
            73: 'Snow',
            75: 'Heavy Snow',
            95: 'Thunderstorm',
            96: 'Thunderstorm',
            99: 'Severe Thunderstorm'
        };
        
        return conditionMap[weathercode] || 'Unknown';
    }

    // ===============================================
    // PUBLIC HOLIDAYS
    // ===============================================
    async loadPublicHolidays(countryCode) {
        try {
            const cached = this.getFromCache('holidays');
            if (cached) {
                this.displayNextHoliday(cached);
                return;
            }

            const response = await this.fetchWithRetry(
                `https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`
            );
            
            const holidays = await response.json();
            this.setCache('holidays', holidays);
            this.displayNextHoliday(holidays);
            
        } catch (error) {
            console.error('Error loading public holidays:', error);
            this.displayHolidayError();
        }
    }

    displayNextHoliday(holidays) {
        if (!holidays || holidays.length === 0) return;
        
        const container = this.getOrCreateLivePanel();
        const holidaySection = container.querySelector('.live-holiday') || this.createHolidaySection();
        
        const nextHoliday = holidays[0];
        const date = new Date(nextHoliday.date);
        const daysUntil = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
        
        holidaySection.innerHTML = `
            <div class="holiday-chip">
                <div class="holiday-icon">
                    <i class="fas fa-calendar-day"></i>
                </div>
                <div class="holiday-info">
                    <div class="holiday-name">${nextHoliday.localName}</div>
                    <div class="holiday-date">
                        ${daysUntil === 0 ? 'Today!' : 
                          daysUntil === 1 ? 'Tomorrow' : 
                          `In ${daysUntil} days`}
                    </div>
                </div>
            </div>
        `;
        
        if (!container.contains(holidaySection)) {
            container.appendChild(holidaySection);
        }
    }

    createHolidaySection() {
        const section = document.createElement('div');
        section.className = 'live-holiday';
        return section;
    }

    displayHolidayError() {
        const container = this.getOrCreateLivePanel();
        const holidaySection = container.querySelector('.live-holiday') || this.createHolidaySection();
        
        holidaySection.innerHTML = `
            <div class="holiday-chip error">
                <i class="fas fa-calendar-times"></i>
                <span>Holidays unavailable</span>
            </div>
        `;
        
        if (!container.contains(holidaySection)) {
            container.appendChild(holidaySection);
        }
    }

    // ===============================================
    // LIVE PANEL MANAGEMENT
    // ===============================================
    getOrCreateLivePanel() {
        let container = document.getElementById('liveNowPanel');
        if (!container) {
            container = this.createLivePanel();
            this.insertLivePanel(container);
        }
        return container;
    }

    createLivePanel() {
        const panel = document.createElement('section');
        panel.id = 'liveNowPanel';
        panel.className = 'live-now-panel';
        panel.innerHTML = `
            <div class="container">
                <h2><i class="fas fa-broadcast-tower"></i> Live Now</h2>
                <div class="live-content">
                    <!-- Content will be dynamically added -->
                </div>
            </div>
        `;
        
        // Add styles
        this.addLivePanelStyles();
        
        return panel;
    }

    insertLivePanel(panel) {
        // Insert after hero section but before main content
        const hero = document.querySelector('.hero');
        const nextSection = hero ? hero.nextElementSibling : document.querySelector('main section');
        
        if (nextSection) {
            nextSection.parentNode.insertBefore(panel, nextSection);
        } else {
            document.querySelector('main').appendChild(panel);
        }
    }

    addLivePanelStyles() {
        if (document.getElementById('live-now-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'live-now-styles';
        styles.textContent = `
            .live-now-panel {
                background: var(--color-bg-secondary);
                padding: var(--space-xl) 0;
                border-bottom: 1px solid var(--color-border-primary);
            }
            
            .live-now-panel h2 {
                color: var(--color-text-primary);
                margin-bottom: var(--space-lg);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-sm);
            }
            
            .live-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--space-lg);
                max-width: 900px;
                margin: 0 auto;
            }
            
            .greeting-content,
            .weather-chip,
            .holiday-chip {
                background: var(--color-surface-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-lg);
                box-shadow: var(--shadow-sm);
                transition: all var(--transition-normal);
                display: flex;
                align-items: center;
                gap: var(--space-md);
            }
            
            .greeting-content:hover,
            .weather-chip:hover,
            .holiday-chip:hover {
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }
            
            .greeting-icon,
            .weather-icon,
            .holiday-icon {
                font-size: var(--font-size-2xl);
                color: var(--color-primary);
                min-width: 40px;
                text-align: center;
            }
            
            .greeting-text h3,
            .weather-info .weather-temp,
            .holiday-info .holiday-name {
                margin: 0 0 var(--space-xs) 0;
                color: var(--color-text-primary);
                font-weight: 600;
            }
            
            .greeting-text p,
            .weather-condition,
            .weather-range,
            .holiday-date {
                margin: 0;
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
            }
            
            .weather-temp {
                font-size: var(--font-size-xl);
                font-weight: 700;
            }
            
            .weather-range {
                font-size: var(--font-size-xs);
                color: var(--color-text-muted);
            }
            
            .error {
                background: rgba(239, 68, 68, 0.1) !important;
                color: var(--color-error) !important;
            }
            
            @media (max-width: 768px) {
                .live-content {
                    grid-template-columns: 1fr;
                    gap: var(--space-md);
                }
                
                .greeting-content,
                .weather-chip,
                .holiday-chip {
                    padding: var(--space-md);
                }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .greeting-content:hover,
                .weather-chip:hover,
                .holiday-chip:hover {
                    transform: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    showFallbackContent() {
        const container = this.getOrCreateLivePanel();
        container.querySelector('.live-content').innerHTML = `
            <div class="greeting-content">
                <div class="greeting-icon"><i class="fas fa-globe"></i></div>
                <div class="greeting-text">
                    <h3>Welcome!</h3>
                    <p>Thanks for visiting my portfolio</p>
                </div>
            </div>
        `;
    }

    // ===============================================
    // UTILITY METHODS
    // ===============================================
    async fetchWithRetry(url, options = {}, retries = this.retryCount) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'User-Agent': 'LiveNowPanel/1.0',
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

    getFromCache(key, timeout = this.cacheTimeout) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < timeout) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data, timeout = this.cacheTimeout) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            timeout
        });
    }
}

// Initialize only on homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    new LiveNowPanel();
}
