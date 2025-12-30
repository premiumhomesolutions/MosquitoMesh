// script.js - main glue: estimator UI interactions, calculation, modals, WhatsApp flow

// Utilities
function scrollToEl(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); }
function openWhatsAppUrl(msg) { const phone = '919642661602'; const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`; window.open(url, '_blank'); }

// DOM ready wiring
document.addEventListener('DOMContentLoaded', () => {

  // Elements
  const serviceSelect = document.getElementById('serviceType');
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const quantityInput = document.getElementById('quantity');
  const calculateBtn = document.getElementById('calculateBtn');
  const resultDiv = document.getElementById('estimationResult');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const customerFormModalEl = document.getElementById('customerFormModal');
  const customerForm = document.getElementById('customerEstimationForm');

  // 1) Wire service cards Get Quote buttons
  document.querySelectorAll('.btn-service').forEach(btn => {
    btn.addEventListener('click', () => {
      const svc = btn.getAttribute('data-service');
      if (svc) {
        // open service modal with details (function in this file)
        openServiceModal(svc);
      }
    });
  });

// Call from service modal to start estimation flow while closing the service modal smoothly
function getEstimationFromModal(serviceType) {
  // 1) set the estimator service dropdown and update addons UI
  const serviceSelect = document.getElementById('serviceType');
  if (serviceSelect) {
    serviceSelect.value = serviceType;
    // updateAddons is defined in estimator.js — ensures the estimator UI matches the selected service
    if (typeof updateAddons === 'function') {
      try { updateAddons(); } catch (e) { console.warn('updateAddons failed', e); }
    }
  }

  // 2) hide the currently open service modal, then show estimator / customer modal after it's hidden
  const serviceModalEl = document.getElementById('serviceModal');
  const customerModalEl = document.getElementById('customerFormModal');

  if (!serviceModalEl) {
    // no service modal element — fallback: scroll to estimator and show customer modal
    const el = document.getElementById('estimator');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (customerModalEl) new bootstrap.Modal(customerModalEl).show();
    return;
  }

  // Register a one-time 'hidden' handler so we show the customer modal only after the service modal is fully hidden
  const onHidden = function () {
    serviceModalEl.removeEventListener('hidden.bs.modal', onHidden);

    // scroll to estimator to make it visible under the customer modal
    const est = document.getElementById('estimator');
    if (est) est.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // small delay to allow scroll/paint; then show customer modal
    setTimeout(() => {
      if (customerModalEl) {
        const cm = new bootstrap.Modal(customerModalEl);
        cm.show();
      } else {
        // fallback: ensure estimator is visible
        const anchor = document.getElementById('estimator');
        if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
      }
    }, 220);
  };

  serviceModalEl.addEventListener('hidden.bs.modal', onHidden);

  // Hide the service modal using bootstrap instance (if exists) or create and hide
  const currentInstance = bootstrap.Modal.getInstance(serviceModalEl);
  if (currentInstance) {
    currentInstance.hide();
  } else {
    // create instance then hide
    const tmp = new bootstrap.Modal(serviceModalEl);
    tmp.hide();
  }
}

  
  // 2) service select change -> update addons
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      updateAddons();
    });
  }

  // 3) calculate button -> compute estimation and show customer modal
  if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
      const estimation = calculateEstimation();
      if (!estimation) return;
      // show estimation in UI
      displayEstimationResult(estimation);

      // Show send via WhatsApp option
      if (sendWhatsAppBtn) {
        sendWhatsAppBtn.classList.remove('d-none');
      }

      // Open customer details modal so user can provide contact before sending
      const custModal = new bootstrap.Modal(customerFormModalEl);
      custModal.show();
    });
  }

  // 4) customer form submit -> send WhatsApp with estimation
  if (customerForm) {
    customerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('estimationName') || {}).value || '';
      const phone = (document.getElementById('estimationPhone') || {}).value || '';
      const email = (document.getElementById('estimationEmail') || {}).value || '';
      const location = (document.getElementById('estimationLocation') || {}).value || '';

      if (!name || !phone || !location) {
        alert('Please provide Name, Phone and Location.');
        return;
      }

      const estimation = calculateEstimation();
      if (!estimation) { alert('Calculation missing or invalid.'); return; }

      // hide modal
      const inst = bootstrap.Modal.getInstance(customerFormModalEl);
      if (inst) inst.hide();

      // Build WhatsApp message
      const serviceText = getSelectedServiceText();
      const message = `Hello! I'm interested in ${serviceText}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nLocation: ${location}\n\nEstimated Cost: ₹${estimation.total.toLocaleString('en-IN')}\nDetails: ${estimation.areaText}\n\nPlease contact me for a free site visit.`;

      // Open WhatsApp
      openWhatsAppUrl(message);
    });
  }

  // 5) Send WhatsApp quick button (if user already has contact details)
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const estimation = calculateEstimation();
      if (!estimation) { alert('Please calculate estimation first.'); return; }
      // Try to use provided customer fields if present
      const name = (document.getElementById('estimationName') || {}).value || '';
      const phone = (document.getElementById('estimationPhone') || {}).value || '';
      const location = (document.getElementById('estimationLocation') || {}).value || '';
      const serviceText = getSelectedServiceText();
      const message = `Hello! I'm interested in ${serviceText}.\n\n${name ? 'Name: '+name+'\n' : ''}${phone ? 'Phone: '+phone+'\n' : ''}${location ? 'Location: '+location+'\n' : ''}\nEstimated Cost: ₹${estimation.total.toLocaleString('en-IN')}\nDetails: ${estimation.areaText}\n\nPlease contact me for a free site visit.`;
      openWhatsAppUrl(message);
    });
  }

  // 6) Hero CTAs
  const ctaEstimator = document.getElementById('ctaEstimator');
  if (ctaEstimator) ctaEstimator.addEventListener('click', () => scrollToEl('estimator'));
  const ctaWhatsApp = document.getElementById('ctaWhatsApp');
  if (ctaWhatsApp) ctaWhatsApp.addEventListener('click', () => openWhatsAppUrl('Hi, I want info about your home solutions.'));

  // 7) service image click / video handled in modal.js via delegation

  // 8) Quick contact form handling
  const quickContactForm = document.getElementById('quickContactForm');
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! We will contact you shortly.');
      quickContactForm.reset();
    });
  }

  // 9) Navbar shrink on scroll
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNavbar') || document.querySelector('.navbar');
    if (!nav) return;
    if (window.scrollY > 80) { nav.classList.add('navbar-shrink'); } else { nav.classList.remove('navbar-shrink'); }
  });

}); // DOMContentLoaded end

