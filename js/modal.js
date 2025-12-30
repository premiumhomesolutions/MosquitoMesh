// modal.js - image & video modal handlers (single-lifecycle listeners)

const imageModalEl = document.getElementById('imageModal');
const videoModalEl = document.getElementById('videoModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const videoModalTitle = document.getElementById('videoModalTitle');

function openImageModal(src, alt = 'Image') {
  if (!modalImage || !imageModalEl) return;
  modalImage.src = src;
  modalImage.alt = alt;
  const m = new bootstrap.Modal(imageModalEl);
  m.show();
}

function openVideoModal(title, src) {
  if (!modalVideo || !videoModalEl) return;
  if (videoModalTitle) videoModalTitle.textContent = title || 'Video';
  modalVideo.src = src;
  const m = new bootstrap.Modal(videoModalEl);
  m.show();
}

document.addEventListener('DOMContentLoaded', () => {
  if (videoModalEl && modalVideo) {
    videoModalEl.addEventListener('shown.bs.modal', () => {
      try { modalVideo.play(); } catch (e) { /* autoplay blocked */ }
    });

    videoModalEl.addEventListener('hidden.bs.modal', () => {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.removeAttribute('src');
      modalVideo.load();
    });
  }

  // close on backdrop click for each modal element (safe)
  [imageModalEl, videoModalEl, document.getElementById('serviceModal'), document.getElementById('customerFormModal')].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        const inst = bootstrap.Modal.getInstance(modal);
        if (inst) inst.hide();
      }
    });
  });

  // Delegate clicks from service cards & video buttons
  document.addEventListener('click', (e) => {
    // service card image click
    const img = e.target.closest('.service-img');
    if (img && img.dataset && img.dataset.img) {
      openImageModal(img.dataset.img, img.alt || '');
    }

    // view video button
    const vbtn = e.target.closest('.view-video-btn');
    if (vbtn) {
      const title = vbtn.getAttribute('data-video-title') || 'Product Video';
      const src = vbtn.getAttribute('data-video-src');
      if (src) openVideoModal(title, src);
    }
  });
});
