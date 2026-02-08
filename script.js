// Game configuration
const rounds = [
  {
    question: "Will you be my Valentine?",
    options: ["No", "Nope", "Never", "In your dreams", "Ask my cat", "Yes! 💕"],
    winIndex: 5
  },
  {
    question: "Are you sure?",
    options: ["Changed my mind", "Let me think...", "Buffering...", "Error 404", "Maybe not", "100% Yes! 💖"],
    winIndex: 5
  },
  {
    question: "Final answer?",
    options: ["Just kidding", "Actually no", "New phone who dis", "I need to wash my hair", "Nah", "Yes forever! 💘"],
    winIndex: 5
  }
];

let currentRound = 0;
let isSpinning = false;

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
    
    // Draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(option, radius - 10, 4);
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
  document.getElementById('result').textContent = round.options[round.winIndex];
  
  currentRound++;
  
  if (currentRound < rounds.length) {
    // Next round after delay
    setTimeout(() => {
      document.getElementById('question').textContent = rounds[currentRound].question;
      document.getElementById('result').textContent = '';
      document.getElementById('spinBtn').disabled = false;
      
      // Redraw wheel with new options
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWheel(rounds[currentRound].options);
      
      isSpinning = false;
    }, 1500);
  } else {
    // Show finale
    setTimeout(() => {
      document.getElementById('finale').classList.remove('hidden');
    }, 1500);
  }
}

// Event listeners
document.getElementById('spinBtn').addEventListener('click', spinWheel);

// Initial draw
drawWheel(rounds[0].options);
