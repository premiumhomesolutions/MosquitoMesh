// estimator.js
// Rates and addon configuration (single source)
const serviceRates = {
  mesh: {
    base: 250,
    min: 2000,
    max: 15000,
    unit: 'sqft',
    addons: [{ id: 'premium-mesh', name: 'Premium Mesh', price: 50, unit: 'sqft' }]
  },
  invisible: {
    base: 190,
    min: 3000,
    max: 25000,
    unit: 'sqft',
    addons: [{ id: 'premium-invisible', name: 'Premium Invisible Grills', price: 200, unit: 'sqft' }]
  },
  aluminium: {
    base: 380, min: 4000, max: 35000, unit: 'sqft',
    addons: [{ id: 'premium-aluminium', name: 'Premium Aluminium Windows', price: 300, unit: 'sqft' }]
  },
  upvc: {
    base: 350, min: 5000, max: 45000, unit: 'sqft',
    addons: [{ id: 'tuffan-glass', name: 'Tuffan Glass', price: 30, unit: 'sqft' }, { id: 'color-glass', name: 'Color Glass', price: 20, unit: 'sqft' }]
  },
  led: { base: 550, min: 3000, max: 20000, unit: 'sqft', addons: [{ id: 'premium-led', name: 'Premium LED Mirrors', price: 30, unit: 'sqft' }] },
  shower: { base: 350, min: 6000, max: 30000, unit: 'sqft', addons: [{ id: 'premium-shower', name: 'Premium Shower Partition', price: 30, unit: 'sqft' }] },
  kitchen: { base: 440, min: 2500, max: 18000, unit: 'sqft', addons: [{ id: 'premium-kitchen', name: 'Premium Kitchen Profile', price: 50, unit: 'sqft' }] },
  hanger: { base: 2600, min: 2600, max: 26000, unit: 'piece', addons: [{ id: 'premium-hanger', name: 'Premium Cloth Hanger', price: 500, unit: 'piece' }] }
};

let selectedAddons = {};

// updateAddons() will build addon checkboxes for selected service
function updateAddons() {
  const serviceType = (document.getElementById('serviceType') || {}).value;
  const addonsSection = document.getElementById('addonsSection');
  const addonsContainer = document.getElementById('addonsContainer');
  const dimensionLabel = document.getElementById('dimensionLabel');
  const heightLabel = document.getElementById('heightLabel');
  const heightInput = document.getElementById('height');

  selectedAddons = {};
  if (addonsContainer) addonsContainer.innerHTML = '';

  if (serviceType && serviceRates[serviceType]) {
    if (addonsSection) addonsSection.style.display = 'block';

    if (serviceType === 'hanger') {
      if (dimensionLabel) dimensionLabel.textContent = 'Length (feet) *';
      if (heightLabel) heightLabel.style.display = 'none';
      if (heightInput) { heightInput.style.display = 'none'; heightInput.value = ''; }
    } else {
      if (dimensionLabel) dimensionLabel.textContent = 'Width (feet) *';
      if (heightLabel) { heightLabel.style.display = 'block'; heightLabel.textContent = 'Height (feet) *'; }
      if (heightInput) heightInput.style.display = 'block';
    }

    const addons = serviceRates[serviceType].addons || [];
    addons.forEach(addon => {
      const wrapper = document.createElement('div');
      wrapper.className = 'addon-option';
      wrapper.innerHTML = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="${addon.id}">
          <label class="form-check-label" for="${addon.id}">
            ${addon.name} <span class="addon-price">+₹${addon.price}/${addon.unit}</span>
          </label>
        </div>`;
      addonsContainer.appendChild(wrapper);

      const checkbox = wrapper.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => toggleAddon(addon.id, addon.price, addon.unit));
    });
  } else {
    if (addonsSection) addonsSection.style.display = 'none';
    if (dimensionLabel) dimensionLabel.textContent = 'Width (feet) *';
    if (heightLabel) heightLabel.textContent = 'Height (feet) *';
    if (heightInput) heightInput.style.display = 'block';
  }
}

function toggleAddon(addonId, price, unit) {
  const checkbox = document.getElementById(addonId);
  if (!checkbox) return;
  const container = checkbox.closest('.addon-option');
  if (checkbox.checked) {
    selectedAddons[addonId] = { price: price, unit: unit };
    if (container) container.classList.add('selected');
  } else {
    delete selectedAddons[addonId];
    if (container) container.classList.remove('selected');
  }
}
