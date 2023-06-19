document.getElementById('changeStyle').addEventListener('change', function() {
    changeStyle(this.value);
});

document.getElementById('changeLanguage').addEventListener('change', function() {
    changeLanguage(this.value);
})

//No soy de hacer las cosas pequeñas y bien, esta siguiente funcion lo mas reducido posible es el ejemplo 
function changeStyle(value) {
    const body = document.body;
    const textElements = document.querySelectorAll('h1, h2, p, span, div');
    const borderElements = document.querySelectorAll('.seccion, .mitad-seccion, header, footer');
    const mainElements = document.querySelectorAll('main, main *');
    const headerElement = document.querySelector('header');
    const footerElement = document.querySelector('footer');
    const controls = document.querySelectorAll('#controls, #controls *');
    const icons = document.querySelectorAll('.icono-container i');
    const iconNames = document.querySelectorAll('.nombre-icono');
    const musicPlayer = document.querySelector('#musicPlayer');
    const playerIcons = document.querySelectorAll('#controls i');
    const headerButtons = document.querySelectorAll('.header-buttons button, .header-buttons select');
    const songList = document.querySelector('#songList');
    const songListText = document.querySelectorAll('#songList *');

    if (value === 'default') {
        body.style.backgroundColor = "#FFFFFF";
        textElements.forEach(el => el.style.color = '#000000');
        borderElements.forEach(el => el.style.borderColor = '#808080');
        mainElements.forEach(el => el.style.backgroundColor = '#FFFFFF');
        headerElement.style.backgroundColor = '#FFFFFF';
        footerElement.style.backgroundColor = '#FFFFFF';
        controls.forEach(el => el.style.backgroundColor = '#FFFFFF');
        icons.forEach(el => el.style.color = '#000000');
        iconNames.forEach(el => el.style.color = '#000000');
        musicPlayer.style.backgroundColor = '#FFFFFF';
        playerIcons.forEach(el => el.style.color = '#000000');
        headerButtons.forEach(el => {
            el.style.backgroundColor = '#FFFFFF';
            el.style.color = '#000000';
            el.style.borderColor = '#808080';
        });
        songList.style.backgroundColor = '#FFFFFF';
        songList.style.borderColor = '#808080';
        songListText.forEach(el => el.style.color = '#000000');
    } else if (value === 'default1') {
        body.style.backgroundColor = "#ADD8E6";
        textElements.forEach(el => el.style.color = '#000080');
        borderElements.forEach(el => el.style.borderColor = '#0000FF');
        mainElements.forEach(el => el.style.backgroundColor = '#ADD8E6');
        headerElement.style.backgroundColor = '#ADD8E6';
        footerElement.style.backgroundColor = '#ADD8E6';
        controls.forEach(el => el.style.backgroundColor = '#ADD8E6');
        icons.forEach(el => el.style.color = '#000080');
        iconNames.forEach(el => el.style.color = '#000080');
        musicPlayer.style.backgroundColor = '#ADD8E6';
        playerIcons.forEach(el => el.style.color = '#000080');
        headerButtons.forEach(el => {
            el.style.backgroundColor = '#ADD8E6';
            el.style.color = '#000080';
            el.style.borderColor = '#0000FF';
        });
        songList.style.backgroundColor = '#ADD8E6';
        songList.style.borderColor = '#0000FF';
        songListText.forEach(el => el.style.color = '#000080');
    } else if (value === 'default2') {
        body.style.backgroundColor = "#303030";
        textElements.forEach(el => el.style.color = '#FFFFFF');
        borderElements.forEach(el => el.style.borderColor = '#FFFFFF');
        mainElements.forEach(el => el.style.backgroundColor = '#303030');
        headerElement.style.backgroundColor = '#303030';
        footerElement.style.backgroundColor = '#303030';
        controls.forEach(el => el.style.backgroundColor = '#303030');
        icons.forEach(el => el.style.color = '#FFFFFF');
        iconNames.forEach(el => el.style.color = '#FFFFFF');
        musicPlayer.style.backgroundColor = '#303030';
        playerIcons.forEach(el => el.style.color = '#FFFFFF');
        headerButtons.forEach(el => {
            el.style.backgroundColor = '#303030';
            el.style.color = '#FFFFFF';
            el.style.borderColor = '#FFFFFF';
        });
        songList.style.backgroundColor = '#303030';
        songList.style.borderColor = '#FFFFFF';
        songListText.forEach(el => el.style.color = '#FFFFFF');
    }
}



