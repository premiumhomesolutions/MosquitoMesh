// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

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

// Form submission
document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // In a real implementation, you would send this data to your backend
    // For this demo, we'll just show a success message
    alert('Thank you for your inquiry! Our expert will contact you within 24 hours.');
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
