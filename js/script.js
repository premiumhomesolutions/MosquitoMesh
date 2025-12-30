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

// Scroll to estimator with pre-selected service
function scrollToEstimatorWithService(serviceType) {
    document.getElementById('serviceType').value = serviceType;
    updateAddons();
    scrollToEstimator();
}

// WhatsApp integration
function openWhatsApp() {
    const phone = "919642661602";
    const message = "Hi, I'm interested in your home solutions services. Can you provide more information?";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Phone call function
function makeCall() {
    window.location.href = 'tel:+919642661602';
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

// Service Modals Data
const serviceDetails = {
    mesh: {
        title: "Mosquito Mesh Doors",
        description: "Premium anti-mosquito sliding doors with complete protection for your home.",
        features: [
            { icon: "fas fa-shield-alt", text: "10 Years Warranty" },
            { icon: "fas fa-gem", text: "Premium Quality Mesh" },
            { icon: "fas fa-calendar-day", text: "1-2 Days Installation" },
            { icon: "fas fa-users", text: "2-3 Expert Laborers" },
            { icon: "fas fa-ruler-combined", text: "Custom Size Available" },
            { icon: "fas fa-magnet", text: "Magnetic Locking System" }
        ],
        price: "₹250/sqft"
    },
    invisible: {
        title: "Invisible Grills",
        description: "Transparent safety grills for balconies and windows with uninterrupted views.",
        features: [
            { icon: "fas fa-shield-alt", text: "15 Years Warranty" },
            { icon: "fas fa-gem", text: "316 Grade Steel" },
            { icon: "fas fa-calendar-day", text: "2-3 Days Installation" },
            { icon: "fas fa-users", text: "3-4 Expert Laborers" },
            { icon: "fas fa-child", text: "Child Safety Certified" },
            { icon: "fas fa-sun", text: "Weather Resistant" }
        ],
        price: "₹190/sqft"
    },
    upvc: {
        title: "UPVC Windows",
        description: "Energy-efficient UPVC windows with thermal insulation and noise reduction.",
        features: [
            { icon: "fas fa-shield-alt", text: "20 Years Warranty" },
            { icon: "fas fa-gem", text: "German Technology" },
            { icon: "fas fa-calendar-day", text: "3-5 Days Installation" },
            { icon: "fas fa-users", text: "4-5 Expert Laborers" },
            { icon: "fas fa-thermometer-half", text: "Thermal Insulation" },
            { icon: "fas fa-volume-mute", text: "Sound Proof" }
        ],
        price: "₹350/sqft"
    },
    aluminium: {
        title: "Aluminium Windows",
        description: "Durable and stylish aluminium windows with modern designs and finishes.",
        features: [
            { icon: "fas fa-shield-alt", text: "12 Years Warranty" },
            { icon: "fas fa-gem", text: "Premium Aluminium" },
            { icon: "fas fa-calendar-day", text: "2-4 Days Installation" },
            { icon: "fas fa-users", text: "3-4 Expert Laborers" },
            { icon: "fas fa-palette", text: "Multiple Colors" },
            { icon: "fas fa-expand-arrows-alt", text: "Custom Designs" }
        ],
        price: "₹380/sqft"
    },
    led: {
        title: "LED Mirrors",
        description: "Modern LED mirrors with anti-fog technology and touch controls.",
        features: [
            { icon: "fas fa-shield-alt", text: "5 Years Warranty" },
            { icon: "fas fa-gem", text: "Anti-Fog Technology" },
            { icon: "fas fa-calendar-day", text: "1 Day Installation" },
            { icon: "fas fa-users", text: "1-2 Expert Laborers" },
            { icon: "fas fa-lightbulb", text: "Energy Efficient LED" },
            { icon: "fas fa-hand-pointer", text: "Touch Controls" }
        ],
        price: "₹550/sqft"
    },
    shower: {
        title: "Shower Partitions",
        description: "Elegant glass shower partitions for modern bathrooms.",
        features: [
            { icon: "fas fa-shield-alt", text: "8 Years Warranty" },
            { icon: "fas fa-gem", text: "Tempered Glass" },
            { icon: "fas fa-calendar-day", text: "2-3 Days Installation" },
            { icon: "fas fa-users", text: "2-3 Expert Laborers" },
            { icon: "fas fa-tint", text: "Water Proof" },
            { icon: "fas fa-broom", text: "Easy Maintenance" }
        ],
        price: "₹350/sqft"
    },
    kitchen: {
        title: "Kitchen Profiles",
        description: "Premium aluminium profiles for modern kitchen cabinets.",
        features: [
            { icon: "fas fa-shield-alt", text: "10 Years Warranty" },
            { icon: "fas fa-gem", text: "Rust Proof" },
            { icon: "fas fa-calendar-day", text: "3-4 Days Installation" },
            { icon: "fas fa-users", text: "3-4 Expert Laborers" },
            { icon: "fas fa-ruler-combined", text: "Custom Sizes" },
            { icon: "fas fa-tools", text: "Easy Installation" }
        ],
        price: "₹440/sqft"
    },
    hanger: {
        title: "Cloth Hangers",
        description: "Premium quality cloth hangers and drying solutions.",
        features: [
            { icon: "fas fa-shield-alt", text: "3 Years Warranty" },
            { icon: "fas fa-gem", text: "Stainless Steel" },
            { icon: "fas fa-calendar-day", text: "1 Day Installation" },
            { icon: "fas fa-users", text: "1-2 Expert Laborers" },
            { icon: "fas fa-arrows-alt-v", text: "Adjustable Height" },
            { icon: "fas fa-compress-arrows-alt", text: "Space Saving" }
        ],
        price: "₹2600/piece"
    }
};

// Open Service Modal
function openServiceModal(serviceType) {
    const service = serviceDetails[serviceType];
    if (!service) return;

    const modalTitle = document.getElementById('serviceModalTitle');
    const modalContent = document.getElementById('serviceModalContent');

    modalTitle.textContent = service.title;

    let featuresHTML = '';
    service.features.forEach(feature => {
        featuresHTML += `
            <div class="service-feature">
                <i class="${feature.icon}"></i>
                <p>${feature.text}</p>
            </div>
        `;
    });

    modalContent.innerHTML = `
        <div class="service-modal-content">
            <h4>${service.title}</h4>
            <p class="text-muted">${service.description}</p>
            <div class="service-modal-features">
                ${featuresHTML}
            </div>
            <div class="price-info mb-4">
                <h5 class="text-primary">Starting at ${service.price}</h5>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary btn-lg me-3" onclick="scrollToEstimatorWithService('${serviceType}')">
                    <i class="fas fa-calculator"></i> Get Estimation
                </button>
                <button class="btn btn-outline-primary btn-lg" onclick="openWhatsApp()">
                    <i class="fab fa-whatsapp"></i> Chat Now
                </button>
            </div>
        </div>
    `;

    const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal'));
    serviceModal.show();
}

// Show customer form before estimation
function showCustomerForm() {
    const serviceType = document.getElementById('serviceType').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const quantity = document.getElementById('quantity').value;

    if (!serviceType || !width || !quantity) {
        alert('Please fill all required fields in the estimation form first.');
        return;
    }

    if (serviceType !== 'hanger' && (!height || height <= 0)) {
        alert('Please enter valid height');
        return;
    }

    const customerModal = new bootstrap.Modal(document.getElementById('customerFormModal'));
    customerModal.show();
}

// Handle customer estimation form submission
document.getElementById('customerEstimationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const customerData = {
        name: document.getElementById('estimationName').value,
        phone: document.getElementById('estimationPhone').value,
        email: document.getElementById('estimationEmail').value,
        location: document.getElementById('estimationLocation').value
    };

    // Calculate estimation
    const estimation = calculateEstimation();
    
    if (estimation) {
        // Close the customer form modal
        const customerModal = bootstrap.Modal.getInstance(document.getElementById('customerFormModal'));
        customerModal.hide();

        // Show estimation result
        displayEstimationResult(estimation);

        // Prepare WhatsApp message
        const serviceType = document.getElementById('serviceType').value;
        const serviceName = document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text.split(' - ')[0];
        
        const whatsappMessage = `Hello! I'm interested in ${serviceName}.\n\nMy Details:\nName: ${customerData.name}\nPhone: ${customerData.phone}\nEmail: ${customerData.email || 'Not provided'}\nLocation: ${customerData.location}\n\nEstimated Cost: ${estimation.total}\nService: ${serviceName}\n\nPlease contact me for free site visit and exact pricing.`;

        // Open WhatsApp after a short delay
        setTimeout(() => {
            const whatsappUrl = `https://wa.me/919642661602?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }, 2000);
    }
});

// Calculate estimation (moved from estimator.js for integration)
function calculateEstimation() {
    const serviceType = document.getElementById('serviceType').value;
    const width = parseFloat(document.getElementById('width').value);
    let height = parseFloat(document.getElementById('height').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!serviceType || !width || !quantity) {
        alert('Please fill all required fields');
        return null;
    }
    
    // For cloth hangers, height is not required
    if (serviceType !== 'hanger' && (!height || height <= 0)) {
        alert('Please enter valid height');
        return null;
    }
    
    const service = serviceRates[serviceType];
    let area, total;
    
    if (serviceType === 'hanger') {
        // For cloth hangers, calculate based on quantity only
        area = quantity;
        total = service.base * quantity;
    } else {
        area = width * height * quantity;
        total = service.base * area;
    }
    
    // Add additional features cost
    Object.values(selectedAddons).forEach(addon => {
        if (serviceType === 'hanger') {
            total += addon.price * quantity;
        } else {
            total += addon.price * area;
        }
    });
    
    // Apply min/max limits
    const min = service.min * quantity;
    const max = service.max * quantity;
    total = Math.max(min, Math.min(max, total));
    
    // Add 18% GST
    total = total * 1.18;
    
    return {
        total: Math.round(total),
        service: serviceType,
        area: serviceType === 'hanger' ? quantity : area,
        quantity: quantity
    };
}

// Display estimation result
function displayEstimationResult(estimation) {
    const resultDiv = document.getElementById('estimationResult');
    const serviceName = document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text.split(' - ')[0];
    
    let areaText = serviceRates[estimation.service].unit === 'piece' ? 
        `${estimation.quantity} pieces` : 
        `${estimation.area.toFixed(2)} sqft (${estimation.quantity} units)`;
    
    resultDiv.innerHTML = `
        <div class="service-name">${serviceName}</div>
        <div class="area-info">${areaText}</div>
        <div class="price-range">₹${estimation.total.toLocaleString('en-IN')}</div>
        <div class="price-note">*Inclusive of 18% GST</div>
        <div class="text-success mt-2">
            <i class="fas fa-check-circle"></i> Estimation Ready!
        </div>
    `;

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Quick contact form handling
document.getElementById('quickContactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const service = this.querySelector('select').value;
    
    const message = `Quick Contact Request:%0A%0AName: ${name}%0APhone: ${phone}%0AService: ${service}%0A%0APlease contact me ASAP!`;
    
    const whatsappUrl = `https://wa.me/919642661602?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    alert('Thank you! We will contact you shortly.');
    this.reset();
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Premium Home Solutions Website Loaded');
    
    // Add smooth scrolling to all links
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
});
