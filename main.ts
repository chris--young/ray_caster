const LEVEL_GRID_SIZE = 32;
const LEVEL_WIDTH = 640;
const LEVEL_HEIGHT = 480;
const LEVEL = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const player = {
  position: [LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2],
  rotation: Math.PI / 4
};

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

(function loop(): void {
  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_level();
  cast_ray(player.position[0], player.position[1], player.rotation);
  draw_grid();
  draw_ray(player.position[0], player.position[1], player.rotation);
  draw_player();

  requestAnimationFrame(loop);
})();

function draw_ray(x: number, y: number, t: number): void {
  context.save();
  context.strokeStyle = 'rgb(255, 255, 0)';
  context.translate(x, y);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(Math.cos(t) * canvas.width, Math.sin(t) * -canvas.height);
  context.stroke();
  context.restore();
}

function cast_ray(x: number, y: number, t: number): number {
  const direction = t < Math.PI ? -1 : 1;
  const ay = (Math.floor(y / LEVEL_GRID_SIZE) + direction) * LEVEL_GRID_SIZE;
  const ax = Math.floor(((y - ay) / Math.tan(t) + x) / LEVEL_GRID_SIZE) * LEVEL_GRID_SIZE;

  console.log({ x, y, t, ax, ay, direction });

  context.save();
  context.fillStyle = 'rgb(255, 255, 0)';
  context.fillRect(ax, ay, LEVEL_GRID_SIZE, LEVEL_GRID_SIZE);
  context.restore();

  return 0;
}

document.addEventListener('keydown', (event: KeyboardEvent): void => {
  switch (event.which) {
    case 37: // left 
      if (player.rotation < Math.PI * 2)
        player.rotation += Math.PI * 2 / 360;
      else
        player.rotation = 0;
      break;
    case 38: // up
      player.position[0] += Math.cos(player.rotation);
      player.position[1] -= Math.sin(player.rotation);
      break;
    case 39: // right
      if (player.rotation > 0)
        player.rotation -= Math.PI * 2 / 360;
      else
        player.rotation = Math.PI * 2;
      break;
    case 40: // down
      player.position[0] -= Math.cos(player.rotation);
      player.position[1] += Math.sin(player.rotation);
      break;
  }
});

function draw_player(): void {
  context.save();
  context.fillStyle = 'rgb(255, 0, 0)';
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.translate(player.position[0], player.position[1]);
  context.rotate(-player.rotation);
  context.beginPath();
  context.moveTo(10, 0);
  context.lineTo(-10, -10);
  context.lineTo(-10, 10);
  context.lineTo(10, 0);
  context.fill();
  context.stroke();
  context.restore();
}

function draw_grid(): void {
  context.save();
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.lineWidth = 1;

  for (let x = 0; x <= LEVEL_WIDTH; x += LEVEL_GRID_SIZE) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, LEVEL_HEIGHT);
    context.closePath();
    context.stroke();
  }

  for (let y = 0; y <= LEVEL_HEIGHT; y += LEVEL_GRID_SIZE) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(LEVEL_WIDTH, y);
    context.closePath();
    context.stroke();
  }

  context.restore();
}

function draw_level(): void {
  context.save();
  context.fillStyle = 'rgb(127, 127, 127)';

  for (let y = 0; y < LEVEL.length; ++y)
    for (let x = 0; x < LEVEL[0].length; ++x)
      if (LEVEL[y][x])
        context.fillRect(x * LEVEL_GRID_SIZE, y * LEVEL_GRID_SIZE, LEVEL_GRID_SIZE, LEVEL_GRID_SIZE);

  context.restore();
}
