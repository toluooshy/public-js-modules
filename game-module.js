// Flappy Bird Module for Momentos
export const metadata = {
  id: "flappy",
  name: "Flappy Bird",
  description: "Tap to keep the bird flying and score points",
  size: "2x2",
  intendedSize: { width: 240, height: 240 }, // Dev-intended size for 2x2
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // Calculate zoom scale based on container vs intended size
  const intendedWidth = metadata.intendedSize?.width || 240;
  const intendedHeight = metadata.intendedSize?.height || 240;
  const scaleX = container.clientWidth / intendedWidth;
  const scaleY = container.clientHeight / intendedHeight;
  const scale = Math.min(scaleX, scaleY);

  container.innerHTML = `
    <div id="flappy-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; z-index:2;"></div>
    <div style="width:100%; height:100%; position:relative; border-radius:6px; overflow:hidden;">
      <canvas style="width:100%; height:100%; display:block; background: ${isDark ? "#111" : "#87CEEB"}; position:relative; z-index:1; border-radius:6px;"></canvas>
    </div>
  `;
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const overlay = container.querySelector("#flappy-overlay");

  // Set background image to cover
  canvas.style.backgroundSize = "cover";
  canvas.style.backgroundRepeat = "no-repeat";

  // Resize canvas to container
  function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Image assets
  const birdImg = new window.Image();
  birdImg.src =
    "https://www.nicepng.com/png/detail/151-1515288_flappy-bird-png-jpg-download-flappy-bird-bird.png";
  const pipeImg = new window.Image();
  pipeImg.src =
    "https://www.pikpng.com/pngl/b/33-332693_flappy-bird-pipe-png-clipart.png";
  const bgImg = new window.Image();
  bgImg.src = isDark
    ? "https://cdn6.f-cdn.com/contestentries/137315/8319146/54a81de882e75_thumb900.jpg"
    : "https://e0.pxfuel.com/wallpapers/488/135/desktop-wallpaper-flappy-bird-background.jpg";

  // Game variables
  let bird = { x: 50, y: canvas.height / 2, width: 24, height: 24, dy: 0 };
  let gravity = 0.35; // slower gravity
  let lift = -6; // less aggressive up
  let pipes = [];
  let pipeWidth = 40;
  let pipeGap = 120;
  let frame = 0;
  let score = 0;
  let gameOver = false;
  let started = false;

  function reset() {
    bird.y = canvas.height / 2;
    bird.dy = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    started = true;
    hideOverlay();
  }

  function showOverlay(html) {
    overlay.innerHTML = html;
    overlay.style.display = "flex";
  }
  function hideOverlay() {
    overlay.innerHTML = "";
    overlay.style.display = "none";
  }

  // Initial Play button
  showOverlay(
    `<button id="flappy-play-btn" style="font-size:${Math.max(24, 36 * scale)}px; padding: 16px 32px; border-radius:0; border:none; background:#ffeb3b; color:#222; font-family:Consolas,monospace; font-weight:bold; cursor:pointer;">Play</button>`,
  );
  overlay.querySelector("#flappy-play-btn").onclick = () => {
    started = true;
    hideOverlay();
  };

  // Handle input (click/tap)
  container.addEventListener("click", (e) => {
    if (!started) return;
    if (gameOver) return;
    // Only jump if click is on canvas (not overlay)
    if (e.target === canvas) bird.dy = lift;
  });

  function drawBird() {
    ctx.save();
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    ctx.restore();
  }

  function drawPipes() {
    pipes.forEach((pipe) => {
      // Top pipe
      ctx.save();
      ctx.translate(pipe.x, pipe.top - pipeImg.height);
      ctx.drawImage(pipeImg, 0, 0, pipeWidth, pipeImg.height);
      ctx.restore();
      // Bottom pipe
      ctx.save();
      ctx.translate(pipe.x, canvas.height - pipe.bottom);
      ctx.drawImage(pipeImg, 0, 0, pipeWidth, pipeImg.height);
      ctx.restore();
    });
  }

  function drawScore() {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.max(19, 20 * scale)}px Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 8 * scale);
    ctx.restore();
  }

  function drawGameOver() {
    // Centered overlay for Game Over
    showOverlay(`
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%;">
        <div style="font-size:${Math.max(36, 48 * scale)}px; color:#fff; font-family:Consolas,monospace; font-weight:bold; margin-bottom:24px; text-align:center;">Game Over!</div>
        <button id="flappy-replay-btn" style="font-size:${Math.max(18, 24 * scale)}px; padding: 12px 28px; border-radius:0; border:none; background:#ffeb3b; color:#222; font-family:Consolas,monospace; font-weight:bold; cursor:pointer;">Replay</button>
      </div>
    `);
    overlay.querySelector("#flappy-replay-btn").onclick = () => {
      reset();
    };
  }

  function update() {
    if (!started) return;
    if (gameOver) return;

    // Gravity
    bird.dy += gravity;
    bird.y += bird.dy;

    // Add pipes every 100 frames
    if (frame % 100 === 0) {
      const topHeight = Math.random() * (canvas.height - pipeGap - 40) + 20;
      const bottomHeight = canvas.height - topHeight - pipeGap;
      pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
    }

    // Move pipes
    pipes.forEach((pipe) => (pipe.x -= 2));

    // Remove offscreen pipes & update score
    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
      score++;
    }

    // Collision detection
    for (let pipe of pipes) {
      if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        (bird.y < pipe.top ||
          bird.y + bird.height > canvas.height - pipe.bottom)
      ) {
        gameOver = true;
      }
    }

    // Floor/Ceiling collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
      gameOver = true;
    }

    frame++;
  }

  function draw() {
    // Draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    // Draw game elements
    ctx.font = `${Math.max(19, 20 * scale)}px Consolas, monospace`;
    if (started) {
      drawPipes();
      drawBird();
      drawScore();
      if (gameOver) {
        drawGameOver();
      }
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();

  // Cleanup
  return () => {
    window.removeEventListener("resize", resize);
    container.innerHTML = "";
  };
}

export default render;
