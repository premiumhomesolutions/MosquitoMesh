// Main JavaScript for functionality

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to estimator function
function scrollToEstimator() {
    document.getElementById('estimator').scrollIntoView({
        behavior: 'smooth'
    });
}

// WhatsApp integration
function openWhatsApp() {
    const phone = "919876543210"; // Replace with actual phone number
    const message = "Hi, I'm interested in your home solutions services in Hyderabad. Can you provide more information?";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(44, 62, 80, 0.98)';
        navbar.style.padding = '10px 0';
    } else {
        navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        navbar.style.padding = '15px 0';
    }
});

// Form handling
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const area = this.querySelector('input[placeholder*="Area"]').value;
    
    const message = `New Lead from Website:%0A%0AName: ${name}%0APhone: ${phone}%0AArea: ${area}%0AInterested in: ${document.getElementById('serviceType').value}`;
    
    const whatsappUrl = `https://wa.me/919876543210?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    this.reset();
    
    // Show success message
    alert('Thank you! We will contact you shortly on WhatsApp.');
});

// Service areas in Hyderabad
const hyderabadAreas = [
    "Gachibowli", "HITEC City", "Madhapur", "Kondapur", "Jubilee Hills",
    "Banjara Hills", "Financial District", "Nanakramguda", "Kokapet",
    "Manikonda", "Miyapur", "Kukatpally", "Ameerpet", "SR Nagar"
];

// Initialize any other components
document.addEventListener('DOMContentLoaded', function() {
    console.log('Premium Home Solutions Website Loaded');
});
