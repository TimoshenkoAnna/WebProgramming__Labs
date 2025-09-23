document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.content__media-gallery');
    if (!galleryContainer) return;

    // Коллекция изображений
    const mediaData = [
        { image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/1388/1388-preview.mp3' }, // Природа (пение птиц)
        { image: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/2988/2988-preview.mp3' }, // Горы (ветер)
        { image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/1387/1387-preview.mp3' }, // Снег (хруст снега)
        { image: 'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/1389/1389-preview.mp3' }, // Океан (волны)
        { image: 'https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/2563/2563-preview.mp3' }, // Небо (легкий ветер)
        { image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/2987/2987-preview.mp3' }, // Пустыня (песчаный ветер)
        { image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/1552/1552-preview.mp3' }, // Звезды (ночные сверчки)
        { image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/1387/1387-preview.mp3' }, // Озеро (ручей)
        { image: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/1390/1390-preview.mp3' }, // Море (прибой)
        { image: 'https://images.pexels.com/photos/2832061/pexels-photo-2832061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', sound: 'https://assets.mixkit.co/active_storage/sfx/1387/1387-preview.mp3' }  // Лес (лесная атмосфера)
    ];

    const galleryImage = document.getElementById('gallery-image');
    const galleryPlayer = document.querySelector('.media-gallery__player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playerStateIndicator = document.getElementById('player-state-indicator');
    const volumeSlider = document.getElementById('volume-slider');
    const nextMediaBtn = document.getElementById('next-media-btn');

    let currentMediaIndex = 0;
    let galleryAudio = document.getElementById('gallery-audio');
    const playIcon = '<img src="https://img.icons8.com/ios-filled/50/ffffff/play.png" alt="Play"/>';
    const pauseIcon = '<img src="https://img.icons8.com/ios-filled/50/ffffff/pause.png" alt="Pause"/>';

    function createNewAudioElement() {

        if (galleryAudio) {
            galleryAudio.pause();
            galleryAudio.remove();
        }

        galleryAudio = document.createElement('audio');
        galleryAudio.id = 'gallery-audio';
        galleryAudio.style.display = 'none';
        galleryPlayer.appendChild(galleryAudio);

        galleryAudio.addEventListener('play', updatePlayerStateIndicator);
        galleryAudio.addEventListener('pause', updatePlayerStateIndicator);
        galleryAudio.addEventListener('ended', updatePlayerStateIndicator);

        galleryAudio.volume = volumeSlider.value;
    }

    function loadRandomMedia() {
        createNewAudioElement();

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * mediaData.length);
        } while (newIndex === currentMediaIndex);
        currentMediaIndex = newIndex;
        const selectedMedia = mediaData[currentMediaIndex];

        galleryImage.classList.add('fade-out');
        setTimeout(() => {
            galleryImage.src = selectedMedia.image;
            galleryImage.classList.remove('fade-out');
            galleryAudio.src = selectedMedia.sound;
            console.log('Загружается аудио:', selectedMedia.sound); // Для отладки
            galleryAudio.load();
            galleryAudio.addEventListener('loadedmetadata', () => {
                console.log('Длительность аудио:', galleryAudio.duration, 'секунд');
                if (galleryAudio.duration > 0 && !isNaN(galleryAudio.duration)) {
                    galleryAudio.play().catch(error => {
                        console.error('Ошибка воспроизведения:', error.message, 'Файл:', selectedMedia.sound);
                        updatePlayerStateIndicator();
                    });
                } else {
                    console.warn('Некорректная длительность аудио. Файл:', selectedMedia.sound);
                    updatePlayerStateIndicator();
                }
            }, { once: true });
            galleryAudio.addEventListener('error', (e) => {
                console.error('Ошибка загрузки аудио:', e.message || 'Неизвестная ошибка', 'Файл:', selectedMedia.sound);
                updatePlayerStateIndicator();
            }, { once: true });
        }, 600);
    }

    function togglePlayPause() {
        if (!galleryAudio.src) {
            console.warn('Аудио не загружено');
            return;
        }
        if (galleryAudio.paused) {
            galleryAudio.play().catch(error => {
                console.error('Ошибка воспроизведения:', error.message);
                updatePlayerStateIndicator();
            });
        } else {
            galleryAudio.pause();
        }
    }

    function updatePlayerStateIndicator() {
        playerStateIndicator.innerHTML = galleryAudio.paused || !galleryAudio.src ? playIcon : pauseIcon;
        playPauseBtn.title = galleryAudio.paused || !galleryAudio.src ? 'Воспроизведение' : 'Пауза';
    }

    function changeVolume() {
        galleryAudio.volume = volumeSlider.value;
    }

    // События
    galleryImage.addEventListener('click', loadRandomMedia);
    nextMediaBtn.addEventListener('click', loadRandomMedia);
    playPauseBtn.addEventListener('click', togglePlayPause);
    volumeSlider.addEventListener('input', changeVolume);

    // Инициализация
    updatePlayerStateIndicator();
    changeVolume();
    loadRandomMedia();
});