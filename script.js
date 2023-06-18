document.getElementById('changeStyle').addEventListener('change', function() {
    changeStyle(this.value);
});

document.getElementById('changeLanguage').addEventListener('change', function() {
    changeLanguage(this.value);
});

function changeStyle(value) {
    const body = document.body;
    const borderElements = document.querySelectorAll('.seccion, .mitad-seccion, header, footer');

    if (value === 'default') {
      body.style.backgroundColor = "#FFFFFF";
      borderElements.forEach(el => el.style.borderColor = '#808080');
    } else if (value === 'default1') {
      body.style.backgroundColor = "#ADD8E6";
      borderElements.forEach(el => el.style.borderColor = '#0000FF');
    } else if (value === 'default2') {
      body.style.backgroundColor = "#90EE90";
      borderElements.forEach(el => el.style.borderColor = '#008000');
    }
}

function changeLanguage(language) {
    const welcomeMessage = document.getElementById('welcome');

    if (language === 'es') {
      welcomeMessage.textContent = 'Bienvenido a mi blog personal';
    } else if (language === 'en') {
      welcomeMessage.textContent = 'Welcome to my personal blog';
    }
}
const songs = ['chill.mp3', 'song2.mp3', 'song3.mp3'];
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

const pauseIcon = document.querySelector('#pause i');
pauseButton.addEventListener('click', function() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    pauseIcon.className = 'fas fa-pause';
  } else {
    audioPlayer.pause();
    pauseIcon.className = 'fas fa-play';
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
  musicPlayer.style.display = 'none';
  playMusicButton.style.display = 'inline';
});
closePlayerButton.addEventListener('click', function() {
audioPlayer.pause();
    musicPlayer.style.display = 'none';
    playMusicButton.style.display = 'inline';
  });
  