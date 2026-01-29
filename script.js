
const songs = [
  { title: "Bandana", artist: "Sidhu Moosewala", src: "songs/bandana.mp3", img: "images/bandana.jpeg" },
  { title: "Beqarar", artist: "Unknown", src: "songs/beqarar.mp3", img: "images/karan.jpeg" },
  { title: "Boyfriend", artist: "Karan Aujla", src: "songs/Boyfriend - Karan Aujla.mp3", img: "images/boyfriend.jpeg" },
  { title: "Dawood", artist: "Sidhu Moosewala", src: "songs/dawood.mp3", img: "images/dawood.jpeg" },
  { title: "Dilemma", artist: "Sidhu Moosewala", src: "songs/dilemma.mp3", img: "images/dilema.jpeg" },
  { title: "For A Reason", artist: "Karan Aujla", src: "songs/For A Reason - Karan Aujla (DJJOhAL.Com).mp3", img: "images/karan.jpeg" },
  { title: "IDK How", artist: "Karan Aujla", src: "songs/IDK_How_1 karan aujla.mp3", img: "images/aujla.jpeg" },
  { title: "Ishqa", artist: "Unknown", src: "songs/ishqa.mp3", img: "images/ishqa.jpeg" },
  { title: "Layiari", artist: "Rehman Dakait", src: "songs/layari.mp3", img: "images/layari.jpeg" },
  { title: "Lock", artist: "Sidhu Moosewala", src: "songs/lock.mp3", img: "images/lock.jpeg" },
  { title: "Mexico", artist: "Karan Aujla", src: "songs/mexico.mp3", img: "images/karan.jpeg" },
  { title: "OST", artist: "Unknown", src: "songs/ost.mp3", img: "images/karan.jpeg" },
  { title: "Sohne", artist: "Sidhu Moosewala", src: "songs/sohne.mp3", img: "images/sohne.jpeg" },
  { title: "Sparrow", artist: "Unknown", src: "songs/sparrow.mp3", img: "images/sparrow.jpeg" },
  { title: "Tu Hai To Mai Hu", artist: "Unknown", src: "songs/Tu hai to mai hu.mp3", img: "images/karan.jpeg" },
  { title: "WBB", artist: "Karan Aujla", src: "songs/wbb.mp3", img: "images/wbb.jpeg" }
];

// DOM Elements
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const imgEl = document.getElementById("song-img");
const songListEl = document.getElementById("song-list");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeEl = document.getElementById("volume");
const fileInput = document.getElementById("file-input");

// Player State
let songIndex = 0;
let isPlaying = false;

// Populate playlist UI
function createPlaylist() {
  songListEl.innerHTML = "";
  songs.forEach((s, idx) => {
    const li = document.createElement("li");
    li.dataset.index = idx;
    li.innerHTML = `
      <img src="${s.img}" class="song-thumb" alt="thumb">
      <div class="song-meta">
        <span class="title">${s.title}</span>
        <span class="artist">${s.artist}</span>
      </div>
    `;
    li.addEventListener("click", () => {
      loadSongByIndex(idx);
      playSong();
    });
    songListEl.appendChild(li);
  });
}

function setActiveListItem() {
  const items = songListEl.querySelectorAll('li');
  items.forEach(it => it.classList.remove('active'));
  const active = songListEl.querySelector(`li[data-index="${songIndex}"]`);
  if (active) active.classList.add('active');
}

// Load song into player
function loadSong(song) {
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist || 'Unknown Artist';
  audio.src = song.src;
  imgEl.src = song.img;
}

function loadSongByIndex(i) {
  songIndex = i;
  loadSong(songs[songIndex]);
  setActiveListItem();
}

// Playback controls
function playSong() {
  audio.play();
  playBtn.textContent = '⏸';
  isPlaying = true;
}
function pauseSong() {
  audio.pause();
  playBtn.textContent = '▶';
  isPlaying = false;
}

playBtn.addEventListener('click', () => {
  if (!isPlaying) playSong(); else pauseSong();
});

nextBtn.addEventListener('click', () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSongByIndex(songIndex);
  playSong();
});

prevBtn.addEventListener('click', () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSongByIndex(songIndex);
  playSong();
});

// Progress and timing
audio.addEventListener('timeupdate', () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

progress.addEventListener('input', () => {
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Auto next
audio.addEventListener('ended', () => {
  nextBtn.click();
});

// Volume
volumeEl.addEventListener('input', () => {
  audio.volume = volumeEl.value;
});

// Handle file uploads (add to playlist locally)
fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach(f => {
    const url = URL.createObjectURL(f);
    let name = f.name.replace(/\.[^/.]+$/, "");
    // try to split into title - artist
    let [title, artist] = name.split(' - ').map(s => s && s.trim());
    if (!artist) artist = 'Unknown';
    songs.push({ title: title || name, artist, src: url, img: 'images/karan.jpeg' });
  });
  createPlaylist();
});

// Init
createPlaylist();
loadSongByIndex(0);
volumeEl.value = 0.7;
audio.volume = 0.7;

// Keyboard: space to play/pause
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); if (!isPlaying) playSong(); else pauseSong(); }
});