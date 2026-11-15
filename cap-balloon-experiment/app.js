/**
 * ============================================================================
 * EXPERIMENT: 3D GRADUATION CAP + VERLET STRING BALLOON CAPTURE PHYSICS
 * Isolated sandbox experiment — Main invitation files untouched.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  const audioEngine = initSynthesizedAudio();
  const tiltController = initTiltAndFoilPhysics();
  initParallaxAndScrollDrawing();
  initBalloonCapChoreography(audioEngine, tiltController);
  initOdometerCountdown();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND PARTICLES
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const count = Math.min(20, Math.floor((width * height) / 36000));
  const particles = [];
  const colors = [
    'rgba(181, 144, 75, 0.22)',
    'rgba(235, 215, 171, 0.20)',
    'rgba(218, 178, 180, 0.12)',
    'rgba(24, 35, 56, 0.05)'
  ];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.7,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -Math.random() * 0.22 - 0.06,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      color: colors[i % colors.length]
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.014;
      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      const pulse = 0.65 + 0.35 * Math.sin(p.phase);
      ctx.save();
      ctx.globalAlpha = p.alpha * pulse;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. WEB AUDIO SYNTHESIZER (Soft Air Launch, Tug Glint, Paper & Chime)
   ========================================================================== */
function initSynthesizedAudio() {
  let audioCtx = null;
  let isMuted = false;

  const toggleBtn = document.getElementById('audio-toggle-btn');
  const iconOn = document.getElementById('icon-vol-on');
  const iconOff = document.getElementById('icon-vol-off');

  function ensureContext() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (iconOn && iconOff) {
        iconOn.classList.toggle('hidden', isMuted);
        iconOff.classList.toggle('hidden', !isMuted);
      }
      if (!isMuted) playSoftChime();
    });
  }

  function playBalloonLaunchWhoosh() {
    if (isMuted) return;
    try {
      ensureContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const bufSize = Math.floor(audioCtx.sampleRate * 0.45);
      const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buf;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(920, now + 0.4);
      filter.Q.setValueAtTime(1.4, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      src.start(now);
    } catch (_) {}
  }

  function playCapCatchSparkle() {
    if (isMuted) return;
    try {
      ensureContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      [659.25, 987.77].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.001, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.05, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.05 + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.48);
      });
    } catch (_) {}
  }

  function playPaperSlide() {
    if (isMuted) return;
    try {
      ensureContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const bufSize = Math.floor(audioCtx.sampleRate * 0.4);
      const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufSize) * Math.PI);
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(880, now);
      filter.Q.setValueAtTime(1.6, now);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      src.start(now);
    } catch (_) {}
  }

  function playSoftChime() {
    if (isMuted) return;
    try {
      ensureContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.075);
        gain.gain.setValueAtTime(0.001, now + idx * 0.075);
        gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.075 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.075 + 1.0);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.075);
        osc.stop(now + idx * 0.075 + 1.05);
      });
    } catch (_) {}
  }

  return { playBalloonLaunchWhoosh, playCapCatchSparkle, playPaperSlide, playSoftChime };
}

/* ==========================================================================
   3. 3D TILT, IDLE TASSEL SWAY & FOIL SHEEN
   ========================================================================== */
