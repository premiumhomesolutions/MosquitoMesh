// Estimation calculator functionality
const serviceRates = {
    mesh: { base: 80, min: 2000, max: 15000 },
    invisible: { base: 120, min: 3000, max: 25000 },
    aluminium: { base: 150, min: 4000, max: 35000 },
    upvc: { base: 200, min: 5000, max: 45000 },
    led: { base: 250, min: 3000, max: 20000 },
    shower: { base: 180, min: 6000, max: 30000 },
    kitchen: { base: 100, min: 2500, max: 18000 }
};

function calculateEstimation() {
    const serviceType = document.getElementById('serviceType').value;
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const childLock = document.getElementById('childLock').checked;
    const premiumMesh = document.getElementById('premiumMesh').checked;
    
    if (!serviceType || !width || !height || !quantity) {
        alert('Please fill all required fields');
        return;
    }
    
    const area = width * height;
    const baseRate = serviceRates[serviceType].base;
    let total = area * baseRate * quantity;
    
    // Add additional features cost
    if (childLock) total += 500 * quantity;
    if (premiumMesh) total += total * 0.2; // 20% premium
    
    // Apply min/max limits
    const min = serviceRates[serviceType].min * quantity;
    const max = serviceRates[serviceType].max * quantity;
    total = Math.max(min, Math.min(max, total));
    
    // Add 18% GST
    total = total * 1.18;
    
    displayEstimation(total, min, max);
}

function displayEstimation(total, min, max) {
    const resultDiv = document.getElementById('estimationResult');
    const serviceName = document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text;
    
    resultDiv.innerHTML = `
        <div class="service-name">${serviceName}</div>
        <div class="price-range">₹${Math.round(total).toLocaleString('en-IN')}</div>
        <div class="price-note">*Inclusive of GST</div>
        <div class="estimation-details">
            <p><i class="fas fa-info-circle"></i> This is an approximate estimation</p>
            <p><i class="fas fa-home"></i> Free site visit for exact measurement</p>
            <p><i class="fas fa-wrench"></i> Includes professional installation</p>
        </div>
    `;
}

// Auto-fill area suggestions (basic implementation)
function setupAreaAutocomplete() {
    const areaInput = document.querySelector('input[placeholder*="Area"]');
    if (areaInput) {
        areaInput.addEventListener('input', function(e) {
            // Basic implementation - can be enhanced with a proper autocomplete library
            console.log('Area input:', e.target.value);
        });
    }
}

document.addEventListener('DOMContentLoaded', setupAreaAutocomplete);
