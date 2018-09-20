const LEVEL_GRID_SIZE = 32;
const LEVEL_WIDTH = 640;
const LEVEL_HEIGHT = 480;
const LEVEL = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
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
  draw_grid();
  cast_ray_x(player.position[0], player.position[1], player.rotation);
  cast_ray_y(player.position[0], player.position[1], player.rotation);
  draw_player();

  requestAnimationFrame(loop);
})();

function collision(x: number, y: number): boolean {
  const xi = Math.floor(x / LEVEL_GRID_SIZE);
  const yi = Math.floor(y / LEVEL_GRID_SIZE);

  if (!LEVEL[yi]) {
    console.log({ xi, yi });
    return true;
  }

  return LEVEL[yi][xi] === 1;
}

function cast_ray_y(x: number, y: number, t: number): number {
  const ydirection = t > Math.PI ? LEVEL_GRID_SIZE : -1;

  const ya = ydirection === -1 ? -LEVEL_GRID_SIZE : LEVEL_GRID_SIZE
  const xa = LEVEL_GRID_SIZE / Math.tan(t);

  let ay = Math.floor(y / LEVEL_GRID_SIZE) * LEVEL_GRID_SIZE + ydirection;
  let ax = x + (y - ay) / Math.tan(t);

  context.save();
  context.fillStyle = 'rgb(0, 0, 0)';
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.fillRect(ax - 3, ay - 3, 6, 6);

  while (!collision(ax, ay)) {
    ay += ya;

    if (ydirection === -1)
      ax += xa;
    else
      ax -= xa;

    context.fillRect(ax - 3, ay - 3, 6, 6);
  }

  context.restore();

  return 0;
}

function cast_ray_x(x: number, y: number, t: number): number {
  const xdirection = t > Math.PI * 0.5 && t < Math.PI * 1.5 ? -1 : LEVEL_GRID_SIZE;

  const ya = LEVEL_GRID_SIZE * Math.tan(t);
  const xa = xdirection === -1 ? -LEVEL_GRID_SIZE : LEVEL_GRID_SIZE

  let bx = Math.floor(x / LEVEL_GRID_SIZE) * LEVEL_GRID_SIZE + xdirection;
  let by = y + (x - bx) * Math.tan(t);

  context.save();
  context.fillStyle = 'rgb(0, 0, 0)';
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.fillRect(bx - 3, by - 3, 6, 6);

  while (!collision(bx, by)) {
    if (xdirection === -1)
      by += ya;
    else
      by -= ya;

    bx += xa;

    context.fillRect(bx - 3, by - 3, 6, 6);
  }

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
  context.fillStyle = 'rgb(127, 127, 127)';
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
