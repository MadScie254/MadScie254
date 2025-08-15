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
        document.getElementById('quick-actions').style.display = 'none';
        this.showMessageInput();
        
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
            this.addBotMessage("What specific project do you have in mind? Feel free to describe your requirements in detail below, and I'll make sure Daniel gets your message!");
            this.enableChatMode();
        }, 2500);
    }

    handleResumeRequest() {
        this.addBotMessage("📋 You can find Daniel's complete professional background on his portfolio:");
        setTimeout(() => {
            this.addBotMessage("🔗 <a href='about.html' style='color: #25D366;'>View About Page</a>\n🔗 <a href='education.html' style='color: #25D366;'>Education & Certifications</a>\n🔗 <a href='projects.html' style='color: #25D366;'>Portfolio Projects</a>");
        }, 1000);
        
        setTimeout(() => {
            this.addBotMessage("Would you like to discuss Daniel's experience for a specific role? Please share more details below:");
            this.enableChatMode();
        }, 2000);
    }

    handleMeetingRequest() {
        this.addBotMessage("📅 Daniel is available for consultations! Here are the best ways to schedule:");
        setTimeout(() => {
            this.addBotMessage("• WhatsApp: Immediate response (preferred)\n• Email: dmwanjala254@gmail.com\n• LinkedIn: Professional networking");
        }, 1000);
        
        setTimeout(() => {
            this.addBotMessage("When would you prefer to meet? Please let me know your availability and preferred meeting format:");
            this.enableChatMode();
        }, 2000);
    }

    handleGeneralInquiry() {
        this.addBotMessage("💬 I'm here to help! Here's what I can tell you about Daniel:");
        setTimeout(() => {
            this.addBotMessage("🏆 Award-winning Data Scientist\n🏥 Healthcare Analytics Expert\n🏢 IT Manager with 5+ years experience\n🎓 Master's in Computer Science (AI/ML)");
        }, 1000);
        
        setTimeout(() => {
            this.addBotMessage("What would you like to know more about? Feel free to ask any questions:");
            this.enableChatMode();
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
        quickActionsContainer.style.display = 'flex';
    }

    enableChatMode() {
        document.getElementById('message-input-area').style.display = 'flex';
        document.getElementById('user-message-input').focus();
        
        // Add helpful suggestions
        setTimeout(() => {
            this.showChatSuggestions();
        }, 1000);
    }

    showChatSuggestions() {
        const quickActionsContainer = document.getElementById('quick-actions');
        quickActionsContainer.innerHTML = `
            <div class="chat-suggestions">
                <small style="color: #666; margin-bottom: 0.5rem; display: block;">💡 Quick suggestions:</small>
                <button class="suggestion-btn" onclick="document.getElementById('user-message-input').value = 'I need help with data analysis for my healthcare project'">
                    🏥 Healthcare project
                </button>
                <button class="suggestion-btn" onclick="document.getElementById('user-message-input').value = 'Can we schedule a 30-minute consultation call?'">
                    📞 Schedule consultation
                </button>
                <button class="suggestion-btn" onclick="document.getElementById('user-message-input').value = 'What are your rates for machine learning projects?'">
                    💰 Pricing inquiry
                </button>
            </div>
        `;
        quickActionsContainer.style.display = 'block';
    }

    showMessageInput() {
        document.getElementById('message-input-area').style.display = 'flex';
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
            
            // Hide suggestions when user starts typing
            document.getElementById('quick-actions').style.display = 'none';
            
            // Store the conversation for WhatsApp
            this.userMessages = this.userMessages || [];
            this.userMessages.push(message);
            
            // Simulate bot response based on message content
            setTimeout(() => {
                this.generateBotResponse(message);
            }, 1000);
        }
    }

    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('price') || message.includes('cost') || message.includes('rate') || message.includes('budget')) {
            this.addBotMessage("💰 Great question! Daniel's pricing varies based on project scope and complexity. Here's a general overview:");
            setTimeout(() => {
                this.addBotMessage("• Consultation: Free initial 30-min call\n• Hourly rate: Competitive market rates\n• Project-based: Custom quotes available\n• Long-term contracts: Discounted rates");
            }, 1000);
            setTimeout(() => {
                this.addBotMessage("Would you like to discuss your specific requirements? I can connect you with Daniel for a detailed quote!");
                this.showFinalWhatsAppButton();
            }, 2000);
        }
        else if (message.includes('time') || message.includes('schedule') || message.includes('meet') || message.includes('call')) {
            this.addBotMessage("📅 Daniel is quite flexible with scheduling! He typically works:");
            setTimeout(() => {
                this.addBotMessage("🕘 Monday-Friday: 8 AM - 6 PM (EAT)\n🕘 Weekends: By appointment\n🌍 Available for international calls\n⚡ Quick response on WhatsApp");
            }, 1000);
            setTimeout(() => {
                this.addBotMessage("Let me connect you directly so you can coordinate the perfect time!");
                this.showFinalWhatsAppButton();
            }, 2000);
        }
        else if (message.includes('project') || message.includes('help') || message.includes('need')) {
            this.addBotMessage("🚀 Excellent! Daniel loves working on challenging data science projects. Based on what you've shared, here's how he can help:");
            setTimeout(() => {
                this.addBotMessage("✅ Project scoping and planning\n✅ Technical feasibility analysis\n✅ Implementation roadmap\n✅ Ongoing support and maintenance");
            }, 1000);
            setTimeout(() => {
                this.addBotMessage("Ready to dive deeper into your project details? Let's get you connected!");
                this.showFinalWhatsAppButton();
            }, 2000);
        }
        else if (message.includes('experience') || message.includes('background') || message.includes('qualification')) {
            this.addBotMessage("🏆 Daniel brings impressive credentials to every project:");
            setTimeout(() => {
                this.addBotMessage("🎓 Master's in Computer Science (AI/ML)\n🏥 Healthcare analytics specialist\n💼 5+ years IT management\n🏆 Award-winning data scientist\n📊 Proven track record with real impact");
            }, 1000);
            setTimeout(() => {
                this.addBotMessage("Want to see specific examples of his work? Let's continue the conversation!");
                this.showFinalWhatsAppButton();
            }, 2000);
        }
        else {
            this.addBotMessage("Thank you for sharing that! I've noted your message and Daniel will be able to give you a detailed response.");
            setTimeout(() => {
                this.addBotMessage("To ensure you get the most comprehensive answer to your specific question, let me connect you directly with Daniel on WhatsApp!");
                this.showFinalWhatsAppButton();
            }, 1500);
        }
    }

    showFinalWhatsAppButton() {
        const conversation = this.getAllConversationText();
        const quickActionsContainer = document.getElementById('quick-actions');
        quickActionsContainer.innerHTML = `
            <div class="final-whatsapp-section">
                <div class="conversation-summary">
                    <small style="color: #666; margin-bottom: 0.5rem; display: block;">📝 Your conversation will be shared with Daniel</small>
                </div>
                <button class="whatsapp-direct-btn final-btn" onclick="window.open('https://wa.me/254742007277?text=${encodeURIComponent(conversation)}', '_blank')">
                    <i class="fab fa-whatsapp"></i>
                    Continue Conversation on WhatsApp
                </button>
                <div class="chat-actions">
                    <button class="continue-chat-btn" onclick="document.getElementById('user-message-input').focus()">
                        💬 Ask more questions first
                    </button>
                </div>
            </div>
        `;
        quickActionsContainer.style.display = 'block';
    }

    getAllConversationText() {
        const messages = document.querySelectorAll('.message');
        let conversation = "Hi Daniel! I had a conversation with your AI assistant. Here's our discussion:\n\n";
        
        messages.forEach(message => {
            const isBot = message.classList.contains('bot-message');
            const text = message.querySelector('.message-text').textContent;
            const prefix = isBot ? "🤖 Assistant: " : "👤 Visitor: ";
            conversation += prefix + text + "\n\n";
        });
        
        conversation += "I'd like to continue our conversation with you directly. Looking forward to hearing from you!";
        return conversation;
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
