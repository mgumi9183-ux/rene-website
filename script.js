// Sample Track Data for SpotiBai
const tracks = [
  {
    id: 1,
    title: "Bicol Express Midnight",
    artist: "Rene & The Bais",
    playlist: "OPM Hits",
    duration: 198, // seconds
    emoji: "🌋",
    color: "linear-gradient(135deg, #e11d48, #4c0519)",
    liked: true
  },
  {
    id: 2,
    title: "Git Push to Production",
    artist: "Lo-Fi Dev",
    playlist: "Coding Focus",
    duration: 165,
    emoji: "💻",
    color: "linear-gradient(135deg, #2563eb, #1e1b4b)",
    liked: true
  },
  {
    id: 3,
    title: "Tala sa Dagat",
    artist: "Island Acoustic",
    playlist: "OPM Hits",
    duration: 214,
    emoji: "🌊",
    color: "linear-gradient(135deg, #0d9488, #115e59)",
    liked: false
  },
  {
    id: 4,
    title: "3AM Coffee & CSS",
    artist: "Syntax Chill",
    playlist: "Coding Focus",
    duration: 152,
    emoji: "☕",
    color: "linear-gradient(135deg, #d97706, #451a03)",
    liked: false
  },
  {
    id: 5,
    title: "Neon Jeepney Ride",
    artist: "Metro Beats",
    playlist: "Late Night",
    duration: 205,
    emoji: "🚐",
    color: "linear-gradient(135deg, #9333ea, #3b0764)",
    liked: true
  },
  {
    id: 6,
    title: "Para Sa'yo, Bai",
    artist: "Harana Sessions",
    playlist: "OPM Hits",
    duration: 230,
    emoji: "🎸",
    color: "linear-gradient(135deg, #16a34a, #052e16)",
    liked: false
  },
  {
    id: 7,
    title: "Heavy Repetitions",
    artist: "Bass Drop PH",
    playlist: "Workout",
    duration: 184,
    emoji: "🏋️",
    color: "linear-gradient(135deg, #dc2626, #18181b)",
    liked: false
  },
  {
    id: 8,
    title: "Rain Over Virac",
    artist: "Ambient Tropics",
    playlist: "Late Night",
    duration: 245,
    emoji: "🌧️",
    color: "linear-gradient(135deg, #0284c7, #0f172a)",
    liked: true
  }
];

// State
let currentTrackIndex = 0;
let isPlaying = false;
let currentSeconds = 0;
let progressInterval = null;
let activePlaylist = "all";
let searchQuery = "";

// DOM Elements
const quickPicksEl = document.getElementById("quick-picks");
const cardsGridEl = document.getElementById("cards-grid");
const trackListBodyEl = document.getElementById("track-list-body");
const sectionTitleEl = document.getElementById("section-title");
const trackCountEl = document.getElementById("track-count");
const searchInputEl = document.getElementById("search-input");

// Player DOM Elements
const playerCoverEl = document.getElementById("player-cover");
const playerTitleEl = document.getElementById("player-title");
const playerArtistEl = document.getElementById("player-artist");
const playerLikeBtn = document.getElementById("player-like-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");
const progressBarEl = document.getElementById("progress-bar");
const progressFillEl = document.getElementById("progress-fill");
const volumeSliderEl = document.getElementById("volume-slider");

// Helper: Format seconds to M:SS
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Dynamic Greeting based on time of day
function setGreeting() {
  const hour = new Date().getHours();
  const greetingEl = document.getElementById("greeting-text");
  if (hour < 12) greetingEl.textContent = "Good morning, Bai";
  else if (hour < 18) greetingEl.textContent = "Good afternoon, Bai";
  else greetingEl.textContent = "Good evening, Bai";
}

// Filter Tracks
function getFilteredTracks() {
  return tracks.filter(track => {
    const matchesPlaylist =
      activePlaylist === "all" ||
      (activePlaylist === "liked" && track.liked) ||
      track.playlist === activePlaylist;

    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPlaylist && matchesSearch;
  });
}

// Render Dashboard
function renderDashboard() {
  const filtered = getFilteredTracks();
  trackCountEl.textContent = `${filtered.length} track${filtered.length === 1 ? "" : "s"}`;

  // Render Quick Picks (Top 6 tracks)
  quickPicksEl.innerHTML = tracks.slice(0, 6).map(track => `
    <div class="quick-card" onclick="selectAndPlay(${track.id})">
      <div class="quick-art" style="background: ${track.color};">${track.emoji}</div>
      <div class="quick-title">${track.title}</div>
    </div>
  `).join("");

  // Render Album/Track Cards
  cardsGridEl.innerHTML = filtered.map(track => `
    <div class="music-card" onclick="selectAndPlay(${track.id})">
      <div class="card-art" style="background: ${track.color};">
        ${track.emoji}
        <button class="hover-play-btn">▶</button>
      </div>
      <div class="card-title">${track.title}</div>
      <div class="card-artist">${track.artist}</div>
    </div>
  `).join("");

  // Render Tracklist Table
  const currentTrack = tracks[currentTrackIndex];
  trackListBodyEl.innerHTML = filtered.map((track, idx) => {
    const isCurrent = currentTrack && currentTrack.id === track.id;
    return `
      <div class="track-row ${isCurrent ? "active-track" : ""}" onclick="selectAndPlay(${track.id})">
        <span>${isCurrent && isPlaying ? "🔊" : idx + 1}</span>
        <div class="track-info-col">
          <strong>${track.title}</strong>
          <span class="track-sub">${track.artist}</span>
        </div>
        <span class="track-sub">${track.playlist}</span>
        <button class="row-like-btn" onclick="toggleLike(event, ${track.id})">
          ${track.liked ? "💚" : "🤍"}
        </button>
        <span class="track-sub">${formatTime(track.duration)}</span>
      </div>
    `;
  }).join("");
}

