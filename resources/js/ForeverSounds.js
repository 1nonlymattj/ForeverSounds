// ForeverSounds.js

let sounds = [];
let playedSounds = [];
let currentAudio;

// -----------------------------
// 1️⃣ Get the personKey from the URL
// -----------------------------
const urlParams = new URLSearchParams(window.location.search);
const personKey = urlParams.get("person");
const waveform = document.querySelector(".waveform");


if (!personKey || !accessMap[personKey]) {
    console.log("No valid person provided. Waiting for login redirect.");
    window.location.href = "login.html";
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
sounds = entry.sounds.map(s => ({
    url: entry.bucket + s.file,
    text: s.text
}));

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
    const remaining = sounds.filter(s => !playedSounds.includes(s.url));
    const selected = remaining[Math.floor(Math.random() * remaining.length)];
    playedSounds.push(selected.url);
    return selected;
}

// -----------------------------
// 6️⃣ Play a sound
// -----------------------------
function playSound(soundObj) {
    if (currentAudio) currentAudio.pause();

    currentAudio = new Audio(soundObj.url);

    // Start animation when playing
    currentAudio.onplay = () => {
        waveform.classList.add("playing");
    };

    // Stop animation when paused or finished
    currentAudio.onpause = () => {
        waveform.classList.remove("playing");
    };

    currentAudio.onended = () => {
        waveform.classList.remove("playing");
        controls.classList.remove("hidden");
    };

    currentAudio.play().catch(err => {
        console.warn("Autoplay blocked.", err);
        if (playButton) playButton.style.display = "inline-block";
    });

    // UPDATE TRANSCRIPT
    const transcriptBox = document.getElementById("transcriptBox");
    transcriptBox.innerText = soundObj.text || "";
    transcriptBox.classList.remove("hidden");
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
