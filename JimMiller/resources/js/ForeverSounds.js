const soundFolder = "resources/Soundbites/";
const totalSounds = 12; // update when you add more
let sounds = Array.from({ length: totalSounds }, (_, i) => `${soundFolder}sound${i + 1}.mp3`);
let unusedSounds = [...sounds];
let currentSound = null;
let audio = null;
let audioCtx, analyser, dataArray, source;
let animationId;
let started = false; // to track first user interaction

function getRandomSound() {
  if (unusedSounds.length === 0) unusedSounds = [...sounds];
  const index = Math.floor(Math.random() * unusedSounds.length);
  const selected = unusedSounds[index];
  unusedSounds.splice(index, 1);
  return selected;
}

function playSound(soundPath) {
  stopVisualizer();

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  audio = new Audio(soundPath);
  audio.crossOrigin = "anonymous";
  currentSound = soundPath;

  document.getElementById("soundTitle").textContent =
    `Now Playing: ${soundPath.split("/").pop().replace(".mp3", "")}`;

  setupVisualizer(audio);
  audio.play().catch(err => console.warn("Playback blocked:", err));

  // show proper buttons
  document.getElementById("replayBtn").style.display = "inline-block";
  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("startBtn").style.display = "none";
}

function setupVisualizer(audioElement) {
  const canvas = document.getElementById("waveform");
  const ctx = canvas.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 64;

  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  function draw() {
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const barWidth = (WIDTH / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * HEIGHT;
      const gradient = ctx.createLinearGradient(0, HEIGHT - barHeight, 0, HEIGHT);
      gradient.addColorStop(0, "#00e0ff");
      gradient.addColorStop(1, "#0077ff");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  draw();
}

function stopVisualizer() {
  if (animationId) cancelAnimationFrame(animationId);
}

// button click handlers
document.getElementById("startBtn").addEventListener("click", () => {
  const sound = getRandomSound();
  playSound(sound);
});

document.getElementById("replayBtn").addEventListener("click", () => {
  if (currentSound) playSound(currentSound);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  const nextSound = getRandomSound();
  playSound(nextSound);
});

// Automatically start playback after first user interaction anywhere
window.addEventListener("click", () => {
  if (!started) {
    started = true;
    document.getElementById("startBtn").click(); // simulate click
  }
});
