document.getElementById('changeStyle').addEventListener('change', function() {
    changeStyle(this.value);
});

document.getElementById('changeLanguage').addEventListener('change', function() {
    changeLanguage(this.value);
})

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
        textElements.forEach(el => el.style.color = '#F081FF');
        borderElements.forEach(el => el.style.borderColor = '#F081FF');
        mainElements.forEach(el => el.style.backgroundColor = '#ADD8E6');
        headerElement.style.backgroundColor = '#ADD8E6';
        footerElement.style.backgroundColor = '#ADD8E6';
        controls.forEach(el => el.style.backgroundColor = '#ADD8E6');
        icons.forEach(el => el.style.color = '#F081FF');
        iconNames.forEach(el => el.style.color = '#F081FF');
        musicPlayer.style.backgroundColor = '#ADD8E6';
        playerIcons.forEach(el => el.style.color = '#F081FF');
        headerButtons.forEach(el => {
            el.style.backgroundColor = '#ADD8E6';
            el.style.color = '#F081FF';
            el.style.borderColor = '#F081FF';
        });
        songList.style.backgroundColor = '#ADD8E6';
        songList.style.borderColor = '#F081FF';
        songListText.forEach(el => el.style.color = '#F081FF');
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
    const title = document.getElementById('title');
    const intro1 = document.getElementById('intro1');
    const intro2 = document.getElementById('intro2');
    const knowledge1 = document.getElementById('knowledge1');
    const knowledge2 = document.getElementById('knowledge2');
    const footerText = document.getElementById('footerText');
    const musicPlayerTitle = document.getElementById('musicPlayerTitle');
    const closePlayer = document.getElementById('closePlayer');

    if (language === 'es') {
        welcomeMessage.textContent = 'Pal Hueco';
        title.textContent = 'Gitweb';
        intro1.textContent = 'primero';
        intro2.textContent = 'Soy un desarrollador de software versátil con experiencia en C#, Java ,Angular y Python. Me apasiona la resolución de problemas y la creación de soluciones eficaces y escalables.';
        knowledge1.textContent = 'Conocimiento en:';
        knowledge2.textContent = 'C# y tales';
        footerText.textContent = 'Gonzalo Ortiz';
        musicPlayerTitle.textContent = 'Reproductor de música';
    } else if (language === 'en') {
        welcomeMessage.textContent = 'Pal Hueco';
        title.textContent = 'Gitweb';
        intro1.textContent = 'first';
        intro2.textContent = 'I am a versatile software developer with experience in C#, Java, Angular, and Python. I am passionate about problem-solving and creating efficient and scalable solutions. ';
        knowledge1.textContent = 'Knowledge in:';
        knowledge2.textContent = 'C# and such';
        footerText.textContent = 'Gonzalo Ortiz';
        musicPlayerTitle.textContent = 'Music Player';
    }
}

document.getElementById('changeLanguage').addEventListener('change', function() {
    changeLanguage(this.value);
});

document.getElementById('changeLanguage').addEventListener('change', function() {
    changeLanguage(this.value);
});




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