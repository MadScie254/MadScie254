// WhatsApp API Integration System
class WhatsAppAPIIntegration {
    constructor() {
        this.phoneNumber = '254742007277';
        this.apiEndpoints = {
            // Free WhatsApp API services
            callmebot: 'https://api.callmebot.com/whatsapp.php',
            whatsappJS: 'https://web.whatsapp.com/send',
            twilioSandbox: 'https://api.twilio.com/2010-04-01/Accounts/sandbox/Messages.json',
            // Alternative free services
            chatAPI: 'https://api.chat-api.com/instance/send',
            greenAPI: 'https://api.green-api.com/waInstance/SendMessage'
        };
        this.messagingQueue = [];
        this.init();
    }

    init() {
        this.setupCallMeBotIntegration();
        this.setupWhatsAppWebIntegration();
        this.setupFormspreeIntegration();
        this.setupEmailJSIntegration();
    }

    // Method 1: CallMeBot WhatsApp API (Free)
    setupCallMeBotIntegration() {
        this.callMeBotApiKey = 'your-callmebot-api-key'; // Get from https://www.callmebot.com/blog/free-api-whatsapp-messages/
    }

    async sendViaCallMeBot(message, userPhone = null) {
        try {
            const params = new URLSearchParams({
                phone: this.phoneNumber,
                text: message,
                apikey: this.callMeBotApiKey
            });

            const response = await fetch(`${this.apiEndpoints.callmebot}?${params}`, {
                method: 'GET'
            });

            if (response.ok) {
                console.log('Message sent via CallMeBot successfully');
                return { success: true, provider: 'CallMeBot' };
            }
        } catch (error) {
            console.error('CallMeBot API error:', error);
            return { success: false, error: error.message };
        }
    }

    // Method 2: WhatsApp Web URL (Direct Redirect)
    sendViaWhatsAppWeb(message, userPhone = null) {
        try {
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
            
            // Store the message attempt
            this.logMessageAttempt(message, 'WhatsApp Web', userPhone);
            
            // Open WhatsApp Web in new tab
            window.open(whatsappURL, '_blank');
            
            return { success: true, provider: 'WhatsApp Web' };
        } catch (error) {
            console.error('WhatsApp Web error:', error);
            return { success: false, error: error.message };
        }
    }

    // Method 3: Formspree Email-to-WhatsApp Bridge
    setupFormspreeIntegration() {
        this.formspreeEndpoint = 'https://formspree.io/f/xdkogqak'; // Your existing Formspree endpoint
    }

