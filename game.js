const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerWidth = 50;
const playerHeight = 30;
const playerSpeed = 5;

const enemyWidth = 40;
const enemyHeight = 30;
const enemySpeed = 2;
const enemyHealth = 1.5;
// Array of enemy types with their properties
const enemyTypes = [
  {
    color: "green",
    health: 1.5,
    speed: enemySpeed,
  },
  {
    color: "yellow",
    health: 2,
    speed: enemySpeed,
  },
  {
    color: "orange",
    health: 5,
    speed: enemySpeed * 1.2, // Adjust speed as needed
  },
  {
    color: "blue",
    health: 4,
    speed: enemySpeed * 0.8, // Adjust speed as needed
    shield: 3, // New shield property
  },
  {
    color: "purple", // New heavy enemy type
    health: 8, // Higher health for better recovery
    speed: enemySpeed * 0.6, // Slower due to large size
    size: 1.5, // 50% larger than normal enemies
  },
];

// Function to create a new enemy
// Define isMobile to detect mobile devices
const isMobile = window.innerWidth <= 768; // Adjust this value based on your target mobile width

// Define min and max enemies based on device type
const minEnemies = isMobile ? 3 : 5; // Minimum enemies: 3 for mobile, 5 for desktop
const maxEnemies = isMobile ? 6 : 10; // Maximum enemies: 6 for mobile, 10 for desktop

let lastSpawnTime = 0;
const spawnInterval = 2000; // Interval in milliseconds (2 seconds)

function createEnemy() {
  const enemyWidth = 40; // Set appropriate width for the enemy
  const enemyHeight = 40; // Set appropriate height for the enemy
  let x, y;
  let overlap = true;

  while (overlap) {
    x = Math.random() * (canvas.width - enemyWidth);
    y = -enemyHeight;
    overlap = false;

    for (let otherEnemy of enemies) {
      if (
        x < otherEnemy.x + otherEnemy.width &&
        x + enemyWidth > otherEnemy.x &&
        y < otherEnemy.y + otherEnemy.height &&
        y + enemyHeight > otherEnemy.y
      ) {
        overlap = true;
        break;
      }
    }
  }

  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

  enemies.push({
    x,
    y,
    width: enemyWidth,
    height: enemyHeight,
    health: enemyType.health,
    color: enemyType.color,
    speed: enemyType.speed,
    shield: enemyType.shield || 0,
  });
}

function spawnEnemies() {
  const now = Date.now();
  if (now - lastSpawnTime > spawnInterval) {
    lastSpawnTime = now;
    const numberOfEnemies =
      Math.floor(Math.random() * (maxEnemies - minEnemies + 1)) + minEnemies;
    for (let i = 0; i < numberOfEnemies; i++) {
      createEnemy();
    }
  }
}

