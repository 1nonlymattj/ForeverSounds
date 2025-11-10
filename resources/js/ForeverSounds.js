// ForeverSounds.js

let sounds = [];
let playedSounds = [];
let currentAudio;

// Get personKey from sessionStorage
const personKey = sessionStorage.getItem("personKey");
if (!personKey || !accessMap[personKey]) {
    alert("Person not recognized. Please login first.");
    throw new Error("Person not recognized");
}

const entry = accessMap[personKey];

// Set the display name
document.getElementById("personName").innerText = entry.displayName;

// ---- Load sounds dynamically from sounds.json ----
fetch(`${entry.folder}sounds.json`)
  .then(res => res.json())
  .then(data => {
      sounds = data.map(f => entry.folder + f); // prepend folder path
  })
  .catch(err => {
      console.error("Failed to load sounds.json", err);
});

// Get buttons
const playButton = document.getElementById("playButton");
const replayButton = document.getElementById("replayButton");
const nextButton = document.getElementById("nextButton");
const controls = document.getElementById("controls");

// Pick a random sound that hasn’t been played yet
function getRandomSound() {
    if (playedSounds.length === sounds.length) playedSounds = [];
    const remaining = sounds.filter(s => !playedSounds.includes(s));
    const selected = remaining[Math.floor(Math.random() * remaining.length)];
    playedSounds.push(selected);
    return selected;
}

// Play a sound
function playSound(src) {
    if (currentAudio) currentAudio.pause();
    currentAudio = new Audio(src);

    currentAudio.onerror = () => console.error("Failed to play:", src);
    currentAudio.play().catch(err => console.error("Play failed:", err, src));

    currentAudio.onended = () => {
        controls.classList.remove("hidden");
    };
}

// Event listeners
playButton.addEventListener("click", () => {
    const sound = getRandomSound();
    playSound(sound);
    playButton.style.display = "none";
});

replayButton.addEventListener("click", () => {
    if (currentAudio) {
        currentAudio.currentTime = 0;
        currentAudio.play();
    }
});

nextButton.addEventListener("click", () => {
    const sound = getRandomSound();
    playSound(sound);
});