function initTiltAndFoilPhysics() {
  const envelopeAssembly = document.getElementById('envelope-assembly');
  const envelopeAura = document.getElementById('envelope-aura');
  const tiltZone = document.getElementById('envelope-tilt-zone');
  const idleTassel = document.getElementById('cap-tassel-pendulum');

  let tiltEnabled = true;
  let targetRx = 0;
  let targetRy = 0;
  let currentRx = 0;
  let currentRy = 0;

  function springLoop(now) {
    if (tiltEnabled && envelopeAssembly) {
      currentRx += (targetRx - currentRx) * 0.12;
      currentRy += (targetRy - currentRy) * 0.12;

      if (Math.abs(currentRx) > 0.01 || Math.abs(currentRy) > 0.01) {
        envelopeAssembly.style.transform =
          `rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg)`;
        if (envelopeAura) {
          envelopeAura.style.transform =
            `translate3d(${(-currentRy * 1.4).toFixed(1)}px, ${(currentRx * 1.4).toFixed(1)}px, 0)`;
        }
      } else {
        envelopeAssembly.style.transform = '';
      }

      // Gentle ambient breeze on the cap's gold tassel while resting
      if (idleTassel) {
        const idleSwing = Math.sin(now * 0.0022) * 2.8 - currentRy * 0.9;
        idleTassel.style.transform = `rotate(${idleSwing.toFixed(2)}deg)`;
      }
    }
    requestAnimationFrame(springLoop);
  }
  requestAnimationFrame(springLoop);

  function updateFoilCoords(xPct, yPct) {
    document.documentElement.style.setProperty('--foil-x', `${xPct.toFixed(1)}%`);
    document.documentElement.style.setProperty('--foil-y', `${yPct.toFixed(1)}%`);
  }

  function handlePointer(clientX, clientY) {
    const xPct = Math.max(0, Math.min(100, (clientX / window.innerWidth) * 100));
    const yPct = Math.max(0, Math.min(100, (clientY / window.innerHeight) * 100));
    updateFoilCoords(xPct, yPct);

    if (tiltEnabled && tiltZone) {
      const rect = tiltZone.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const relX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const relY = ((clientY - rect.top) / rect.height) * 2 - 1;
        targetRy = Math.max(-1, Math.min(1, relX)) * 6.5;
        targetRx = -Math.max(-1, Math.min(1, relY)) * 5.5;
      }
    }
  }

  window.addEventListener('pointermove', (e) => handlePointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  if (tiltZone) {
    tiltZone.addEventListener('pointerleave', () => {
      targetRx = 0;
      targetRy = 0;
    });
  }

  return {
    lockTilt() {
      tiltEnabled = false;
      targetRx = 0;
      targetRy = 0;
      currentRx = 0;
      currentRy = 0;
      if (envelopeAssembly) envelopeAssembly.style.transform = '';
      if (envelopeAura) envelopeAura.style.transform = '';
    },
    unlockTilt() {
      tiltEnabled = true;
    }
  };
}

/* ==========================================================================
   4. PARALLAX & SCROLL DRAWING
   ========================================================================== */
function initParallaxAndScrollDrawing() {
  const watermark = document.getElementById('parallax-watermark');
  const topControls = document.querySelector('.top-controls');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (watermark) watermark.style.setProperty('--parallax-y', `${(scrollY * 0.14).toFixed(1)}px`);
      if (topControls) topControls.classList.toggle('is-scrolled', scrollY > 36);
      ticking = false;
    });
  }, { passive: true });

  const revealEls = document.querySelectorAll('.scroll-reveal');
  const dividerEls = document.querySelectorAll('.drawn-divider-wrap');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-inview'));
    dividerEls.forEach((el) => el.classList.add('is-drawn'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target.classList.contains('scroll-reveal')) entry.target.classList.add('is-inview');
        if (entry.target.classList.contains('drawn-divider-wrap')) entry.target.classList.add('is-drawn');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -18px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
  dividerEls.forEach((el) => observer.observe(el));
}

function triggerInitialManuscriptReveals() {
  document.querySelectorAll('.scroll-reveal').forEach((el, idx) => {
    if (idx < 3) setTimeout(() => el.classList.add('is-inview'), 140 + idx * 110);
  });
  document.querySelectorAll('.drawn-divider-wrap').forEach((el, idx) => {
    if (idx < 2) setTimeout(() => el.classList.add('is-drawn'), 220 + idx * 170);
  });
}

/* ==========================================================================
   5. BALLOON PHYSICS ENGINE + CAP STRING CAPTURE + ENVELOPE OPENING
   ========================================================================== */
