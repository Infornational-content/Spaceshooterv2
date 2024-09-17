let destroyedEnemiesCount = 0; // Counter for destroyed enemies
const bulletSpeed = 8;
const bulletWidth = 5;
const bulletHeight = 20;
let normalScoreIncrement = 10; // Base score increment for defeating an enemy

// Function to handle bullet movement and collisions
function moveBullets() {
  bullets.forEach((bullet) => {
    bullet.y -= bulletSpeed;
  });

  fireballs.forEach((fireball) => {
    fireball.y -= fireballSpeed;
  });

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    if (!bullet) continue; // Skip if bullet is undefined or null

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (!enemy) continue; // Skip if enemy is undefined or null

      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bulletWidth > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bulletHeight > enemy.y
      ) {
        const dx = bullet.x - (enemy.x + enemy.width / 2);
        const dy = bullet.y - (enemy.y + enemy.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Ensure minimum distance of 1
        const minDistance = 1;
        const maxDistance = 250 * 1.05; // Increased by 5%
        const distanceFactor = Math.max(
          0,
          (distance - minDistance) / (maxDistance - minDistance)
        );

        const baseDamage = 0.6 * 1.05; // Increased by 5%
        const minDamage = 0.45 * 1.05; // Increased by 5%

        let damage =
          baseDamage * distanceFactor + minDamage * (1 - distanceFactor);

        // Critical hit range adjustment
        const shortRangeThreshold = 125 * 1.05; // Increased by 5%

        if (distance <= shortRangeThreshold) {
          const minMultiplier = 0.5 * 1.05; // Increased by 5%
          const maxMultiplier = 1.0 * 1.05; // Increased by 5%
          const randomMultiplier =
            Math.random() * (maxMultiplier - minMultiplier) + minMultiplier;
          damage *= randomMultiplier;
        }

        // Critical hit calculation
        const criticalChance = 0.2 * 1.05; // Increased by 5%
        const criticalMultiplierMin = 0.5 * 1.05; // Increased by 5%
        const criticalMultiplierMax = 1.0 * 1.05; // Increased by 5%
        const baseCriticalDamage = 0.9 * 1.05; // Increased by 5%
        const additionalDamageChance = 0.05 * 1.05; // Increased by 5%
        const additionalDamagePercentage = 0.03 * 1.05; // Increased by 5%

        const isCriticalHit = Math.random() < criticalChance;
        if (isCriticalHit) {
          const criticalMultiplier =
            Math.random() * (criticalMultiplierMax - criticalMultiplierMin) +
            criticalMultiplierMin;
          damage = (damage + baseCriticalDamage) * criticalMultiplier;
        }

        const isAdditionalDamage = Math.random() < additionalDamageChance;
        if (isAdditionalDamage) {
          damage += damage * additionalDamagePercentage;
        }

        enemy.health -= damage;

        let enemyScore = 0;
        let enemyCoins = 0;
        switch (enemy.type) {
          case "yellow":
            enemyScore = 50 * 1.05; // Increased by 5%
            enemyCoins = 10 * 1.05; // Increased by 5%
            break;
          case "blue":
            enemyScore = 75 * 1.05; // Increased by 5%
            enemyCoins = 15 * 1.05; // Increased by 5%
            break;
          case "green":
            enemyScore = 100 * 1.05; // Increased by 5%
            enemyCoins = 20 * 1.05; // Increased by 5%
            break;
          case "purple":
            enemyScore = 150 * 1.05; // Increased by 5%
            enemyCoins = 30 * 1.05; // Increased by 5%
            break;
          case "orange":
            enemyScore = 120 * 1.05; // Increased by 5%
            enemyCoins = 25 * 1.05; // Increased by 5%
            break;
          default:
            enemyScore = 50 * 1.05; // Increased by 5%
            enemyCoins = 10 * 1.05; // Increased by 5%
            break;
        }

        if (enemy.health <= 0) {
          enemies.splice(j, 1);
          score += enemyScore;
          coins += enemyCoins;
        }

        damageIndicators.push({
          x: enemy.x + enemy.width / 2 - 10,
          y: enemy.y + enemy.height / 2 - 10,
          text: isCriticalHit
            ? `-${damage.toFixed(1)} CRIT`
            : `-${damage.toFixed(1)}`,
          color: isCriticalHit ? "#FF6347" : "white",
          creationTime: Date.now(),
          life: isCriticalHit ? 800 * 1.05 : 500 * 1.05, // Increased by 5%
          fontSize: isCriticalHit ? 26 * 1.05 : 20 * 1.05, // Increased by 5%
          opacity: 1,
          riseSpeed: 0.5,
        });

        bullets.splice(i, 1);
        break;
      }
    }
  }

  // Fireball Collision Detection
  for (let i = fireballs.length - 1; i >= 0; i--) {
    const fireball = fireballs[i];
    if (!fireball) continue;

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (!enemy) continue;

      if (
        fireball.x < enemy.x + enemy.width &&
        fireball.x + fireball.width > enemy.x &&
        fireball.y < enemy.y + enemy.height &&
        fireball.y + fireball.height > enemy.y
      ) {
        // Randomly reduce the base damage by 5% to 10%
        const baseDamage = 1.0;
        const damageReductionFactor = 0.95 + Math.random() * 0.05; // Random factor between 0.95 and 1.00
        let fireballDamage = baseDamage * damageReductionFactor;

        // Apply critical hit chance
        const criticalChance = 0.1; // 10% chance for critical hit
        const criticalMultiplierMin = 1.1;
        const criticalMultiplierMax = 1.2; // Reduced critical multiplier max
        const maxCriticalMultiplier = 1.3; // Reduced maximum critical multiplier cap
        const isCriticalHit = Math.random() < criticalChance;
        if (isCriticalHit) {
          const criticalMultiplier =
            Math.random() * (criticalMultiplierMax - criticalMultiplierMin) +
            criticalMultiplierMin;
          fireballDamage *= Math.min(criticalMultiplier, maxCriticalMultiplier); // Cap critical multiplier
        }

        // Apply 2% extra damage
        const extraDamagePercentage = 0.02;
        fireballDamage += fireballDamage * extraDamagePercentage;

        // Increase total damage by 3%
        fireballDamage *= 1.03;

        // Add damage indicator for critical hit
        damageIndicators.push({
          x: enemy.x + enemy.width / 2 - 10,
          y: enemy.y + enemy.height / 2 - 10,
          text: isCriticalHit
            ? `-${fireballDamage.toFixed(1)} CRIT`
            : `-${fireballDamage.toFixed(1)}`,
          color: isCriticalHit ? "red" : "orange",
          creationTime: Date.now(),
          life: isCriticalHit ? 600 : 500, // Duration of the damage indicator
          fontSize: isCriticalHit ? 22 : 18, // Font size for critical hits
          opacity: 1,
          riseSpeed: 0.4, // Rise speed of the damage indicator
        });

        // Apply fireball damage to the main enemy
        enemy.health -= fireballDamage;

        if (enemy.health <= 0) {
          enemies.splice(j, 1);
          score += 60; // Reduced score for kill
          coins += 50; // Reduced coin reward for kill
        }

        const splashRadius = 30; // Reduced radius for splash damage

        // Apply splash damage to nearby enemies
        enemies.forEach((otherEnemy) => {
          const dx = fireball.x - (otherEnemy.x + otherEnemy.width / 2);
          const dy = fireball.y - (otherEnemy.y + otherEnemy.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= splashRadius) {
            // Calculate splash damage
            let splashDamage = fireballDamage * (1 - distance / splashRadius); // Splash damage scales with distance

            // Increase splash damage by 2%
            splashDamage *= 1.02;

            otherEnemy.health -= splashDamage;

            // Add damage indicator for splash
            damageIndicators.push({
              x: otherEnemy.x + otherEnemy.width / 2 - 10,
              y: otherEnemy.y + otherEnemy.height / 2 - 10,
              text: `-${splashDamage.toFixed(1)}`,
              color: "orange",
              creationTime: Date.now(),
              life: 800, // Duration of splash damage indicator
              fontSize: 16, // Font size for splash damage
              opacity: 1,
              riseSpeed: 0.4,
            });

            if (otherEnemy.health <= 0) {
              enemies.splice(enemies.indexOf(otherEnemy), 1);
              score += 15; // Reduced score for splash kill
              coins += 2; // Reduced coin reward for splash kill
            }
          }
        });

        // Apply burning effect (damage over time)
        const burningChanceMin = 0.05; // Minimum chance of burning effect
        const burningChanceMax = 0.1; // Maximum chance of burning effect

        // Generate a random chance between 0 and 1
        const randomChance = Math.random();

        if (
          randomChance >= 1 - burningChanceMax &&
          randomChance < 1 - burningChanceMin
        ) {
          const burningDuration = 1500; // Reduced duration of 1.5 seconds
          const burningDamage = 6; // Reduced total burning damage
          const numBurnTicks = 3; // Reduced number of ticks
          const burnInterval = burningDuration / numBurnTicks; // Interval between ticks
          const tickDamage = burningDamage / numBurnTicks; // Damage per tick

          if (!enemy.burning) {
            enemy.burning = true;
            enemy.burnTicks = 0;
            enemy.burnInterval = setInterval(() => {
              if (enemy.burnTicks < numBurnTicks) {
                enemy.health -= tickDamage;
                damageIndicators.push({
                  x: enemy.x + enemy.width / 2 - 10,
                  y: enemy.y + enemy.height / 2 - 10,
                  text: `-${tickDamage.toFixed(1)} BURN`,
                  color: "orange",
                  creationTime: Date.now(),
                  life: 300, // Duration of the damage indicator
                  fontSize: 16,
                  opacity: 1,
                  riseSpeed: 0.4,
                });
                enemy.burnTicks += 1;
              } else {
                clearInterval(enemy.burnInterval);
                enemy.burning = false;
              }
            }, burnInterval);
          }
        }

        fireballs.splice(i, 1);
        break;
      }
    }
  }
}

