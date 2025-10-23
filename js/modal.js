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
    
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            const modal = bootstrap.Modal.getInstance(imageModal);
            modal.hide();
        }
    });
    
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            const modal = bootstrap.Modal.getInstance(videoModal);
            modal.hide();
        }
    });
});
