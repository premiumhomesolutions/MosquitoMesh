// WhatsApp Chatbot Implementation
class WhatsAppChatbot {
    constructor() {
        this.phoneNumber = '919642661602';
        this.defaultMessage = "Hi, I'm interested in your services for my home in [Area, Hyderabad]. Can you provide more info?";
        this.init();
    }
    
    init() {
        this.createChatbot();
        this.addEventListeners();
    }
    
    createChatbot() {
        const chatbotHTML = `
            <a href="https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.defaultMessage)}" 
               target="_blank" 
               class="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg pulse z-50 whatsapp-button">
                <i class="fab fa-whatsapp text-2xl"></i>
            </a>
        `;
        
        document.getElementById('whatsapp-chatbot').innerHTML = chatbotHTML;
    }
    
    addEventListeners() {
        // Add click tracking for analytics
        document.querySelector('.whatsapp-button').addEventListener('click', () => {
            this.trackEvent('WhatsApp Click', 'Chat Initiated');
        });
        
        // Optional: Add chatbot expansion functionality
        this.addChatExpansion();
    }
    
    trackEvent(category, action) {
        // In a real implementation, you would send this to Google Analytics
        console.log(`Event tracked: ${category} - ${action}`);
        
        // Example for Google Analytics:
        // gtag('event', action, {
        //     'event_category': category,
        //     'event_label': 'WhatsApp Chat'
        // });
    }
    
    addChatExpansion() {
        // Optional: Expand to show more options when clicked
        const whatsappButton = document.querySelector('.whatsapp-button');
        
        whatsappButton.addEventListener('mouseenter', () => {
            // Could show a tooltip or expand the button
            this.showTooltip();
        });
        
        whatsappButton.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }
    
    showTooltip() {
        // Create and show a tooltip
        let tooltip = document.querySelector('.whatsapp-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'whatsapp-tooltip fixed bottom-20 right-6 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-50 max-w-xs';
            tooltip.innerHTML = `
                <p class="text-sm font-medium">Chat with us on WhatsApp!</p>
                <p class="text-xs text-gray-600 mt-1">We typically reply within 15 minutes</p>
            `;
            document.body.appendChild(tooltip);
            
            // Remove tooltip after 3 seconds
            setTimeout(() => {
                if (tooltip && document.body.contains(tooltip)) {
                    document.body.removeChild(tooltip);
                }
            }, 3000);
        }
    }
    
    hideTooltip() {
        const tooltip = document.querySelector('.whatsapp-tooltip');
        if (tooltip && document.body.contains(tooltip)) {
            document.body.removeChild(tooltip);
        }
    }
    
    // Method to update the default message based on user context
    updateMessage(area, service) {
        let message = "Hi, I'm interested in your services";
        
        if (service) {
            message += ` for ${service}`;
        }
        
        if (area) {
            message += ` for my home in ${area}, Hyderabad`;
        } else {
            message += " for my home in Hyderabad";
        }
        
        message += ". Can you provide more info?";
        
        this.defaultMessage = message;
        this.updateChatbotLink();
    }
    
    updateChatbotLink() {
        const link = document.querySelector('.whatsapp-button');
        link.href = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.defaultMessage)}`;
    }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new WhatsAppChatbot();
    
    // Optional: Update WhatsApp message based on form inputs
    const locationInput = document.getElementById('location');
    const serviceSelect = document.getElementById('service');
    
    if (locationInput) {
        locationInput.addEventListener('change', () => {
            chatbot.updateMessage(locationInput.value, serviceSelect.value);
        });
    }
    
    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            chatbot.updateMessage(locationInput.value, serviceSelect.value);
        });
    }
});