// Function to draw all enemies on the canvas
function drawEnemies() {
  for (let enemy of enemies) {
    ctx.save();

    // Draw spaceship body (flipped vertically)
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width, enemy.y);
    ctx.lineTo(enemy.x, enemy.y);
    ctx.closePath();
    ctx.fill();

    // Add gradient to the spaceship body
    let gradient = ctx.createLinearGradient(
      enemy.x,
      enemy.y,
      enemy.x + enemy.width,
      enemy.y + enemy.height
    );
    gradient.addColorStop(0, enemy.color);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)"); // Darker shade for a shadow effect
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width, enemy.y);
    ctx.lineTo(enemy.x, enemy.y);
    ctx.closePath();
    ctx.fill();

    // Draw cockpit (moved to bottom)
    ctx.fillStyle = "rgba(200, 200, 200, 0.9)";
    ctx.beginPath();
    ctx.arc(
      enemy.x + enemy.width / 2,
      enemy.y + (enemy.height * 2) / 3,
      enemy.width / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw wings (flipped vertically)
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y + enemy.height * 0.4);
    ctx.lineTo(enemy.x - enemy.width / 4, enemy.y);
    ctx.lineTo(enemy.x, enemy.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width, enemy.y + enemy.height * 0.4);
    ctx.lineTo(enemy.x + enemy.width + enemy.width / 4, enemy.y);
    ctx.lineTo(enemy.x + enemy.width, enemy.y);
    ctx.closePath();
    ctx.fill();

    // Add wing gradient for depth
    gradient = ctx.createLinearGradient(
      enemy.x,
      enemy.y,
      enemy.x + enemy.width,
      enemy.y + enemy.height
    );
    gradient.addColorStop(0, enemy.color);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)"); // Slight shadow for depth
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y + enemy.height * 0.4);
    ctx.lineTo(enemy.x - enemy.width / 4, enemy.y);
    ctx.lineTo(enemy.x, enemy.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width, enemy.y + enemy.height * 0.4);
    ctx.lineTo(enemy.x + enemy.width + enemy.width / 4, enemy.y);
    ctx.lineTo(enemy.x + enemy.width, enemy.y);
    ctx.closePath();
    ctx.fill();

    // Draw thrust effect (simple exhaust flames)
    ctx.fillStyle = "rgba(255, 0, 0, 0.7)"; // More vibrant red with some transparency
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 4, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height + 20); // Extended flames
    ctx.lineTo(enemy.x + (3 * enemy.width) / 4, enemy.y + enemy.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 140, 0, 0.7)"; // Brighter orange with some transparency
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 3, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height + 16); // Extended flames
    ctx.lineTo(enemy.x + (2 * enemy.width) / 3, enemy.y + enemy.height);
    ctx.closePath();
    ctx.fill();

    // Add flame highlights
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Brighter white highlight
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 4, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height + 20);
    ctx.lineTo(enemy.x + (3 * enemy.width) / 4, enemy.y + enemy.height);
    ctx.closePath();
    ctx.stroke();

    // Draw additional details for realism
    // Adding subtle reflections on the spaceship body
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // Light reflection
    ctx.beginPath();
    ctx.ellipse(
      enemy.x + enemy.width / 2,
      enemy.y + enemy.height / 4,
      enemy.width / 2.2,
      enemy.height / 5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Add small details such as bolts or panel lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)"; // Darker line for detail
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 4, enemy.y + enemy.height / 3);
    ctx.lineTo(enemy.x + (3 * enemy.width) / 4, enemy.y + enemy.height / 3);
    ctx.stroke();

    // Add additional wing highlights for depth
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; // Subtle highlight
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(enemy.x, enemy.y + enemy.height * 0.4);
    ctx.lineTo(enemy.x - enemy.width / 6, enemy.y + enemy.height * 0.35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width, enemy.y + enemy.height * 0.4);
    ctx.lineTo(
      enemy.x + enemy.width + enemy.width / 6,
      enemy.y + enemy.height * 0.35
    );
    ctx.stroke();

    ctx.restore();
  }
}

// Function to move and check for collisions with enemies
function moveEnemies() {
  for (let enemy of enemies) {
    enemy.y += enemy.speed;

    // Check for collision between player and enemy
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // Base damage calculation
      let damage = 0;
      switch (enemy.color) {
        case "yellow":
          damage = 4;
          break;
        case "orange":
          damage = 5;
          break;
        case "blue":
          damage = 6; // 2x damage for blue enemies
          break;
        case "purple":
          damage = 7;
          break;
        case "green":
          damage = 2;
          break;
        default:
          damage = 10; // Default damage
      }

      // Determine if the attack is a critical hit
      const criticalHitChance = Math.random() * (0.27 - 0.05) + 0.05; // 5% to 27%
      const isCriticalHit = Math.random() < criticalHitChance;
      if (isCriticalHit) {
        damage *= 1.5; // Increase damage by 50% for critical hits
      }

      // Calculate damage reduction based on player's shield
      let shieldReduction = Math.min(player.shield, damage);
      player.shield -= shieldReduction;
      damage -= shieldReduction;

      // Display shield damage indicator if shield absorbed damage
      if (shieldReduction > 0) {
        playerDamageIndicators.push({
          x: player.x + player.width / 2 - 10,
          y: player.y - 20,
          text: `-${shieldReduction.toFixed(1)} SHIELD`,
          color: "blue",
          creationTime: Date.now(),
          life: 1000,
          fontSize: 20,
          opacity: 1,
          riseSpeed: 0.4,
        });
      }

      // Apply and show remaining damage to the player's health
      if (damage > 0) {
        player.health -= damage;
        player.isHit = true;
        player.hitTime = Date.now();

        // Display health damage indicator
        playerDamageIndicators.push({
          x: player.x + player.width / 2 - 10,
          y: player.y - 20,
          text: isCriticalHit
            ? `-${damage.toFixed(1)} CRIT`
            : `-${damage.toFixed(1)}`,
          color: isCriticalHit ? "red" : "orange",
          creationTime: Date.now(),
          life: 1000,
          fontSize: isCriticalHit ? 28 : 20,
          opacity: 1,
          riseSpeed: 0.5,
        });

        // Add critical hit indicator
        if (isCriticalHit) {
          damageIndicators.push({
            x: player.x + player.width / 2,
            y: player.y - 30,
            text: `CRITICAL HIT!`,
            color: "red",
            creationTime: Date.now(),
            life: 1000,
            fontSize: 28,
            opacity: 1,
            riseSpeed: 0.7,
            scale: 1.2,
          });
        }
      }

      // Remove the enemy after the collision
      enemies.splice(enemies.indexOf(enemy), 1);
    }
  }
  if (player.health <= 0) {
    displayGameOver();
  }
  // Remove enemies that are out of the canvas
  enemies = enemies.filter((enemy) => enemy.y < canvas.height);
}

