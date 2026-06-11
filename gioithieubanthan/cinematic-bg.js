/**
 * cinematic-bg.js
 * Mỗi trang có một hiệu ứng cinematic riêng biệt, render trên canvas full-screen.
 * Thêm data-cinematic="<type>" vào <body> để chọn hiệu ứng.
 */
(function () {
  const type = document.body.dataset.cinematic;
  if (!type) return;

  // ─── SETUP CANVAS ───
  const canvas = document.createElement('canvas');
  canvas.id = 'cinematic-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // ─── EFFECTS ───

  // ▸ 1. NEBULA DRIFT — home.html
  function nebulaEffect() {
    const stars = [];
    const nebulae = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random(), speed: Math.random() * 0.3 + 0.05,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    for (let i = 0; i < 5; i++) {
      nebulae.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 150 + Math.random() * 200,
        hue: [220, 260, 300, 180, 340][i],
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }
    return function (t) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      // Nebulae
      nebulae.forEach(n => {
        n.x += n.dx; n.y += n.dy;
        if (n.x < -n.r) n.x = W + n.r;
        if (n.x > W + n.r) n.x = -n.r;
        if (n.y < -n.r) n.y = H + n.r;
        if (n.y > H + n.r) n.y = -n.r;
        const pulse = 0.08 + Math.sin(t * 0.0005 + n.phase) * 0.03;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `hsla(${n.hue}, 60%, 40%, ${pulse})`);
        g.addColorStop(0.5, `hsla(${n.hue}, 50%, 20%, ${pulse * 0.4})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
      // Stars
      stars.forEach(s => {
        s.twinkle += s.speed * 0.04;
        const alpha = 0.3 + Math.sin(s.twinkle) * 0.7;
        ctx.globalAlpha = Math.max(0, alpha) * s.a;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
  }

  // ▸ 2. AURORA WAVES — blog.html
  function auroraEffect() {
    const waves = [];
    for (let i = 0; i < 6; i++) {
      waves.push({
        y: H * 0.3 + i * 40,
        amp: 30 + Math.random() * 50,
        freq: 0.002 + Math.random() * 0.003,
        speed: 0.0003 + Math.random() * 0.0005,
        hue: [140, 170, 200, 120, 160, 190][i],
        alpha: 0.06 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2
      });
    }
    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H * 0.6 + H * 0.1,
        r: Math.random() * 1.5 + 0.3,
        vy: -(Math.random() * 0.3 + 0.1),
        alpha: Math.random() * 0.5
      });
    }
    return function (t) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 3) {
          const y = w.y + Math.sin(x * w.freq + t * w.speed + w.phase) * w.amp
                       + Math.sin(x * w.freq * 1.5 + t * w.speed * 0.7) * w.amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, w.y - w.amp, 0, w.y + 200);
        g.addColorStop(0, `hsla(${w.hue}, 80%, 55%, ${w.alpha})`);
        g.addColorStop(0.5, `hsla(${w.hue + 20}, 70%, 40%, ${w.alpha * 0.5})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fill();
      });
      particles.forEach(p => {
        p.y += p.vy;
        if (p.y < 0) { p.y = H * 0.6; p.x = Math.random() * W; }
        ctx.globalAlpha = p.alpha * (0.5 + Math.sin(t * 0.002 + p.x) * 0.5);
        ctx.fillStyle = `hsl(${150 + Math.sin(t * 0.001) * 30}, 70%, 65%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
  }

  // ▸ 3. BOKEH DREAMS — lifestyle.html
  function bokehEffect() {
    const orbs = [];
    for (let i = 0; i < 40; i++) {
      orbs.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 15 + Math.random() * 80,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.2,
        hue: Math.random() * 360,
        alpha: 0.03 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2
      });
    }
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.dx + Math.sin(t * 0.0003 + o.phase) * 0.2;
        o.y += o.dy + Math.cos(t * 0.0004 + o.phase) * 0.15;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;
        const pulse = o.alpha + Math.sin(t * 0.001 + o.phase) * 0.02;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue + t * 0.005}, 50%, 60%, ${pulse * 1.5})`);
        g.addColorStop(0.5, `hsla(${o.hue + t * 0.005}, 40%, 40%, ${pulse * 0.6})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };
  }

  // ▸ 4. DIGITAL MATRIX — workspace.html
  function matrixEffect() {
    const cols = Math.floor(W / 18);
    const drops = [];
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'.split('');
    for (let i = 0; i < cols; i++) {
      drops.push({ y: Math.random() * H, speed: 1 + Math.random() * 3, col: i });
    }
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, W, H);
      drops.forEach(d => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = d.col * 18;
        const brightness = 40 + Math.sin(t * 0.002 + d.col) * 20;
        // Lead char bright
        ctx.fillStyle = `hsl(130, 100%, ${brightness + 30}%)`;
        ctx.font = '15px monospace';
        ctx.fillText(char, x, d.y);
        // Trail
        ctx.fillStyle = `hsl(130, 80%, ${brightness}%)`;
        ctx.globalAlpha = 0.6;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, d.y - 18);
        ctx.globalAlpha = 0.3;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, d.y - 36);
        ctx.globalAlpha = 1;

        d.y += d.speed;
        if (d.y > H + 50) {
          d.y = -20;
          d.speed = 1 + Math.random() * 3;
        }
      });
    };
  }

  // ▸ 5. NEURAL NETWORK — snippets.html
  function neuralEffect() {
    const nodes = [];
    for (let i = 0; i < 80; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 2 + Math.random() * 2,
        pulse: Math.random() * Math.PI * 2
      });
    }
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(0, 0, W, H);
      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            const pulse = Math.sin(t * 0.002 + i + j) * 0.5 + 0.5;
            ctx.strokeStyle = `hsla(200, 80%, 60%, ${alpha * pulse})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            // Traveling pulse
            if (dist < 80 && Math.sin(t * 0.003 + i * j) > 0.7) {
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * ((t * 0.001 + i) % 1);
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * ((t * 0.001 + i) % 1);
              ctx.fillStyle = 'hsla(180, 90%, 70%, 0.6)';
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      // Nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.pulse += 0.02;
        const glow = 0.4 + Math.sin(n.pulse) * 0.4;
        ctx.fillStyle = `hsla(200, 80%, 65%, ${glow})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.fillStyle = `hsla(200, 80%, 65%, ${glow * 0.2})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };
  }

  // ▸ 6. FLOATING GEOMETRY — hoatdong.html
  function geometryEffect() {
    const shapes = [];
    for (let i = 0; i < 20; i++) {
      shapes.push({
        x: Math.random() * W, y: Math.random() * H,
        size: 30 + Math.random() * 80,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.2,
        sides: [3, 4, 5, 6][Math.floor(Math.random() * 4)],
        hue: 200 + Math.random() * 100,
        alpha: 0.04 + Math.random() * 0.06
      });
    }
    const dust = [];
    for (let i = 0; i < 100; i++) {
      dust.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.2, a: Math.random() * 0.4,
        s: Math.random() * 0.2 + 0.05
      });
    }
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, W, H);
      // Shapes
      shapes.forEach(s => {
        s.x += s.dx; s.y += s.dy; s.rotation += s.rotSpeed;
        if (s.x < -s.size) s.x = W + s.size;
        if (s.x > W + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = H + s.size;
        if (s.y > H + s.size) s.y = -s.size;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.strokeStyle = `hsla(${s.hue}, 60%, 55%, ${s.alpha + Math.sin(t * 0.001) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= s.sides; i++) {
          const angle = (Math.PI * 2 / s.sides) * i - Math.PI / 2;
          const px = Math.cos(angle) * s.size;
          const py = Math.sin(angle) * s.size;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Inner shape
        ctx.strokeStyle = `hsla(${s.hue + 30}, 60%, 55%, ${s.alpha * 0.5})`;
        ctx.beginPath();
        for (let i = 0; i <= s.sides; i++) {
          const angle = (Math.PI * 2 / s.sides) * i - Math.PI / 2 + Math.PI / s.sides;
          const px = Math.cos(angle) * s.size * 0.5;
          const py = Math.sin(angle) * s.size * 0.5;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      });
      // Dust
      dust.forEach(d => {
        d.y -= d.s;
        if (d.y < -5) { d.y = H + 5; d.x = Math.random() * W; }
        ctx.globalAlpha = d.a * (0.5 + Math.sin(t * 0.002 + d.x) * 0.5);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
  }

  // ▸ 7. GOLDEN RAIN — khenthuong.html
  function goldenEffect() {
    const sparkles = [];
    for (let i = 0; i < 150; i++) {
      sparkles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vy: 0.2 + Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        hue: 35 + Math.random() * 25,
        alpha: Math.random() * 0.6 + 0.2,
        wobble: Math.random() * Math.PI * 2
      });
    }
    const rays = [];
    for (let i = 0; i < 8; i++) {
      rays.push({
        angle: (Math.PI * 2 / 8) * i,
        length: 200 + Math.random() * 300,
        alpha: 0.02 + Math.random() * 0.02,
        speed: 0.0001 + Math.random() * 0.0002
      });
    }
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, W, H);
      // God rays
      const cx = W * 0.5, cy = H * 0.1;
      rays.forEach(r => {
        const a = r.angle + t * r.speed;
        const pulse = r.alpha + Math.sin(t * 0.001 + r.angle) * 0.01;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        const g = ctx.createLinearGradient(0, 0, 0, r.length);
        g.addColorStop(0, `hsla(45, 80%, 60%, ${pulse})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(30, 0);
        ctx.lineTo(60, r.length);
        ctx.lineTo(-60, r.length);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      // Sparkles
      sparkles.forEach(s => {
        s.y += s.vy;
        s.wobble += 0.02;
        s.x += s.vx + Math.sin(s.wobble) * 0.3;
        if (s.y > H + 10) { s.y = -10; s.x = Math.random() * W; }
        const flash = s.alpha * (0.5 + Math.sin(t * 0.003 + s.wobble) * 0.5);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 65%, ${flash})`;
        ctx.beginPath();
        // Diamond shape
        ctx.moveTo(s.x, s.y - s.r * 2);
        ctx.lineTo(s.x + s.r, s.y);
        ctx.lineTo(s.x, s.y + s.r * 2);
        ctx.lineTo(s.x - s.r, s.y);
        ctx.closePath();
        ctx.fill();
      });
    };
  }

  // ▸ 8. PULSE RINGS — gioithieubthan.html
  function pulseEffect() {
    const rings = [];
    const cx = W / 2, cy = H / 2;
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, 0, W, H);
      // Spawn new rings periodically
      if (t % 1500 < 16) {
        rings.push({ r: 0, born: t, hue: 200 + Math.random() * 80 });
      }
      // Draw rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        const age = (t - ring.born) * 0.001;
        ring.r = age * 120;
        const alpha = Math.max(0, 0.25 - age * 0.04);
        if (alpha <= 0) { rings.splice(i, 1); continue; }
        const breathe = 1 + Math.sin(t * 0.002) * 0.1;
        ctx.strokeStyle = `hsla(${ring.hue}, 60%, 55%, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r * breathe, 0, Math.PI * 2);
        ctx.stroke();
        // Inner glow
        ctx.strokeStyle = `hsla(${ring.hue + 40}, 50%, 45%, ${alpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r * breathe * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Center glow
      const pulse = 0.1 + Math.sin(t * 0.003) * 0.05;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      g.addColorStop(0, `hsla(220, 70%, 60%, ${pulse})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // Floating particles
      for (let i = 0; i < 60; i++) {
        const angle = (t * 0.0003 + i * 0.105) % (Math.PI * 2);
        const dist = 50 + i * 5 + Math.sin(t * 0.001 + i) * 30;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const a = 0.15 + Math.sin(t * 0.002 + i * 0.5) * 0.15;
        ctx.fillStyle = `hsla(220, 70%, 70%, ${a})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
  }

  // ▸ 9. TIMELINE FLOW — trainghiem.html
  function timelineEffect() {
    const streams = [];
    for (let i = 0; i < 12; i++) {
      streams.push({
        y: H * 0.15 + (H * 0.7 / 12) * i,
        particles: Array.from({ length: 20 }, () => ({
          x: Math.random() * W,
          speed: 0.5 + Math.random() * 1.5,
          size: 1 + Math.random() * 2,
          alpha: 0.1 + Math.random() * 0.3
        })),
        hue: 180 + i * 12
      });
    }
    const milestones = [];
    for (let i = 0; i < 6; i++) {
      milestones.push({
        x: W * 0.15 + (W * 0.7 / 5) * i,
        y: H * 0.5,
        r: 4 + Math.random() * 4,
        pulse: Math.random() * Math.PI * 2
      });
    }
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, W, H);
      // Streams
      streams.forEach(s => {
        s.particles.forEach(p => {
          p.x += p.speed;
          if (p.x > W + 20) p.x = -20;
          const wave = Math.sin(p.x * 0.005 + t * 0.001) * 15;
          ctx.globalAlpha = p.alpha * (0.5 + Math.sin(t * 0.002 + p.x * 0.01) * 0.5);
          ctx.fillStyle = `hsl(${s.hue}, 60%, 55%)`;
          ctx.beginPath();
          ctx.arc(p.x, s.y + wave, p.size, 0, Math.PI * 2);
          ctx.fill();
          // Trail
          ctx.globalAlpha = p.alpha * 0.2;
          ctx.fillRect(p.x - 20, s.y + wave - 0.5, 20, 1);
        });
      });
      ctx.globalAlpha = 1;
      // Central timeline line
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.5);
      ctx.lineTo(W, H * 0.5);
      ctx.stroke();
      // Milestones
      milestones.forEach(m => {
        m.pulse += 0.015;
        const glow = 0.3 + Math.sin(m.pulse) * 0.3;
        ctx.fillStyle = `hsla(200, 70%, 60%, ${glow})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(200, 70%, 60%, ${glow * 0.15})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 5, 0, Math.PI * 2);
        ctx.fill();
      });
    };
  }

  // ▸ 10. ORBITAL PATHS — kinhnghiem.html
  function orbitalEffect() {
    const orbits = [];
    const cx = W / 2, cy = H / 2;
    for (let i = 0; i < 6; i++) {
      const r = 80 + i * 60;
      orbits.push({
        r: r,
        tilt: 0.2 + Math.random() * 0.4,
        speed: (0.0003 + Math.random() * 0.0004) * (i % 2 === 0 ? 1 : -1),
        hue: 190 + i * 20,
        bodies: Array.from({ length: 2 + Math.floor(Math.random() * 3) }, (_, j) => ({
          angle: (Math.PI * 2 / 3) * j + Math.random(),
          size: 2 + Math.random() * 3
        }))
      });
    }
    return function (t) {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, W, H);
      // Center
      const pulse = 0.08 + Math.sin(t * 0.002) * 0.03;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      g.addColorStop(0, `hsla(210, 60%, 50%, ${pulse * 2})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // Orbits
      orbits.forEach(o => {
        // Draw orbit path
        ctx.strokeStyle = `hsla(${o.hue}, 40%, 40%, 0.06)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const px = cx + Math.cos(a) * o.r;
          const py = cy + Math.sin(a) * o.r * o.tilt;
          a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Bodies
        o.bodies.forEach(b => {
          b.angle += o.speed;
          const bx = cx + Math.cos(b.angle) * o.r;
          const by = cy + Math.sin(b.angle) * o.r * o.tilt;
          const glow = 0.4 + Math.sin(t * 0.003 + b.angle) * 0.3;
          // Trail
          for (let tr = 1; tr <= 8; tr++) {
            const ta = b.angle - o.speed * tr * 8;
            const tx = cx + Math.cos(ta) * o.r;
            const ty = cy + Math.sin(ta) * o.r * o.tilt;
            ctx.fillStyle = `hsla(${o.hue}, 60%, 60%, ${glow * 0.06 * (8 - tr)})`;
            ctx.beginPath();
            ctx.arc(tx, ty, b.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
          // Body
          ctx.fillStyle = `hsla(${o.hue}, 70%, 65%, ${glow})`;
          ctx.beginPath();
          ctx.arc(bx, by, b.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `hsla(${o.hue}, 70%, 65%, ${glow * 0.2})`;
          ctx.beginPath();
          ctx.arc(bx, by, b.size * 3, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    };
  }

  // ─── SELECT & RUN ───
  const effects = {
    nebula: nebulaEffect,
    aurora: auroraEffect,
    bokeh: bokehEffect,
    matrix: matrixEffect,
    neural: neuralEffect,
    geometry: geometryEffect,
    golden: goldenEffect,
    pulse: pulseEffect,
    timeline: timelineEffect,
    orbital: orbitalEffect
  };

  const factory = effects[type];
  if (!factory) return;
  const render = factory();

  function loop(t) {
    render(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Re-init on resize
  window.addEventListener('resize', () => {
    // Stars/particles positions need to be re-spread for new dimensions
    // The effect will naturally adapt since W and H are updated
  });
})();
