// Modal functionality for images and videos

// Image Modal
function openImageModal(imageSrc) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modalImage.alt = 'Product Image';
    
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
}

// Video Modal
function openVideoModal(title, videoSrc) {
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('videoModalTitle');
    
    modalTitle.textContent = title;
    modalVideo.src = videoSrc;
    
    const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
    videoModal.show();
    
    // Play video when modal opens
    videoModal._element.addEventListener('shown.bs.modal', function () {
        modalVideo.play();
    });
    
    // Pause video when modal closes
    videoModal._element.addEventListener('hidden.bs.modal', function () {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    });
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById('imageModal');
    const videoModal = document.getElementById('videoModal');
    const serviceModal = document.getElementById('serviceModal');
    const customerFormModal = document.getElementById('customerFormModal');
    
    [imageModal, videoModal, serviceModal, customerFormModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                }
            });
        }
    });
});
