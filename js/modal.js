// modal.js
// Modal functionality for images and videos (clean, single-listener approach)

// Helpers to get elements
const modalImageEl = document.getElementById('modalImage');
const modalVideoEl = document.getElementById('modalVideo');
const videoModalEl = document.getElementById('videoModal');
const imageModalEl = document.getElementById('imageModal');

// Image Modal
function openImageModal(imageSrc) {
    if (!modalImageEl) return;
    modalImageEl.src = imageSrc;
    modalImageEl.alt = 'Product Image';

    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is required for modals.');
        return;
    }

    const imageModal = new bootstrap.Modal(imageModalEl);
    imageModal.show();
}

// Video Modal
function openVideoModal(title, videoSrc) {
    const modalTitle = document.getElementById('videoModalTitle');
    if (modalTitle) modalTitle.textContent = title;

    if (!modalVideoEl) return;
    // set src (use dataset to avoid reloading strangely)
    modalVideoEl.src = videoSrc;

    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is required for modals.');
        return;
    }

    const videoModal = new bootstrap.Modal(videoModalEl);
    videoModal.show();
}

// Attach single event listeners (only once)
document.addEventListener('DOMContentLoaded', function () {
    if (!videoModalEl || !modalVideoEl) return;

    // Use event delegation via the modal element (bootstrap emits events on the element)
    videoModalEl.addEventListener('shown.bs.modal', () => {
        // Play only if source set
        try { modalVideoEl.play(); } catch (e) { /* ignore autoplay restrictions */ }
    });

    videoModalEl.addEventListener('hidden.bs.modal', () => {
        // Pause and reset when closed
        try {
            modalVideoEl.pause();
            modalVideoEl.currentTime = 0;
            // Optionally clear src to free memory
            modalVideoEl.removeAttribute('src');
            modalVideoEl.load();
        } catch (e) { /* ignore */ }
    });

    // Close modals by clicking outside (backdrop element)
    const serviceModal = document.getElementById('serviceModal');
    const customerFormModal = document.getElementById('customerFormModal');

    [imageModalEl, videoModalEl, serviceModal, customerFormModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                const instance = bootstrap.Modal.getInstance(modal);
                if (instance) instance.hide();
            }
        });
    });
});
