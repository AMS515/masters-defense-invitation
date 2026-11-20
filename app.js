/**
 * ============================================================================
 * MASTER'S DEFENSE CELEBRATORY LUNCHEON — BESPOKE TACTILE & MOTION ENGINE
 * Researcher: Ibtisam Mahmoud Saleh | University of Mosul
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  const audioEngine = initSynthesizedAudio();
  const tiltController = initTiltAndFoilPhysics();
  initParallaxAndScrollDrawing();
  initBalloonCapChoreography(audioEngine, tiltController);
  initOdometerCountdown();
  initNativeMapLinks();
  initSupabaseWishes(audioEngine);
  initShareTools(audioEngine);
});

/* ==========================================================================
   1. SUBTLE AMBIENT CANVAS (Calm Warm Gold Bokeh & Light Motes)
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

  const count = Math.min(22, Math.floor((width * height) / 34000));
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
      r: Math.random() * 2.1 + 0.7,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.06,
      alpha: Math.random() * 0.55 + 0.2,
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
   2. WEB AUDIO SYNTHESIZER (Soft Air Launch, Capture Sparkle, Paper & Chime)
   ========================================================================== */
function initSynthesizedAudio() {
  let audioCtx = null;
  let isMuted = false;

  const toggleBtn = document.getElementById('audio-toggle-btn');
  const iconOn = document.getElementById('icon-vol-on');
  const iconOff = document.getElementById('icon-vol-off');

  function ensureContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
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
      if (!isMuted) {
        playSoftChime();
      }
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
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.42);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(880, now);
      filter.Q.setValueAtTime(1.6, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
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
        gain.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.075 + 1.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.075);
        osc.stop(now + idx * 0.075 + 1.1);
      });
    } catch (_) {}
  }

  return { playBalloonLaunchWhoosh, playCapCatchSparkle, playPaperSlide, playSoftChime };
}

