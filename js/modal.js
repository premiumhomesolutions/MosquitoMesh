// modal.js - robust image & video modal handling

const imageModalEl = document.getElementById('imageModal');
const videoModalEl = document.getElementById('videoModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const videoModalTitle = document.getElementById('videoModalTitle');

function openImageModal(src, alt = '') {
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
  // Play video on show, stop on hide (attach once)
  if (videoModalEl && modalVideo) {
    videoModalEl.addEventListener('shown.bs.modal', () => { try { modalVideo.play(); } catch (e) {} });
    videoModalEl.addEventListener('hidden.bs.modal', () => { try { modalVideo.pause(); modalVideo.currentTime = 0; modalVideo.removeAttribute('src'); modalVideo.load(); } catch(e) {} });
  }

  // Close modal on backdrop click (works for all modals)
  [imageModalEl, videoModalEl, document.getElementById('serviceModal'), document.getElementById('customerFormModal')].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        const inst = bootstrap.Modal.getInstance(modal);
        if (inst) inst.hide();
      }
    });
  });

  // Delegate clicks for images and video buttons inside service cards
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.service-img');
    if (img && img.dataset && img.dataset.img) {
      openImageModal(img.dataset.img, img.alt || '');
    }
    const vbtn = e.target.closest('.view-video-btn');
    if (vbtn) {
      const title = vbtn.getAttribute('data-video-title');
      const src = vbtn.getAttribute('data-video-src');
      if (src) openVideoModal(title, src);
    }
  });
});
