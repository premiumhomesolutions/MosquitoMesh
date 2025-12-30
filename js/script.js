// script.js - main site behavior (depends on estimator.js, modal.js, chatbot.js)

// Smooth nav scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Hero CTA and floating buttons
document.addEventListener('DOMContentLoaded', () => {
  const ctaEstimator = document.getElementById('ctaEstimator');
  const ctaWhatsApp = document.getElementById('ctaWhatsApp');
  const floatingPhone = document.getElementById('floatingPhone');
  const floatingWhatsapp = document.getElementById('floatingWhatsapp');

  if (ctaEstimator) ctaEstimator.addEventListener('click', () => {
    const el = document.getElementById('estimator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  if (ctaWhatsApp) ctaWhatsApp.addEventListener('click', openWhatsApp);
  if (floatingPhone) {
    floatingPhone.addEventListener('click', makeCall);
    floatingPhone.addEventListener('keypress', (e) => { if (e.key === 'Enter') makeCall(); });
  }
  if (floatingWhatsapp) {
    // placeholder element replaced by chatbot.js anchor; attach handler on document for clicks
    document.addEventListener('click', e => {
      if (e.target.closest('.whatsapp-float')) {
        // let chatbot handle link target behavior
      }
    });
  }

  // Setup estimator controls
  const serviceSelect = document.getElementById('serviceType');
  if (serviceSelect) serviceSelect.addEventListener('change', updateAddons);

  const openCustomerFormBtn = document.getElementById('openCustomerFormBtn');
  if (openCustomerFormBtn) openCustomerFormBtn.addEventListener('click', showCustomerForm);

  // Attach customer form submit handler
  const customerForm = document.getElementById('customerEstimationForm');
  if (customerForm) {
    customerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('estimationName').value.trim();
      const phone = document.getElementById('estimationPhone').value.trim();
      const location = document.getElementById('estimationLocation').value.trim();

      if (!name || !phone || !location) {
        alert('Please complete your contact details.');
        return;
      }

      const estimation = calculateEstimation();
      if (!estimation) return;

      // close modal
      const customerModal = bootstrap.Modal.getInstance(document.getElementById('customerFormModal'));
      if (customerModal) customerModal.hide();

      displayEstimationResult(estimation);

      // Prepare whatsapp message
      const service = document.getElementById('serviceType');
      const serviceName = service ? service.options[service.selectedIndex].text.split(' - ')[0] : 'Service';
      const msg = `Hello! I'm interested in ${serviceName}.\n\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\nEstimated Cost: ₹${estimation.total}\n\nPlease contact me for a free site visit.`;

      // open whatsApp
      window.open(`https://wa.me/919642661602?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // Quick contact form
  const quickContactForm = document.getElementById('quickContactForm');
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! We will contact you shortly.');
      this.reset();
    });
  }

  // Navbar style on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNavbar') || document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(44,62,80,0.98)';
      navbar.style.padding = '10px 0';
    } else {
      navbar.style.background = 'rgba(44,62,80,0.95)';
      navbar.style.padding = '15px 0';
    }
  });

});

// Utility actions
function scrollToEstimator() {
  const el = document.getElementById('estimator');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function scrollToEstimatorWithService(serviceType) {
  const sel = document.getElementById('serviceType');
  if (sel) {
    sel.value = serviceType;
    updateAddons();
  }
  scrollToEstimator();
}

function openWhatsApp() {
  const phone = "919642661602";
  const message = "Hi, I'm interested in your home solutions services. Can you provide more information?";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function makeCall() {
  window.location.href = 'tel:+919642661602';
}

/* Service modal data & opening */
const serviceDetails = {
  mesh: {
    title: "Mosquito Mesh Doors",
    description: "Premium anti-mosquito sliding doors with complete protection for your home.",
    features: [
      { icon: "fas fa-shield-alt", text: "10 Years Warranty" },
      { icon: "fas fa-gem", text: "Premium Quality Mesh" },
      { icon: "fas fa-calendar-day", text: "1-2 Days Installation" }
    ],
    price: "₹250/sqft"
  },
  // ... other services (aluminium, upvc, led, shower, kitchen, hanger) - keep entries as in your original file
};

function openServiceModal(serviceType) {
  const service = serviceDetails[serviceType];
  if (!service) return;
  const title = document.getElementById('serviceModalTitle');
  const content = document.getElementById('serviceModalContent');
  if (title) title.textContent = service.title;
  if (content) {
    const featuresHtml = (service.features || []).map(f => `<div class="service-feature"><i class="${f.icon}"></i><p>${f.text}</p></div>`).join('');
    content.innerHTML = `<h4>${service.title}</h4><p class="text-muted">${service.description}</p><div class="service-modal-features">${featuresHtml}</div><div class="price-info mt-3"><strong>Starting at ${service.price}</strong></div><div class="mt-3"><button class="btn btn-primary me-2" onclick="scrollToEstimatorWithService('${serviceType}')">Get Estimation</button><button class="btn btn-outline-primary" onclick="openWhatsApp()">Chat Now</button></div>`;
  }
  const m = new bootstrap.Modal(document.getElementById('serviceModal'));
  m.show();
}

/* --- Estimation calculation (robust) --- */
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
    // For piece-based items
    area = quantity;
    total = service.base * quantity;
  } else {
    if (!width || width <= 0 || !height || height <= 0) {
      alert('Please provide valid width and height');
      return null;
    }
    area = width * height * quantity;
    total = service.base * area;
  }

  // Addons
  Object.values(selectedAddons || {}).forEach(addon => {
    if (!addon || typeof addon.price !== 'number') return;
    if (serviceType === 'hanger') total += addon.price * quantity;
    else total += addon.price * area;
  });

  // Apply min/max limits (min and max are per quantity in original)
  const min = (service.min || 0) * (service.unit === 'piece' ? quantity : 1);
  const max = (service.max || Infinity) * (service.unit === 'piece' ? quantity : 1);
  total = Math.max(min, Math.min(max, total));

  // GST
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
