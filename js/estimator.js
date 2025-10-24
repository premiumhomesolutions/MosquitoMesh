// Updated Estimation calculator functionality with new rates and addons
const serviceRates = {
    mesh: { 
        base: 250, 
        min: 2000, 
        max: 15000,
        unit: 'sqft',
        addons: [
            { id: 'premium-mesh', name: 'Premium Mesh', price: 50, unit: 'sqft' }
        ]
    },
    invisible: { 
        base: 190, 
        min: 3000, 
        max: 25000,
        unit: 'sqft',
        addons: [
            { id: 'premium-invisible', name: 'Premium Invisible Grills', price: 200, unit: 'sqft' }
        ]
    },
    aluminium: { 
        base: 380, 
        min: 4000, 
        max: 35000,
        unit: 'sqft',
        addons: [
            { id: 'premium-aluminium', name: 'Premium Aluminium Windows', price: 300, unit: 'sqft' }
        ]
    },
    upvc: { 
        base: 350, 
        min: 5000, 
        max: 45000,
        unit: 'sqft',
        addons: [
            { id: 'tuffan-glass', name: 'Tuffan Glass', price: 30, unit: 'sqft' },
            { id: 'color-glass', name: 'Color Glass', price: 20, unit: 'sqft' }
        ]
    },
    led: { 
        base: 550, 
        min: 3000, 
        max: 20000,
        unit: 'sqft',
        addons: [
            { id: 'premium-led', name: 'Premium LED Mirrors', price: 30, unit: 'sqft' }
        ]
    },
    shower: { 
        base: 350, 
        min: 6000, 
        max: 30000,
        unit: 'sqft',
        addons: [
            { id: 'premium-shower', name: 'Premium Shower Partition', price: 30, unit: 'sqft' }
        ]
    },
    kitchen: { 
        base: 440, 
        min: 2500, 
        max: 18000,
        unit: 'sqft',
        addons: [
            { id: 'premium-kitchen', name: 'Premium Kitchen Profile', price: 50, unit: 'sqft' }
        ]
    },
    hanger: { 
        base: 2600, 
        min: 2600, 
        max: 26000,
        unit: 'piece',
        addons: [
            { id: 'premium-hanger', name: 'Premium Cloth Hanger', price: 500, unit: 'piece' }
        ]
    }
};

let selectedAddons = {};

function updateAddons() {
    const serviceType = document.getElementById('serviceType').value;
    const addonsSection = document.getElementById('addonsSection');
    const addonsContainer = document.getElementById('addonsContainer');
    const dimensionLabel = document.getElementById('dimensionLabel');
    const heightLabel = document.getElementById('heightLabel');
    
    // Reset addons
    selectedAddons = {};
    addonsContainer.innerHTML = '';
    
    if (serviceType && serviceRates[serviceType]) {
        addonsSection.style.display = 'block';
        
        // Update dimension labels based on service type
        if (serviceType === 'hanger') {
            dimensionLabel.textContent = 'Length (feet) *';
            heightLabel.style.display = 'none';
            document.getElementById('height').style.display = 'none';
        } else {
            dimensionLabel.textContent = 'Width (feet) *';
            heightLabel.style.display = 'block';
            document.getElementById('height').style.display = 'block';
            heightLabel.textContent = 'Height (feet) *';
        }
        
        const addons = serviceRates[serviceType].addons;
        
        if (addons && addons.length > 0) {
            addons.forEach(addon => {
                const addonDiv = document.createElement('div');
                addonDiv.className = 'addon-option';
                addonDiv.innerHTML = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${addon.id}" 
                               onchange="toggleAddon('${addon.id}', ${addon.price}, '${addon.unit}')">
                        <label class="form-check-label" for="${addon.id}">
                            ${addon.name}
                            <span class="addon-price">+₹${addon.price}/${addon.unit}</span>
                        </label>
                    </div>
                `;
                addonsContainer.appendChild(addonDiv);
            });
        }
    } else {
        addonsSection.style.display = 'none';
        dimensionLabel.textContent = 'Width (feet) *';
        heightLabel.textContent = 'Height (feet) *';
        document.getElementById('height').style.display = 'block';
    }
}

function toggleAddon(addonId, price, unit) {
    const checkbox = document.getElementById(addonId);
    const addonOption = checkbox.closest('.addon-option');
    
    if (checkbox.checked) {
        selectedAddons[addonId] = { price: price, unit: unit };
        addonOption.classList.add('selected');
    } else {
        delete selectedAddons[addonId];
        addonOption.classList.remove('selected');
    }
}

// This function is now integrated into script.js for better flow
// The calculateEstimation function is moved to script.js