// Helper: get human-readable selected service text
function getSelectedServiceText() {
  const sel = document.getElementById('serviceType');
  if (!sel) return '';
  return sel.options[sel.selectedIndex].text || sel.value;
}

/* -------------------------
   Estimation core logic
   ------------------------- */
function calculateEstimation() {
  const serviceType = (document.getElementById('serviceType') || {}).value;
  const width = parseFloat((document.getElementById('width') || {}).value || 0);
  const height = parseFloat((document.getElementById('height') || {}).value || 0);
  const quantity = parseInt((document.getElementById('quantity') || {}).value || '0', 10);

  if (!serviceType) { alert('Please select a service'); return null; }
  if (!quantity || quantity <= 0) { alert('Please enter valid quantity'); return null; }

  const service = serviceRates[serviceType];
  if (!service) { alert('Invalid service'); return null; }

  let area = 0;
  let total = 0;

  if (serviceType === 'hanger') {
    // piece-based
    area = quantity;
    total = service.base * quantity;
  } else {
    if (!width || width <= 0 || !height || height <= 0) { alert('Please enter valid width and height'); return null; }
    area = width * height * quantity;
    total = service.base * area;
  }

  // Addons
  Object.values(selectedAddons || {}).forEach(addon => {
    if (typeof addon.price !== 'number') return;
    if (serviceType === 'hanger') total += addon.price * quantity;
    else total += addon.price * area;
  });

  // Clamp to min/max (min/max considered as order minimums)
  const min = (service.min || 0) * (service.unit === 'piece' ? quantity : 1);
  const max = (service.max || Infinity) * (service.unit === 'piece' ? quantity : 1);
  total = Math.max(min, Math.min(max, total));

  // GST 18%
  total = total * 1.18;

  // Compose area text for UI and message
  const areaText = service.unit === 'piece' ? `${quantity} piece(s)` : `${parseFloat(area.toFixed(2))} sqft (${quantity} unit(s))`;

  return { total: Math.round(total), service: serviceType, area, areaText, quantity };
}

