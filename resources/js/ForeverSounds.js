// ForeverSounds.js

let sounds = [];
let playedSounds = [];
let currentAudio;

// -----------------------------
// 1️⃣ Get the personKey from the URL
// -----------------------------
const urlParams = new URLSearchParams(window.location.search);
const personKey = urlParams.get("person");

if (!personKey || !accessMap[personKey]) {
    alert("Person not found. Please scan a valid QR code or login first.");
    throw new Error("Person not recognized");
}

const entry = accessMap[personKey];

// -----------------------------
// 2️⃣ Set display name
// -----------------------------
const personNameEl = document.getElementById("personName");
if (personNameEl) personNameEl.innerText = entry.displayName;

// -----------------------------
// 3️⃣ Load full S3 URLs for all sounds
// -----------------------------
sounds = entry.sounds.map(f => entry.bucket + f);

// -----------------------------
// 4️⃣ Get button elements
// -----------------------------
const playButton = document.getElementById("playButton");
const replayButton = document.getElementById("replayButton");
const nextButton = document.getElementById("nextButton");
const controls = document.getElementById("controls");

// -----------------------------
// 5️⃣ Pick a random sound that hasn’t been played yet
// -----------------------------
function getRandomSound() {
    if (playedSounds.length === sounds.length) playedSounds = [];
    const remaining = sounds.filter(s => !playedSounds.includes(s));
    const selected = remaining[Math.floor(Math.random() * remaining.length)];
    playedSounds.push(selected);
    return selected;
}

// -----------------------------
// 6️⃣ Play a sound
// -----------------------------
function playSound(src) {
    if (currentAudio) currentAudio.pause();
    currentAudio = new Audio(src);

    currentAudio.onerror = () => console.error("Failed to play:", src);
    currentAudio.play()
        .then(() => {
            // Successfully started playing
            controls.classList.remove("hidden");
        })
        .catch(err => {
            console.warn("Autoplay blocked by browser. Please press Play.", err);
            // Show the Play button so user can manually start
            if (playButton) playButton.style.display = "inline-block";
        });

    currentAudio.onended = () => {
        controls.classList.remove("hidden");
    };
}

// -----------------------------
// 7️⃣ Button event listeners
// -----------------------------
if (playButton) {
    playButton.addEventListener("click", () => {
        const sound = getRandomSound();
        playSound(sound);
        playButton.style.display = "none"; // hide after starting
    });
}

if (replayButton) {
    replayButton.addEventListener("click", () => {
        if (currentAudio) {
            currentAudio.currentTime = 0;
            currentAudio.play();
        }
    });
}

if (nextButton) {
    nextButton.addEventListener("click", () => {
        const sound = getRandomSound();
        playSound(sound);
    });
}

// -----------------------------
// 8️⃣ Auto-play first sound on page load
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
    if (sounds.length > 0) {
        const sound = getRandomSound();
        playSound(sound);
        if (playButton) playButton.style.display = "none";
    }
});
