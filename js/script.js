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

function openServiceModal(serviceType) {
  const s = serviceDetails[serviceType];
  if (!s) return;
  const titleEl = document.getElementById('serviceModalTitle');
  const contentEl = document.getElementById('serviceModalContent');
  if (titleEl) titleEl.textContent = s.title;
  if (contentEl) {
    const featuresHtml = (s.features || []).map(f => `<div class="service-feature"><i class="${f.icon}"></i><p>${f.text}</p></div>`).join('');
    contentEl.innerHTML = `<h4>${s.title}</h4><p class="text-muted">${s.description}</p><div class="service-modal-features">${featuresHtml}</div><div class="price-info"><strong>Starting at ${s.price}</strong></div><div class="mt-3"><button class="btn btn-primary me-2" onclick="scrollToEstimatorWithService('${serviceType}')">Get Estimation</button><button class="btn btn-outline-primary" onclick="openWhatsApp()">Chat Now</button></div>`;
  }
  const m = new bootstrap.Modal(document.getElementById('serviceModal'));
  m.show();
}

function scrollToEstimatorWithService(serviceType) {
  const sel = document.getElementById('serviceType');
  if (sel) { sel.value = serviceType; updateAddons(); }
  scrollToEl('estimator');
}