/* ==========================================================================
   3. SPRING 3D TILT, IDLE TASSEL SWAY & SPECULAR FOIL SHEEN PHYSICS
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
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  if (tiltZone) {
    tiltZone.addEventListener('pointerleave', () => {
      targetRx = 0;
      targetRy = 0;
    });
  }

  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null || e.beta === null) return;
    const normX = Math.max(-1, Math.min(1, e.gamma / 30));
    const normY = Math.max(-1, Math.min(1, (e.beta - 40) / 30));

    updateFoilCoords(50 + normX * 32, 35 + normY * 28);

    if (tiltEnabled) {
      targetRy = normX * 5.5;
      targetRx = -normY * 4.5;
    }
  }, { passive: true });

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
   4. SCROLL-LINKED WATERMARK PARALLAX & SVG PATH DRAWING
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
      if (watermark) {
        watermark.style.setProperty('--parallax-y', `${(scrollY * 0.14).toFixed(1)}px`);
      }
      if (topControls) {
        topControls.classList.toggle('is-scrolled', scrollY > 36);
      }
      const foilY = 20 + Math.min(65, (scrollY / 900) * 55);
      document.documentElement.style.setProperty('--foil-y', `${foilY.toFixed(1)}%`);
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
        if (entry.target.classList.contains('scroll-reveal')) {
          entry.target.classList.add('is-inview');
        }
        if (entry.target.classList.contains('drawn-divider-wrap')) {
          entry.target.classList.add('is-drawn');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -18px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
  dividerEls.forEach((el) => observer.observe(el));
}

function triggerInitialManuscriptReveals() {
  const revealEls = document.querySelectorAll('.scroll-reveal');
  const dividerEls = document.querySelectorAll('.drawn-divider-wrap');

  revealEls.forEach((el, idx) => {
    if (idx < 3) {
      setTimeout(() => el.classList.add('is-inview'), 140 + idx * 120);
    }
  });

  dividerEls.forEach((el, idx) => {
    if (idx < 2) {
      setTimeout(() => el.classList.add('is-drawn'), 240 + idx * 180);
    }
  });
}

/* ==========================================================================
   5. BALLOON PHYSICS ENGINE + CAP STRING CAPTURE + CONTINUOUS FLIP OPENING
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

  const SATIN_PALETTES = [
    { light: '#f6d4d8', mid: '#d47984', dark: '#98424d', rim: 'rgba(255, 224, 228, 0.55)' },
    { light: '#cbe6ec', mid: '#508fa2', dark: '#295b6c', rim: 'rgba(220, 245, 250, 0.50)' },
    { light: '#d6e9dc', mid: '#70a484', dark: '#3e6c50', rim: 'rgba(225, 246, 232, 0.50)' },
    { light: '#d0def5', mid: '#5576ab', dark: '#2c4670', rim: 'rgba(222, 234, 255, 0.50)' },
    { light: '#e8d7ee', mid: '#9776ab', dark: '#5e4272', rim: 'rgba(240, 224, 250, 0.50)' },
    { light: '#f8dec9', mid: '#d98f64', dark: '#9c5631', rim: 'rgba(255, 234, 218, 0.52)' },
    { light: '#ffffff', mid: '#eae1cf', dark: '#b8aa91', rim: 'rgba(255, 255, 255, 0.65)' }
  ];

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
      const midX = (neckX + b.capHookX) * 0.5 + b.tautSnapBow * Math.sin(tSec * 28);
      const midY = (neckY + b.capHookY) * 0.5;
      ctx.quadraticCurveTo(midX, midY, b.capHookX, b.capHookY);
      ctx.strokeStyle = 'rgba(138, 104, 41, 0.92)';
      ctx.lineWidth = 1.65;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(b.capHookX, b.capHookY, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#f3e1b6';
      ctx.fill();
      ctx.strokeStyle = '#87662a';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
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

    ctx.translate(x, y);
    ctx.rotate(tilt);

    ctx.shadowColor = 'rgba(24, 35, 56, 0.14)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.moveTo(-4, ry + 4);
    ctx.lineTo(4, ry + 4);
    ctx.lineTo(0, ry - 1);
    ctx.closePath();
    ctx.fillStyle = palette.dark;
    ctx.fill();

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

    ctx.shadowColor = 'transparent';

    ctx.save();
    ctx.translate(-rx * 0.36, -ry * 0.36);
    ctx.rotate(-0.42);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.17, ry * 0.29, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.fill();
    ctx.restore();

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

    if (navigator.vibrate) {
      try { navigator.vibrate([10, 24, 8]); } catch (_) {}
    }

    audioEngine.playBalloonLaunchWhoosh();

    const { W, H } = resizeBalloonCanvas();

    if (capHaloRing) capHaloRing.classList.add('is-gone');
    animateEl(sanctuaryPrompt, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], {
      duration: 280,
      easing: 'ease-out'
    });

    const capRect = capActor.getBoundingClientRect();
    const initCenterX = capRect.left + capRect.width * 0.5;
    const initStudOffsetY = capRect.height * 0.1941;
    const initStudY = capRect.top + initStudOffsetY;

    const heroStringLen = Math.min(144, Math.max(98, H * 0.185));
    const PASS_AND_HOOK_DURATION = 1.18;

    const startTime = performance.now();
    let prevTime = startTime;

    const heroStartX = initCenterX - 24;
    const heroStartY = H + 46;
    const heroHookTargetBalloonY = initStudY - heroStringLen - 43;

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

    const balloons = [];
    const totalDecor = 14;
    const heightScale = Math.max(0.84, Math.min(1.16, H / 780));
    for (let i = 0; i < totalDecor; i++) {
      let laneX;
      let yOffset;
      let delay;
      if (i < 12) {
        laneX = i % 2 === 0
          ? 0.06 + Math.random() * 0.23
          : 0.71 + Math.random() * 0.23;
        yOffset = 18 + Math.random() * 95;
        delay = Math.random() * 0.16;
      } else {
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
    balloons.push(hero);

    const capState = {
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
      const lateFade = t > 2.65 ? Math.max(0, 1 - (t - 2.65) / 0.65) : 1;

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

        if (!b.captured) {
          const p = Math.min(1, t / PASS_AND_HOOK_DURATION);
          const easeP = 1 - Math.pow(1 - p, 1.48);
          const prevX = b.x;
          const prevY = b.y;

          const weave = Math.sin(p * Math.PI) * 26 * (1 - p * 0.65);
          b.x = heroStartX + (initCenterX - heroStartX) * easeP + weave;
          b.y = heroStartY + (heroHookTargetBalloonY - heroStartY) * easeP;

          b.vx = (b.x - prevX) / Math.max(dt, 0.008);
          b.vy = (b.y - prevY) / Math.max(dt, 0.008);
          b.tilt = Math.max(-0.18, Math.min(0.18, b.vx * 0.0018));

          if (p >= 1) {
            b.captured = true;
            b.captureTime = t;
            b.tautSnapBow = 14;

            b.x = initCenterX;
            b.tilt = 0;
            b.y = initStudY - b.stringLen - (b.ry + 4);
            b.capHookX = initCenterX;
            b.capHookY = initStudY;

            document.body.appendChild(capActor);
            capActor.style.position = 'fixed';
            capActor.style.left = `${capState.x}px`;
            capActor.style.top = `${capState.y}px`;
            capActor.style.width = `${capState.w}px`;
            capActor.style.height = `${capState.h}px`;
            capActor.classList.add('is-flying');
            capState.promoted = true;

            capState.angularVel = -24;
            capState.tasselVel = 46;
            b.vy = 22;
            b.vx = 22;

            spawnSparkles(initCenterX, initStudY);
            audioEngine.playCapCatchSparkle();
            if (navigator.vibrate) { try { navigator.vibrate([12, 20]); } catch (_) {} }

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
          const liftTime = t - b.captureTime;
          const targetVy = -435 * Math.min(1, Math.max(0.05, (liftTime - 0.04) * 1.45));
          b.vy += (targetVy - b.vy) * Math.min(1, dt * 7.2);

          const lateralDrift = Math.sin(liftTime * 3.8) * 34;
          b.vx += (lateralDrift - b.vx) * Math.min(1, dt * 4.5);

          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.tilt = Math.max(-0.2, Math.min(0.2, b.vx * 0.0022));
          b.tautSnapBow *= Math.pow(0.018, dt);

          const neckX = b.x - Math.sin(b.tilt) * (b.ry + 4);
          const neckY = b.y + Math.cos(b.tilt) * (b.ry + 4);
          b.capHookX = neckX - b.vx * 0.025;
          b.capHookY = neckY + b.stringLen;

          const capNextLeft = b.capHookX - capState.w * 0.5;
          const capNextTop = b.capHookY - capState.h * 0.1941;

          const accelTorque = -b.vx * 0.125;
          const springRestore = -capState.angle * 16 - capState.angularVel * 3.8;
          capState.angularVel += (springRestore + accelTorque) * dt;
          capState.angle += capState.angularVel * dt;

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

          if (!envelopeTriggerFired && ((capNextTop + capState.h < assembly.getBoundingClientRect().top - 22 && liftTime >= 0.62) || liftTime >= 0.86)) {
            envelopeTriggerFired = true;
            openUnlockedEnvelope();
          }
        }

        b.opacity = lateFade;
        if (b.opacity > 0.01) drawSatinBalloon(bCtx, b, t);
      }

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

    animateEl(
      topFlap,
      [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(180deg)' }],
      { duration: 640, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
    );

    schedule(() => {
      if (topFlapWrap) topFlapWrap.style.zIndex = '1';
    }, 320);

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

  function resetEnvelope() {
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
    replayBtn.addEventListener('click', resetEnvelope);
  }
}

/* ==========================================================================
   6. ROLLING ODOMETER COUNTDOWN (Target: Sunday, Nov 29, 2026 - Mosul UTC+3)
   ========================================================================== */
