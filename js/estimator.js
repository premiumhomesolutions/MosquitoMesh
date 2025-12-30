// estimator.js - single source for service rates, addons & estimator UX control

const serviceRates = {
  mesh: {
    base: 250, min: 2000, max: 15000, unit: 'sqft',
    addons: [{ id: 'premium-mesh', name: 'Premium Mesh', price: 50, unit: 'sqft' }]
  },
  invisible: {
    base: 190, min: 3000, max: 25000, unit: 'sqft',
    addons: [{ id: 'premium-invisible', name: 'Premium Invisible Grills', price: 200, unit: 'sqft' }]
  },
  aluminium: {
    base: 380, min: 4000, max: 35000, unit: 'sqft',
    addons: [{ id: 'premium-aluminium', name: 'Premium Aluminium Windows', price: 300, unit: 'sqft' }]
  },
  upvc: {
    base: 350, min: 5000, max: 45000, unit: 'sqft',
    addons: [
      { id: 'tuffan-glass', name: 'Tuffan Glass', price: 30, unit: 'sqft' },
      { id: 'color-glass', name: 'Color Glass', price: 20, unit: 'sqft' }
    ]
  },
  led: {
    base: 550, min: 3000, max: 20000, unit: 'sqft',
    addons: [{ id: 'premium-led', name: 'Premium LED Mirrors', price: 30, unit: 'sqft' }]
  },
  shower: {
    base: 350, min: 6000, max: 30000, unit: 'sqft',
    addons: [{ id: 'premium-shower', name: 'Premium Shower Partition', price: 30, unit: 'sqft' }]
  },
  kitchen: {
    base: 440, min: 2500, max: 18000, unit: 'sqft',
    addons: [{ id: 'premium-kitchen', name: 'Premium Kitchen Profile', price: 50, unit: 'sqft' }]
  },
  hanger: {
    base: 2600, min: 2600, max: 26000, unit: 'piece',
    addons: [{ id: 'premium-hanger', name: 'Premium Cloth Hanger', price: 500, unit: 'piece' }]
  }
};

let selectedAddons = {};

/* ------------------------------------
   ADDONS UI HANDLING
------------------------------------ */

function updateAddons() {
  const serviceType = document.getElementById('serviceType')?.value;
  const addonsSection = document.getElementById('addonsSection');
  const addonsContainer = document.getElementById('addonsContainer');
  const dimensionLabel = document.getElementById('dimensionLabel');
  const heightLabel = document.getElementById('heightLabel');
  const heightInput = document.getElementById('height');

  selectedAddons = {};
  if (addonsContainer) addonsContainer.innerHTML = '';

  if (!serviceType || !serviceRates[serviceType]) {
    addonsSection?.classList.add('d-none');
    if (dimensionLabel) dimensionLabel.textContent = 'Width (feet) *';
    if (heightLabel) heightLabel.textContent = 'Height (feet) *';
    if (heightInput) heightInput.style.display = 'block';
    return;
  }

  addonsSection?.classList.remove('d-none');

  if (serviceType === 'hanger') {
    dimensionLabel && (dimensionLabel.textContent = 'Length (feet) *');
    if (heightLabel) heightLabel.style.display = 'none';
    if (heightInput) {
      heightInput.style.display = 'none';
      heightInput.value = '';
    }
  } else {
    dimensionLabel && (dimensionLabel.textContent = 'Width (feet) *');
    if (heightLabel) {
      heightLabel.style.display = 'block';
      heightLabel.textContent = 'Height (feet) *';
    }
    heightInput && (heightInput.style.display = 'block');
  }

  serviceRates[serviceType].addons.forEach(addon => {
    const div = document.createElement('div');
    div.className = 'addon-option';
    div.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${addon.id}">
        <label class="form-check-label" for="${addon.id}">
          ${addon.name} <span class="addon-price">+₹${addon.price}/${addon.unit}</span>
        </label>
      </div>
    `;
    addonsContainer.appendChild(div);
    div.querySelector('input')?.addEventListener(
      'change',
      () => toggleAddon(addon.id, addon.price, addon.unit)
    );
  });
}

function toggleAddon(addonId, price, unit) {
  const cb = document.getElementById(addonId);
  if (!cb) return;
  const parent = cb.closest('.addon-option');
  if (cb.checked) {
    selectedAddons[addonId] = { price, unit };
    parent?.classList.add('selected');
  } else {
    delete selectedAddons[addonId];
    parent?.classList.remove('selected');
  }
}

/* ------------------------------------
   🔥 FIX: GET ESTIMATION FLOW
------------------------------------ */

function openEstimatorFromQuote() {
  // 1. Close Get Quote modal
  const quoteModalEl = document.getElementById('getQuoteModal');
  if (quoteModalEl && window.bootstrap) {
    const quoteModal = bootstrap.Modal.getInstance(quoteModalEl)
      || new bootstrap.Modal(quoteModalEl);
    quoteModal.hide();
  }

  // 2. Open Estimator modal OR scroll section
  const estimatorModalEl = document.getElementById('estimatorModal');
  if (estimatorModalEl && window.bootstrap) {
    const estimatorModal = new bootstrap.Modal(estimatorModalEl);
    estimatorModal.show();
  } else {
    // fallback: scroll to estimator section
    document.getElementById('estimator')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/* ------------------------------------
   AUTO BIND CLICK EVENTS
------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.open-estimator-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openEstimatorFromQuote();
    });
  });
});

/* ------------------------------------
   GLOBAL EXPORTS
------------------------------------ */
window.serviceRates = serviceRates;
window.updateAddons = updateAddons;
window.toggleAddon = toggleAddon;
window.selectedAddons = selectedAddons;
window.openEstimatorFromQuote = openEstimatorFromQuote;
