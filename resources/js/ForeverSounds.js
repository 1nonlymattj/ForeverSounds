const sounds = [];
const numSounds = 12; // adjust if you know how many there are
let playedSounds = [];
let currentAudio;

// You can list or auto-generate the sound file names if consistent
for (let i = 1; i <= numSounds; i++) {
  sounds.push(`${personFolder}sound${i}.mp3`);
}

const playButton = document.getElementById("playButton");
const replayButton = document.getElementById("replayButton");
const nextButton = document.getElementById("nextButton");
const controls = document.getElementById("controls");

function getRandomSound() {
  if (playedSounds.length === sounds.length) playedSounds = [];
  const remaining = sounds.filter(s => !playedSounds.includes(s));
  const selected = remaining[Math.floor(Math.random() * remaining.length)];
  playedSounds.push(selected);
  return selected;
}

function playSound(src) {
  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(src);
  currentAudio.play();

  currentAudio.onended = () => {
    controls.classList.remove("hidden");
  };
}

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
