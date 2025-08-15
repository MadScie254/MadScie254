// WhatsApp Floating Bot - Advanced Interactive Assistant
class WhatsAppBot {
    constructor() {
        this.phoneNumber = '254742007277';
        this.isOpen = false;
        this.currentStep = 'welcome';
        this.userName = '';
        this.userEmail = '';
        this.selectedService = '';
        this.init();
    }

    init() {
        this.createBotElements();
        this.attachEventListeners();
        this.showWelcomeAnimation();
    }

    createBotElements() {
        // Create floating button
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'whatsapp-float-btn';
        floatingBtn.innerHTML = `
            <div class="whatsapp-btn-content">
                <i class="fab fa-whatsapp"></i>
                <span class="pulse-ring"></span>
                <span class="notification-badge" id="wa-notification">1</span>
            </div>
        `;

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'whatsapp-chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="agent-info">
                    <div class="agent-avatar">
                        <img src="assets/images/daniel.jpg" alt="Daniel Wanjala" onerror="this.style.display='none'">
                        <div class="online-indicator"></div>
                    </div>
                    <div class="agent-details">
                        <h4>Daniel Wanjala</h4>
                        <span class="status">Data Scientist • Online</span>
                    </div>
                </div>
                <button class="close-chat" id="close-whatsapp-chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-body" id="chat-messages">
                <!-- Messages will be populated here -->
            </div>
            <div class="chat-footer">
                <div class="quick-actions" id="quick-actions">
                    <!-- Quick action buttons -->
                </div>
                <div class="message-input-area" id="message-input-area" style="display: none;">
                    <input type="text" id="user-message-input" placeholder="Type your message...">
                    <button id="send-whatsapp-message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(floatingBtn);
        document.body.appendChild(chatWindow);
    }

    attachEventListeners() {
        const floatingBtn = document.getElementById('whatsapp-float-btn');
        const closeBtn = document.getElementById('close-whatsapp-chat');
        const sendBtn = document.getElementById('send-whatsapp-message');
        const messageInput = document.getElementById('user-message-input');

        floatingBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    showWelcomeAnimation() {
        setTimeout(() => {
            this.addBotMessage("👋 Hi! I'm Daniel's AI assistant. I'm here to help you connect with Daniel for data science opportunities!");
            this.showNotification();
        }, 3000);
    }

    showNotification() {
        const notification = document.getElementById('wa-notification');
        notification.style.display = 'block';
        
        // Pulse animation
        setTimeout(() => {
            notification.classList.add('pulse');
        }, 100);
    }

    hideNotification() {
        const notification = document.getElementById('wa-notification');
        notification.style.display = 'none';
        notification.classList.remove('pulse');
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('whatsapp-chat-window');
        const floatingBtn = document.getElementById('whatsapp-float-btn');
        
        chatWindow.classList.add('active');
        floatingBtn.classList.add('chat-open');
        this.isOpen = true;
        this.hideNotification();
        
        if (document.getElementById('chat-messages').children.length === 0) {
            this.startConversation();
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('whatsapp-chat-window');
        const floatingBtn = document.getElementById('whatsapp-float-btn');
        
        chatWindow.classList.remove('active');
        floatingBtn.classList.remove('chat-open');
        this.isOpen = false;
    }

    startConversation() {
        this.addBotMessage("🚀 Welcome! I'm Daniel's virtual assistant. How can I help you today?");
        
        setTimeout(() => {
            this.showQuickActions([
                { text: "💼 Discuss Project", action: "project" },
                { text: "📄 View Resume", action: "resume" },
                { text: "🤝 Schedule Meeting", action: "meeting" },
                { text: "💬 General Inquiry", action: "general" }
            ]);
        }, 1000);
    }

    showQuickActions(actions) {
        const quickActionsContainer = document.getElementById('quick-actions');
        quickActionsContainer.innerHTML = '';
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'quick-action-btn';
            button.innerHTML = action.text;
            button.addEventListener('click', () => this.handleQuickAction(action.action, action.text));
            quickActionsContainer.appendChild(button);
        });
        
        quickActionsContainer.style.display = 'flex';
    }

