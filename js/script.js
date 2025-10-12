// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Service Quote Buttons
document.querySelectorAll('.quote-btn').forEach(button => {
    button.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        openQuotePopup(service);
    });
});

// Quote Popup Functions
function openQuotePopup(service) {
    const popup = document.getElementById('quote-popup');
    const popupContent = popup.querySelector('.bg-white');
    
    // Store the service for later use
    popup.setAttribute('data-service', service);
    
    // Show popup with animation
    popup.classList.remove('hidden');
    setTimeout(() => {
        popupContent.classList.add('popup-open', 'spin');
    }, 10);
    
    // Set up button handlers
    setupPopupButtons(service);
}

function setupPopupButtons(service) {
    const fillDetailsBtn = document.getElementById('fill-details-btn');
    const directChatBtn = document.getElementById('direct-chat-btn');
    const closePopup = document.getElementById('close-popup');
    
    // Remove existing event listeners
    fillDetailsBtn.replaceWith(fillDetailsBtn.cloneNode(true));
    directChatBtn.replaceWith(directChatBtn.cloneNode(true));
    closePopup.replaceWith(closePopup.cloneNode(true));
    
    // Get fresh references
    const freshFillBtn = document.getElementById('fill-details-btn');
    const freshDirectBtn = document.getElementById('direct-chat-btn');
    const freshCloseBtn = document.getElementById('close-popup');
    
    // Fill Details button - scroll to contact form
    freshFillBtn.addEventListener('click', function() {
        closeQuotePopup();
        // Scroll to contact form and pre-fill service
        document.getElementById('service').value = getServiceValue(service);
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Direct Chat button - open WhatsApp
    freshDirectBtn.addEventListener('click', function() {
        const message = `Hi, I'm interested in ${service}. Can you provide more information and pricing?`;
        const whatsappUrl = `https://wa.me/919642661602?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        closeQuotePopup();
    });
    
    // Close button
    freshCloseBtn.addEventListener('click', closeQuotePopup);
}

function closeQuotePopup() {
    const popup = document.getElementById('quote-popup');
    const popupContent = popup.querySelector('.bg-white');
    
    popupContent.classList.remove('popup-open', 'spin');
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 300);
}

function getServiceValue(serviceName) {
    const serviceMap = {
        'Mesh Sliding Doors': 'mesh-doors',
        'Invisible Grills': 'invisible-grills',
        'UPVC Windows': 'upvc-windows',
        'Aluminium Windows': 'aluminium-windows',
        'LED Mirrors': 'led-mirrors',
        'Shower Partitions': 'shower-partitions',
        'Aluminium Kitchen Profiles': 'kitchen-profiles'
    };
    return serviceMap[serviceName] || 'other';
}

// Estimation Calculator Logic
document.getElementById('calculate-btn').addEventListener('click', function() {
    const product = document.getElementById('product').value;
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    
    if (!product || width <= 0 || height <= 0) {
        document.getElementById('estimate-result').innerHTML = 
            '<p class="text-red-500">Please select a product and enter valid dimensions</p>';
        return;
    }
    
    // Base prices per square foot for different products
    const basePrices = {
        'mesh-doors': 400,
        'invisible-grills': 350,
        'upvc-windows': 600,
        'aluminium-windows': 450,
        'led-mirrors': 1200,
        'shower-partitions': 800,
        'kitchen-profiles': 500
    };
    
    const area = width * height;
    const basePrice = basePrices[product] * area;
    
    // Add-ons cost
    let addonsCost = 0;
    const addons = document.querySelectorAll('input[type="checkbox"]:checked');
    addons.forEach(addon => {
        switch(addon.value) {
            case 'child-lock': addonsCost += 500; break;
            case 'premium-mesh': addonsCost += 800; break;
            case 'frosted-glass': addonsCost += 1200; break;
            case 'anti-fog': addonsCost += 1500; break;
        }
    });
    
    const totalEstimate = basePrice + addonsCost;
    const variance = totalEstimate * 0.3; // 30% variance
    
    const minEstimate = Math.round(totalEstimate - variance);
    const maxEstimate = Math.round(totalEstimate + variance);
    
    document.getElementById('estimate-result').innerHTML = `
        <p class="text-3xl font-bold text-blue-700 mb-2">₹${minEstimate.toLocaleString()} - ₹${maxEstimate.toLocaleString()}</p>
        <p class="text-gray-600">Estimated Starting Price</p>
    `;
});

// Form submission - Send to WhatsApp
document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').options[document.getElementById('service').selectedIndex].text,
        property: document.getElementById('property').options[document.getElementById('property').selectedIndex].text,
        location: document.getElementById('location').value,
        budget: document.getElementById('budget').options[document.getElementById('budget').selectedIndex].text,
        requirements: document.getElementById('requirements').value
    };
    
    // Create WhatsApp message
    let message = `*New Lead - Hyderabad Window Solutions*%0A%0A`;
    message += `*Name:* ${formData.name}%0A`;
    message += `*Phone:* ${formData.phone}%0A`;
    message += `*Email:* ${formData.email || 'Not provided'}%0A`;
    message += `*Service:* ${formData.service}%0A`;
    message += `*Property Type:* ${formData.property}%0A`;
    message += `*Location:* ${formData.location}%0A`;
    message += `*Budget:* ${formData.budget || 'Not specified'}%0A`;
    message += `*Requirements:* ${formData.requirements || 'Not specified'}%0A%0A`;
    message += `*Note:* ₹250 site visit charge applicable`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/919642661602?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    alert('Thank you! Your details have been prepared to send via WhatsApp. Please confirm the message to connect with our expert.');
    document.getElementById('lead-form').reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.add('hidden');
        }
    });
});

// Form validation
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value) {
            this.classList.add('border-red-500');
        } else {
            this.classList.remove('border-red-500');
        }
    });
});

// Close popup when clicking outside
document.getElementById('quote-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeQuotePopup();
    }
});
