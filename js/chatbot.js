// chatbot.js - WhatsApp floating widget and message builder

class WhatsAppChatbot {
  constructor(phone = '919642661602') {
    this.phone = phone;
    this.defaultMessage = "Hi, I'm interested in your home solutions services. Can you provide more information?";
  }

  render(containerId = 'whatsapp-chatbot') {
    const container = document.getElementById(containerId);
    const anchor = document.createElement('a');
    anchor.className = 'whatsapp-float';
    anchor.href = `https://wa.me/${this.phone}?text=${encodeURIComponent(this.defaultMessage)}`;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.innerHTML = `<i class="fab fa-whatsapp"></i><span class="whatsapp-text">Chat with us</span>`;
    if (container) container.appendChild(anchor);
    else document.body.appendChild(anchor);
  }

  updateMessage(message) {
    this.defaultMessage = message;
    const link = document.querySelector('.whatsapp-float');
    if (link) link.href = `https://wa.me/${this.phone}?text=${encodeURIComponent(this.defaultMessage)}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.PHS_WhatsApp = new WhatsAppChatbot();
  window.PHS_WhatsApp.render('whatsapp-chatbot');
});