function displayGameOver() {
  // Create a full-screen overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.color = "white";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "1000";
  overlay.style.fontFamily = "Arial, sans-serif";

  // Create Game Over text
  const gameOverText = document.createElement("h1");
  gameOverText.textContent = "Game Over";
  gameOverText.style.fontSize = "60px";
  overlay.appendChild(gameOverText);

  // Create Restart instruction text
  const restartText = document.createElement("p");
  restartText.textContent = "Restarting in 2 seconds...";
  restartText.style.fontSize = "24px";
  overlay.appendChild(restartText);

  // Append the overlay to the body
  document.body.appendChild(overlay);

  // Auto-restart the game after a delay
  setTimeout(restartGame, 2000); // Adjust the delay (2000 ms = 2 seconds) as needed
}

// Function to handle game restart logic
function restartGame() {
  // Remove the game over overlay
  const overlay = document.querySelector("div");
  if (overlay) {
    document.body.removeChild(overlay);
  }

  // Reload the page after removing the overlay
  location.reload();
}

let player = {
  x: canvas.width / 2 - playerWidth / 2,
  y: canvas.height - playerHeight - 10,
  width: playerWidth,
  height: playerHeight,
  health: 100,
  isHit: false,
  hitTime: 0,
  shield: 35, // Player's shield with max value of 30
};

let bullets = [];
let enemies = [];
let score = 0;
let coins = 0;
const coinsPerEnemy = 4;
let damageIndicators = [];
let playerDamageIndicators = [];

for (let i = 0; i < 5; i++) {
  createEnemy();
}

