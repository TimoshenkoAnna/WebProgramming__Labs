document.addEventListener('DOMContentLoaded', () => {
    const videoTrigger = document.getElementById('video-trigger-wrapper');
    if (!videoTrigger) {
        return;
    }
    
    const videoUrl = 'https://videos.pexels.com/video-files/853874/853874-hd_1920_1080_25fps.mp4';

    const videoModal = document.getElementById('video-modal');
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const videoModalClose = document.getElementById('video-modal-close');

    function openVideoModal() {
        modalVideoPlayer.src = videoUrl;
        videoModal.classList.add('active');
        modalVideoPlayer.play();
    }

    function closeVideoModal() {
        videoModal.classList.remove('active');
        modalVideoPlayer.pause();
        modalVideoPlayer.src = "";
    }

    videoTrigger.addEventListener('click', openVideoModal);

    videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (event) => {
        if (event.target === videoModal) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
});