// Load Track into Player
function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];
  currentSeconds = 0;

  playerCoverEl.textContent = track.emoji;
  playerCoverEl.style.background = track.color;
  playerTitleEl.textContent = track.title;
  playerArtistEl.textContent = track.artist;
  playerLikeBtn.textContent = track.liked ? "💚" : "🤍";
  totalDurationEl.textContent = formatTime(track.duration);
  currentTimeEl.textContent = "0:00";
  progressFillEl.style.width = "0%";

  renderDashboard();
}

// Play / Pause Logic
function playTrack() {
  isPlaying = true;
  playPauseBtn.textContent = "⏸";
  clearInterval(progressInterval);

  progressInterval = setInterval(() => {
    const track = tracks[currentTrackIndex];
    if (currentSeconds < track.duration) {
      currentSeconds++;
      currentTimeEl.textContent = formatTime(currentSeconds);
      const percent = (currentSeconds / track.duration) * 100;
      progressFillEl.style.width = `${percent}%`;
    } else {
      nextTrack();
    }
  }, 1000);

  renderDashboard();
}

function pauseTrack() {
  isPlaying = false;
  playPauseBtn.textContent = "▶";
  clearInterval(progressInterval);
  renderDashboard();
}

function selectAndPlay(trackId) {
  const index = tracks.findIndex(t => t.id === trackId);
  if (index !== -1) {
    loadTrack(index);
    playTrack();
  }
}

function nextTrack() {
  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(nextIndex);
  if (isPlaying) playTrack();
}

function prevTrack() {
  const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prevIndex);
  if (isPlaying) playTrack();
}

// Toggle Like Status
function toggleLike(event, trackId) {
  event.stopPropagation();
  const track = tracks.find(t => t.id === trackId);
  if (track) {
    track.liked = !track.liked;
    if (tracks[currentTrackIndex].id === trackId) {
      playerLikeBtn.textContent = track.liked ? "💚" : "🤍";
    }
    renderDashboard();
  }
}

// Event Listeners
playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseTrack() : playTrack();
});

nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

playerLikeBtn.addEventListener("click", (e) => {
  toggleLike(e, tracks[currentTrackIndex].id);
});

// Clickable Progress Bar
progressBarEl.addEventListener("click", (e) => {
  const rect = progressBarEl.getBoundingClientRect();
  const clickRatio = (e.clientX - rect.left) / rect.width;
  const track = tracks[currentTrackIndex];
  currentSeconds = Math.floor(clickRatio * track.duration);
  currentTimeEl.textContent = formatTime(currentSeconds);
  progressFillEl.style.width = `${clickRatio * 100}%`;
});

// Volume Icon Feedback
volumeSliderEl.addEventListener("input", (e) => {
  const val = e.target.value;
  const volIcon = document.getElementById("volume-icon");
  if (val == 0) volIcon.textContent = "🔇";
  else if (val < 50) volIcon.textContent = "🔉";
  else volIcon.textContent = "🔊";
});

// Search Input
searchInputEl.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  sectionTitleEl.textContent = searchQuery ? `Results for "${searchQuery}"` : "Made For Rene";
  renderDashboard();
});

// Sidebar Playlist & Nav Filtering
document.querySelectorAll(".playlist-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".playlist-item, .nav-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
    activePlaylist = item.dataset.playlist;
    sectionTitleEl.textContent = activePlaylist === "all" ? "Made For Rene" : activePlaylist;
    renderDashboard();
  });
});

document.querySelectorAll(".nav-item[data-filter]").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".playlist-item, .nav-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");
    activePlaylist = item.dataset.filter;
    sectionTitleEl.textContent = activePlaylist === "liked" ? "Liked Songs" : "Made For Rene";
    renderDashboard();
  });
});

document.getElementById("focus-search").addEventListener("click", () => {
  searchInputEl.focus();
});

// Create Custom Playlist Prompt
document.getElementById("add-playlist-btn").addEventListener("click", () => {
  const name = prompt("Enter new playlist name:");
  if (name && name.trim() !== "") {
    const li = document.createElement("li");
    li.className = "playlist-item";
    li.textContent = name.trim();
    li.addEventListener("click", () => {
      document.querySelectorAll(".playlist-item").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      sectionTitleEl.textContent = name.trim();
    });
    document.getElementById("playlist-list").appendChild(li);
  }
});

// Initialize
setGreeting();
loadTrack(0);