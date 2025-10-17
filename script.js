// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;           // Holds the interval for spawning items
let timerInterval;           // Holds the interval for the timer
let timeLeft = 30;           // Initial time left in seconds

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

function getSpawnSpeed() {
  const difficulty = document.getElementById('difficulty').value;
  if (difficulty === 'easy') return 1300;
  if (difficulty === 'hard') return 600;
  return 1000; // medium
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  hideRestartButton();
  hideStartButton();
  // Remove countdown logic, start game immediately
  document.getElementById('current-cans').textContent = 0;
  document.getElementById('timer').textContent = 30;
  document.getElementById('achievements').textContent = '';
  createGrid();
  gameActive = true;
  currentCans = 0;
  timeLeft = 30;
  spawnInterval = setInterval(spawnWaterCan, getSpawnSpeed());
  timerInterval = setInterval(updateTimer, 1000);
}

// Updates the timer every second
function updateTimer() {
  if (!gameActive) return;
  timeLeft--;
  document.getElementById('timer').textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
    if (currentCans >= 20) {
      document.getElementById('achievements').textContent = 'You win!';
    } else {
      document.getElementById('achievements').textContent = 'Time is up!';
    }
  }
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop timer
  showRestartButton();
  hideStartButton();
}

function showRestartButton() {
  document.getElementById('restart-game').style.display = 'block';
}

function hideRestartButton() {
  document.getElementById('restart-game').style.display = 'none';
}

function showStartButton() {
  document.getElementById('start-game').style.display = 'block';
}

function hideStartButton() {
  document.getElementById('start-game').style.display = 'none';
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);

// Handle clicks on water cans to update score
document.querySelector('.game-grid').addEventListener('click', function(e) {
  if (!gameActive) return;
  // Check if the clicked element is a water can
  if (e.target.classList.contains('water-can')) {
    currentCans++;
    document.getElementById('current-cans').textContent = currentCans;
    // Remove the can after click
    e.target.parentElement.innerHTML = '';
    // Game continues until timer runs out
  }
});

document.getElementById('restart-game').addEventListener('click', function() {
  showStartButton();
  startGame();
});
