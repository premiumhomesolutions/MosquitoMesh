// chatbot.js - simple WhatsApp floating widget
class WhatsAppChatbot {
  constructor(phone = '919642661602') {
    this.phoneNumber = phone;
    this.defaultMessage = "Hi, I'm interested in your home solutions services. Can you provide more information?";
  }

  render(placeholderId = 'floatingWhatsappPlaceholder') {
    const placeholder = document.getElementById(placeholderId);
    const anchor = document.createElement('a');
    anchor.className = 'whatsapp-float';
    anchor.href = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.defaultMessage)}`;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.innerHTML = `<i class="fab fa-whatsapp"></i><span class="whatsapp-text">Chat with us</span>`;
    if (placeholder) placeholder.replaceWith(anchor);
    else document.body.appendChild(anchor);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const widget = new WhatsAppChatbot();
  widget.render();
});