    async sendViaFormspree(message, userEmail = null, userName = null) {
        try {
            const formData = new FormData();
            formData.append('message', message);
            formData.append('type', 'WhatsApp Message Request');
            formData.append('userEmail', userEmail || 'anonymous@visitor.com');
            formData.append('userName', userName || 'Website Visitor');
            formData.append('timestamp', new Date().toISOString());
            formData.append('source', 'WhatsApp Bot Widget');

            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Message sent via Formspree successfully');
                this.showSuccessNotification('Message sent! Daniel will respond via WhatsApp soon.');
                return { success: true, provider: 'Formspree Email Bridge' };
            }
        } catch (error) {
            console.error('Formspree API error:', error);
            return { success: false, error: error.message };
        }
    }

    // Method 4: EmailJS Integration
    setupEmailJSIntegration() {
        this.emailJSConfig = {
            serviceID: 'service_whatsapp_bridge',
            templateID: 'template_whatsapp_message',
            userID: 'your-emailjs-user-id'
        };
    }

    async sendViaEmailJS(message, userInfo = {}) {
        try {
            // Load EmailJS if not already loaded
            if (typeof emailjs === 'undefined') {
                await this.loadEmailJS();
            }

            const templateParams = {
                to_name: 'Daniel Wanjala',
                from_name: userInfo.name || 'Website Visitor',
                from_email: userInfo.email || 'visitor@website.com',
                message: message,
                phone_request: `Please respond to this message via WhatsApp: +${this.phoneNumber}`,
                timestamp: new Date().toLocaleString(),
                source: 'Portfolio WhatsApp Bot'
            };

            const response = await emailjs.send(
                this.emailJSConfig.serviceID,
                this.emailJSConfig.templateID,
                templateParams,
                this.emailJSConfig.userID
            );

            if (response.status === 200) {
                console.log('Message sent via EmailJS successfully');
                return { success: true, provider: 'EmailJS' };
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            return { success: false, error: error.message };
        }
    }

    // Method 5: Webhook Integration
    async sendViaWebhook(message, userInfo = {}) {
        try {
            const webhookURL = 'https://hooks.zapier.com/hooks/catch/your-webhook-id/'; // Replace with your Zapier webhook
            
            const payload = {
                message: message,
                userInfo: userInfo,
                timestamp: new Date().toISOString(),
                phoneNumber: this.phoneNumber,
                type: 'whatsapp_message_request'
            };

            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('Message sent via Webhook successfully');
                return { success: true, provider: 'Zapier Webhook' };
            }
        } catch (error) {
            console.error('Webhook error:', error);
            return { success: false, error: error.message };
        }
    }

    // Master send method with fallback
    async sendMessage(message, userInfo = {}) {
        const methods = [
            () => this.sendViaFormspree(message, userInfo.email, userInfo.name),
            () => this.sendViaWhatsAppWeb(message, userInfo.phone),
            () => this.sendViaEmailJS(message, userInfo),
            () => this.sendViaWebhook(message, userInfo),
            () => this.sendViaCallMeBot(message, userInfo.phone)
        ];

        let successfulSend = false;
        const results = [];

        for (const method of methods) {
            try {
                const result = await method();
                results.push(result);
                
                if (result.success) {
                    successfulSend = true;
                    this.showSuccessNotification(`Message sent via ${result.provider}!`);
                    break; // Exit loop on first successful send
                }
            } catch (error) {
                console.error('Send method failed:', error);
                results.push({ success: false, error: error.message });
            }
        }

        if (!successfulSend) {
            this.showErrorNotification('Unable to send message. Please try WhatsApp directly.');
            // Fallback to WhatsApp Web as last resort
            this.sendViaWhatsAppWeb(message, userInfo.phone);
        }

        return { 
            success: successfulSend, 
            results: results,
            fallbackUsed: !successfulSend 
        };
    }

    // Utility methods
    logMessageAttempt(message, provider, userPhone = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            message: message,
            provider: provider,
            userPhone: userPhone,
            status: 'attempted'
        };
        
        // Store in localStorage for tracking
        const logs = JSON.parse(localStorage.getItem('whatsapp_message_logs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('whatsapp_message_logs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
    }

    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }

    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `whatsapp-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.remove();
        });
    }

    async loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Integration with existing WhatsApp bot
    integrateWithBot(botInstance) {
        // Override the bot's sendMessage method
        const originalSendMessage = botInstance.sendMessage;
        botInstance.sendMessage = async () => {
            const input = document.getElementById('user-message-input');
            const message = input.value.trim();
            
            if (message) {
                // Add user message to chat
                botInstance.addUserMessage(message);
                input.value = '';
                
                // Send via API
                const fullMessage = `New message from portfolio visitor:\n\n"${message}"\n\nPlease respond via WhatsApp.`;
                await this.sendMessage(fullMessage, {
                    name: botInstance.userName || 'Website Visitor',
                    email: botInstance.userEmail || 'visitor@portfolio.com'
                });
                
                // Generate bot response
                setTimeout(() => {
                    botInstance.generateBotResponse(message);
                }, 1000);
            }
        };
    }

    // Get message delivery status
    getMessageStatus() {
        const logs = JSON.parse(localStorage.getItem('whatsapp_message_logs') || '[]');
        const recentLogs = logs.slice(-10);
        
        return {
            totalSent: logs.length,
            recentActivity: recentLogs,
            lastMessage: logs[logs.length - 1] || null
        };
    }
}

// Initialize WhatsApp API Integration
const whatsappAPI = new WhatsAppAPIIntegration();

// Auto-integrate with existing bot when it loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.whatsappBot) {
            whatsappAPI.integrateWithBot(window.whatsappBot);
            console.log('WhatsApp API integration completed!');
        }
    }, 1000);
});
