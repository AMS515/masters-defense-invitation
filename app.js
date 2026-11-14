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
  initEnvelopeChoreography(audioEngine, tiltController);
  initOdometerCountdown();
  initRSVPAndWishes(audioEngine);
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
   2. WEB AUDIO SYNTHESIZER (Wax Crack, Heavy Paper Slide & Warm Chime)
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

  function playSealCrack() {
    if (isMuted) return;
    try {
      ensureContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(175, now);
      osc.frequency.exponentialRampToValueAtTime(52, now + 0.11);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
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

  return { playSealCrack, playPaperSlide, playSoftChime };
}

/* ==========================================================================
   3. SPRING 3D TILT & DYNAMIC SPECULAR FOIL SHEEN PHYSICS
   ========================================================================== */
function initTiltAndFoilPhysics() {
  const envelopeAssembly = document.getElementById('envelope-assembly');
  const envelopeAura = document.getElementById('envelope-aura');
  const tiltZone = document.getElementById('envelope-tilt-zone');
  const keepsakeCard = document.getElementById('keepsake-pass-card');

  let tiltEnabled = true;
  let targetRx = 0;
  let targetRy = 0;
  let currentRx = 0;
  let currentRy = 0;

  // Smooth RAF spring loop for tactile 3D tilt on sealed envelope
  function springLoop() {
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
    }
    requestAnimationFrame(springLoop);
  }
  requestAnimationFrame(springLoop);

  function updateFoilCoords(xPct, yPct) {
    document.documentElement.style.setProperty('--foil-x', `${xPct.toFixed(1)}%`);
    document.documentElement.style.setProperty('--foil-y', `${yPct.toFixed(1)}%`);
  }

  // Pointer & touch response across page
  function handlePointer(clientX, clientY) {
    const xPct = Math.max(0, Math.min(100, (clientX / window.innerWidth) * 100));
    const yPct = Math.max(0, Math.min(100, (clientY / window.innerHeight) * 100));
    updateFoilCoords(xPct, yPct);

    if (tiltEnabled && tiltZone) {
      const rect = tiltZone.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const relX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const relY = ((clientY - rect.top) / rect.height) * 2 - 1;
        const clampedX = Math.max(-1, Math.min(1, relX));
        const clampedY = Math.max(-1, Math.min(1, relY));
        targetRy = clampedX * 6.5;
        targetRx = -clampedY * 5.5;
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

  // Subtle mobile gyroscope foil & envelope response (when available without prompt)
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

  // Keepsake Guest Pass 3D tilt interaction
  if (keepsakeCard) {
    const updatePassTilt = (clientX, clientY) => {
      const rect = keepsakeCard.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const rx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ry = ((clientY - rect.top) / rect.height) * 2 - 1;
      keepsakeCard.style.transform = `rotateX(${(-ry * 5).toFixed(2)}deg) rotateY(${(rx * 5.5).toFixed(2)}deg)`;
      keepsakeCard.style.setProperty('--pass-foil-x', `${((rx + 1) * 50).toFixed(1)}%`);
      keepsakeCard.style.setProperty('--pass-foil-y', `${((ry + 1) * 50).toFixed(1)}%`);
    };

    keepsakeCard.addEventListener('pointermove', (e) => updatePassTilt(e.clientX, e.clientY), { passive: true });
    keepsakeCard.addEventListener('touchmove', (e) => {
      if (e.touches[0]) updatePassTilt(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    keepsakeCard.addEventListener('pointerleave', () => {
      keepsakeCard.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
      keepsakeCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      setTimeout(() => { keepsakeCard.style.transition = ''; }, 460);
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
      // Subtle foil drift as user reads down the paper
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
   5. CONTINUOUS ENVELOPE-TO-MANUSCRIPT FLIP CHOREOGRAPHY
   ========================================================================== */
function initEnvelopeChoreography(audioEngine, tiltController) {
  const sanctuary = document.getElementById('envelope-sanctuary');
  const assembly = document.getElementById('envelope-assembly');
  const openBtn = document.getElementById('open-trigger-btn');
  const replayBtn = document.getElementById('replay-envelope-btn');
  const royalInvitation = document.getElementById('royal-invitation');
  const manuscriptSheet = document.getElementById('manuscript-sheet');

  const sanctuaryHeader = document.getElementById('sanctuary-header');
  const sanctuaryPrompt = document.getElementById('sanctuary-prompt');
  const waxAuraRing = document.getElementById('wax-aura-ring');
  const waxWholeIdle = document.getElementById('wax-whole-idle');
  const waxCrackPath = document.getElementById('wax-crack-path');
  const waxHalfLeft = document.getElementById('wax-half-left');
  const waxHalfRight = document.getElementById('wax-half-right');
  const topFlapWrap = document.getElementById('env-top-flap-wrap');
  const topFlap = document.getElementById('env-top-flap');
  const envLetter = document.getElementById('env-letter');
  const envBack = document.getElementById('env-back');
  const envPocket = document.getElementById('env-pocket');
  const envAura = document.getElementById('envelope-aura');

  let isOpening = false;
  let activeAnimations = [];
  let timers = [];

  function clearAnimationsAndTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
    activeAnimations.forEach((anim) => {
      try {
        anim.cancel();
      } catch (_) {}
    });
    activeAnimations = [];
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

  function openEnvelope() {
    if (isOpening) return;
    isOpening = true;
    clearAnimationsAndTimers();
    tiltController.lockTilt();

    // Subtle mobile haptic confirmation on supported phones
    if (navigator.vibrate) {
      try { navigator.vibrate([10, 28, 8]); } catch (_) {}
    }

    // Fade header & understated cue gracefully
    if (waxAuraRing) waxAuraRing.style.opacity = '0';
    animateEl(sanctuaryPrompt, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], {
      duration: 240,
      easing: 'ease-out'
    });
    animateEl(sanctuaryHeader, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-10px)' }], {
      duration: 280,
      easing: 'ease-out'
    });

    // STAGE 1: Wax Seal Crack (0ms -> 220ms)
    audioEngine.playSealCrack();
    if (waxCrackPath) {
      waxCrackPath.style.opacity = '1';
      animateEl(
        waxCrackPath,
        [{ strokeDashoffset: 140 }, { strokeDashoffset: 0 }],
        { duration: 200, easing: 'ease-out' }
      );
    }

    // STAGE 2: Wax Seal Splits Cleanly Apart (190ms -> 550ms)
    schedule(() => {
      if (waxWholeIdle) waxWholeIdle.classList.add('hidden');
      if (waxHalfLeft) waxHalfLeft.classList.remove('is-hidden-split');
      if (waxHalfRight) waxHalfRight.classList.remove('is-hidden-split');
      if (waxCrackPath) waxCrackPath.style.opacity = '0';
      animateEl(
        waxHalfLeft,
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(-28px, 14px) rotate(-18deg)', opacity: 0 }
        ],
        { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      animateEl(
        waxHalfRight,
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(28px, 14px) rotate(18deg)', opacity: 0 }
        ],
        { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
    }, 190);

    // STAGE 3: 3D Top Flap Unfolds Backward (360ms -> 1040ms)
    // On short screens (< 660px), gently lower assembly slightly so flap never clips at top
    schedule(() => {
      audioEngine.playPaperSlide();
      if (window.innerHeight < 660 && assembly) {
        animateEl(
          assembly,
          [{ transform: 'translateY(0)' }, { transform: 'translateY(16%)' }],
          { duration: 540, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
        );
      }

      animateEl(
        topFlap,
        [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(180deg)' }],
        { duration: 680, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
      );
    }, 360);

    // Swap top-flap z-index at exact 90deg midpoint (700ms) so lining stays behind rising letter
    schedule(() => {
      if (topFlapWrap) topFlapWrap.style.zIndex = '1';
    }, 700);

    // STAGE 4: Letter Extraction & Envelope Descent (880ms -> 1480ms)
    schedule(() => {
      audioEngine.playSoftChime();

      animateEl(
        envLetter,
        [
          { transform: 'translateY(0) scale(1)' },
          { transform: 'translateY(-18%) scale(1.03)' }
        ],
        { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );

      const pocketSlide = [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(108%)', opacity: 0 }
      ];
      const slideOpts = { duration: 640, easing: 'cubic-bezier(0.32, 0, 0.2, 1)' };

      animateEl(envBack, pocketSlide, slideOpts);
      animateEl(envPocket, pocketSlide, slideOpts);
      animateEl(topFlapWrap, pocketSlide, slideOpts);
      animateEl(envAura, [{ opacity: 1 }, { opacity: 0 }], { duration: 480 });
    }, 880);

    // STAGE 5: Seamless Shared-Element FLIP Morph & Stationery Unfolding (1440ms)
    schedule(() => {
      const firstRect = envLetter ? envLetter.getBoundingClientRect() : null;

      window.scrollTo({ top: 0, behavior: 'auto' });
      document.body.classList.remove('is-locked');

      royalInvitation.classList.add('is-visible');
      royalInvitation.setAttribute('aria-hidden', 'false');

      const lastRect = manuscriptSheet ? manuscriptSheet.getBoundingClientRect() : null;

      // Dismiss Stage 1 on the exact same paint frame as Stage 2 FLIP invert
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
          { duration: 760, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        );

        schedule(() => {
          manuscriptSheet.classList.remove('is-creasing');
        }, 780);
      }

      triggerInitialManuscriptReveals();
    }, 1440);
  }

  function resetEnvelope() {
    clearAnimationsAndTimers();
    isOpening = false;

    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.add('is-locked');

    royalInvitation.classList.remove('is-visible');
    royalInvitation.setAttribute('aria-hidden', 'true');
    if (manuscriptSheet) manuscriptSheet.classList.remove('is-creasing');

    sanctuary.classList.remove('is-dismissed');

    if (replayBtn) replayBtn.classList.add('hidden');
    if (topFlapWrap) topFlapWrap.style.zIndex = '4';
    if (waxAuraRing) waxAuraRing.style.opacity = '1';
    if (waxWholeIdle) waxWholeIdle.classList.remove('hidden');
    if (waxHalfLeft) waxHalfLeft.classList.add('is-hidden-split');
    if (waxHalfRight) waxHalfRight.classList.add('is-hidden-split');
    if (waxCrackPath) waxCrackPath.style.opacity = '0';

    tiltController.unlockTilt();
  }

  if (assembly) {
    assembly.addEventListener('click', openEnvelope);
    assembly.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
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
   7. RSVP FORM, 3D KEEPSAKE PASS & OPTIMISTIC WISHES STREAM
   ========================================================================== */
function initRSVPAndWishes(audioEngine) {
  const form = document.getElementById('rsvp-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestCountSelect = document.getElementById('guest-count');
  const companionsWrap = document.getElementById('companions-field-wrap');
  const guestWishesInput = document.getElementById('guest-wishes');
  const whatsappBtn = document.getElementById('whatsapp-direct-btn');

  const passContainer = document.getElementById('vip-pass-container');
  const passName = document.getElementById('vip-guest-name');
  const passStatus = document.getElementById('vip-guest-status');
  const editBtn = document.getElementById('edit-rsvp-btn');
  const blessingsGrid = document.getElementById('blessings-grid');

  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  attendanceRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (companionsWrap) {
        companionsWrap.classList.toggle('hidden', radio.value === 'declined' && radio.checked);
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = guestNameInput ? guestNameInput.value.trim() : '';
      if (!name) return;

      const selectedRadio = document.querySelector('input[name="attendance"]:checked');
      const isAttending = !selectedRadio || selectedRadio.value === 'attending';
      const countText = guestCountSelect ? guestCountSelect.value : 'شخص واحد';
      const wishText = guestWishesInput ? guestWishesInput.value.trim() : '';

      audioEngine.playSoftChime();
      if (navigator.vibrate) {
        try { navigator.vibrate([12]); } catch (_) {}
      }

      if (passName) passName.textContent = name;
      if (passStatus) {
        passStatus.textContent = isAttending
          ? `مؤكد بإذن الله (${countText})`
          : 'معتذر عن الحضور';
      }

      form.classList.add('hidden');
      if (passContainer) {
        passContainer.classList.remove('hidden');
        if (passContainer.animate) {
          passContainer.animate(
            [
              { opacity: 0, transform: 'translateY(12px) scale(0.97)' },
              { opacity: 1, transform: 'translateY(0) scale(1)' }
            ],
            { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
          );
        }
      }

      if (wishText && blessingsGrid) {
        const entry = document.createElement('blockquote');
        entry.className = 'wish-entry is-newly-posted';

        const p = document.createElement('p');
        p.className = 'wish-body';
        p.textContent = wishText;

        const footer = document.createElement('footer');
        footer.className = 'wish-footer';

        const author = document.createElement('span');
        author.className = 'wish-author';
        author.textContent = name;

        const meta = document.createElement('span');
        meta.className = 'wish-meta';
        meta.textContent = 'أُضيفت الآن';

        footer.appendChild(author);
        footer.appendChild(meta);
        entry.appendChild(p);
        entry.appendChild(footer);

        blessingsGrid.prepend(entry);
      }
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      if (passContainer) passContainer.classList.add('hidden');
      if (form) form.classList.remove('hidden');
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const name = (guestNameInput && guestNameInput.value.trim()) || 'ضيف كريم';
      const selectedRadio = document.querySelector('input[name="attendance"]:checked');
      const isAttending = !selectedRadio || selectedRadio.value === 'attending';
      const countText = guestCountSelect ? guestCountSelect.value : 'شخص واحد';
      const wishText = guestWishesInput ? guestWishesInput.value.trim() : '';

      let msg = `السلام عليكم،\nمعكم ${name}.\n`;
      if (isAttending) {
        msg += `يسعدني تأكيد الحضور لمأدبة الغداء بمناسبة مناقشة الماجستير للباحثة ابتسام محمود صالح يوم الأحد 29 / 11 / 2026 (${countText}).`;
      } else {
        msg += `أعتذر عن عدم التمكن من الحضور، مع خالص التهاني والتمنيات للباحثة ابتسام محمود صالح بالتوفيق والنجاح.`;
      }
      if (wishText) {
        msg += `\n\nتهنئة: ${wishText}`;
      }

      const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
}

/* ==========================================================================
   8. SHARE TOOLS
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
        'دعوة لحضور مأدبة الغداء بمناسبة مناقشة رسالة الماجستير للباحثة ابتسام محمود صالح (تخصص أمن المعلومات - كلية الإدارة والاقتصاد - جامعة الموصل) يوم الأحد 29 / 11 / 2026:\n' +
        window.location.href;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}
