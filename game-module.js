// Flappy Bird Module for Momentos
export const metadata = {
  id: "flappy",
  name: "Flappy Bird",
  description: "Tap to keep the bird flying and score points",
  size: "2x2",
  intendedSize: { width: 240, height: 240 },
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  // --- Load Jersey 10 font once ---
  if (!document.getElementById("jersey-10-font")) {
    const link = document.createElement("link");
    link.id = "jersey-10-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Jersey+10&display=swap";
    document.head.appendChild(link);
  }

  const FONT_FAMILY = "'Jersey 10', monospace";

  // Calculate zoom scale
  const intendedWidth = metadata.intendedSize?.width || 240;
  const intendedHeight = metadata.intendedSize?.height || 240;
  const scaleX = container.clientWidth / intendedWidth;
  const scaleY = container.clientHeight / intendedHeight;
  const scale = Math.min(scaleX, scaleY);

  container.innerHTML = `
    <div id="flappy-overlay" style="
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:2;
      font-family:${FONT_FAMILY};
    "></div>
    <div style="width:100%; height:100%; position:relative; border-radius:6px; overflow:hidden;">
      <canvas style="
        width:100%;
        height:100%;
        display:block;
        background:${isDark ? "#111" : "#87CEEB"};
        position:relative;
        z-index:1;
        border-radius:6px;
      "></canvas>
    </div>
  `;

  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const overlay = container.querySelector("#flappy-overlay");

  // Resize canvas
  function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Assets
  const birdImg = new Image();
  birdImg.src =
    "https://www.clipartmax.com/png/full/64-645329_flappy-bird-clipart-flappy-bird-transparent-background.png";

  const pipeImg = new Image();
  pipeImg.src =
    "https://upload.wikimedia.org/wikipedia/commons/9/93/Mario_pipe.png";

  const bgImg = new Image();
  bgImg.src = isDark
    ? "https://cdn6.f-cdn.com/contestentries/137315/8319146/54a81de882e75_thumb900.jpg"
    : "https://e0.pxfuel.com/wallpapers/488/135/desktop-wallpaper-flappy-bird-background.jpg";

  // Game state
  let bird = { x: 50, y: canvas.height / 2, width: 24, height: 24, dy: 0 };
  let gravity = 0.35;
  let lift = -6;
  let pipes = [];
  let pipeWidth = 40;
  let pipeGap = 120;
  let frame = 0;
  let score = 0;
  let gameOver = false;
  let started = false;

  function showOverlay(html) {
    overlay.innerHTML = html;
    overlay.style.display = "flex";
  }

  function hideOverlay() {
    overlay.innerHTML = "";
    overlay.style.display = "none";
  }

  function reset() {
    bird.y = canvas.height / 2;
    bird.dy = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    started = false;
    hideOverlay();
    setTimeout(showPlayButton, 0);
  }

  function showPlayButton() {
    showOverlay(`
      <button id="flappy-play-btn" style="
        font-size:${Math.max(24, 36 * scale)}px;
        padding:4px 8px;
        border:none;
        border-radius:0;
        background:#ffeb3b;
        color:#222;
        font-family:${FONT_FAMILY};
        font-weight:400;
        cursor:pointer;
      ">PLAY</button>
    `);
    overlay.querySelector("#flappy-play-btn").onclick = () => {
      started = true;
      hideOverlay();
    };
  }
  showPlayButton();

  // Input
  container.addEventListener("click", (e) => {
    if (!started || gameOver) return;
    if (e.target === canvas) bird.dy = lift;
  });

  function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  function drawPipes() {
    pipes.forEach((pipe) => {
      // Draw top pipe (rotated 180 degrees), repeat image if needed
      let topPipeY = 0;
      let topPipeHeight = pipe.top;
      for (let y = topPipeY; y < topPipeHeight; y += pipeImg.height) {
        ctx.save();
        ctx.translate(pipe.x + pipeWidth / 2, y + pipeImg.height / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(
          pipeImg,
          -pipeWidth / 2,
          -pipeImg.height / 2,
          pipeWidth,
          pipeImg.height,
        );
        ctx.restore();
      }

      // Draw bottom pipe (normal), repeat image if needed
      let bottomPipeY = canvas.height - pipe.bottom;
      for (let y = bottomPipeY; y < canvas.height; y += pipeImg.height) {
        ctx.drawImage(
          pipeImg,
          pipe.x,
          y,
          pipeWidth,
          Math.min(pipeImg.height, canvas.height - y),
        );
      }
    });
  }

  function drawScore() {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.max(20, 22 * scale)}px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(`SCORE ${score}`, canvas.width / 2, 8 * scale);
    ctx.restore();
  }

  function drawGameOver() {
    showOverlay(`
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        width:100%;
        height:100%;
        font-family:${FONT_FAMILY};
      ">
        <div style="
          font-size:${Math.max(36, 48 * scale)}px;
          color:#fff;
          margin-bottom:24px;
          text-align:center;
        ">GAME OVER</div>
        <button id="flappy-replay-btn" style="
          font-size:${Math.max(24, 36 * scale)}px;
          padding:4px 8px;
          border:none;
          border-radius:0;
          background:#ffeb3b;
          color:#222;
          font-family:${FONT_FAMILY};
          font-weight:400;
          cursor:pointer;
        ">REPLAY</button>
      </div>
    `);

    overlay.querySelector("#flappy-replay-btn").onclick = reset;
  }

  function update() {
    if (!started || gameOver) return;

    bird.dy += gravity;
    bird.y += bird.dy;

    if (frame % 100 === 0) {
      const top = Math.random() * (canvas.height - pipeGap - 40) + 20;
      pipes.push({
        x: canvas.width,
        top,
        bottom: canvas.height - top - pipeGap,
      });
    }

    pipes.forEach((p) => (p.x -= 2));

    if (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
      score++;
    }

    for (let p of pipes) {
      if (
        bird.x + bird.width > p.x &&
        bird.x < p.x + pipeWidth &&
        (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
      ) {
        gameOver = true;
      }
    }

    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
      gameOver = true;
    }

    frame++;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Center the background image
    const imgAspect = bgImg.width / bgImg.height;
    const canvasAspect = canvas.width / canvas.height;
    let drawWidth, drawHeight;
    if (imgAspect > canvasAspect) {
      // Image is wider than canvas
      drawHeight = canvas.height;
      drawWidth = bgImg.width * (canvas.height / bgImg.height) + 10; // add extra to prevent gaps
    } else {
      // Image is taller than canvas
      drawWidth = canvas.width;
      drawHeight = bgImg.height * (canvas.width / bgImg.width);
    }
    const dx = (canvas.width - drawWidth) / 2;
    const dy = (canvas.height - drawHeight) / 2;
    ctx.drawImage(bgImg, dx, dy, drawWidth, drawHeight);

    if (started) {
      drawPipes();
      drawBird();
      drawScore();
      if (gameOver) drawGameOver();
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // --- Wait for font before starting ---
  document.fonts.load(`20px ${FONT_FAMILY}`).then(loop);

  // Cleanup
  return () => {
    window.removeEventListener("resize", resize);
    container.innerHTML = "";
  };
}

export default render;
