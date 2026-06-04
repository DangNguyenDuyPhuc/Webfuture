// ═══════════════════════════════════════════════════════════════
//  MULTI-LAYER GRAVITATIONAL STARFIELD — COSMOS THEME
// ═══════════════════════════════════════════════════════════════
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let W, H;
let mouse = { x: null, y: null, radius: 180 };
let stars = [];
let shootingStars = [];
let burstParticles = [];

// ─── RESIZE ───────────────────────────────────────────────────
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initStars();
}

// ─── STAR LAYERS ──────────────────────────────────────────────
const LAYERS = [
  { count: 300, minSize: 0.2, maxSize: 0.8, speed: 0.04, color: 'rgba(200,220,255,' },
  { count: 200, minSize: 0.8, maxSize: 1.5, speed: 0.10, color: 'rgba(180,200,255,' },
  { count: 100, minSize: 1.5, maxSize: 2.5, speed: 0.20, color: 'rgba(255,255,255,' },
  { count: 30,  minSize: 2.0, maxSize: 3.5, speed: 0.35, color: 'rgba(255,215,0,' },
];

function initStars() {
  stars = [];
  LAYERS.forEach((l, li) => {
    for (let i = 0; i < l.count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        ox: 0, oy: 0,          // offset from gravity
        size: l.minSize + Math.random() * (l.maxSize - l.minSize),
        layer: li,
        speed: l.speed * (0.7 + Math.random() * 0.6),
        dirX: (Math.random() - 0.5),
        dirY: (Math.random() - 0.5),
        twinkle: Math.random() < 0.3,
        twinklePhase: Math.random() * Math.PI * 2,
        color: l.color,
        density: 5 + Math.random() * 20,
      });
    }
  });
}

// ─── DRAW STAR ─────────────────────────────────────────────────
function drawStar(s, t) {
  let alpha = 0.7 + 0.3 * LAYERS[s.layer].speed / 0.3;
  if (s.twinkle) {
    alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.002 + s.twinklePhase));
  }
  ctx.beginPath();
  ctx.arc(s.x + s.ox, s.y + s.oy, s.size, 0, Math.PI * 2);
  ctx.fillStyle = s.color + alpha + ')';
  ctx.fill();
  // Glow for bigger stars
  if (s.size > 1.5) {
    ctx.beginPath();
    ctx.arc(s.x + s.ox, s.y + s.oy, s.size * 3, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(s.x + s.ox, s.y + s.oy, 0, s.x + s.ox, s.y + s.oy, s.size * 3);
    grad.addColorStop(0, `rgba(160,200,255,${alpha * 0.3})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// ─── UPDATE STAR ───────────────────────────────────────────────
function updateStar(s) {
  // Normal drift
  if (mouse.x === null) {
    s.x += s.dirX * s.speed;
    s.y += s.dirY * s.speed;
  } else {
    const dx = mouse.x - s.x;
    const dy = mouse.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouse.radius) {
      // Gravity: pull TOWARD cursor
      const force = (mouse.radius - dist) / mouse.radius;
      s.ox += (dx / dist) * force * 0.8;
      s.oy += (dy / dist) * force * 0.8;
    } else {
      // Drift back
      s.ox *= 0.96;
      s.oy *= 0.96;
      s.x += s.dirX * s.speed;
      s.y += s.dirY * s.speed;
    }
  }
  // Wrap around edges
  if (s.x < -5) s.x = W + 5;
  if (s.x > W + 5) s.x = -5;
  if (s.y < -5) s.y = H + 5;
  if (s.y > H + 5) s.y = -5;
}

// ─── CONNECT NEARBY STARS ─────────────────────────────────────
function connectStars() {
  const nearby = stars.filter(s => s.layer === 2);
  for (let a = 0; a < nearby.length; a++) {
    for (let b = a + 1; b < nearby.length; b++) {
      const dx = nearby[a].x - nearby[b].x;
      const dy = nearby[a].y - nearby[b].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 20000) {
        const alpha = (1 - d2 / 20000) * 0.25;
        ctx.strokeStyle = `rgba(123,47,247,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(nearby[a].x + nearby[a].ox, nearby[a].y + nearby[a].oy);
        ctx.lineTo(nearby[b].x + nearby[b].ox, nearby[b].y + nearby[b].oy);
        ctx.stroke();
      }
    }
  }
}

// ─── SHOOTING STARS ────────────────────────────────────────────
function spawnShootingStar() {
  const angle = (Math.random() * 40 + 20) * Math.PI / 180;
  shootingStars.push({
    x: Math.random() * W * 0.7,
    y: Math.random() * H * 0.3,
    vx: Math.cos(angle) * (8 + Math.random() * 6),
    vy: Math.sin(angle) * (8 + Math.random() * 6),
    len: 80 + Math.random() * 120,
    life: 1,
    color: Math.random() < 0.5 ? '0,212,255' : '123,47,247',
  });
}

function updateShootingStars() {
  shootingStars.forEach((s, i) => {
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.025;
    const tail = { x: s.x - s.vx * (s.len / 12), y: s.y - s.vy * (s.len / 12) };
    const grad = ctx.createLinearGradient(tail.x, tail.y, s.x, s.y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, `rgba(${s.color},${s.life})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tail.x, tail.y);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();
    if (s.life <= 0 || s.x > W || s.y > H) shootingStars.splice(i, 1);
  });
}

// ─── BURST PARTICLES ON CLICK ──────────────────────────────────
window.addEventListener('click', function(e) {
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    burstParticles.push({
      x: e.clientX, y: e.clientY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: 1 + Math.random() * 3,
      color: Math.random() < 0.5 ? '0,212,255' : '255,215,0',
    });
  }
});

function updateBurst() {
  burstParticles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    p.vx *= 0.96; p.vy *= 0.96;
    p.life -= 0.03;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.life})`;
    ctx.fill();
    if (p.life <= 0) burstParticles.splice(i, 1);
  });
}

// ─── MAIN LOOP ─────────────────────────────────────────────────
let lastShoot = 0;
function animate(t) {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, W, H);

  // Periodic shooting stars (~every 8s)
  if (t - lastShoot > 8000 + Math.random() * 4000) {
    spawnShootingStar();
    lastShoot = t;
  }

  stars.forEach(s => { updateStar(s); drawStar(s, t); });
  connectStars();
  updateShootingStars();
  updateBurst();
}

// ─── EVENTS ────────────────────────────────────────────────────
window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

resize();
animate(0);
