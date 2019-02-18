
type Vec2D = [number, number];

interface Level {
  grid: number,
  size: Vec2D,
  pallet: string[],
  map: number[][]
}

interface Player {
  pos: Vec2D,
  r: number
}

const level: Level = {
  grid: 32,
  size: [640, 480],
  pallet: [
    'rgb(127, 127, 127)',
    'rgb(255, 0, 0)',
    'rgb(0, 0, 255)'
  ],
  map: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 1],
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
  ]
};

const player: Player = {
  pos: [level.size[0] / 2, level.size[1] / 4],
  r: Math.PI / 2
};

const map_canvas: HTMLCanvasElement = document.querySelector('#map');
const map_context: CanvasRenderingContext2D = map_canvas.getContext('2d');

const fpv_canvas: HTMLCanvasElement = document.querySelector('#fpv');
const fpv_context: CanvasRenderingContext2D = fpv_canvas.getContext('2d');

(function loop(): void {
  map_context.clearRect(0, 0, map_canvas.width, map_canvas.height);
  fpv_context.clearRect(0, 0, fpv_canvas.width, fpv_canvas.height);

  
  draw_level();
  draw_grid();
  draw_player();
  
  draw_fpv();

  requestAnimationFrame(loop);
})();

function draw_fpv(): void {
  const X_RESOLUTION: number = fpv_canvas.width;
  const Y_RESOLUTION: number = fpv_canvas.height;

  // const FOV: number = (Math.PI * 2 / 360) * 60;
  const D2P: number = 120;

  // const low: number = player.r - FOV / 2;
  // const high: number = player.r + FOV / 2;
  // const num_steps: number = 320;
  // const step_size: number = (high - low) / num_steps;

  let rs: number[] = [player.r];

  /* for (let i: number = num_steps / -2; i < 0; ++i)
    rs.unshift(step_size * i)

  for (let i: number = 0; i < num_steps / 2; ++i)
    rs.unshift(step_size * i); */

  fpv_context.save();

  for (let i: number = 0; i < rs.length; ++i) {
    const r: number = rs[i];
    const d: number = cast_ray(player.pos, r);
    const h: number = level.grid / d * D2P;
    
    console.log({
      r, d,
      px: (Math.cos(r) * d + player.pos[0]) / level.grid,
      py: (Math.sin(-r) * d + player.pos[1]) / level.grid
    })
    
    const x: number = Math.floor((Math.cos(r) * d + player.pos[0]) / level.grid);
    const y: number = Math.floor((Math.sin(-r) * d + player.pos[1]) / level.grid);

    const c: string = level.pallet[level.map[y][x] - 1];

    console.log({ x, y, c })

    fpv_context.fillStyle = c;
    fpv_context.fillRect(i * X_RESOLUTION / rs.length, Y_RESOLUTION / 2 - h / 2, X_RESOLUTION / rs.length, h);
  }

  fpv_context.restore();
}

function draw_ray(pos: Vec2D, r: number, d: number): void {
  map_context.save();
  map_context.strokeStyle = 'rgb(255, 255, 0)';
  map_context.moveTo(pos[0], pos[1]);
  map_context.lineTo(Math.cos(r) * d + pos[0], Math.sin(-r) * d + pos[1]);
  map_context.stroke();
  map_context.restore();
}

function dist(a: Vec2D, b: Vec2D): number {
  const x: number = b[0] - a[0];
  const y: number = b[1] - a[1];

  return Math.sqrt(x * x + y * y);
}

function cast_ray(pos: Vec2D, r: number): number {
  const x: Vec2D = cast_ray_x(pos, r);
  const y: Vec2D = cast_ray_y(pos, r);
  const dx: number = dist(player.pos, x);
  const dy: number = dist(player.pos, y);
  const d: number = Math.min(dx, dy);

  draw_ray(player.pos, r, d);

  return d;
}

function collision(pos: Vec2D): boolean {
  const x: number = Math.floor(pos[0] / level.grid);
  const y: number = Math.floor(pos[1] / level.grid);

  if (!level.map[y])
    return true;

  return level.map[y][x] !== 0;
}

function cast_ray_y(pos: Vec2D, r: number): Vec2D {
  const d: number = r > Math.PI ? level.grid : -1;
  const sy: number = d === -1 ? -level.grid : level.grid
  const sx: number = level.grid / Math.tan(r);

  let y: number = Math.floor(pos[1] / level.grid) * level.grid + d;
  let x: number = pos[0] + (pos[1] - y) / Math.tan(r);

  map_context.save();
  map_context.fillStyle = 'rgb(0, 0, 0)';
  map_context.strokeStyle = 'rgb(0, 0, 0)';
  map_context.fillRect(x - 3, y - 3, 6, 6);

  while (!collision([x, y])) {
    y += sy;

    if (d === -1)
      x += sx;
    else
      x -= sx;

    map_context.fillRect(x - 3, y - 3, 6, 6);
  }

  map_context.restore();

  return [x, y];
}

function cast_ray_x(pos: Vec2D, r: number): Vec2D {
  const d: number = r > Math.PI * 0.5 && r < Math.PI * 1.5 ? -1 : level.grid;
  const sy: number = level.grid * Math.tan(r);
  const sx: number = d === -1 ? -level.grid : level.grid

  let x: number = Math.floor(pos[0] / level.grid) * level.grid + d;
  let y: number = pos[1] + (pos[0] - x) * Math.tan(r);

  map_context.save();
  map_context.fillStyle = 'rgb(0, 0, 0)';
  map_context.strokeStyle = 'rgb(0, 0, 0)';
  map_context.fillRect(x - 3, y - 3, 6, 6);

  while (!collision([x, y])) {
    if (d === -1)
      y += sy;
    else
      y -= sy;

    x += sx;

    map_context.fillRect(x - 3, y - 3, 6, 6);
  }

  map_context.restore();

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
  map_context.save();
  map_context.fillStyle = 'rgb(127, 127, 127)';
  map_context.strokeStyle = 'rgb(0, 0, 0)';
  map_context.translate(player.pos[0], player.pos[1]);
  map_context.rotate(-player.r);
  map_context.beginPath();
  map_context.moveTo(10, 0);
  map_context.lineTo(-10, -10);
  map_context.lineTo(-10, 10);
  map_context.lineTo(10, 0);
  map_context.fill();
  map_context.stroke();
  map_context.restore();
}

function draw_grid(): void {
  map_context.save();
  map_context.strokeStyle = 'rgb(0, 0, 0)';
  map_context.lineWidth = 1;

  for (let x = 0; x <= level.size[0]; x += level.grid) {
    map_context.beginPath();
    map_context.moveTo(x, 0);
    map_context.lineTo(x, level.size[1]);
    map_context.closePath();
    map_context.stroke();
  }

  for (let y = 0; y <= level.size[1]; y += level.grid) {
    map_context.beginPath();
    map_context.moveTo(0, y);
    map_context.lineTo(level.size[0], y);
    map_context.closePath();
    map_context.stroke();
  }

  map_context.restore();
}

function draw_level(): void {
  map_context.save();

  for (let y: number = 0; y < level.map.length; ++y) {
    for (let x: number = 0; x < level.map[0].length; ++x) {
      if (level.map[y][x]) {
        map_context.fillStyle = level.pallet[level.map[y][x] - 1];
        map_context.fillRect(x * level.grid, y * level.grid, level.grid, level.grid);
      }
    }
  }

  map_context.restore();
}