function initOdometerCountdown() {
  const targetDate = new Date('2026-11-29T13:00:00+03:00').getTime();

  const containers = {
    days: document.getElementById('odo-days'),
    hours: document.getElementById('odo-hours'),
    minutes: document.getElementById('odo-minutes'),
    seconds: document.getElementById('odo-seconds')
  };

  function createDigitColumn() {
    const col = document.createElement('span');
    col.className = 'odo-digit-col';
    const track = document.createElement('span');
    track.className = 'odo-digit-track';
    for (let d = 0; d <= 9; d++) {
      const numSpan = document.createElement('span');
      numSpan.textContent = String(d);
      track.appendChild(numSpan);
    }
    col.appendChild(track);
    col._track = track;
    return col;
  }

  function renderOdometerValue(container, strValue) {
    if (!container) return;
    if (!container._cols || container._cols.length !== strValue.length) {
      container.innerHTML = '';
      container._cols = [];
      for (let i = 0; i < strValue.length; i++) {
        const col = createDigitColumn();
        container._cols.push(col);
        container.appendChild(col);
      }
    }

    for (let i = 0; i < strValue.length; i++) {
      const digit = parseInt(strValue[i], 10);
      if (!Number.isNaN(digit) && container._cols[i]._track) {
        container._cols[i]._track.style.transform = `translateY(-${digit * 10}%)`;
      }
    }
  }

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    renderOdometerValue(containers.days, String(days).padStart(2, '0'));
    renderOdometerValue(containers.hours, String(hours).padStart(2, '0'));
    renderOdometerValue(containers.minutes, String(minutes).padStart(2, '0'));
    renderOdometerValue(containers.seconds, String(seconds).padStart(2, '0'));
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   7. NATIVE MAPS APP LAUNCHERS (NEVER OPEN MAPS INSIDE MOBILE BROWSER)
   ========================================================================== */
function initNativeMapLinks() {
  const appleBtn = document.getElementById('btn-apple-maps');
  const googleBtn = document.getElementById('btn-google-maps');
  const deviceNote = document.getElementById('map-device-note');

  const LAT = '36.371263';
  const LNG = '43.169477';
  const VENUE_LABEL = 'مطعم سراي الموصل';
  const ENCODED_LABEL = encodeURIComponent(VENUE_LABEL);
  const DESKTOP_FALLBACK_URL = 'https://maps.app.goo.gl/hLz2goPDaHTHeNnA6?g_st=aw';

  const APPLE_MAPS_SCHEME = `maps://?ll=${LAT},${LNG}&sll=${LAT},${LNG}&q=${ENCODED_LABEL}`;
  const ANDROID_GEO_SCHEME = `geo:${LAT},${LNG}?q=${LAT},${LNG}(${ENCODED_LABEL})`;
  const ANDROID_GMAPS_INTENT =
    `intent://maps.google.com/maps?q=${LAT},${LNG}(${ENCODED_LABEL})&ll=${LAT},${LNG}&z=17` +
    `#Intent;scheme=https;package=com.google.android.apps.maps;` +
    `S.browser_fallback_url=${encodeURIComponent(ANDROID_GEO_SCHEME)};end`;
  const IOS_GMAPS_SCHEME = `comgooglemaps://?q=${LAT},${LNG}&center=${LAT},${LNG}&zoom=17`;

  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMac = /Macintosh/i.test(ua) && !isIOS;
  const isAndroid = /Android/i.test(ua);
  const isFirefox = /Firefox|FxiOS/i.test(ua);

  function showMapNote(msg) {
    if (!deviceNote) return;
    deviceNote.textContent = msg;
    deviceNote.classList.remove('hidden');
  }

  function launchWithHiddenFallback(primaryUri, fallbackUri) {
    let leftPage = false;
    const onHidden = () => {
      if (document.hidden) leftPage = true;
    };
    document.addEventListener('visibilitychange', onHidden, { once: true });
    window.addEventListener('pagehide', () => { leftPage = true; }, { once: true });

    window.location.href = primaryUri;

    setTimeout(() => {
      document.removeEventListener('visibilitychange', onHidden);
      if (!leftPage && fallbackUri) {
        window.location.href = fallbackUri;
      }
    }, 950);
  }

  if (appleBtn) {
    if (isIOS || isMac) {
      appleBtn.classList.add('is-recommended-app');
      appleBtn.setAttribute('href', APPLE_MAPS_SCHEME);
    } else if (isAndroid) {
      appleBtn.setAttribute('href', '#location-section');
    } else {
      appleBtn.setAttribute('href', DESKTOP_FALLBACK_URL);
      appleBtn.setAttribute('target', '_blank');
      appleBtn.setAttribute('rel', 'noopener noreferrer');
    }

    appleBtn.addEventListener('click', (e) => {
      if (isIOS || isMac) {
        e.preventDefault();
        window.location.href = APPLE_MAPS_SCHEME;
      } else if (isAndroid) {
        e.preventDefault();
        showMapNote('زر «خرائط آيفون» مخصص لأجهزة iPhone، اضغط على زر «خرائط Google» لفتح التطبيق على جهازك.');
      }
    });
  }

  if (googleBtn) {
    if (isAndroid) {
      googleBtn.classList.add('is-recommended-app');
      googleBtn.setAttribute('href', ANDROID_GEO_SCHEME);
    } else if (isIOS) {
      googleBtn.setAttribute('href', IOS_GMAPS_SCHEME);
    } else {
      googleBtn.setAttribute('href', DESKTOP_FALLBACK_URL);
      googleBtn.setAttribute('target', '_blank');
      googleBtn.setAttribute('rel', 'noopener noreferrer');
    }

    googleBtn.addEventListener('click', (e) => {
      if (isAndroid) {
        e.preventDefault();
        if (!isFirefox) {
          launchWithHiddenFallback(ANDROID_GMAPS_INTENT, ANDROID_GEO_SCHEME);
        } else {
          window.location.href = ANDROID_GEO_SCHEME;
        }
      } else if (isIOS) {
        e.preventDefault();
        // Open Google Maps iOS app directly; fallback natively to Apple Maps app (never web browser)
        launchWithHiddenFallback(IOS_GMAPS_SCHEME, APPLE_MAPS_SCHEME);
      }
    });
  }
}

/* ==========================================================================
   8. PUBLIC WISHES GUESTBOOK POWERED BY SUPABASE (PUBLISHABLE KEY ONLY)
   ========================================================================== */
function initSupabaseWishes(audioEngine) {
  const SUPABASE_URL = 'https://fcmaqhcdagphlqbcobby.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_w7rIMzeaaJln7cTRUs4Elw_ckOE2UjZ';
  const WISHES_ENDPOINT = `${SUPABASE_URL}/rest/v1/wishes`;

  const form = document.getElementById('wish-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestWishesInput = document.getElementById('guest-wishes');
  const submitBtn = document.getElementById('wish-submit-btn');
  const feedbackEl = document.getElementById('wish-feedback');
  const blessingsGrid = document.getElementById('blessings-grid');

  function formatArabicTime(isoDate) {
    if (!isoDate) return 'الآن';
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return 'الآن';
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return 'أُضيفت الآن';
    if (diffSec < 3600) return `منذ ${Math.floor(diffSec / 60)} د`;
    if (diffSec < 86400) return `منذ ${Math.floor(diffSec / 3600)} س`;
    try {
      return d.toLocaleDateString('ar-IQ', { day: 'numeric', month: 'short' });
    } catch (_) {
      return d.toLocaleDateString('ar', { day: 'numeric', month: 'short' });
    }
  }

  function createWishElement(wish, isNew = false) {
    const entry = document.createElement('blockquote');
    entry.className = isNew ? 'wish-entry is-newly-posted' : 'wish-entry';

    const p = document.createElement('p');
    p.className = 'wish-body';
    p.textContent = wish.message || '';

    const footer = document.createElement('footer');
    footer.className = 'wish-footer';

    const author = document.createElement('span');
    author.className = 'wish-author';
    author.textContent = wish.guest_name || 'ضيف كريم';

    const meta = document.createElement('span');
    meta.className = 'wish-meta';
    meta.textContent = isNew ? 'أُضيفت الآن' : formatArabicTime(wish.created_at);

    footer.appendChild(author);
    footer.appendChild(meta);
    entry.appendChild(p);
    entry.appendChild(footer);
    return entry;
  }

  function setFeedback(text, isError = false) {
    if (!feedbackEl) return;
    feedbackEl.textContent = text;
    feedbackEl.classList.toggle('is-error', isError);
    feedbackEl.classList.remove('hidden');
  }

  async function loadPublicWishes() {
    if (!blessingsGrid) return;
    try {
      const res = await fetch(`${WISHES_ENDPOINT}?select=id,guest_name,message,created_at&order=created_at.desc&limit=60`, {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Accept: 'application/json'
        }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();

      blessingsGrid.innerHTML = '';
      if (!Array.isArray(rows) || rows.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'wishes-empty-state';
        emptyMsg.textContent = 'كن أول من يترك كلمة تهنئة جميلة للباحثة ابتسام في سجل الدعوة.';
        blessingsGrid.appendChild(emptyMsg);
        return;
      }

      rows.forEach((wish) => {
        blessingsGrid.appendChild(createWishElement(wish, false));
      });
    } catch (_) {
      blessingsGrid.innerHTML = '';
      const errNote = document.createElement('p');
      errNote.className = 'wishes-empty-state';
      errNote.textContent = 'تعذر تحميل التهاني حالياً، يمكنك إضافة تهنئتك والمحاولة لاحقاً.';
      blessingsGrid.appendChild(errNote);
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = guestNameInput ? guestNameInput.value.trim() : '';
      const message = guestWishesInput ? guestWishesInput.value.trim() : '';
      if (!name || !message) return;

      const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
      const origLabel = btnSpan ? btnSpan.textContent : 'إرسال التهنئة';
      if (submitBtn) submitBtn.disabled = true;
      if (btnSpan) btnSpan.textContent = 'جاري الإرسال...';
      if (feedbackEl) feedbackEl.classList.add('hidden');

      try {
        const res = await fetch(WISHES_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_PUBLISHABLE_KEY,
            Prefer: 'return=representation'
          },
          body: JSON.stringify({ guest_name: name, message })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const inserted = await res.json();
        const savedRow = Array.isArray(inserted) && inserted[0]
          ? inserted[0]
          : { guest_name: name, message, created_at: new Date().toISOString() };

        audioEngine.playSoftChime();
        if (navigator.vibrate) {
          try { navigator.vibrate([12]); } catch (_) {}
        }

        if (blessingsGrid) {
          const emptyNotice = blessingsGrid.querySelector('.wishes-empty-state, .wishes-loading');
          if (emptyNotice) emptyNotice.remove();
          blessingsGrid.prepend(createWishElement(savedRow, true));
        }

        if (guestNameInput) guestNameInput.value = '';
        if (guestWishesInput) guestWishesInput.value = '';
        setFeedback('شكراً لك، تم تسجيل تهنئتك بنجاح في سجل الدعوة ✓', false);
      } catch (_) {
        setFeedback('حدث خطأ أثناء الإرسال، يرجى التأكد من الاتصال بالإنترنت والمحاولة مجدداً.', true);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnSpan) btnSpan.textContent = origLabel;
      }
    });
  }

  loadPublicWishes();
}

/* ==========================================================================
   9. SHARE TOOLS
   ========================================================================== */
function initShareTools(audioEngine) {
  const copyBtn = document.getElementById('copy-invitation-link');
  const copyLabel = document.getElementById('copy-link-label');
  const shareWaBtn = document.getElementById('share-whatsapp-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const shareUrl = window.location.href;
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (_) {
        const temp = document.createElement('input');
        temp.value = shareUrl;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }

      audioEngine.playSoftChime();
      if (copyLabel) {
        copyLabel.textContent = 'تم نسخ الرابط ✓';
        setTimeout(() => {
          copyLabel.textContent = 'نسخ الرابط';
        }, 2200);
      }
    });
  }

  if (shareWaBtn) {
    shareWaBtn.addEventListener('click', () => {
      const shareText =
        'دعوة لحضور مأدبة الغداء بمناسبة مناقشة رسالة الماجستير للباحثة ابتسام محمود صالح (التخصص الدقيق: إدارة الأعمال - كلية الإدارة والاقتصاد - جامعة الموصل)\n' +
        'يوم الأحد ٢٩ / ١١ / ٢٠٢٦ — الساعة ١:٠٠ مساءً في مطعم سراي، الموصل:\n' +
        window.location.href;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}
