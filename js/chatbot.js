// chatbot.js - simple WhatsApp floating link and safe initialization
class WhatsAppChatbot {
  constructor(phone = '919642661602') {
    this.phoneNumber = phone;
    this.defaultMessage = "Hi, I'm interested in your services for my home. Can you provide more info?";
  }

  render(containerId = 'floatingWhatsapp') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // build link
    const anchor = document.createElement('a');
    anchor.href = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.defaultMessage)}`;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'whatsapp-float';
    anchor.innerHTML = `<i class="fab fa-whatsapp"></i><span class="whatsapp-text">Chat with us</span>`;
    container.replaceWith(anchor); // replace placeholder
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const w = new WhatsAppChatbot();
    w.render('floatingWhatsapp');
  } catch (e) {
    console.warn('WhatsApp widget init failed', e);
  }
});
