// modal.js - robust modal handlers (single listeners)

// Cached elements
const imageModalEl = document.getElementById('imageModal');
const videoModalEl = document.getElementById('videoModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const videoModalTitle = document.getElementById('videoModalTitle');

// Open image modal
function openImageModal(src, alt = 'Image') {
  if (!modalImage || !imageModalEl) return;
  modalImage.src = src;
  modalImage.alt = alt;
  const m = new bootstrap.Modal(imageModalEl);
  m.show();
}

// Open video modal
function openVideoModal(title, src) {
  if (!modalVideo || !videoModalEl) return;
  videoModalTitle.textContent = title || 'Video';
  // set source and play when modal shown
  modalVideo.src = src;
  const m = new bootstrap.Modal(videoModalEl);
  m.show();
}

// Attach single event listeners (once)
document.addEventListener('DOMContentLoaded', () => {
  if (videoModalEl && modalVideo) {
    videoModalEl.addEventListener('shown.bs.modal', () => {
      // try play (may be blocked by autoplay policy)
      try { modalVideo.play(); } catch (e) { /* ignore */ }
    });

    videoModalEl.addEventListener('hidden.bs.modal', () => {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.removeAttribute('src');
      modalVideo.load();
    });
  }

  // close on backdrop click (safe)
  [imageModalEl, videoModalEl].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        const inst = bootstrap.Modal.getInstance(modal);
        if (inst) inst.hide();
      }
    });
  });
});
