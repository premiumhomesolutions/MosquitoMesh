// script.js - main interactions, estimation, modals, forms

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Phone and WhatsApp
function openWhatsApp() {
  const phone = "919642661602";
  const message = "Hi, I'm interested in your home solutions services. Can you provide more information?";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}
function makeCall() { window.location.href = 'tel:+919642661602'; }

// Service details for modal (used by openServiceModal)
const serviceDetails = {
  mesh: { title: "Mosquito Mesh Doors", description: "Premium anti-mosquito sliding doors", features: [{icon:"fas fa-shield-alt",text:"10 Years Warranty"},{icon:"fas fa-calendar-day",text:"1-2 Days Installation"}], price: "₹250/sqft" },
  invisible: { title: "Invisible Grills", description: "Transparent safety grills for balconies", features: [{icon:"fas fa-shield-alt",text:"15 Years Warranty"},{icon:"fas fa-calendar-day",text:"2-3 Days Installation"}], price: "₹190/sqft" },
  aluminium: { title: "Aluminium Windows", description: "Durable aluminium windows", features: [], price: "₹380/sqft" },
  upvc: { title: "UPVC Windows", description: "Energy-efficient UPVC windows", features: [], price: "₹350/sqft" },
  led: { title: "LED Mirrors", description: "Modern LED mirrors", features: [], price: "₹550/sqft" },
  shower: { title: "Shower Partitions", description: "Elegant glass shower partitions", features: [], price: "₹350/sqft" },
  kitchen: { title: "Kitchen Profiles", description: "Premium aluminium kitchen profiles", features: [], price: "₹440/sqft" },
  hanger: { title: "Cloth Hangers", description: "Premium cloth hangers and systems", features: [], price: "₹2600/piece" }
};

function openServiceModal(serviceType) {
  const s = serviceDetails[serviceType];
  if (!s) return;
  const titleEl = document.getElementById('serviceModalTitle');
  const contentEl = document.getElementById('serviceModalContent');
  if (titleEl) titleEl.textContent = s.title;
  if (contentEl) {
    const featuresHtml = (s.features || []).map(f => `<div class="service-feature"><i class="${f.icon}"></i><p>${f.text}</p></div>`).join('');
    contentEl.innerHTML = `<h4>${s.title}</h4><p class="text-muted">${s.description}</p><div class="service-modal-features">${featuresHtml}</div><div class="price-info mt-3"><strong>Starting at ${s.price}</strong></div><div class="mt-3"><button class="btn btn-primary me-2" onclick="scrollToEstimatorWithService('${serviceType}')">Get Estimation</button><button class="btn btn-outline-primary" onclick="openWhatsApp()">Chat Now</button></div>`;
  }
  const m = new bootstrap.Modal(document.getElementById('serviceModal'));
  m.show();
}

// Show customer modal after initial validation
function showCustomerForm() {
  const serviceType = (document.getElementById('serviceType') || {}).value;
  const width = (document.getElementById('width') || {}).value;
  const height = (document.getElementById('height') || {}).value;
  const quantity = (document.getElementById('quantity') || {}).value;

  if (!serviceType || !width || !quantity) {
    alert('Please fill all required fields in the estimation form first.');
    return;
  }

  if (serviceType !== 'hanger' && (!height || parseFloat(height) <= 0)) {
    alert('Please enter valid height');
    return;
  }

  const customerModal = new bootstrap.Modal(document.getElementById('customerFormModal'));
  customerModal.show();
}

