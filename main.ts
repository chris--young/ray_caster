const LEVEL_GRID_SIZE: number = 32;
const LEVEL_WIDTH: number = 640;
const LEVEL_HEIGHT: number = 480;
const LEVEL: number[][] = [
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

type Vec2D = [number, number];

interface Player {
  pos: Vec2D,
  r: number
}

const player: Player = {
  pos: [LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2],
  r: Math.PI / 4
};

const canvas: HTMLCanvasElement = document.querySelector('canvas');
const context: CanvasRenderingContext2D = canvas.getContext('2d');

(function loop(): void {
  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_level();
  draw_grid();

  const d: number = cast_ray(player.pos, player.r);
  draw_ray(player.pos, player.r, d);

  draw_player();

  requestAnimationFrame(loop);
})();

function draw_ray(pos: Vec2D, r: number, d: number): void {
  context.save();
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.moveTo(pos[0], pos[1]);
  context.lineTo(Math.cos(r) * d + pos[0], Math.sin(-r) * d + pos[1]);
  context.stroke();
  context.restore();
}

function dist(a: Vec2D, b: Vec2D): number {
  const x: number = b[0] - a[0];
  const y: number = b[1] - a[1];
  const d: number = Math.sqrt(x * x + y * y)

  return d;
}

function cast_ray(pos: Vec2D, r: number): number {
  const x: Vec2D = cast_ray_x(pos, r);
  const y: Vec2D = cast_ray_y(pos, r);
  const dx: number = dist(player.pos, x);
  const dy: number = dist(player.pos, y);

  return Math.min(dx, dy);
}

function collision(pos: Vec2D): boolean {
  const x: number = Math.floor(pos[0] / LEVEL_GRID_SIZE);
  const y: number = Math.floor(pos[1] / LEVEL_GRID_SIZE);

  if (!LEVEL[y])
    return true;

  return LEVEL[y][x] !== 0;
}

function cast_ray_y(pos: Vec2D, r: number): Vec2D {
  const ydirection: number = r > Math.PI ? LEVEL_GRID_SIZE : -1;

  const sy: number = ydirection === -1 ? -LEVEL_GRID_SIZE : LEVEL_GRID_SIZE
  const sx: number = LEVEL_GRID_SIZE / Math.tan(r);

  let y: number = Math.floor(pos[1] / LEVEL_GRID_SIZE) * LEVEL_GRID_SIZE + ydirection;
  let x: number = pos[0] + (pos[1] - y) / Math.tan(r);

  context.save();
  context.fillStyle = 'rgb(0, 0, 0)';
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.fillRect(x - 3, y - 3, 6, 6);

  while (!collision([x, y])) {
    y += sy;

    if (ydirection === -1)
      x += sx;
    else
      x -= sx;

    context.fillRect(x - 3, y - 3, 6, 6);
  }

  context.restore();

  return [x, y];
}

function cast_ray_x(pos: Vec2D, r: number): Vec2D {
  const xdirection: number = r > Math.PI * 0.5 && r < Math.PI * 1.5 ? -1 : LEVEL_GRID_SIZE;

  const sy: number = LEVEL_GRID_SIZE * Math.tan(r);
  const sx: number = xdirection === -1 ? -LEVEL_GRID_SIZE : LEVEL_GRID_SIZE

  let x: number = Math.floor(pos[0] / LEVEL_GRID_SIZE) * LEVEL_GRID_SIZE + xdirection;
  let y: number = pos[1] + (pos[0] - x) * Math.tan(r);

  context.save();
  context.fillStyle = 'rgb(0, 0, 0)';
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.fillRect(x - 3, y - 3, 6, 6);

  while (!collision([x, y])) {
    if (xdirection === -1)
      y += sy;
    else
      y -= sy;

    x += sx;

    context.fillRect(x - 3, y - 3, 6, 6);
  }

  context.restore();

  return [x, y];
}

document.addEventListener('keydown', (event: KeyboardEvent): void => {
  switch (event.which) {
    case 37: // left 
      if (player.r < Math.PI * 2)
        player.r += Math.PI * 2 / 360;
      else
        player.r = 0;
      break;
    case 38: // up
      player.pos[0] += Math.cos(player.r);
      player.pos[1] -= Math.sin(player.r);
      break;
    case 39: // right
      if (player.r > 0)
        player.r -= Math.PI * 2 / 360;
      else
        player.r = Math.PI * 2;
      break;
    case 40: // down
      player.pos[0] -= Math.cos(player.r);
      player.pos[1] += Math.sin(player.r);
      break;
  }
});

function draw_player(): void {
  context.save();
  context.fillStyle = 'rgb(127, 127, 127)';
  context.strokeStyle = 'rgb(0, 0, 0)';
  context.translate(player.pos[0], player.pos[1]);
  context.rotate(-player.r);
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

  for (let y: number = 0; y < LEVEL.length; ++y)
    for (let x: number = 0; x < LEVEL[0].length; ++x)
      if (LEVEL[y][x])
        context.fillRect(x * LEVEL_GRID_SIZE, y * LEVEL_GRID_SIZE, LEVEL_GRID_SIZE, LEVEL_GRID_SIZE);

  context.restore();
}