    handleQuickAction(action, text) {
        this.addUserMessage(text);
        
        setTimeout(() => {
            switch(action) {
                case 'project':
                    this.handleProjectInquiry();
                    break;
                case 'resume':
                    this.handleResumeRequest();
                    break;
                case 'meeting':
                    this.handleMeetingRequest();
                    break;
                case 'general':
                    this.handleGeneralInquiry();
                    break;
            }
        }, 800);
    }

    handleProjectInquiry() {
        this.addBotMessage("🎯 Excellent! Daniel specializes in:");
        setTimeout(() => {
            this.addBotMessage("• Healthcare Analytics & Predictive Modeling\n• Financial Forecasting & Risk Analysis\n• Machine Learning & AI Solutions\n• Business Intelligence Dashboards");
        }, 1000);
        
        setTimeout(() => {
            this.addBotMessage("What type of data science project are you interested in? Click below to start a WhatsApp conversation with Daniel!");
            this.showWhatsAppButton("Hi Daniel! I'm interested in discussing a data science project. Could we schedule a time to chat about my requirements?");
        }, 2500);
    }

    handleResumeRequest() {
        this.addBotMessage("📋 You can find Daniel's complete professional background on his portfolio:");
        setTimeout(() => {
            this.addBotMessage("🔗 <a href='about.html' style='color: #25D366;'>View About Page</a>\n🔗 <a href='education.html' style='color: #25D366;'>Education & Certifications</a>\n🔗 <a href='projects.html' style='color: #25D366;'>Portfolio Projects</a>");
        }, 1000);
        
        setTimeout(() => {
            this.addBotMessage("Would you like to discuss Daniel's experience for a specific role?");
            this.showWhatsAppButton("Hi Daniel! I've reviewed your portfolio and would like to discuss your experience for a potential opportunity.");
        }, 2000);
    }

    handleMeetingRequest() {
        this.addBotMessage("📅 Daniel is available for consultations! Here are the best ways to schedule:");
        setTimeout(() => {
            this.addBotMessage("• WhatsApp: Immediate response (preferred)\n• Email: dmwanjala254@gmail.com\n• LinkedIn: Professional networking");
        }, 1000);
        
        setTimeout(() => {
            this.addBotMessage("Click below to message Daniel directly and schedule your meeting!");
            this.showWhatsAppButton("Hi Daniel! I'd like to schedule a meeting to discuss potential collaboration. When would be a good time for you?");
        }, 2000);
    }

    handleGeneralInquiry() {
        this.addBotMessage("💬 I'm here to help! Here's what I can tell you about Daniel:");
        setTimeout(() => {
            this.addBotMessage("🏆 Award-winning Data Scientist\n🏥 Healthcare Analytics Expert\n🏢 IT Manager with 5+ years experience\n🎓 Master's in Computer Science (AI/ML)");
        }, 1000);
        
        setTimeout(() => {
            this.addBotMessage("What specific information would you like to know?");
            this.showWhatsAppButton("Hi Daniel! I have some questions about your background and would love to chat.");
        }, 2000);
    }

    showWhatsAppButton(message) {
        const quickActionsContainer = document.getElementById('quick-actions');
        quickActionsContainer.innerHTML = `
            <button class="whatsapp-direct-btn" onclick="window.open('https://wa.me/254742007277?text=${encodeURIComponent(message)}', '_blank')">
                <i class="fab fa-whatsapp"></i>
                Continue on WhatsApp
            </button>
        `;
    }

    addBotMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Hide quick actions when user sends message
        document.getElementById('quick-actions').style.display = 'none';
    }

    sendMessage() {
        const input = document.getElementById('user-message-input');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                this.addBotMessage("Thanks for your message! For the fastest response, please continue our conversation on WhatsApp where Daniel can assist you personally.");
                this.showWhatsAppButton(`Hi Daniel! ${message}`);
            }, 1000);
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize WhatsApp Bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppBot();
});

// Auto-show welcome message after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const notification = document.getElementById('wa-notification');
        if (notification) {
            notification.classList.add('pulse');
        }
    }, 5000);
});