// Handle customer form submit
document.addEventListener('DOMContentLoaded', () => {
  // wire up service card buttons -> open service modal
  document.querySelectorAll('.btn-service').forEach(btn => {
    const svc = btn.getAttribute('data-service');
    btn.addEventListener('click', () => openServiceModal(svc));
  });

  // wire up view video / image handled in modal.js (delegated)

  // service select change uses estimator.updateAddons
  const serviceSelect = document.getElementById('serviceType');
  if (serviceSelect) serviceSelect.addEventListener('change', updateAddons);

  // calculation start button opens customer form
  const openCustomerFormBtn = document.getElementById('openCustomerFormBtn');
  if (openCustomerFormBtn) openCustomerFormBtn.addEventListener('click', showCustomerForm);

  // customer form submit
  const customerForm = document.getElementById('customerEstimationForm');
  if (customerForm) {
    customerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (document.getElementById('estimationName') || {}).value || '';
      const phone = (document.getElementById('estimationPhone') || {}).value || '';
      const location = (document.getElementById('estimationLocation') || {}).value || '';
      if (!name || !phone || !location) {
        alert('Please complete contact details.');
        return;
      }
      const estimation = calculateEstimation();
      if (!estimation) return;
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById('customerFormModal'));
      if (modalInstance) modalInstance.hide();
      displayEstimationResult(estimation);

      // Prepare WhatsApp message
      const serviceEl = document.getElementById('serviceType');
      const serviceName = serviceEl ? serviceEl.options[serviceEl.selectedIndex].text.split(' - ')[0] : '';
      const msg = `Hello! I'm interested in ${serviceName}.\n\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\nEstimated Cost: ₹${estimation.total}\nPlease contact me for a free site visit.`;
      window.open(`https://wa.me/919642661602?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // quick contact
  const quickForm = document.getElementById('quickContactForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks — we will contact you soon!');
      quickForm.reset();
    });
  }

  // CTA handlers
  const ctaEstimator = document.getElementById('ctaEstimator');
  if (ctaEstimator) ctaEstimator.addEventListener('click', () => {
    const el = document.getElementById('estimator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  const ctaWhatsApp = document.getElementById('ctaWhatsApp');
  if (ctaWhatsApp) ctaWhatsApp.addEventListener('click', openWhatsApp);

  // floating phone
  const floatingPhone = document.getElementById('floatingPhone');
  if (floatingPhone) {
    floatingPhone.addEventListener('click', makeCall);
    floatingPhone.addEventListener('keypress', (e) => { if (e.key === 'Enter') makeCall(); });
  }

  // navbar style on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    if (window.scrollY > 100) { navbar.style.background = 'rgba(44,62,80,0.98)'; navbar.style.padding = '10px 0'; }
    else { navbar.style.background = 'rgba(44,62,80,0.95)'; navbar.style.padding = '15px 0'; }
  });
});

// scroll helpers
function scrollToEstimator() {
  const el = document.getElementById('estimator');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
function scrollToEstimatorWithService(serviceType) {
  const sel = document.getElementById('serviceType');
  if (sel) { sel.value = serviceType; updateAddons(); }
  scrollToEstimator();
}

/* --- Estimation logic --- */
function calculateEstimation() {
  const serviceType = (document.getElementById('serviceType') || {}).value;
  const width = parseFloat((document.getElementById('width') || {}).value || 0);
  const height = parseFloat((document.getElementById('height') || {}).value || 0);
  const quantity = parseInt((document.getElementById('quantity') || {}).value || '0', 10);

  if (!serviceType || !quantity || quantity <= 0) {
    alert('Please fill all required fields');
    return null;
  }

  const service = serviceRates[serviceType];
  if (!service) { alert('Invalid service selected'); return null; }

  let area = 0;
  let total = 0;

  if (serviceType === 'hanger') {
    area = quantity;
    total = service.base * quantity;
  } else {
    if (!width || width <= 0 || !height || height <= 0) { alert('Please enter valid width and height'); return null; }
    area = width * height * quantity;
    total = service.base * area;
  }

  Object.values(selectedAddons || {}).forEach(addon => {
    if (!addon || typeof addon.price !== 'number') return;
    if (serviceType === 'hanger') total += addon.price * quantity;
    else total += addon.price * area;
  });

  // min/max clamp (min/max are per total basis or per order - using safe clamp)
  const min = (service.min || 0) * (service.unit === 'piece' ? quantity : 1);
  const max = (service.max || Infinity) * (service.unit === 'piece' ? quantity : 1);
  total = Math.max(min, Math.min(max, total));

  // Add GST
  total = total * 1.18;
  return { total: Math.round(total), service: serviceType, area: serviceType === 'hanger' ? quantity : parseFloat(area.toFixed(2)), quantity };
}

function displayEstimationResult(estimation) {
  const resultDiv = document.getElementById('estimationResult');
  if (!resultDiv) return;
  const sel = document.getElementById('serviceType');
  const serviceName = sel ? sel.options[sel.selectedIndex].text.split(' - ')[0] : estimation.service;
  const areaText = serviceRates[estimation.service].unit === 'piece' ? `${estimation.quantity} piece(s)` : `${estimation.area} sqft (${estimation.quantity} unit(s))`;

  resultDiv.innerHTML = `
    <div class="service-name">${serviceName}</div>
    <div class="area-info">${areaText}</div>
    <div class="price-range">₹${estimation.total.toLocaleString('en-IN')}</div>
    <div class="price-note">*Inclusive of 18% GST</div>
    <div class="text-success mt-2"><i class="fas fa-check-circle"></i> Estimation Ready!</div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