// Function to draw bullets
function drawBullets() {
  for (let bullet of bullets) {
    // Draw the main bullet bodies (left and right)
    for (let offset of [-bulletWidth, bulletWidth]) {
      // Draw the bullet body
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(bullet.x + offset - bulletWidth, bullet.y);
      ctx.lineTo(bullet.x + offset, bullet.y - bulletHeight / 2);
      ctx.lineTo(bullet.x + offset + bulletWidth, bullet.y);
      ctx.lineTo(bullet.x + offset, bullet.y + bulletHeight / 1.5);
      ctx.closePath();
      ctx.fill();

      // Add a metallic shine
      const gradient = ctx.createLinearGradient(
        bullet.x + offset - bulletWidth,
        bullet.y,
        bullet.x + offset + bulletWidth,
        bullet.y
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.7)");
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add a powerful glowing effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(255, 100, 0, 0.8)";
      ctx.fillStyle = "rgba(255, 200, 0, 0.8)";
      ctx.beginPath();
      ctx.arc(bullet.x + offset, bullet.y, bulletWidth * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Add pulsating energy core
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.fillStyle =
        "rgba(255, 255, 255, " +
        (0.5 + Math.sin(Date.now() * 0.01) * 0.3) +
        ")";
      ctx.beginPath();
      ctx.arc(bullet.x + offset, bullet.y, bulletWidth / 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw bullet tail
      ctx.shadowBlur = 0; // No shadow for the tail
      ctx.strokeStyle = "rgba(255, 200, 0, 0.5)"; // Tail color
      ctx.lineWidth = bulletWidth; // Tail width
      ctx.beginPath();
      ctx.moveTo(bullet.x + offset, bullet.y);
      ctx.lineTo(bullet.x + offset - bullet.vx * 5, bullet.y - bullet.vy * 5); // Tail length
      ctx.stroke();
    }

    // Reset shadow effects
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  }
}

const fireballs = [];
const fireballSpeed = 6; // Speed of fireballs
const fireballWidth = 25;
const fireballHeight = 25;

// Listen for 'z' key to fire fireballs
document.addEventListener("keydown", function (e) {
  if (e.key === "z") {
    fireballs.push({
      x: player.x + player.width / 2 - fireballWidth / 2,
      y: player.y,
      width: fireballWidth,
      height: fireballHeight,
    });
  }
});
function moveFireballs() {
  fireballs.forEach((fireball) => {
    fireball.y -= fireballSpeed;
  });

  // Remove fireballs that go off-screen
  for (let i = fireballs.length - 1; i >= 0; i--) {
    if (fireballs[i].y + fireballHeight < 0) {
      fireballs.splice(i, 1);
    }
  }
}

function drawFireballs() {
  fireballs.forEach((fireball) => {
    // Draw the fireball
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(
      fireball.x + fireball.width / 2,
      fireball.y + fireball.height / 2,
      fireballWidth / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Add a glowing effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255, 69, 0, 0.8)";
    ctx.fillStyle = "rgba(255, 140, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(
      fireball.x + fireball.width / 2,
      fireball.y + fireball.height / 2,
      fireballWidth * 0.8,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow effects
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  });
}

function checkCollisions() {
  moveBullets();
  moveEnemies();
  moveDamageIndicators();
}

function update(timestamp) {
  if (!lastSpawnTime) lastSpawnTime = timestamp;
  const deltaTime = timestamp - lastSpawnTime;
  if (deltaTime > spawnInterval) {
    createEnemy();
    lastSpawnTime = timestamp;
  }

  // Reset player hit effect after 200ms
  if (player.isHit && Date.now() - player.hitTime > 200) {
    player.isHit = false;
  }

  movePlayer(); // Moving player (keyboard)
  checkCollisions();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawTimer(); // Draw the timer
  spawnEnemies(); // Call to spawn enemies
  moveFireballs(); // Add this line
  drawFireballs(); // Add this line
  drawDamageIndicators();
  drawPlayerDamageIndicators();
  drawScoreAndCoins();
  drawPlayerHealth();
  requestAnimationFrame(update);
}

update();
