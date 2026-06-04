// ─── WARP SPEED PAGE TRANSITION ───────────────────────────────────────
function initWarpTransition() {
  const overlay = document.getElementById('warp-overlay');
  if (!overlay) return;
  const canvas = document.createElement('canvas');
  overlay.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], animId = null;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W - W / 2,
        y: Math.random() * H - H / 2,
        z: Math.random() * W,
        pz: Math.random() * W
      });
    }
  }
  makeStars(500);

  function drawWarp(progress, isDeparting) {
    const speed = 2 + (progress * 150);
    const bgAlpha = isDeparting ? (0.2 + progress * 0.8) : (0.2 + progress * 0.8);
    
    ctx.fillStyle = `rgba(5,10,24,${bgAlpha})`;
    ctx.fillRect(0, 0, W, H);
    
    stars.forEach(s => {
      s.pz = s.z;
      s.z -= speed;
      if (s.z <= 0) {
        s.x = Math.random() * W - W / 2;
        s.y = Math.random() * H - H / 2;
        s.z = W;
        s.pz = W;
      }
      const sx = (s.x / s.z) * W + W / 2;
      const sy = (s.y / s.z) * H + H / 2;
      const px = (s.x / s.pz) * W + W / 2;
      const py = (s.y / s.pz) * H + H / 2;
      
      const size = Math.max(0.5, (1 - s.z / W) * 3);
      let starAlpha = (1 - s.z / W);
      if (!isDeparting) starAlpha *= progress; // Fade out stars when arriving

      ctx.globalAlpha = Math.max(0, Math.min(1, starAlpha));
      ctx.lineWidth = size;
      const dist = Math.sqrt((sx - W/2)**2 + (sy - H/2)**2);
      const hue = dist < 250 ? 280 : 190;
      ctx.strokeStyle = `hsl(${hue}, 100%, ${60 + progress * 40}%)`;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  let start = null, duration = 800, targetUrl = null, mode = 'departing';

  function animate(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const rawProgress = Math.min(elapsed / duration, 1);
    
    const easeInQuart = t => t * t * t * t;
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    ctx.clearRect(0, 0, W, H);

    if (mode === 'departing') {
      const progress = easeInQuart(rawProgress);
      drawWarp(progress, true);
      
      if (rawProgress >= 1 && !window._isWarpNavigating) {
        window._isWarpNavigating = true;
        sessionStorage.setItem('cosmosWarping', 'true');
        if (targetUrl) window.location.href = targetUrl;
        
        // Safety timeout: if page doesn't change after 2 seconds, cancel the warp (arriving back)
        setTimeout(() => {
          window._isWarpNavigating = false;
          mode = 'arriving';
          start = performance.now();
        }, 2000);
      }
      // Always continue animating so it doesn't freeze while loading
      animId = requestAnimationFrame(animate);
    } else {
      // Arriving
      const progress = 1 - easeOutQuart(rawProgress);
      drawWarp(progress, false);
      
      // Fade out the entire overlay smoothly
      overlay.style.opacity = Math.max(0, progress).toString();
      
      if (rawProgress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        overlay.style.pointerEvents = 'none';
        overlay.style.background = 'transparent';
        overlay.style.opacity = '1'; // reset for next time
        ctx.clearRect(0, 0, W, H);
      }
    }
  }

  window._warpTo = function(url) {
    targetUrl = url;
    mode = 'departing';
    overlay.style.pointerEvents = 'all';
    overlay.style.background = 'transparent';
    overlay.style.opacity = '1';
    start = null;
    makeStars(500); // Reset stars
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(animate);
  };

  // Check if arriving
  if (sessionStorage.getItem('cosmosWarping') === 'true') {
    sessionStorage.removeItem('cosmosWarping');
    mode = 'arriving';
    overlay.style.pointerEvents = 'all';
    overlay.style.background = '#050a18';
    overlay.style.opacity = '1';
    start = null;
    makeStars(500);
    animId = requestAnimationFrame(animate);

    // Safety fallback: force-clear overlay if animation hasn't finished in 2s
    setTimeout(() => {
      overlay.style.pointerEvents = 'none';
      overlay.style.background = 'transparent';
      overlay.style.opacity = '1';
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      ctx.clearRect(0, 0, W, H);
    }, 2000);
  } else {
    overlay.style.pointerEvents = 'none';
  }

  // Intercept all internal link clicks
  document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    // Skip if external, hash, mailto, tel, or target="_blank"
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || a.target === '_blank') return;
    e.preventDefault();
    window._warpTo(href);
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
      else e.target.classList.remove('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ─── CARD 3D TILT ─────────────────────────────────────────────────────
function initCardTilt() {
  document.querySelectorAll('.preview-card, .cosmos-card, .stat-preview').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}

// ─── NAV ARROWS ───────────────────────────────────────────────────────
function initNavArrows() {
  const up = document.getElementById('btn-up');
  const dn = document.getElementById('btn-down');
  const reveals = document.querySelectorAll('.scroll-reveal');
  if (dn) dn.addEventListener('click', () => {
    reveals.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 80));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
  if (up) up.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── LOADER ───────────────────────────────────────────────────────────
function initLoader() {
  const loaderEl = document.getElementById('loader-overlay');
  const exploreBtn = document.getElementById('btn-kham-pha');
  if (exploreBtn && loaderEl) {
    exploreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');
      loaderEl.classList.add('active');
      setTimeout(() => { window.location.href = url; }, 1400);
    });
  }
}

// ─── INIT ALL ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initWarpTransition();
  initScrollReveal();
  initCardTilt();
  initNavArrows();
  initLoader();
});
