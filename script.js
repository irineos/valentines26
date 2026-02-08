// Answer pools - add more here!
const badAnswers = [
  "No",
  "Nope",
  "Never",
  "In your dreams",
  "Ask my cat",
  "Changed my mind",
  "Let me think...",
  "Buffering...",
  "Error 404",
  "Maybe not",
  "Just kidding",
  "Actually no",
  "New phone\nwho dis",
  "I need to wash\nmy hair",
  "Nah",
  "Ask my lawyer",
  "Have you tried\nturning it off\nand on again?",
  "404 feelings\nnot found",
  "I'll pass",
  "Absolutely not",
  "Not today",
  "Maybe next year",
  "System error",
  "Connection lost",
  "Brain.exe\nhas stopped",
  "Lemme\ncheck my calendar",
  "Per my\nlast email... no",
  "I have plans\nwith my couch",
  "Mercury is\nin retrograde",
  "Haha no",
  "Read receipts: off",
  "Seen ✓✓",
  "Unsubscribe",
  "K",
  "lol no",
  "Hard pass",
  "That's gonna\nbe a no"
];

const winningAnswers = [
  "Yes! 💕",
  "100% Yes! 💖",
  "Yes forever! 💘",
  "Obviously yes! 💝",
  "Yes yes yes! 💗",
  "Always yes! 💞",
  "Absolutely! 💓",
  "Of course! 🥰"
];

// Questions for each round
const questions = [
  "Will you be my Valentine?",
  "Are you sure?",
  "Final answer?"
];

// Analytics - track events to GoatCounter
function trackEvent(name) {
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: name, event: true });
  }
}

// Build a round by picking random bad answers + one winning answer
function buildRound(questionIndex) {
  const numBadOptions = 5;
  
  // Shuffle and pick bad answers
  const shuffledBad = [...badAnswers].sort(() => Math.random() - 0.5);
  const selectedBad = shuffledBad.slice(0, numBadOptions);
  
  // Pick a winning answer for this round
  const winAnswer = winningAnswers[questionIndex % winningAnswers.length];
  
  // Random position for winning answer
  const winIndex = Math.floor(Math.random() * (numBadOptions + 1));
  
  // Build options array
  const options = [...selectedBad];
  options.splice(winIndex, 0, winAnswer);
  
  return {
    question: questions[questionIndex],
    options: options,
    winIndex: winIndex
  };
}

// Game state
let currentRound = 0;
let rounds = [];
let isSpinning = false;

// Initialize rounds
function initRounds() {
  rounds = questions.map((_, i) => buildRound(i));
}

// Canvas setup
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = canvas.width / 2 - 5;

// Colors for wheel segments
const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];

let currentRotation = 0;

// Draw the wheel
function drawWheel(options) {
  const sliceAngle = (2 * Math.PI) / options.length;
  
  options.forEach((option, i) => {
    const startAngle = i * sliceAngle + currentRotation;
    const endAngle = startAngle + sliceAngle;
    
    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw text (supports multi-line with \n)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Arial';
    
    const lines = option.split('\n');
    const lineHeight = 12;
    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = -totalHeight / 2;
    
    lines.forEach((line, idx) => {
      ctx.fillText(line, radius - 10, startY + idx * lineHeight + 4);
    });
    ctx.restore();
  });
  
  // Center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
}

// Spin the wheel (always lands on winning option)
function spinWheel() {
  if (isSpinning) return;
  
  // Track spin event
  trackEvent(`spin-round-${currentRound + 1}`);
  
  const round = rounds[currentRound];
  isSpinning = true;
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('result').textContent = '';
  
  // Calculate target angle to land on winning slice
  // Pointer is at top (270° = 3π/2 radians)
  const numSlices = round.options.length;
  const sliceAngle = (2 * Math.PI) / numSlices;
  
  // Winning slice center (from 0, without rotation)
  const winSliceCenter = round.winIndex * sliceAngle + sliceAngle / 2;
  
  // We need: winSliceCenter + finalRotation = 3π/2 (top)
  // So: finalRotation = 3π/2 - winSliceCenter
  const targetAngle = (3 * Math.PI / 2) - winSliceCenter;
  
  // Calculate rotation needed to reach target
  let rotationToTarget = targetAngle - currentRotation;
  
  // Normalize to positive rotation (always spin forward)
  while (rotationToTarget < 0) {
    rotationToTarget += 2 * Math.PI;
  }
  
  // Add 3-5 full spins for dramatic effect (always visible spinning)
  const fullSpins = 3 + Math.floor(Math.random() * 3);
  const additionalRotation = rotationToTarget + fullSpins * 2 * Math.PI;
  
  // Animation variables
  const startRotation = currentRotation;
  const totalRotation = additionalRotation;
  const duration = 4000 + Math.random() * 1000; // 4-5 seconds
  const startTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    currentRotation = startRotation + totalRotation * easeOut;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel(round.options);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Spin complete
      onSpinComplete();
    }
  }
  
  requestAnimationFrame(animate);
}

// Handle spin completion
function onSpinComplete() {
  const round = rounds[currentRound];
  const resultBadge = document.getElementById('resultBadge');
  const resultText = document.getElementById('result');
  
  resultText.textContent = round.options[round.winIndex];
  resultBadge.classList.remove('hidden');
  
  currentRound++;
  
  if (currentRound < rounds.length) {
    // Next round after delay
    setTimeout(() => {
      document.getElementById('question').textContent = rounds[currentRound].question;
      resultBadge.classList.add('hidden');
      resultText.textContent = '';
      document.getElementById('spinBtn').disabled = false;
      
      // Redraw wheel with new options
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWheel(rounds[currentRound].options);
      
      isSpinning = false;
    }, 1500);
  } else {
    // Show finale
    setTimeout(() => {
      trackEvent('reached-finale');
      document.getElementById('finale').classList.remove('hidden');
    }, 1500);
  }
}

// Event listeners
document.getElementById('spinBtn').addEventListener('click', spinWheel);

// Initialize game
initRounds();
drawWheel(rounds[0].options);
