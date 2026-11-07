/**
 * ============================================================================
 * ROYAL INVITATION — SOFT BLUSH & ROSE GOLD INTERACTIVE ENGINE
 * Honoree: Researcher Ibtisam Mahmoud Saleh — University of Mosul
 * Featuring: Drifting Rose Petals, Ethereal Piano/Harp Chords, 3D Velvet Envelope
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. ETHEREAL PIANO & HARP SYNTHESIZER (Celebratory E-Flat Major Warm Chords)
  // ==========================================================================
  let audioCtx = null;
  let isMuted = false;

  function ensureAudioContext() {
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

  // Delicate Wax Seal Snap
  function playWaxCrackSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      // Brittle snap
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.13);

      // Warm velvet release thump
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now + 0.03);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      subGain.gain.setValueAtTime(0.28, now + 0.03);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);
      subOsc.start(now + 0.03);
      subOsc.stop(now + 0.19);
    } catch (e) {}
  }

  // Soft Cotton Paper Sliding
  function playPaperSlideSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const duration = 0.6;
      const bufferSize = Math.floor(audioCtx.sampleRate * duration);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.12;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.frequency.linearRampToValueAtTime(1200, now + duration * 0.7);
      filter.Q.value = 1.2;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Ethereal Piano & Harp Celebratory Arpeggio (Warm E-flat / A-flat harmony)
  function playEtherealChords() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      // Frequencies for Eb4, G4, Bb4, C5, Eb5, G5, Bb5 (Luminous Piano Harp)
      const freqs = [311.13, 392.00, 466.16, 523.25, 622.25, 783.99, 932.33];

      freqs.forEach((f, idx) => {
        const start = now + idx * 0.085;
        const osc = audioCtx.createOscillator();
        const overtone = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const overGain = audioCtx.createGain();

        osc.type = 'sine';
        overtone.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        overtone.frequency.setValueAtTime(f * 2, start);

        overGain.gain.value = 0.12;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0006, start + 2.1);

        osc.connect(gain);
        overtone.connect(overGain);
        overGain.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(start);
        overtone.start(start);
        osc.stop(start + 2.15);
        overtone.stop(start + 2.15);
      });
    } catch (e) {}
  }

  // Audio Toggle
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const iconVolOn = document.getElementById('icon-vol-on');
  const iconVolOff = document.getElementById('icon-vol-off');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ensureAudioContext();
      isMuted = !isMuted;
      if (isMuted) {
        iconVolOn.classList.add('hidden');
        iconVolOff.classList.remove('hidden');
        audioToggleBtn.style.opacity = '0.6';
      } else {
        iconVolOff.classList.add('hidden');
        iconVolOn.classList.remove('hidden');
        audioToggleBtn.style.opacity = '1';
        playEtherealChords();
      }
    });
  }


  // ==========================================================================
  // 2. DRIFTING ROSE PETALS & SILK WAVE CANVAS ENGINE
  // ==========================================================================
  const canvas = document.getElementById('silk-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let width = window.innerWidth;
  let height = window.innerHeight;

  const rosePetals = [];
  const diamondGlints = [];
  let pointerX = 0;
  let pointerY = 0;

  function resizeCanvas() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Draw an organic curved rose petal
  function drawRosePetal(c, x, y, size, angle, tilt, color, alpha) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.scale(1, Math.cos(tilt));
    c.globalAlpha = Math.max(0, Math.min(1, alpha));

    c.beginPath();
    // Heart-shaped organic petal
    c.moveTo(0, -size);
    c.bezierCurveTo(size * 0.9, -size * 0.8, size * 0.8, size * 0.7, 0, size);
    c.bezierCurveTo(-size * 0.8, size * 0.7, -size * 0.9, -size * 0.8, 0, -size);
    c.fillStyle = color;
    c.fill();

    // Subtle petal vein highlight
    c.beginPath();
    c.moveTo(0, -size * 0.8);
    c.quadraticCurveTo(size * 0.1, 0, 0, size * 0.7);
    c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    c.lineWidth = 0.8;
    c.stroke();

    c.restore();
  }

  function initAmbientPetals() {
    rosePetals.length = 0;
    diamondGlints.length = 0;

    // Drifting ambient petals (Whisper-soft pearl & silk blush)
    const petalPalette = ['#fbf2f0', '#f7e8e4', '#f3ded9', '#fcf7f5', '#eed6d0'];
    for (let i = 0; i < 18; i++) {
      rosePetals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.5 + Math.random() * 0.65,
        size: 8 + Math.random() * 7,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.02 + Math.random() * 0.03,
        color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
        alpha: 0.25 + Math.random() * 0.25,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.02
      });
    }

    // Sparkle glints
    for (let i = 0; i < 40; i++) {
      diamondGlints.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 2.0,
        speedY: -(0.1 + Math.random() * 0.22),
        alpha: 0.18 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // Spawn a celebratory flurry of soft pearl-blush petals
  function spawnRosePetalFlurry(normX, normY, count) {
    const originX = normX * width;
    const originY = normY * height;
    const petalPalette = ['#f7e6e2', '#f2dad5', '#e8c8c0', '#fbf3f1', '#dfc0b8'];

    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const speed = 4 + Math.random() * 8;
      rosePetals.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        size: 10 + Math.random() * 9,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.07,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.05 + Math.random() * 0.08,
        color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
        alpha: 0.68,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.03,
        isFlurry: true
      });
    }
  }

  window.addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / width - 0.5) * 20;
    pointerY = (e.clientY / height - 0.5) * 20;
  });

  function renderSilkLoop() {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);

      // 1. Diamond Sparkle Glints
      for (let i = 0; i < diamondGlints.length; i++) {
        const g = diamondGlints[i];
        g.y += g.speedY;
        g.phase += 0.03;
        if (g.y < -10) g.y = height + 10;

        const pulse = 0.5 + Math.sin(g.phase) * 0.5;
        const drawAlpha = g.alpha * pulse;

        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 125, 135, ${drawAlpha * 0.45})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${drawAlpha})`;
        ctx.fill();
      }

      // 2. Drifting & Falling Rose Petals
      for (let i = rosePetals.length - 1; i >= 0; i--) {
        const p = rosePetals[i];

        if (p.isFlurry) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // Gravity
          p.vx *= 0.985;
          p.alpha -= 0.005;

          if (p.alpha <= 0 || p.y > height + 50) {
            rosePetals.splice(i, 1);
            continue;
          }
        } else {
          p.swayPhase += p.swaySpeed;
          p.x += p.vx + Math.sin(p.swayPhase) * 0.7;
          p.y += p.vy;

          if (p.y > height + 30) p.y = -30;
          if (p.x < -30) p.x = width + 30;
          if (p.x > width + 30) p.x = -30;
        }

        p.angle += p.rotSpeed;
        p.tilt += p.tiltSpeed;

        drawRosePetal(ctx, p.x, p.y, p.size, p.angle, p.tilt, p.color, p.alpha);
      }
    }
    requestAnimationFrame(renderSilkLoop);
  }

  resizeCanvas();
  initAmbientPetals();
  renderSilkLoop();
  window.addEventListener('resize', resizeCanvas);


  // ==========================================================================
  // 3. PRECISION 3D ENVELOPE CHOREOGRAPHY (WEB ANIMATIONS API)
  // ==========================================================================
  const sanctuary = document.getElementById('envelope-sanctuary');
  const sanctuaryHeader = document.getElementById('sanctuary-header');
  const sanctuaryPrompt = document.getElementById('sanctuary-prompt');
  const envelopeTiltZone = document.getElementById('envelope-tilt-zone');
  const envelopeAssembly = document.getElementById('envelope-assembly');
  const envelopeAura = document.getElementById('envelope-aura');
  const envBack = document.getElementById('env-back');
  const envPocket = document.getElementById('env-pocket');
  const topFlapWrap = document.getElementById('env-top-flap-wrap');
  const topFlap3d = document.getElementById('env-top-flap');
  const envLetter = document.getElementById('env-letter');
  const waxAuraRing = document.getElementById('wax-aura-ring');
  const waxHalfLeft = document.getElementById('wax-half-left');
  const waxHalfRight = document.getElementById('wax-half-right');
  const waxCrackPath = document.getElementById('wax-crack-path');
  const royalInvitation = document.getElementById('royal-invitation');
  const manuscriptSheet = document.getElementById('manuscript-sheet');
  const replayBtn = document.getElementById('replay-envelope-btn');
  const openTriggerBtn = document.getElementById('open-trigger-btn');

  let isOpeningOrOpen = false;
  let activeAnimations = [];
  let activeTimeouts = [];

  function clearChoreography() {
    activeTimeouts.forEach((id) => clearTimeout(id));
    activeTimeouts = [];
    activeAnimations.forEach((anim) => {
      try { anim.cancel(); } catch (e) {}
    });
    activeAnimations = [];
  }

  function animateEl(el, keyframes, options) {
    if (!el || !el.animate) return null;
    const anim = el.animate(keyframes, {
      fill: 'forwards',
      ...options
    });
    activeAnimations.push(anim);
    return anim;
  }

  function scheduleStep(fn, delayMs) {
    const id = setTimeout(fn, delayMs);
    activeTimeouts.push(id);
  }

  // Interactive 3D Tilt on Closed Envelope
  if (envelopeTiltZone && envelopeAssembly) {
    envelopeTiltZone.addEventListener('pointermove', (e) => {
      if (isOpeningOrOpen) return;
      const rect = envelopeAssembly.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));

      envelopeAssembly.style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 8}deg)`;
    });

    envelopeTiltZone.addEventListener('pointerleave', () => {
      if (isOpeningOrOpen) return;
      envelopeAssembly.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // Master Envelope Opening Sequence
  function triggerEnvelopeOpen() {
    if (isOpeningOrOpen) return;
    isOpeningOrOpen = true;
    clearChoreography();
    ensureAudioContext();

    // Reset tilt smoothly
    envelopeAssembly.style.transition = 'transform 0.3s ease';
    envelopeAssembly.style.transform = 'rotateY(0deg) rotateX(0deg)';

    // Hide header and touch prompt
    animateEl(sanctuaryHeader, [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-14px)' }
    ], { duration: 380, easing: 'ease-in-out' });

    animateEl(sanctuaryPrompt, [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(14px)' }
    ], { duration: 340, easing: 'ease-in-out' });

    // PHASE 1 (100ms -> 680ms): Wax Seal Fracture & Two-Piece Split
    scheduleStep(() => {
      playWaxCrackSound();

      animateEl(waxCrackPath, [
        { strokeDashoffset: 140, opacity: 1 },
        { strokeDashoffset: 0, opacity: 1 }
      ], { duration: 240, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

      animateEl(waxAuraRing, [
        { opacity: 0.9, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.4)' }
      ], { duration: 300, easing: 'ease-out' });
    }, 100);

    scheduleStep(() => {
      // Petals and spark flurry
      spawnRosePetalFlurry(0.5, 0.54, 25);

      animateEl(waxCrackPath, [
        { opacity: 1 },
        { opacity: 0 }
      ], { duration: 140, easing: 'ease-out' });

      // Left half splits & falls
      animateEl(waxHalfLeft, [
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'translate(-12px, -4px) rotate(-8deg) scale(1.03)', opacity: 1, offset: 0.25 },
        { transform: 'translate(-42px, 46px) rotate(-24deg) scale(0.8)', opacity: 0 }
      ], { duration: 420, easing: 'cubic-bezier(0.32, 0, 0.67, 0)' });

      // Right half splits & falls
      animateEl(waxHalfRight, [
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'translate(12px, -4px) rotate(8deg) scale(1.03)', opacity: 1, offset: 0.25 },
        { transform: 'translate(42px, 46px) rotate(24deg) scale(0.8)', opacity: 0 }
      ], { duration: 420, easing: 'cubic-bezier(0.32, 0, 0.67, 0)' });
    }, 320);

    // PHASE 2 (650ms -> 1570ms): 3D Top Flap Unfolding
    scheduleStep(() => {
      playPaperSlideSound();

      animateEl(topFlap3d, [
        { transform: 'rotateX(0deg)' },
        { transform: 'rotateX(180deg)' }
      ], { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
    }, 650);

    // Z-index handoff at 90deg midpoint
    scheduleStep(() => {
      topFlapWrap.style.zIndex = '1';
    }, 1100);

    // PHASE 3 (1500ms -> 2720ms): Pocket glides down, card glides up
    scheduleStep(() => {
      playPaperSlideSound();

      animateEl(envLetter, [
        { transform: 'translateY(0%) scale(1)' },
        { transform: 'translateY(-22%) scale(1.05)' }
      ], { duration: 1180, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });

      const envParts = [envBack, envPocket, topFlapWrap, envelopeAura];
      envParts.forEach((part) => {
        animateEl(part, [
          { transform: 'translateY(0%) scale(1)', opacity: 1 },
          { transform: 'translateY(70%) scale(0.96)', opacity: 1, offset: 0.6 },
          { transform: 'translateY(120%) scale(0.90)', opacity: 0 }
        ], { duration: 1200, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });
      });
    }, 1500);

    // PHASE 4 (2700ms): Ethereal Chords, Rose Flurry & Unfurl
    scheduleStep(() => {
      playEtherealChords();
      spawnRosePetalFlurry(0.2, 0.45, 30);
      spawnRosePetalFlurry(0.8, 0.45, 30);

      animateEl(envLetter, [
        { transform: 'translateY(-22%) scale(1.05)', opacity: 1 },
        { transform: 'translateY(-8%) scale(1.24)', opacity: 0 }
      ], { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

      document.body.classList.remove('is-locked');
      royalInvitation.classList.add('is-active');
      royalInvitation.setAttribute('aria-hidden', 'false');
      sanctuary.classList.add('hidden');
      replayBtn.classList.remove('hidden');

      animateEl(manuscriptSheet, [
        { opacity: 0, transform: 'translateY(40px) scale(0.96)' },
        { opacity: 1, transform: 'translateY(0px) scale(1)' }
      ], { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });

      const sections = document.querySelectorAll('.reveal-section');
      sections.forEach((sec, idx) => {
        animateEl(sec, [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0px)' }
        ], {
          duration: 650,
          delay: 100 + idx * 95,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
        });
      });
    }, 2700);
  }

  // Trigger Listeners
  if (envelopeAssembly) {
    envelopeAssembly.addEventListener('click', triggerEnvelopeOpen);
    envelopeAssembly.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerEnvelopeOpen();
      }
    });
  }
  if (openTriggerBtn) {
    openTriggerBtn.addEventListener('click', triggerEnvelopeOpen);
  }

  // Replay Button
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        clearChoreography();
        royalInvitation.classList.remove('is-active');
        royalInvitation.setAttribute('aria-hidden', 'true');
        replayBtn.classList.add('hidden');
        sanctuary.classList.remove('hidden');
        document.body.classList.add('is-locked');

        topFlapWrap.style.zIndex = '4';
        envLetter.style.zIndex = '2';
        envPocket.style.zIndex = '3';
        envBack.style.zIndex = '1';
        envelopeAssembly.style.transform = 'rotateY(0deg) rotateX(0deg)';

        isOpeningOrOpen = false;
      }, 250);
    });
  }


  // ==========================================================================
  // 4. COUNTDOWN TIMER (Target: 29 November 2026)
  // ==========================================================================
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  const ringDays = document.getElementById('ring-days');
  const ringHours = document.getElementById('ring-hours');
  const ringMinutes = document.getElementById('ring-minutes');
  const ringSeconds = document.getElementById('ring-seconds');

  const CIRCUMFERENCE = 2 * Math.PI * 52;
  const targetTimestamp = new Date('2026-11-29T13:00:00+03:00').getTime();

  function setRingProgress(circleEl, fraction) {
    if (!circleEl) return;
    const clamped = Math.max(0, Math.min(1, fraction));
    circleEl.style.strokeDashoffset = CIRCUMFERENCE - clamped * CIRCUMFERENCE;
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetTimestamp - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');

    setRingProgress(ringDays, Math.min(1, days / 30));
    setRingProgress(ringHours, hours / 24);
    setRingProgress(ringMinutes, minutes / 60);
    setRingProgress(ringSeconds, seconds / 60);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ==========================================================================
  // 5. RSVP & VIP PASS GENERATOR & BLESSINGS WALL
  // ==========================================================================
  const rsvpForm = document.getElementById('rsvp-form');
  const companionsFieldWrap = document.getElementById('companions-field-wrap');
  const vipPassContainer = document.getElementById('vip-pass-container');
  const vipGuestName = document.getElementById('vip-guest-name');
  const vipGuestStatus = document.getElementById('vip-guest-status');
  const editRsvpBtn = document.getElementById('edit-rsvp-btn');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');
  const blessingsGrid = document.getElementById('blessings-grid');

  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  attendanceRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'declined' && radio.checked) {
        companionsFieldWrap.style.display = 'none';
      } else {
        companionsFieldWrap.style.display = 'flex';
      }
    });
  });

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function prependBlessingCard(author, text, timeLabel) {
    if (!blessingsGrid) return;
    const card = document.createElement('div');
    card.className = 'blessing-parchment';
    card.innerHTML = `
      <div class="blessing-quote-mark">❝</div>
      <p class="blessing-body">${escapeHTML(text)}</p>
      <div class="blessing-meta">
        <span class="blessing-author">${escapeHTML(author)}</span>
        <span class="blessing-time">${escapeHTML(timeLabel || 'الآن')}</span>
      </div>
    `;
    blessingsGrid.prepend(card);
  }

  try {
    const savedBlessings = JSON.parse(localStorage.getItem('ibtisam_rose_blessings') || '[]');
    savedBlessings.forEach((item) => {
      prependBlessingCard(item.author, item.text, item.time);
    });
  } catch (e) {}

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('guest-name').value.trim();
      if (!nameVal) return;

      const attChecked = document.querySelector('input[name="attendance"]:checked');
      const isAttending = attChecked ? attChecked.value === 'attending' : true;
      const countVal = document.getElementById('guest-count').value;
      const wishesVal = document.getElementById('guest-wishes').value.trim();

      ensureAudioContext();
      playEtherealChords();
      spawnRosePetalFlurry(0.5, 0.7, 40);

      vipGuestName.textContent = nameVal;
      vipGuestStatus.textContent = isAttending
        ? `يشرفنا حضوركم الكريم (${countVal})`
        : 'معتذر بكل محبة وتقدير';

      rsvpForm.classList.add('hidden');
      vipPassContainer.classList.remove('hidden');

      if (wishesVal) {
        prependBlessingCard(nameVal, wishesVal, 'مؤخراً');
        try {
          const current = JSON.parse(localStorage.getItem('ibtisam_rose_blessings') || '[]');
          current.push({ author: nameVal, text: wishesVal, time: '٢٠٢٦' });
          localStorage.setItem('ibtisam_rose_blessings', JSON.stringify(current));
        } catch (err) {}
      }
    });
  }

  if (editRsvpBtn) {
    editRsvpBtn.addEventListener('click', () => {
      vipPassContainer.classList.add('hidden');
      rsvpForm.classList.remove('hidden');
    });
  }

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const nameVal = document.getElementById('guest-name').value.trim() || 'ضيف كريم';
      const attChecked = document.querySelector('input[name="attendance"]:checked');
      const isAttending = attChecked ? attChecked.value === 'attending' : true;
      const countVal = document.getElementById('guest-count').value;
      const wishesVal = document.getElementById('guest-wishes').value.trim();

      const statusLine = isAttending
        ? `يشرفني الحضور بكل سرور (${countVal})`
        : 'أعتذر بكل محبة لظرف طارئ';

      let msg = `✨ *بطاقة تأكيد حضور — مأدبة تتويج الباحثة ابتسام محمود صالح* ✨\n\n`;
      msg += `• *الاسم الكريم:* ${nameVal}\n`;
      msg += `• *حالة الحضور:* ${statusLine}\n`;
      msg += `• *الموعد:* الأحد ٢٩ تشرين الثاني ٢٠٢٦\n`;
      if (wishesVal) {
        msg += `\n💌 *كلمة التهنئة:*\n"${wishesVal}"\n`;
      }
      msg += `\nألف مبارك نيل درجة الماجستير ومنها للأعلى بإذن الله.`;

      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }


  // ==========================================================================
  // 6. SHARE INVITATION ACTIONS
  // ==========================================================================
  const copyLinkBtn = document.getElementById('copy-invitation-link');
  const copyLinkLabel = document.getElementById('copy-link-label');
  const shareWhatsappBtn = document.getElementById('share-whatsapp-btn');

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const orig = copyLinkLabel.textContent;
        copyLinkLabel.textContent = 'تم نسخ الرابط بنجاح ✓';
        setTimeout(() => {
          copyLinkLabel.textContent = orig;
        }, 2500);
      }).catch(() => {
        prompt('انسخ رابط الدعوة:', url);
      });
    });
  }

  if (shareWhatsappBtn) {
    shareWhatsappBtn.addEventListener('click', () => {
      const url = window.location.href;
      const text = `🌸 *دعوة لحضور مأدبة غداء تكريمية* 🌸\n\nبمناسبة نيل الباحثة *ابتسام محمود صالح* درجة الماجستير في إدارة الأعمال (تخصص أمن المعلومات) — جامعة الموصل.\n\n📅 *الأحد ٢٩ / ١١ / ٢٠٢٦*\n\nيسعدنا ويشرفنا فتح بطاقة الدعوة التفاعلية من هنا:\n${url}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

});