// Function to draw damage indicators with enhanced effects
function drawDamageIndicators() {
  const currentTime = Date.now();
  for (let i = damageIndicators.length - 1; i >= 0; i--) {
    let indicator = damageIndicators[i];
    let age = currentTime - indicator.creationTime;

    if (age > indicator.life) {
      // Remove indicator after life duration
      damageIndicators.splice(i, 1);
      continue;
    }

    // Calculate progress (0 to 1) over the life of the indicator
    let progress = age / indicator.life;

    // Apply fading effect (opacity decreases)
    indicator.opacity = 1 - progress;

    // Apply floating effect (indicator rises)
    indicator.y -= indicator.riseSpeed;

    // Scale effect (starts large and shrinks slightly over time)
    let scale = 1 + (indicator.scale - 1) * (1 - progress);

    // Apply styles and transformations
    ctx.save();
    ctx.globalAlpha = indicator.opacity;
    ctx.font = `bold ${Math.floor(indicator.fontSize * scale)}px Arial`;
    ctx.fillStyle = indicator.color;

    // Shadow for better readability
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Draw the critical hit text
    ctx.fillText(indicator.text, indicator.x, indicator.y);

    // Restore the canvas context to avoid affecting other elements
    ctx.restore();
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.angle);

  // Draw spaceship body with a more complex gradient
  let bodyGrad = ctx.createLinearGradient(
    -player.width / 2,
    -player.height / 2,
    player.width / 2,
    player.height / 2
  );
  bodyGrad.addColorStop(0, "#4a4a4a"); // Dark metallic gray
  bodyGrad.addColorStop(0.5, "#b0b0b0"); // Medium metallic gray
  bodyGrad.addColorStop(1, "#ffffff"); // Light metallic gray

  ctx.beginPath();
  ctx.moveTo(0, -player.height / 2);
  ctx.lineTo(player.width / 2, player.height / 3); // Changed the body shape for uniqueness
  ctx.lineTo(player.width / 4, player.height / 2);
  ctx.lineTo(-player.width / 4, player.height / 2);
  ctx.lineTo(-player.width / 2, player.height / 3);
  ctx.closePath();

  if (player.isHit) {
    ctx.fillStyle = "orange"; // Flash player when hit
  } else {
    ctx.fillStyle = bodyGrad; // Use gradient fill for realistic look
  }
  ctx.fill();

  // Add a highlight to the body
  ctx.beginPath();
  ctx.moveTo(0, -player.height / 2 + 5); // Slightly adjusted position for uniqueness
  ctx.lineTo(player.width / 3, -player.height / 4);
  ctx.lineTo(-player.width / 3, -player.height / 4);
  ctx.closePath();

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // Brighter highlight
  ctx.fill();

  // Draw cockpit with a radial gradient and add a border
  ctx.beginPath();
  let cockpitGrad = ctx.createRadialGradient(
    0,
    0,
    player.width / 8,
    0,
    0,
    player.width / 4
  );
  cockpitGrad.addColorStop(0, "#00aaff"); // Light blue
  cockpitGrad.addColorStop(1, "#005577"); // Dark blue

  ctx.arc(0, 0, player.width / 4, 0, Math.PI * 2);
  ctx.fillStyle = cockpitGrad;
  ctx.fill();

  // Add a shadow to the cockpit
  ctx.beginPath();
  ctx.arc(0, 0, player.width / 4 + 4, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw engine thrusters
  ctx.beginPath();
  ctx.moveTo(-player.width / 4, player.height / 2 + 5);
  ctx.lineTo(-player.width / 3, player.height / 2 + 15);
  ctx.lineTo(-player.width / 6, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(player.width / 4, player.height / 2 + 5);
  ctx.lineTo(player.width / 3, player.height / 2 + 15);
  ctx.lineTo(player.width / 6, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  // Draw yellow thrust effects (flames)
  ctx.beginPath();
  ctx.moveTo(-player.width / 4, player.height / 2 + 10);
  ctx.lineTo(-player.width / 4 - 5, player.height / 2 + 30); // Flame end point
  ctx.lineTo(-player.width / 4 + 5, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 0, 0.7)"; // Semi-transparent yellow
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(player.width / 4, player.height / 2 + 10);
  ctx.lineTo(player.width / 4 + 5, player.height / 2 + 30); // Flame end point
  ctx.lineTo(player.width / 4 - 5, player.height / 2 + 10);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 0, 0.7)"; // Semi-transparent yellow
  ctx.fill();

  ctx.restore();
}

// Function to draw player damage indicators with enhancements
function drawPlayerDamageIndicators() {
  const currentTime = Date.now();
  for (let i = playerDamageIndicators.length - 1; i >= 0; i--) {
    let indicator = playerDamageIndicators[i];
    let age = currentTime - indicator.creationTime;

    if (age > indicator.life) {
      // Remove the indicator after its life span
      playerDamageIndicators.splice(i, 1);
      continue;
    }

    // Calculate fade and rise effect
    let progress = age / indicator.life;
    indicator.opacity = 1 - progress; // Fades out over time
    indicator.y -= indicator.riseSpeed; // Rise over time

    // Set font size and opacity
    ctx.font = `${indicator.fontSize}px Arial`;
    ctx.fillStyle = `rgba(${
      indicator.color === "red" ? "255, 0, 0" : "255, 165, 0"
    }, ${indicator.opacity})`;

    // Add a shadow for better readability
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;

    // Draw the text
    ctx.fillText(indicator.text, indicator.x, indicator.y);

    // Remove shadow after drawing
    ctx.shadowBlur = 0;
  }
}

let dollars = 0; // Current amount of dollars
const maxDollars = 1000; // Maximum capacity
// Load high score from local storage or set to 6000 for testing
//const highScoreKey = "highScore";
//let highScore = parseInt(localStorage.getItem(highScoreKey), 10) || 6000; // Default to 6000 for testing

function drawScoreAndCoins() {
  const marginTop = 60;
  const textColor = "white";
  const fontSize = "20px";
  const fontFamily = "Arial";

  ctx.fillStyle = textColor;
  ctx.font = `${fontSize} ${fontFamily}`;

  // Add text shadow for better readability
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;

  // Round down score and high score to whole numbers
  const displayScore = Math.floor(score);
  const displayHighScore = Math.floor(highScore);

  // Draw the score
  ctx.fillText(`Score: ${displayScore}`, 10, marginTop);

  // Draw the coins
  ctx.fillText(`Coins: ${coins}`, 10, marginTop + 30);

  // Check if the current score exceeds the high score
  if (displayScore > displayHighScore) {
    highScore = displayScore;
    // Save the new high score to local storage
    // localStorage.setItem(highScoreKey, highScore);
  }

  // Draw the high score
  ctx.fillText(`High Score: ${displayHighScore}`, 10, marginTop + 60);

  // Draw the dollars with max capacity (if needed)
  //ctx.fillText(
  //  `Dollars: ${Math.min(dollars, maxDollars)} / ${maxDollars}`,
  // 10,
  // marginTop + 90
  // );

  // Remove shadow for other drawings
  ctx.shadowColor = "transparent";
}

let regenAlpha = 0; // For health regeneration effect
let startTime = Date.now(); // Timer start time
function drawPlayerHealth() {
  const x = 10;
  const marginTop = 20; // Add margin to the top
  const y = 10 + marginTop; // Adjust y position with the margin
  const width = 200;
  const height = 20;
  const maxHealth = 100;
  const maxShield = 35; // Assuming max shield is 35
  const currentHealth = Math.max(0, Math.min(player.health, maxHealth));
  const currentShield = Math.max(0, Math.min(player.shield, maxShield));

  const healthWidth = (currentHealth / maxHealth) * width;
  const shieldWidth = (currentShield / maxShield) * healthWidth; // Shield bar inside the health bar

  // Draw the background of the health bar
  ctx.fillStyle = "darkred";
  ctx.fillRect(x, y, width, height);

  // Draw the health bar with a different color based on health
  ctx.fillStyle = currentHealth > 50 ? "green" : "yellow";
  ctx.fillRect(x, y, healthWidth, height);

  // Draw the shield bar on top, inside the health bar
  if (currentShield > 0) {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, shieldWidth, height); // Shield width is based on the current health width
  }

  // Draw border around the health bar
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Draw health and shield text
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`HP: ${currentHealth} / ${maxHealth}`, x + 5, y + 5);

  // Draw shield text if the player has shield
  if (currentShield > 0) {
    ctx.fillText(`Shield: ${currentShield} / ${maxShield}`, x + 120, y + 5);
  }
}

function drawTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
  const minutes = Math.floor(elapsedTime / 60); // Calculate minutes
  const seconds = elapsedTime % 60; // Calculate remaining seconds

  const timerText = `Time: ${minutes}m ${seconds}s`;

  // Measure text width
  ctx.font = "20px Arial";
  const textWidth = ctx.measureText(timerText).width;

  // Calculate position to center the text
  const timerX = (canvas.width - textWidth) / 2;
  const timerY = 40;

  // Clear previous timer area
  ctx.clearRect(timerX - 5, timerY - 5, textWidth + 10, 30);

  // Draw timer background
  ctx.fillStyle = "black";
  ctx.fillRect(timerX - 5, timerY - 5, textWidth + 10, 30);

  // Draw timer text
  ctx.fillStyle = "white";
  ctx.fillText(timerText, timerX, timerY);
}

// Mouse control for player movement along the x-axis
canvas.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  player.x = mouseX - player.width / 2;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
});

function moveDamageIndicators() {
  const now = Date.now();

  // Filter indicators by life span in a reusable function
  const filterByLife = (indicators) =>
    indicators.filter(
      (indicator) => now - indicator.creationTime < indicator.life
    );

  // Apply the filter to both damage indicator arrays
  damageIndicators = filterByLife(damageIndicators);
  playerDamageIndicators = filterByLife(playerDamageIndicators);
}

// Existing code
function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= playerSpeed;
  }
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += playerSpeed;
  }
}

let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Allow shooting with space bar
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    bullets.push({
      x: player.x + player.width / 2 - bulletWidth / 2,
      y: player.y,
    });
  }
});

// Allow shooting with left mouse button
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    bullets.push({
      x: player.x + player.width / 2 - bulletWidth / 2,
      y: player.y,
    });
  }
});

// Touch controls for player movement
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  handleTouchMovement(e);
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  handleTouchMovement(e);
});

function handleTouchMovement(e) {
  // Get touch coordinates
  const touchX = e.touches[0].clientX - canvas.offsetLeft;
  const touchY = e.touches[0].clientY - canvas.offsetTop;

  // Move player based on touch position
  if (touchX < canvas.width / 2) {
    // Touch on the left side of the screen
    if (player.x > 0) {
      player.x -= playerSpeed;
    }
  } else {
    // Touch on the right side of the screen
    if (player.x < canvas.width - player.width) {
      player.x += playerSpeed;
    }
  }
}

// Touch controls for shooting
canvas.addEventListener("touchend", (e) => {
  e.preventDefault(); // Prevent default touch behavior

  // Add a bullet at the player's position when touch ends
  bullets.push({
    x: player.x + player.width / 2 - bulletWidth / 2,
    y: player.y,
  });
});