const volumeSlider = document.getElementById('volumeSlider');

volumeSlider.addEventListener('input', function() {
    audioPlayer.volume = volumeSlider.value;
});


function changeLanguage(language) {
    const welcomeMessage = document.getElementById('welcome');

    if (language === 'es') {
        welcomeMessage.textContent = 'Bienvenido a mi blog personal';
    } else if (language === 'en') {
        welcomeMessage.textContent = 'Welcome to my personal blog';
    }
}
const songs = ['music/chill.mp3', 'music/japan.mp3', 'music/salsa.mp3'];
let currentSong = 0;
const musicPlayer = document.getElementById('musicPlayer');
const audioPlayer = document.getElementById('audioPlayer');
const sourcePlayer = document.getElementById('sourcePlayer');
const playMusicButton = document.getElementById('playMusic');
const pauseButton = document.getElementById('pause');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const muteButton = document.getElementById('mute');

playMusicButton.addEventListener('click', function() {
    musicPlayer.style.display = 'block';
    audioPlayer.play();
    playMusicButton.style.display = 'none';
    pauseButton.style.display = 'inline';
});

previousButton.addEventListener('click', function() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    sourcePlayer.src = songs[currentSong];
    audioPlayer.load();
    audioPlayer.play();
});

nextButton.addEventListener('click', function() {
    currentSong = (currentSong + 1) % songs.length;
    sourcePlayer.src = songs[currentSong];
    audioPlayer.load();
    audioPlayer.play();
});

const pauseIcon = document.querySelector('#pause i');
pauseButton.addEventListener('click', function() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        pauseIcon.className = 'fas fa-play';
    } else {
        audioPlayer.pause();
        pauseIcon.className = 'fas fa-pause';
    }
});
nextButton.addEventListener('click', function() {
    currentSong = (currentSong + 1) % songs.length;
    sourcePlayer.src = songs[currentSong];
    audioPlayer.load();
    audioPlayer.play();
    document.getElementById('songTitle').textContent = songs[currentSong];
});
previousButton.addEventListener('click', function() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    sourcePlayer.src = songs[currentSong];
    audioPlayer.load();
    audioPlayer.play();
    document.getElementById('songTitle').textContent = songs[currentSong];
});
muteButton.addEventListener('click', function() {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;

        muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        audioPlayer.muted = true;
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

const currentTime = document.getElementById('currentTime');
const progressBar = document.getElementById('progressBar');

audioPlayer.addEventListener('timeupdate', function() {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
const totalTime = document.getElementById('totalTime');

audioPlayer.addEventListener('loadedmetadata', function() {
    totalTime.textContent = formatTime(audioPlayer.duration);
    progressBar.max = audioPlayer.duration;
});

audioPlayer.addEventListener('timeupdate', function() {
    progressBar.value = audioPlayer.currentTime;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
});

progressBar.addEventListener('input', function() {
    audioPlayer.currentTime = progressBar.value;
});
const songList = document.getElementById('songList');
const songTitle = document.getElementById('songTitle');

songList.addEventListener('change', function() {
    sourcePlayer.src = this.value;
    audioPlayer.load();
    audioPlayer.play();
    songTitle.textContent = this.options[this.selectedIndex].text;
});
const closePlayerButton = document.getElementById('closePlayer');

closePlayerButton.addEventListener('click', function() {
    audioPlayer.pause();
    musicPlayer.style.display = 'none';
    playMusicButton.style.display = 'inline';
});

audioPlayer.volume = 0.2;
audioPlayer.addEventListener('ended', function() {
    currentSong = (currentSong + 1) % songs.length;
    sourcePlayer.src = songs[currentSong];
    audioPlayer.load();
    audioPlayer.play();
    document.getElementById('songTitle').textContent = songs[currentSong];
});