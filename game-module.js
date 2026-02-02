// Flappy Bird Module for Momentos
export const metadata = {
  id: "flappy",
  name: "Flappy Bird",
  description: "Tap to keep the bird flying and score points",
  size: "2x2",
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <canvas style="width:100%; height:100%; display:block; background: ${isDark ? "#111" : "#87CEEB"};"></canvas>
  `;
  const canvas = container.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  // Resize canvas to container
  function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Game variables
  let bird = { x: 50, y: canvas.height / 2, width: 20, height: 20, dy: 0 };
  let gravity = 0.6;
  let lift = -10;
  let pipes = [];
  let pipeWidth = 40;
  let pipeGap = 120;
  let frame = 0;
  let score = 0;
  let gameOver = false;

  function reset() {
    bird.y = canvas.height / 2;
    bird.dy = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
  }

  // Handle input (click/tap)
  container.addEventListener("click", () => {
    if (gameOver) reset();
    bird.dy = lift;
  });

  function drawBird() {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }

  function drawPipes() {
    ctx.fillStyle = "#228B22";
    pipes.forEach((pipe) => {
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
      ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
  }

  function drawScore() {
    ctx.fillStyle = isDark ? "#fff" : "#000";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Score: ${score}`, 10, 30);
  }

  function update() {
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
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawBird();
    drawPipes();
    drawScore();

    if (gameOver) {
      ctx.fillStyle = "#FF0000";
      ctx.font = "30px sans-serif";
      ctx.fillText("Game Over! Click to restart", 20, canvas.height / 2);
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
