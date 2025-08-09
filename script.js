// Frequencies for each button color beep
const tones = {
  red: 440,    // A4
  blue: 554,   // C#5
  green: 659,  // E5
  yellow: 784  // G5
};

const buttons = document.querySelectorAll('.color-btn');
let gamePattern = [];
let userPattern = [];
let level = 1;

const statusText = document.getElementById('status');
const levelText = document.getElementById('level');

// Create Web Audio context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

buttons.forEach(button => {
  button.addEventListener('click', handleUserClick);
});

function playTone(freq, duration = 300) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = freq;

  oscillator.start();
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration / 1000);

  oscillator.stop(audioCtx.currentTime + duration / 1000);
}

function startGame() {
  userPattern = [];
  generatePattern();
  showPattern();
}

function generatePattern() {
  const colors = ['red', 'blue', 'green', 'yellow'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gamePattern.push(randomColor);
}

function showPattern() {
  let delay = 0;
  statusText.textContent = "Watch the pattern!";
  buttons.forEach(btn => btn.disabled = true);

  gamePattern.forEach(color => {
    setTimeout(() => {
      flashButton(color);
    }, delay);
    delay += 700;
  });

  setTimeout(() => {
    statusText.textContent = "Your turn!";
    buttons.forEach(btn => btn.disabled = false);
    userPattern = [];
  }, delay);
}

function flashButton(color) {
  const button = document.getElementById(color);
  playTone(tones[color]);
  button.style.opacity = "0.5";
  setTimeout(() => {
    button.style.opacity = "1";
  }, 300);
}

function handleUserClick(event) {
  if (event.target.disabled) return;

  const clickedColor = event.target.id;
  userPattern.push(clickedColor);
  flashButton(clickedColor);

  checkUserInput();
}

function checkUserInput() {
  const lastIndex = userPattern.length - 1;

  if (userPattern[lastIndex] !== gamePattern[lastIndex]) {
    statusText.textContent = "Game Over! You lost.";
    buttons.forEach(btn => btn.disabled = true);
    setTimeout(() => {
      startNewGame();
    }, 1500);
    return;
  }

  if (userPattern.length === gamePattern.length) {
    if (userPattern.join('') === gamePattern.join('')) {
      level++;
      levelText.textContent = `Level: ${level}`;
      statusText.textContent = "Good job! Next level!";
      buttons.forEach(btn => btn.disabled = true);
      setTimeout(startGame, 1500);
    }
  }
}

function startNewGame() {
  gamePattern = [];
  level = 1;
  levelText.textContent = `Level: ${level}`;
  statusText.textContent = "Starting new game...";
  setTimeout(startGame, 1500);
}

startGame();
