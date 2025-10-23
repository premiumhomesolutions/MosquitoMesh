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

// Cities data
const citiesData = {
    telangana: [
        "Hyderabad", "Secunderabad", "Gachibowli", "HITEC City", "Kukatpally", 
        "Miyapur", "Lingampally", "Patenceru", "Kokapet", "Telapur", "Narsinghi"
    ],
    andhra: [
        "Kurnool", "Vishakapatnam", "Guntur", "Tirupati", "Vijayawada",
        "Nellore", "Kakinada", "Rajahmundry", "Anantapur", "Kadapa"
    ]
};

// Update cities based on state selection
function updateCities() {
    const state = document.getElementById('state').value;
    const citySelect = document.getElementById('city');
    
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    if (state && citiesData[state]) {
        citiesData[state].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase();
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// Form handling with Tawk.io simulation
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        projectDetails: document.getElementById('projectDetails').value,
        service: document.getElementById('serviceType').value,
        estimation: document.querySelector('.price-range') ? document.querySelector('.price-range').textContent : 'Not calculated'
    };
    
    // Simulate Tawk.io form submission
    submitToTawkIO(formData);
});

function submitToTawkIO(formData) {
    // Show loading state
    const submitBtn = document.querySelector('#leadForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call to Tawk.io
    setTimeout(() => {
        // Create success message
        const successMessage = `
🎉 Thank you, ${formData.name}!

We have received your inquiry for:
• Service: ${formData.service || 'Not specified'}
• Location: ${formData.city ? formData.city.charAt(0).toUpperCase() + formData.city.slice(1) + ', ' : ''}${formData.state ? formData.state.charAt(0).toUpperCase() + formData.state.slice(1) : ''}
• Estimated Budget: ${formData.estimation}

Our representative will contact you at ${formData.phone} within 30 minutes to schedule a free site visit and provide exact pricing.

For immediate assistance, you can:
📞 Call us: +91 96426 61602
💬 WhatsApp: https://wa.me/919642661602

Thank you for choosing Premium Home Solutions!
        `;
        
        // Show success modal or alert
        showSuccessModal(successMessage);
        
        // Also send WhatsApp message
        const whatsappMessage = `New Lead from Website:%0A%0AName: ${formData.name}%0APhone: ${formData.phone}%0AEmail: ${formData.email || 'Not provided'}%0ALocation: ${formData.city ? formData.city.charAt(0).toUpperCase() + formData.city.slice(1) + ', ' : ''}${formData.state ? formData.state.charAt(0).toUpperCase() + formData.state.slice(1) : ''}%0AService: ${formData.service || 'Not specified'}%0AProject: ${formData.projectDetails || 'Not provided'}%0AEstimation: ${formData.estimation}`;
        
        const whatsappUrl = `https://wa.me/919642661602?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        document.getElementById('leadForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showSuccessModal(message) {
    // Create modal element
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'successModal';
    modalDiv.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title"><i class="fas fa-check-circle"></i> Success!</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
                        <p class="mt-3" style="white-space: pre-line;">${message}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    
    const successModal = new bootstrap.Modal(modalDiv);
    successModal.show();
    
    // Remove modal from DOM after it's hidden
    modalDiv.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalDiv);
    });
}

// Service areas in Hyderabad and Andhra Pradesh
const serviceAreas = {
    telangana: [
        "Kukatpally", "Miyapur", "Gachibowli", "HITEC City", "Lingampally", 
        "Patenceru", "Kokapet", "Telapur", "Narsinghi", "Secunderabad", "Hyderabad"
    ],
    andhra: [
        "Kurnool", "Vishakapatnam", "Guntur", "Tirupati", "Vijayawada",
        "Nellore", "Kakinada", "Rajahmundry", "Anantapur", "Kadapa"
    ]
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Premium Home Solutions Website Loaded');
    updateCities(); // Initialize cities dropdown
    
    // Add some CSS for the success modal
    const style = document.createElement('style');
    style.textContent = `
        .modal-backdrop {
            background-color: rgba(0,0,0,0.7);
        }
    `;
    document.head.appendChild(style);
});