function initBalloonCapChoreography(audioEngine, tiltController) {
  const sanctuary = document.getElementById('envelope-sanctuary');
  const assembly = document.getElementById('envelope-assembly');
  const openBtn = document.getElementById('open-trigger-btn');
  const replayBtn = document.getElementById('replay-envelope-btn');
  const royalInvitation = document.getElementById('royal-invitation');
  const manuscriptSheet = document.getElementById('manuscript-sheet');

  const sanctuaryHeader = document.getElementById('sanctuary-header');
  const sanctuaryPrompt = document.getElementById('sanctuary-prompt');
  const capStage = document.getElementById('cap-seal-stage');
  const capActor = document.getElementById('grad-cap-actor');
  const capGroundShadow = document.getElementById('cap-ground-shadow');
  const capHaloRing = document.getElementById('cap-halo-ring');
  const capTassel = document.getElementById('cap-tassel-pendulum');

  const topFlapWrap = document.getElementById('env-top-flap-wrap');
  const topFlap = document.getElementById('env-top-flap');
  const envLetter = document.getElementById('env-letter');
  const envBack = document.getElementById('env-back');
  const envPocket = document.getElementById('env-pocket');
  const envAura = document.getElementById('envelope-aura');

  const balloonCanvas = document.getElementById('balloon-canvas');
  const bCtx = balloonCanvas ? balloonCanvas.getContext('2d') : null;

  // Moderately muted, tasteful festive satin palette
  const SATIN_PALETTES = [
    { light: '#f6d4d8', mid: '#d47984', dark: '#98424d', rim: 'rgba(255, 224, 228, 0.55)' }, // Dusty Coral Rose
    { light: '#cbe6ec', mid: '#508fa2', dark: '#295b6c', rim: 'rgba(220, 245, 250, 0.50)' }, // Petrol Teal
    { light: '#d6e9dc', mid: '#70a484', dark: '#3e6c50', rim: 'rgba(225, 246, 232, 0.50)' }, // Soft Sage
    { light: '#d0def5', mid: '#5576ab', dark: '#2c4670', rim: 'rgba(222, 234, 255, 0.50)' }, // Academic Slate Blue
    { light: '#e8d7ee', mid: '#9776ab', dark: '#5e4272', rim: 'rgba(240, 224, 250, 0.50)' }, // Muted Mauve Lavender
    { light: '#f8dec9', mid: '#d98f64', dark: '#9c5631', rim: 'rgba(255, 234, 218, 0.52)' }, // Satin Terracotta Peach
    { light: '#ffffff', mid: '#eae1cf', dark: '#b8aa91', rim: 'rgba(255, 255, 255, 0.65)' }  // Ivory Pearl
  ];

  // Hero Carrier Balloon: Rich Champagne-Gold Satin so eye tracks capture clearly
  const HERO_PALETTE = {
    light: '#fff5d4',
    mid: '#d4a74c',
    dark: '#926c21',
    rim: 'rgba(255, 247, 214, 0.68)'
  };

  let isRunning = false;
  let rafId = null;
  let activeAnimations = [];
  let timers = [];

  function clearAll() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    timers.forEach((t) => clearTimeout(t));
    timers = [];
    activeAnimations.forEach((a) => { try { a.cancel(); } catch (_) {} });
    activeAnimations = [];
    if (bCtx && balloonCanvas) {
      bCtx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);
    }
  }

  function schedule(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function animateEl(el, keyframes, options) {
    if (!el || !el.animate) return null;
    const anim = el.animate(keyframes, { fill: 'forwards', ...options });
    activeAnimations.push(anim);
    return anim;
  }

  function resizeBalloonCanvas() {
    if (!balloonCanvas || !bCtx) return { W: window.innerWidth, H: window.innerHeight };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    balloonCanvas.width = Math.floor(W * dpr);
    balloonCanvas.height = Math.floor(H * dpr);
    bCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { W, H };
  }

  function drawSatinBalloon(ctx, b, tSec) {
    const { x, y, rx, ry, tilt, palette, opacity } = b;

    ctx.save();
    ctx.globalAlpha = opacity;

    // 1. Draw Flexible Swaying String Trailing Beneath Balloon Knot
    const neckLocalX = 0;
    const neckLocalY = ry + 4;
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    const neckX = x + neckLocalX * cos - neckLocalY * sin;
    const neckY = y + neckLocalX * sin + neckLocalY * cos;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(neckX, neckY);

    if (b.isHero && b.captured) {
      // Taut tensioned string directly linking Hero Balloon to Cap's top gold stud!
      const midX = (neckX + b.capHookX) * 0.5 + b.tautSnapBow * Math.sin(tSec * 28);
      const midY = (neckY + b.capHookY) * 0.5;
      ctx.quadraticCurveTo(midX, midY, b.capHookX, b.capHookY);
      ctx.strokeStyle = 'rgba(138, 104, 41, 0.92)';
      ctx.lineWidth = 1.65;
      ctx.stroke();

      // Tiny gold tie loop at string end around cap stud
      ctx.beginPath();
      ctx.arc(b.capHookX, b.capHookY, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#f3e1b6';
      ctx.fill();
      ctx.strokeStyle = '#87662a';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Natural free-flowing curved string lagging behind air turbulence
      const segs = 7;
      let prevX = neckX;
      let prevY = neckY;
      for (let i = 1; i <= segs; i++) {
        const f = i / segs;
        const wave = Math.sin(tSec * b.strFreq + f * 4.4 + b.swayPhase) * (7.5 * f) - (b.vx * 0.045 * f);
        const px = neckX + wave;
        const py = neckY + b.stringLen * f;
        const cx = (prevX + px) * 0.5;
        const cy = (prevY + py) * 0.5;
        ctx.quadraticCurveTo(prevX, prevY, cx, cy);
        prevX = px;
        prevY = py;
      }
      ctx.lineTo(prevX, prevY);
      ctx.strokeStyle = b.isHero ? 'rgba(138, 104, 41, 0.85)' : 'rgba(100, 86, 66, 0.55)';
      ctx.lineWidth = b.isHero ? 1.55 : 1.15;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Transform into Tilted Balloon Frame
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Subtle Drop Halo Behind Foreground Balloons for Depth Separation
    ctx.shadowColor = 'rgba(24, 35, 56, 0.14)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    // Latex Knot Base
    ctx.beginPath();
    ctx.moveTo(-4, ry + 4);
    ctx.lineTo(4, ry + 4);
    ctx.lineTo(0, ry - 1);
    ctx.closePath();
    ctx.fillStyle = palette.dark;
    ctx.fill();

    // Rounded Pear-Teardrop Balloon Body
    ctx.beginPath();
    ctx.moveTo(0, -ry);
    ctx.bezierCurveTo(rx * 1.12, -ry * 0.96, rx * 1.16, ry * 0.25, 0, ry);
    ctx.bezierCurveTo(-rx * 1.16, ry * 0.25, -rx * 1.12, -ry * 0.96, 0, -ry);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-rx * 0.34, -ry * 0.36, rx * 0.08, 0, 0, ry * 1.18);
    grad.addColorStop(0, palette.light);
    grad.addColorStop(0.45, palette.mid);
    grad.addColorStop(1, palette.dark);
    ctx.fillStyle = grad;
    ctx.fill();

    // Reset shadow for crisp highlights
    ctx.shadowColor = 'transparent';

    // Glossy Specular Oval Highlight
    ctx.save();
    ctx.translate(-rx * 0.36, -ry * 0.36);
    ctx.rotate(-0.42);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.17, ry * 0.29, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.fill();
    ctx.restore();

    // Soft Bottom Rim Bounce Reflection
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(rx, ry) * 0.85, Math.PI * 0.18, Math.PI * 0.42);
    ctx.strokeStyle = palette.rim;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
  }

  function startAnimationSequence() {
    if (isRunning) return;
    isRunning = true;
    clearAll();
    tiltController.lockTilt();

    const { W, H } = resizeBalloonCanvas();

    // Subtle mobile vibration feedback
    if (navigator.vibrate) {
      try { navigator.vibrate([10, 24, 8]); } catch (_) {}
    }

    audioEngine.playBalloonLaunchWhoosh();

    // Gently fade stage prompt & halo without blocking envelope visibility
    if (capHaloRing) capHaloRing.classList.add('is-gone');
    animateEl(sanctuaryPrompt, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], {
      duration: 280,
      easing: 'ease-out'
    });

    // Measure Cap Exact Position in Viewport and Promote cleanly to Fixed Layer
    const capRect = capActor.getBoundingClientRect();
    const initCenterX = capRect.left + capRect.width * 0.5;
    const initStudOffsetY = capRect.height * 0.1941;
    const initStudY = capRect.top + initStudOffsetY;

    // Smooth responsive string length ensuring visible pass in front & crisp lift
    const heroStringLen = Math.min(144, Math.max(98, H * 0.185));

    // Timing Targets (Balanced: neither slow/boring nor dizzyingly fast)
    const PASS_AND_HOOK_DURATION = 1.18; // seconds until bottom tip of hero string hits cap stud!

    const startTime = performance.now();
    let prevTime = startTime;

    // Hero Carrier Balloon State
    const heroStartX = initCenterX - 24;
    const heroStartY = H + 46;
    const heroHookTargetBalloonY = initStudY - heroStringLen - 43; // ry(39) + neck(4) = exact bottom string match!

    const hero = {
      isHero: true,
      x: heroStartX,
      y: heroStartY,
      vx: 0,
      vy: 0,
      rx: 31,
      ry: 39,
      tilt: 0.06,
      stringLen: heroStringLen,
      swayPhase: 0.4,
      strFreq: 6.2,
      palette: HERO_PALETTE,
      opacity: 1,
      captured: false,
      captureTime: 0,
      tautSnapBow: 0,
      capHookX: initCenterX,
      capHookY: initStudY
    };

    // Supporting Varied Calm-Festive Balloons rising together cleanly along flanking lanes
    // Center capture lane [0.33*W .. 0.67*W] stays uncluttered so the Hero Balloon + Cap shine!
    const balloons = [];
    const totalDecor = 14;
    const heightScale = Math.max(0.84, Math.min(1.16, H / 780));
    for (let i = 0; i < totalDecor; i++) {
      let laneX;
      let yOffset;
      let delay;
      if (i < 12) {
        // Flanking left & right bouquets framing the envelope while Hero crosses front & hooks Cap
        laneX = i % 2 === 0
          ? 0.06 + Math.random() * 0.23
          : 0.71 + Math.random() * 0.23;
        yOffset = 18 + Math.random() * 95;
        delay = Math.random() * 0.16;
      } else {
        // 2 subtle flanking trailing accents framing lower left/right cleanly away from soaring cap
        laneX = i === 12 ? 0.16 : 0.84;
        yOffset = 115 + (i - 12) * 40;
        delay = 0.26;
      }
      const depthScale = 0.76 + Math.random() * 0.34;
      balloons.push({
        isHero: false,
        x: W * laneX,
        y: H + yOffset,
        vx: (Math.random() - 0.5) * 26,
        vy: -(435 + Math.random() * 145) * heightScale,
        rx: 25 * depthScale,
        ry: 32 * depthScale,
        tilt: (Math.random() - 0.5) * 0.14,
        stringLen: (106 + Math.random() * 44) * depthScale,
        swayPhase: Math.random() * Math.PI * 2,
        swayFreq: 2.2 + Math.random() * 1.3,
        strFreq: 5.2 + Math.random() * 2.4,
        palette: SATIN_PALETTES[i % SATIN_PALETTES.length],
        opacity: 0.94,
        delay
      });
    }
    // Render hero last so it passes visibly in the foreground!
    balloons.push(hero);

    // Promote Cap to Fixed Viewport Plane cleanly on capture
    let capState = {
      promoted: false,
      x: capRect.left,
      y: capRect.top,
      w: capRect.width,
      h: capRect.height,
      angle: 0,
      angularVel: 0,
      tasselAngle: 0,
      tasselVel: 0
    };

    const sparkles = [];
    let envelopeTriggerFired = false;

    function spawnSparkles(sx, sy) {
      for (let i = 0; i < 9; i++) {
        const ang = (Math.PI * 2 * i) / 9 + Math.random() * 0.35;
        const spd = 48 + Math.random() * 58;
        sparkles.push({
          x: sx,
          y: sy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 20,
          life: 1,
          r: 2 + Math.random() * 1.7
        });
      }
    }

    function physicsTick(now) {
      const dt = Math.min(0.032, (now - prevTime) / 1000);
      prevTime = now;
      const t = (now - startTime) / 1000;

      bCtx.clearRect(0, 0, W, H);

      // Gentle fade out near final transition so no late balloon overlaps opened manuscript calligraphy
      const lateFade = t > 2.65 ? Math.max(0, 1 - (t - 2.65) / 0.65) : 1;

      // Update & Draw Supporting Balloons + Hero Balloon
      for (const b of balloons) {
        if (!b.isHero) {
          if (t < b.delay) continue;
          const swayForce = Math.sin(t * b.swayFreq + b.swayPhase) * 20;
          b.x += (b.vx + swayForce) * dt;
          b.y += b.vy * dt;
          b.tilt = Math.max(-0.22, Math.min(0.22, (b.vx + swayForce) * 0.0028));
          b.opacity = 0.94 * lateFade;
          if (b.opacity > 0.01) drawSatinBalloon(bCtx, b, t);
          continue;
        }

        // --- HERO CARRIER BALLOON ---
        if (!b.captured) {
          const p = Math.min(1, t / PASS_AND_HOOK_DURATION);
          // Smooth controlled climb right across the front of the cap so eye follows balloon + string tip
          const easeP = 1 - Math.pow(1 - p, 1.48);
          const prevX = b.x;
          const prevY = b.y;

          // Gentle sweep crossing visibly in front of the cap face before centering above stud
          const weave = Math.sin(p * Math.PI) * 26 * (1 - p * 0.65);
          b.x = heroStartX + (initCenterX - heroStartX) * easeP + weave;
          b.y = heroStartY + (heroHookTargetBalloonY - heroStartY) * easeP;

          b.vx = (b.x - prevX) / Math.max(dt, 0.008);
          b.vy = (b.y - prevY) / Math.max(dt, 0.008);
          b.tilt = Math.max(-0.18, Math.min(0.18, b.vx * 0.0018));

          // Check Exact Moment String Tip Reaches Cap Top Stud
          if (p >= 1) {
            b.captured = true;
            b.captureTime = t;
            b.tautSnapBow = 14;

            // Snap balloon Y continuously so neck + stringLen === initStudY at t = captureTime (zero pixel pop)
            b.x = initCenterX;
            b.tilt = 0;
            b.y = initStudY - b.stringLen - (b.ry + 4);
            b.capHookX = initCenterX;
            b.capHookY = initStudY;

            // Reparent to document.body and promote to fixed overlay at identical coordinate
            document.body.appendChild(capActor);
            capActor.style.position = 'fixed';
            capActor.style.left = `${capState.x}px`;
            capActor.style.top = `${capState.y}px`;
            capActor.style.width = `${capState.w}px`;
            capActor.style.height = `${capState.h}px`;
            capActor.classList.add('is-flying');
            capState.promoted = true;

            // Impulse when taut string catches the weighted cap!
            capState.angularVel = -24;
            capState.tasselVel = 46;

            // Realistic Newtonian load check right upon hooking weight, then buoyant lift!
            b.vy = 22;
            b.vx = 22;

            spawnSparkles(initCenterX, initStudY);
            audioEngine.playCapCatchSparkle();
            if (navigator.vibrate) { try { navigator.vibrate([12, 20]); } catch (_) {} }

            // Ground shadow dissolves gently as cap lifts off envelope
            if (capGroundShadow) {
              animateEl(
                capGroundShadow,
                [
                  { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.9, filter: 'blur(5px)' },
                  { transform: 'translate(-50%, -40%) scale(1.65)', opacity: 0, filter: 'blur(14px)' }
                ],
                { duration: 380, easing: 'ease-out' }
              );
            }
          }
        } else {
          // Captured Phase: Newtonian weight recoil -> accelerating buoyant climb + pendulum sway
          const liftTime = t - b.captureTime;
          const targetVy = -435 * Math.min(1, Math.max(0.05, (liftTime - 0.04) * 1.45));
          b.vy += (targetVy - b.vy) * Math.min(1, dt * 7.2);

          const lateralDrift = Math.sin(liftTime * 3.8) * 34;
          b.vx += (lateralDrift - b.vx) * Math.min(1, dt * 4.5);

          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.tilt = Math.max(-0.2, Math.min(0.2, b.vx * 0.0022));

          // Taut string snap vibration damps out rapidly
          b.tautSnapBow *= Math.pow(0.018, dt);

          // Continuous neck -> taut string tip -> Cap Center Stud coupling
          const neckX = b.x - Math.sin(b.tilt) * (b.ry + 4);
          const neckY = b.y + Math.cos(b.tilt) * (b.ry + 4);
          b.capHookX = neckX - b.vx * 0.025;
          b.capHookY = neckY + b.stringLen;

          // Update Fixed Cap Position & Damped Pendulum Physics
          const capNextLeft = b.capHookX - capState.w * 0.5;
          const capNextTop = b.capHookY - capState.h * 0.1941;

          const accelTorque = -b.vx * 0.125;
          const springRestore = -capState.angle * 16 - capState.angularVel * 3.8;
          capState.angularVel += (springRestore + accelTorque) * dt;
          capState.angle += capState.angularVel * dt;

          // Secondary Tassel Pendulum lags behind cap tilt
          const tasselTarget = -capState.angle * 0.82 + Math.sin(liftTime * 7.5) * 5;
          const tasselRestore = (tasselTarget - capState.tasselAngle) * 28 - capState.tasselVel * 4.2;
          capState.tasselVel += tasselRestore * dt;
          capState.tasselAngle += capState.tasselVel * dt;

          capActor.style.left = `${capNextLeft.toFixed(1)}px`;
          capActor.style.top = `${capNextTop.toFixed(1)}px`;
          capActor.style.transform = `rotate(${capState.angle.toFixed(2)}deg)`;
          if (capTassel) {
            capTassel.style.transform = `rotate(${capState.tasselAngle.toFixed(2)}deg)`;
          }

          // Trigger Envelope Flap Open seamlessly once cap clears cleanly above the envelope!
          if (!envelopeTriggerFired && ((capNextTop + capState.h < assembly.getBoundingClientRect().top - 22 && liftTime >= 0.62) || liftTime >= 0.86)) {
            envelopeTriggerFired = true;
            openUnlockedEnvelope();
          }
        }

        b.opacity = lateFade;
        if (b.opacity > 0.01) drawSatinBalloon(bCtx, b, t);
      }

      // Draw Micro-Sparkles from Capture Moment
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 120 * dt;
        s.life -= dt * 2.4;
        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }
        bCtx.save();
        bCtx.globalAlpha = s.life;
        bCtx.fillStyle = '#f2da9a';
        bCtx.beginPath();
        bCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.restore();
      }

      // Continue animation until well after envelope opens and all balloons exit/fade
      if (t < 3.6) {
        rafId = requestAnimationFrame(physicsTick);
      } else {
        bCtx.clearRect(0, 0, W, H);
        if (capActor) capActor.style.opacity = '0';
      }
    }

    rafId = requestAnimationFrame(physicsTick);
  }

  function openUnlockedEnvelope() {
    audioEngine.playPaperSlide();

    animateEl(sanctuaryHeader, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-10px)' }], {
      duration: 280,
      easing: 'ease-out'
    });

    if (window.innerHeight < 660 && assembly) {
      animateEl(
        assembly,
        [{ transform: 'translateY(0)' }, { transform: 'translateY(16%)' }],
        { duration: 520, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
      );
    }

    // Top Flap Hinges Open (0ms -> 640ms)
    animateEl(
      topFlap,
      [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(180deg)' }],
      { duration: 640, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
    );

    schedule(() => {
      if (topFlapWrap) topFlapWrap.style.zIndex = '1';
    }, 320);

    // Letter Extraction & Envelope Slide Down (500ms -> 1120ms)
    schedule(() => {
      audioEngine.playSoftChime();

      animateEl(
        envLetter,
        [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-18%) scale(1.03)' }],
        { duration: 580, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );

      const slideDown = [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(108%)', opacity: 0 }];
      const opts = { duration: 600, easing: 'cubic-bezier(0.32, 0, 0.2, 1)' };
      animateEl(envBack, slideDown, opts);
      animateEl(envPocket, slideDown, opts);
      animateEl(topFlapWrap, slideDown, opts);
      animateEl(envAura, [{ opacity: 1 }, { opacity: 0 }], { duration: 450 });
    }, 500);

    // Seamless Continuous FLIP Expansion into Full Manuscript (1020ms)
    schedule(() => {
      const firstRect = envLetter ? envLetter.getBoundingClientRect() : null;

      window.scrollTo({ top: 0, behavior: 'auto' });
      document.body.classList.remove('is-locked');

      royalInvitation.classList.add('is-visible');
      royalInvitation.setAttribute('aria-hidden', 'false');

      const lastRect = manuscriptSheet ? manuscriptSheet.getBoundingClientRect() : null;

      sanctuary.classList.add('is-dismissed');
      if (replayBtn) replayBtn.classList.remove('hidden');

      if (manuscriptSheet && manuscriptSheet.animate && firstRect && lastRect && lastRect.width > 0) {
        const dx = (firstRect.left + firstRect.width / 2) - (lastRect.left + lastRect.width / 2);
        const dy = firstRect.top - lastRect.top;
        const scale = Math.min(1, Math.max(0.58, firstRect.width / lastRect.width));

        manuscriptSheet.classList.add('is-creasing');

        animateEl(
          manuscriptSheet,
          [
            {
              transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
              clipPath: 'inset(0 0 60% 0 round 18px)',
              opacity: 0.96
            },
            {
              transform: 'translate3d(0, 0, 0) scale(1)',
              clipPath: 'inset(0 0 0% 0 round 22px)',
              opacity: 1
            }
          ],
          { duration: 740, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        );

        schedule(() => manuscriptSheet.classList.remove('is-creasing'), 760);
      }

      triggerInitialManuscriptReveals();
    }, 1020);
  }

  function resetExperiment() {
    clearAll();
    isRunning = false;

    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.add('is-locked');

    royalInvitation.classList.remove('is-visible');
    royalInvitation.setAttribute('aria-hidden', 'true');
    if (manuscriptSheet) manuscriptSheet.classList.remove('is-creasing');

    sanctuary.classList.remove('is-dismissed');

    if (replayBtn) replayBtn.classList.add('hidden');
    if (topFlapWrap) topFlapWrap.style.zIndex = '4';
    if (capHaloRing) {
      capHaloRing.classList.remove('is-gone');
      capHaloRing.style.opacity = '';
    }

    // Restore Cap cleanly back into .cap-seal-stage
    capActor.classList.remove('is-flying');
    capActor.style.position = '';
    capActor.style.left = '';
    capActor.style.top = '';
    capActor.style.width = '';
    capActor.style.height = '';
    capActor.style.transform = '';
    capActor.style.opacity = '1';
    if (capTassel) capTassel.style.transform = '';
    if (capStage && !capStage.contains(capActor)) capStage.appendChild(capActor);

    tiltController.unlockTilt();
  }

  if (assembly) {
    assembly.addEventListener('click', startAnimationSequence);
    assembly.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startAnimationSequence();
      }
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startAnimationSequence();
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', resetExperiment);
  }
}

/* ==========================================================================
   6. ROLLING ODOMETER COUNTDOWN
   ========================================================================== */
function initOdometerCountdown() {
  const targetDate = new Date('2026-11-29T13:00:00+03:00').getTime();
  const containers = {
    days: document.getElementById('odo-days'),
    hours: document.getElementById('odo-hours'),
    minutes: document.getElementById('odo-minutes'),
    seconds: document.getElementById('odo-seconds')
  };

  function createCol() {
    const col = document.createElement('span');
    col.className = 'odo-digit-col';
    const track = document.createElement('span');
    track.className = 'odo-digit-track';
    for (let d = 0; d <= 9; d++) {
      const s = document.createElement('span');
      s.textContent = String(d);
      track.appendChild(s);
    }
    col.appendChild(track);
    col._track = track;
    return col;
  }

  function renderVal(c, str) {
    if (!c) return;
    if (!c._cols || c._cols.length !== str.length) {
      c.innerHTML = '';
      c._cols = [];
      for (let i = 0; i < str.length; i++) {
        const col = createCol();
        c._cols.push(col);
        c.appendChild(col);
      }
    }
    for (let i = 0; i < str.length; i++) {
      const d = parseInt(str[i], 10);
      if (!Number.isNaN(d) && c._cols[i]._track) {
        c._cols[i]._track.style.transform = `translateY(-${d * 10}%)`;
      }
    }
  }

  function update() {
    const diff = Math.max(0, targetDate - Date.now());
    renderVal(containers.days, String(Math.floor(diff / 86400000)).padStart(2, '0'));
    renderVal(containers.hours, String(Math.floor((diff / 3600000) % 24)).padStart(2, '0'));
    renderVal(containers.minutes, String(Math.floor((diff / 60000) % 60)).padStart(2, '0'));
    renderVal(containers.seconds, String(Math.floor((diff / 1000) % 60)).padStart(2, '0'));
  }

  update();
  setInterval(update, 1000);
}