function displayEstimationResult(estimation) {
  if (!estimation) return;
  const serviceText = getSelectedServiceText();
  const resultDiv = document.getElementById('estimationResult');
  if (!resultDiv) return;

  resultDiv.innerHTML = `
    <div class="service-name">${serviceText}</div>
    <div class="area-info">${estimation.areaText}</div>
    <div class="price-range">₹${estimation.total.toLocaleString('en-IN')}</div>
    <div class="price-note">*Inclusive of 18% GST</div>
    <div class="text-success mt-2"><i class="fas fa-check-circle"></i> Estimation Ready!</div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* -------------------------
   Service modal population
   (uses same data used previously)
   ------------------------- */
const serviceDetails = {
  mesh: { title: "Mosquito Mesh Doors", description: "Premium anti-mosquito sliding doors with complete protection for your home.", features: [{icon:"fas fa-shield-alt",text:"10 Years Warranty"},{icon:"fas fa-gem",text:"Premium Quality Mesh"},{icon:"fas fa-calendar-day",text:"1-2 Days Installation"}], price:"₹250/sqft" },
  invisible: { title: "Invisible Grills", description: "Transparent safety grills for balconies and windows.", features: [{icon:"fas fa-shield-alt",text:"15 Years Warranty"},{icon:"fas fa-gem",text:"316 Grade Steel"}], price:"₹190/sqft" },
  upvc: { title: "UPVC Windows", description: "Energy-efficient UPVC windows with thermal insulation and noise reduction.", features: [{icon:"fas fa-shield-alt",text:"20 Years Warranty"},{icon:"fas fa-gem",text:"German Technology"}], price:"₹350/sqft" },
  aluminium: { title: "Aluminium Windows", description: "Durable and stylish aluminium windows.", features: [], price:"₹380/sqft" },
  led: { title: "LED Mirrors", description: "Modern LED mirrors with anti-fog technology.", features: [], price:"₹550/sqft" },
  shower: { title: "Shower Partitions", description: "Elegant glass shower partitions.", features: [], price:"₹350/sqft" },
  kitchen: { title: "Kitchen Profiles", description: "Premium aluminium kitchen profiles.", features: [], price:"₹440/sqft" },
  hanger: { title: "Cloth Hangers", description: "Premium cloth hangers and drying solutions.", features: [], price:"₹2600/piece" }
};

// --- openServiceModal (REPLACE existing function with this) ---
function openServiceModal(serviceType) {
  const service = serviceDetails && serviceDetails[serviceType] ? serviceDetails[serviceType] : null;
  const title = document.getElementById('serviceModalTitle');
  const content = document.getElementById('serviceModalContent');

  if (title) title.textContent = service ? service.title : 'Service';
  if (content) {
    const featuresHtml = (service && service.features ? service.features : []).map(f => `<div class="service-feature"><i class="${f.icon}"></i><p>${f.text}</p></div>`).join('');
    const priceInfo = service && service.price ? `<div class="price-info mt-3"><strong>Starting at ${service.price}</strong></div>` : '';
    content.innerHTML = `
      <h4>${service ? service.title : ''}</h4>
      <p class="text-muted">${service ? service.description : ''}</p>
      <div class="service-modal-features">${featuresHtml}</div>
      ${priceInfo}
      <div class="mt-3 action-buttons">
        <button class="btn btn-primary btn-lg me-3" onclick="(function(){ 
            const svcModalEl = document.getElementById('serviceModal'); 
            const inst = bootstrap.Modal.getInstance(svcModalEl); 
            if(inst) inst.hide(); 
            // give bootstrap time to hide modal then open estimation
            setTimeout(function(){ openEstimationModal('${serviceType}'); }, 250); 
          })();">
          <i class="fas fa-calculator"></i> Get Estimation
        </button>
        <button class="btn btn-outline-primary btn-lg" onclick="openWhatsApp()"><i class="fab fa-whatsapp"></i> Chat Now</button>
      </div>
    `;
  }

  const m = new bootstrap.Modal(document.getElementById('serviceModal'));
  m.show();
}

// ----- Estimation Modal logic -----

// keeps track of addons selected inside the modal
let selectedAddonsModal = {};

// Open estimation modal and optionally preselect a service
function openEstimationModal(preselectService = '') {
  try {
    // set preselected service if provided
    const svcSelect = document.getElementById('serviceTypeModal');
    if (svcSelect && preselectService) {
      svcSelect.value = preselectService;
    } else if (svcSelect && !svcSelect.value) {
      svcSelect.value = '';
    }

    // populate addons and UI
    updateAddonsModal();
    calculateModalUpdate();

    // show modal
    const emod = new bootstrap.Modal(document.getElementById('estimationModal'));
    emod.show();
  } catch (e) {
    console.error('openEstimationModal error', e);
  }
}

// Update addons UI in modal (uses serviceRates from estimator.js)
function updateAddonsModal() {
  const serviceType = (document.getElementById('serviceTypeModal') || {}).value;
  const addonsSection = document.getElementById('addonsSectionModal');
  const addonsContainer = document.getElementById('addonsContainerModal');
  const dimensionLabel = document.getElementById('dimensionLabelModal');
  const heightLabel = document.getElementById('heightLabelModal');
  const heightInput = document.getElementById('heightModal');

  selectedAddonsModal = {};
  if (addonsContainer) addonsContainer.innerHTML = '';

  if (!serviceType || !window.serviceRates || !serviceRates[serviceType]) {
    if (addonsSection) addonsSection.style.display = 'none';
    if (dimensionLabel) dimensionLabel.textContent = 'Width (feet) *';
    if (heightLabel) heightLabel.textContent = 'Height (feet) *';
    if (heightInput) heightInput.style.display = 'block';
    return;
  }

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
    const div = document.createElement('div');
    div.className = 'addon-option';
    div.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="modal_${addon.id}">
        <label class="form-check-label" for="modal_${addon.id}">${addon.name} <span class="addon-price">+₹${addon.price}/${addon.unit}</span></label>
      </div>
    `;
    addonsContainer.appendChild(div);
    const cb = div.querySelector('input[type="checkbox"]');
    cb.addEventListener('change', () => toggleAddonModal(addon.id, addon.price, addon.unit, cb));
  });

  // after building addons, recalc
  calculateModalUpdate();
}

