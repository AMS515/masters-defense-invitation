/**
 * ============================================================================
 * ROYAL MASTER'S DEFENSE & BANQUET INVITATION — NATIVE 60FPS ENGINE
 * Honoree: Researcher Ibtisam Mahmoud Saleh — University of Mosul
 * Zero External Dependencies (100% CSP-Safe, Offline-Ready & Hardware Accelerated)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. WEB AUDIO SYNTHESIZER (Wax Fracture, Cotton Paper & Royal Maqam Harp)
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

  function playWaxCrackSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      // Crisp brittle wax snap
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(68, now + 0.14);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Deep physical seal release thud
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(165, now + 0.04);
      subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.22);

      subGain.gain.setValueAtTime(0.36, now + 0.04);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);
      subOsc.start(now + 0.04);
      subOsc.stop(now + 0.23);
    } catch (e) {
      // Ignore audio errors on restricted devices
    }
  }

  function playPaperSlideSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const duration = 0.65;
      const bufferSize = Math.floor(audioCtx.sampleRate * duration);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.15;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(620, now);
      filter.frequency.linearRampToValueAtTime(1150, now + duration * 0.65);
      filter.Q.value = 1.3;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    } catch (e) {
      // Ignore audio errors
    }
  }

  function playRoyalFanfare() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99];

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.09;
        const osc = audioCtx.createOscillator();
        const harmonic = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const harmGain = audioCtx.createGain();

        osc.type = 'sine';
        harmonic.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        harmonic.frequency.setValueAtTime(freq * 2, start);

        harmGain.gain.value = 0.14;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.14, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 1.85);

        osc.connect(gain);
        harmonic.connect(harmGain);
        harmGain.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(start);
        harmonic.start(start);
        osc.stop(start + 1.9);
        harmonic.stop(start + 1.9);
      });
    } catch (e) {
      // Ignore audio errors
    }
  }

  // Audio Toggle Button
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
        audioToggleBtn.style.opacity = '0.65';
      } else {
        iconVolOff.classList.add('hidden');
        iconVolOn.classList.remove('hidden');
        audioToggleBtn.style.opacity = '1';
        playRoyalFanfare();
      }
    });
  }


  // ==========================================================================
  // 2. NATIVE 60FPS CELESTIAL BOKEH & 3D GOLD-LEAF CONFETTI ENGINE
  // ==========================================================================
  const canvas = document.getElementById('celestial-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let width = window.innerWidth;
  let height = window.innerHeight;

  const dustMotes = [];
  const confettiPieces = [];
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

  function initDustMotes() {
    dustMotes.length = 0;
    const count = 85;
    for (let i = 0; i < count; i++) {
      dustMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.2 + Math.random() * 0.8, // Depth factor for 3D parallax
        radius: 1.0 + Math.random() * 2.8,
        speedY: -(0.15 + Math.random() * 0.35),
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.008 + Math.random() * 0.015,
        alpha: 0.2 + Math.random() * 0.55
      });
    }
  }

  // Spawn 3D Tumbling Gold-Leaf & Crimson Confetti
  function spawnGoldConfetti(normX, normY, count) {
    const originX = normX * width;
    const originY = normY * height;
    const palette = ['#d4af37', '#fae596', '#fff3be', '#aa8222', '#80111d', '#b88a28'];

    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const speed = 4 + Math.random() * 9;
      confettiPieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.16,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.08 + Math.random() * 0.14,
        opacity: 1,
        decay: 0.006 + Math.random() * 0.006
      });
    }
  }

  window.addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / width - 0.5) * 24;
    pointerY = (e.clientY / height - 0.5) * 24;
  });

  function renderCelestialLoop() {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);

      // 1. Render 3D Parallax Golden Bokeh Motes
      for (let i = 0; i < dustMotes.length; i++) {
        const m = dustMotes[i];
        m.y += m.speedY * m.z;
        m.driftPhase += m.driftSpeed;
        const dx = Math.sin(m.driftPhase) * 0.4;
        m.x += dx;

        if (m.y < -20) m.y = height + 20;
        if (m.x < -20) m.x = width + 20;
        if (m.x > width + 20) m.x = -20;

        const drawX = m.x - pointerX * m.z;
        const drawY = m.y - pointerY * m.z;

        const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, m.radius * 3.2);
        grad.addColorStop(0, `rgba(255, 243, 190, ${m.alpha})`);
        grad.addColorStop(0.45, `rgba(212, 175, 55, ${m.alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, m.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render 3D Tumbling Gold-Leaf Confetti
      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // Gravity
        p.vx *= 0.985; // Air drag
        p.rotation += p.rotSpeed;
        p.tilt += p.tiltSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > height + 40) {
          confettiPieces.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const scaleY = Math.cos(p.tilt);
        ctx.scale(1, scaleY);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
    requestAnimationFrame(renderCelestialLoop);
  }

  resizeCanvas();
  initDustMotes();
  renderCelestialLoop();
  window.addEventListener('resize', resizeCanvas);


  // ==========================================================================
  // 3. PRECISION 3D ENVELOPE CHOREOGRAPHY (WEB ANIMATIONS API + RAF)
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

      envelopeAssembly.style.transform = `rotateY(${dx * 11}deg) rotateX(${-dy * 9}deg)`;
    });

    envelopeTiltZone.addEventListener('pointerleave', () => {
      if (isOpeningOrOpen) return;
      envelopeAssembly.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // Master Envelope Opening Choreography
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
      { opacity: 0, transform: 'translateY(-16px)' }
    ], { duration: 400, easing: 'ease-in-out' });

    animateEl(sanctuaryPrompt, [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(16px)' }
    ], { duration: 350, easing: 'ease-in-out' });

    // ========================================================================
    // PHASE 1 (100ms -> 680ms): WAX SEAL FRACTURE & TWO-PIECE PHYSICAL SPLIT
    // ========================================================================
    scheduleStep(() => {
      playWaxCrackSound();

      // 1a. Draw glowing golden fracture crack line across the wax seal
      animateEl(waxCrackPath, [
        { strokeDashoffset: 140, opacity: 1 },
        { strokeDashoffset: 0, opacity: 1 }
      ], { duration: 240, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

      animateEl(waxAuraRing, [
        { opacity: 0.9, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.5)' }
      ], { duration: 320, easing: 'ease-out' });
    }, 100);

    scheduleStep(() => {
      // Burst of golden wax sparks right at the seal
      spawnGoldConfetti(0.5, 0.54, 32);

      // Fade out crack line as the two wax halves physically split apart
      animateEl(waxCrackPath, [
        { opacity: 1 },
        { opacity: 0 }
      ], { duration: 150, easing: 'ease-out' });

      // Left half of wax seal splits left & falls
      animateEl(waxHalfLeft, [
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'translate(-14px, -4px) rotate(-10deg) scale(1.04)', opacity: 1, offset: 0.25 },
        { transform: 'translate(-44px, 48px) rotate(-28deg) scale(0.8)', opacity: 0 }
      ], { duration: 440, easing: 'cubic-bezier(0.32, 0, 0.67, 0)' });

      // Right half of wax seal splits right & falls
      animateEl(waxHalfRight, [
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'translate(14px, -4px) rotate(10deg) scale(1.04)', opacity: 1, offset: 0.25 },
        { transform: 'translate(44px, 48px) rotate(28deg) scale(0.8)', opacity: 0 }
      ], { duration: 440, easing: 'cubic-bezier(0.32, 0, 0.67, 0)' });
    }, 320);

    // ========================================================================
    // PHASE 2 (650ms -> 1570ms): 3D TOP FLAP UNFOLDING (0deg -> 180deg)
    // ========================================================================
    scheduleStep(() => {
      playPaperSlideSound();

      animateEl(topFlap3d, [
        { transform: 'rotateX(0deg)' },
        { transform: 'rotateX(180deg)' }
      ], { duration: 920, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
    }, 650);

    // CRITICAL Z-INDEX HANDOFF AT EXACT 90-DEGREE MIDPOINT (650 + 460 = 1110ms):
    // When top flap is perpendicular (90deg), move it to z-index: 1 (behind letter z-index: 2).
    // Meanwhile, front pocket (.env-layer-pocket) stays at z-index: 3 (in front of letter z-index: 2)!
    scheduleStep(() => {
      topFlapWrap.style.zIndex = '1';
    }, 1110);

    // ========================================================================
    // PHASE 3 (1500ms -> 2750ms): PHYSICAL EXTRACTION
    // Envelope pocket (z-index: 3) slides DOWN off the bottom of the letter
    // while the letter (z-index: 2) rises into the center of the viewport!
    // ZERO z-index swap between letter and pocket = ZERO floating paper bug!
    // ========================================================================
    scheduleStep(() => {
      playPaperSlideSound();

      // Letter rises gently into center of screen
      animateEl(envLetter, [
        { transform: 'translateY(0%) scale(1)' },
        { transform: 'translateY(-24%) scale(1.06)' }
      ], { duration: 1200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });

      // Envelope Back, Pocket, Opened Flap, and Aura slide DOWN off the bottom of the letter!
      const envParts = [envBack, envPocket, topFlapWrap, envelopeAura];
      envParts.forEach((part) => {
        animateEl(part, [
          { transform: 'translateY(0%) scale(1)', opacity: 1 },
          { transform: 'translateY(75%) scale(0.96)', opacity: 1, offset: 0.62 },
          { transform: 'translateY(122%) scale(0.90)', opacity: 0 }
        ], { duration: 1220, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });
      });
    }, 1500);

    // ========================================================================
    // PHASE 4 (2720ms -> 3650ms): UNFURLING INTO THE ILLUMINATED MANUSCRIPT
    // ========================================================================
    scheduleStep(() => {
      playRoyalFanfare();
      spawnGoldConfetti(0.18, 0.55, 45);
      spawnGoldConfetti(0.82, 0.55, 45);

      // Letter expands and fades into the full manuscript sheet
      animateEl(envLetter, [
        { transform: 'translateY(-24%) scale(1.06)', opacity: 1 },
        { transform: 'translateY(-10%) scale(1.28)', opacity: 0 }
      ], { duration: 520, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

      // Reveal Act II: The Illuminated Manuscript
      document.body.classList.remove('is-locked');
      royalInvitation.classList.add('is-active');
      royalInvitation.setAttribute('aria-hidden', 'false');
      sanctuary.classList.add('hidden');
      replayBtn.classList.remove('hidden');

      animateEl(manuscriptSheet, [
        { opacity: 0, transform: 'translateY(45px) scale(0.95)' },
        { opacity: 1, transform: 'translateY(0px) scale(1)' }
      ], { duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });

      const sections = document.querySelectorAll('.reveal-section');
      sections.forEach((sec, idx) => {
        animateEl(sec, [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0px)' }
        ], {
          duration: 700,
          delay: 120 + idx * 110,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
        });
      });
    }, 2720);
  }

  // Trigger listeners
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

  // Replay / Re-close Envelope Button
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
  // 4. CELESTIAL ASTROLABE COUNTDOWN (Target: 29 November 2026)
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

  function updateAstrolabeCountdown() {
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

  updateAstrolabeCountdown();
  setInterval(updateAstrolabeCountdown, 1000);


  // ==========================================================================
  // 5. ROYAL GUESTBOOK, VIP PASS GENERATOR & BLESSINGS WALL
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
    const savedBlessings = JSON.parse(localStorage.getItem('ibtisam_royal_blessings') || '[]');
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
      playRoyalFanfare();
      spawnGoldConfetti(0.5, 0.7, 55);

      vipGuestName.textContent = nameVal;
      vipGuestStatus.textContent = isAttending
        ? `مؤكد بإذن الله (${countVal})`
        : 'معتذر مع خالص التبريكات';

      rsvpForm.classList.add('hidden');
      vipPassContainer.classList.remove('hidden');

      if (wishesVal) {
        prependBlessingCard(nameVal, wishesVal, 'مؤخراً');
        try {
          const current = JSON.parse(localStorage.getItem('ibtisam_royal_blessings') || '[]');
          current.push({ author: nameVal, text: wishesVal, time: '٢٠٢٦' });
          localStorage.setItem('ibtisam_royal_blessings', JSON.stringify(current));
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
        ? `أتشرف بالحضور والمشاركة (${countVal})`
        : 'أعتذر لظرف خاص مع خالص التهاني والتبريكات';

      let msg = `✨ *بطاقة تأكيد تشريف — مأدبة تتويج الباحثة ابتسام محمود صالح* ✨\n\n`;
      msg += `• *الاسم الكريم:* ${nameVal}\n`;
      msg += `• *حالة الحضور:* ${statusLine}\n`;
      msg += `• *الموعد:* الأحد ٢٩ تشرين الثاني ٢٠٢٦\n`;
      if (wishesVal) {
        msg += `\n💌 *كلمة التهنئة:*\n"${wishesVal}"\n`;
      }
      msg += `\nمبارك نيل درجة الماجستير في أمن المعلومات ومنها للأعلى بإذن الله.`;

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
      const text = `👑 *دعوة ملكية خاصة* 👑\n\nنتشرف بدعوتكم لحضور *مأدبة الغداء التكريمية* بمناسبة نيل الباحثة *ابتسام محمود صالح* درجة الماجستير في إدارة الأعمال (تخصص أمن المعلومات) — جامعة الموصل.\n\n📅 *الأحد ٢٩ / ١١ / ٢٠٢٦*\n\nتفضلوا بفتح ظرف الدعوة التفاعلي من هنا:\n${url}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

});
