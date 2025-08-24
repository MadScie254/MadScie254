/**
 * Enhanced WhatsApp Integration with Fallback Chat
 * Provides WhatsApp integration with on-site chat bubble fallback
 */

class EnhancedWhatsAppChat {
    constructor() {
        this.phoneNumber = '254742007277';
        this.isOpen = false;
        this.isMobile = this.detectMobile();
        this.whatsappAvailable = this.checkWhatsAppAvailability();
        this.userName = '';
        this.userEmail = '';
        this.currentStep = 'welcome';
        this.messages = [];
        
        this.init();
    }

    init() {
        this.createChatElements();
        this.attachEventListeners();
        this.setupFallbackChat();
        this.showInitialAnimation();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    checkWhatsAppAvailability() {
        // Check if WhatsApp is likely available
        return this.isMobile || window.confirm === window.confirm; // Simple check
    }

    createChatElements() {
        // Create floating chat button
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'enhanced-chat-btn';
        floatingBtn.className = 'enhanced-chat-button';
        floatingBtn.innerHTML = `
            <div class="chat-btn-content">
                <i class="fab fa-whatsapp" id="chat-icon"></i>
                <span class="pulse-ring"></span>
                <div class="chat-tooltip">
                    <span>Need help? Let's chat!</span>
                </div>
            </div>
        `;

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'enhanced-chat-window';
        chatWindow.className = 'enhanced-chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="agent-info">
                    <div class="agent-avatar">
                        <img src="assets/images/My_Profile_Photo.jpg" alt="Daniel Wanjala" class="avatar-img">
                        <div class="online-indicator"></div>
                    </div>
                    <div class="agent-details">
                        <h4>Daniel Wanjala</h4>
                        <span class="status">Data Scientist • Online</span>
                    </div>
                </div>
                <div class="chat-controls">
                    <button class="whatsapp-switch-btn" id="whatsapp-switch" title="Switch to WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button class="close-chat" id="close-chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="chat-body" id="chat-messages">
                <div class="typing-indicator" id="typing-indicator">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span class="typing-text">Daniel is typing...</span>
                </div>
            </div>
            <div class="chat-input-area">
                <div class="quick-actions" id="quick-actions">
                    <button class="quick-btn" data-action="portfolio">📁 Portfolio</button>
                    <button class="quick-btn" data-action="services">💼 Services</button>
                    <button class="quick-btn" data-action="contact">📞 Contact</button>
                </div>
                <div class="input-container">
                    <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
                    <button id="send-message" class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(floatingBtn);
        document.body.appendChild(chatWindow);
    }

    attachEventListeners() {
        const floatingBtn = document.getElementById('enhanced-chat-btn');
        const chatWindow = document.getElementById('enhanced-chat-window');
        const closeBtn = document.getElementById('close-chat');
        const whatsappBtn = document.getElementById('whatsapp-switch');
        const sendBtn = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');
        const quickBtns = document.querySelectorAll('.quick-btn');

        floatingBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        whatsappBtn.addEventListener('click', () => this.switchToWhatsApp());
        sendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Auto-hide tooltip after 5 seconds
        setTimeout(() => {
            const tooltip = document.querySelector('.chat-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-10px)';
            }
        }, 5000);
    }

    setupFallbackChat() {
        // Initialize with welcome message
        setTimeout(() => {
            this.addMessage('bot', '👋 Hi! I\'m Daniel. How can I help you today?');
            this.hideTypingIndicator();
        }, 1000);
    }

    showInitialAnimation() {
        const btn = document.getElementById('enhanced-chat-btn');
        setTimeout(() => {
            btn.classList.add('animate-bounce');
            setTimeout(() => btn.classList.remove('animate-bounce'), 2000);
        }, 2000);
    }

    toggleChat() {
        const chatWindow = document.getElementById('enhanced-chat-window');
        const floatingBtn = document.getElementById('enhanced-chat-btn');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('enhanced-chat-window');
        const floatingBtn = document.getElementById('enhanced-chat-btn');
        
        chatWindow.classList.add('active');
        floatingBtn.classList.add('chat-active');
        this.isOpen = true;
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
    }

    closeChat() {
        const chatWindow = document.getElementById('enhanced-chat-window');
        const floatingBtn = document.getElementById('enhanced-chat-btn');
        
        chatWindow.classList.remove('active');
        floatingBtn.classList.remove('chat-active');
        this.isOpen = false;
    }

    switchToWhatsApp() {
        const message = this.getWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        this.closeChat();
    }

    getWhatsAppMessage() {
        return `Hi Daniel! I'm interested in learning more about your data science services. I came from your portfolio website.`;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        
        this.showTypingIndicator();
        setTimeout(() => {
            this.generateBotResponse(message);
            this.hideTypingIndicator();
        }, 1500);
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add animation
        setTimeout(() => messageDiv.classList.add('fade-in'), 10);
    }

    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';
        
        if (message.includes('portfolio') || message.includes('project')) {
            response = '🚀 Great! Check out my featured projects including the Healthcare Analytics Platform and CBK Financial Forecasting Engine. Would you like me to tell you more about any specific project?';
        } else if (message.includes('service') || message.includes('hire') || message.includes('work')) {
            response = '💼 I offer data science consulting, machine learning solutions, and IT management services. I specialize in healthcare analytics and financial forecasting. What kind of project do you have in mind?';
        } else if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
            response = '📞 You can reach me at daniel.machimbo@example.com or through WhatsApp. I\'m based in Nairobi, Kenya. Would you like to schedule a consultation?';
        } else if (message.includes('experience') || message.includes('background')) {
            response = '👨‍💻 I have 4+ years of experience in data science and IT management. I\'ve worked on 50+ projects with 89% ML model accuracy. Currently working at Kingdom Hospital on healthcare analytics.';
        } else if (message.includes('hello') || message.includes('hi')) {
            response = '👋 Hello! Nice to meet you! I\'m Daniel, a data scientist specializing in healthcare analytics and financial forecasting. How can I help you today?';
        } else {
            response = '🤔 That\'s interesting! I\'d love to discuss this further. For detailed conversations about your specific needs, feel free to switch to WhatsApp or send me an email. How would you prefer to continue?';
        }
        
        this.addMessage('bot', response);
    }

    handleQuickAction(action) {
        switch(action) {
            case 'portfolio':
                this.addMessage('user', 'I\'d like to see your portfolio');
                break;
            case 'services':
                this.addMessage('user', 'What services do you offer?');
                break;
            case 'contact':
                this.addMessage('user', 'How can I contact you?');
                break;
        }
        
        this.showTypingIndicator();
        setTimeout(() => {
            this.generateBotResponse(action);
            this.hideTypingIndicator();
        }, 1000);
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.style.display = 'flex';
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedWhatsAppChat = new EnhancedWhatsAppChat();
});

// Export for external use
window.EnhancedWhatsAppChat = EnhancedWhatsAppChat;