// Toggle addon inside modal
function toggleAddonModal(addonId, price, unit, checkboxElement) {
  if (checkboxElement && checkboxElement.checked) {
    selectedAddonsModal[addonId] = { price, unit };
    checkboxElement.closest('.addon-option').classList.add('selected');
  } else {
    delete selectedAddonsModal[addonId];
    if (checkboxElement) checkboxElement.closest('.addon-option').classList.remove('selected');
  }
  calculateModalUpdate();
}

// Live calculate and update modal result + WhatsApp link
function calculateModalUpdate() {
  const serviceType = (document.getElementById('serviceTypeModal') || {}).value;
  const width = parseFloat((document.getElementById('widthModal') || {}).value || 0);
  const height = parseFloat((document.getElementById('heightModal') || {}).value || 0);
  const quantity = parseInt((document.getElementById('quantityModal') || {}).value || '0', 10);

  const resultDiv = document.getElementById('modalEstimationResult');
  const waBtn = document.getElementById('modalWhatsAppBtn');

  if (!serviceType || !quantity || quantity <= 0) {
    if (resultDiv) resultDiv.innerHTML = '<p class="result-placeholder">Fill the form to see estimation</p>';
    if (waBtn) waBtn.href = '#';
    return;
  }

  if (serviceType !== 'hanger' && (!width || width <= 0 || !height || height <= 0)) {
    if (resultDiv) resultDiv.innerHTML = '<p class="result-placeholder">Enter valid width and height</p>';
    if (waBtn) waBtn.href = '#';
    return;
  }

  // calculate price using same logic as calculateEstimation (uses serviceRates)
  let area = 0;
  let total = 0;
  const service = serviceRates[serviceType];
  if (!service) { if (resultDiv) resultDiv.innerHTML = '<p class="result-placeholder">Service not found</p>'; return; }

  if (serviceType === 'hanger') {
    area = quantity;
    total = service.base * quantity;
  } else {
    area = width * height * quantity;
    total = service.base * area;
  }

  // addons (modal)
  Object.values(selectedAddonsModal || {}).forEach(addon => {
    if (!addon || typeof addon.price !== 'number') return;
    if (serviceType === 'hanger') total += addon.price * quantity;
    else total += addon.price * area;
  });

  // clamp min/max (per earlier logic)
  const min = (service.min || 0) * (service.unit === 'piece' ? quantity : 1);
  const max = (service.max || Infinity) * (service.unit === 'piece' ? quantity : 1);
  total = Math.max(min, Math.min(max, total));

  // GST 18%
  total = total * 1.18;
  total = Math.round(total);

  // prepare area text
  const areaText = service.unit === 'piece' ? `${quantity} piece(s)` : `${parseFloat(area.toFixed(2))} sqft (${quantity} unit(s))`;

  // show in modal result
  if (resultDiv) {
    resultDiv.innerHTML = `
      <div class="service-name">${serviceType}</div>
      <div class="area-info">${areaText}</div>
      <div class="price-range">₹${total.toLocaleString('en-IN')}</div>
      <div class="price-note">*Inclusive of 18% GST</div>
    `;
  }

  // build WhatsApp message
  const serviceSelect = document.getElementById('serviceTypeModal');
  const serviceText = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text.split(' - ')[0] : serviceType;
  const addonNames = Object.keys(selectedAddonsModal || {}).map(id => {
    const a = (serviceRates[serviceType].addons || []).find(x => x.id === id);
    return a ? a.name : id;
  });
  const addonText = addonNames.length ? addonNames.join(', ') : 'None';
  const dimText = serviceType === 'hanger' ? `${quantity} piece(s)` : `${width}ft × ${height}ft, Qty: ${quantity}`;

  const message = `Quotation Request:%0AService: ${serviceText}%0ADimensions: ${dimText}%0AAdd-ons: ${addonText}%0AEstimated Price: ₹${total.toLocaleString('en-IN')}%0A%0APlease contact me for a site visit.`;
  if (waBtn) waBtn.href = `https://wa.me/919642661602?text=${message}`;
}
