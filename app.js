/**
 * ============================================================================
 * MASTER'S DEFENSE CELEBRATORY LUNCHEON — INTERACTIVE ENGINE
 * Researcher: Ibtisam Mahmoud Saleh | University of Mosul
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  const audioEngine = initSynthesizedAudio();
  initScrollReveal();
  initEnvelopeChoreography(audioEngine);
  initCountdownTimer();
  initRSVPAndWishes(audioEngine);
  initShareTools(audioEngine);
});

/* ==========================================================================
   1. CALM ACADEMIC AMBIENT CANVAS (Subtle Floating Gold Dust & Warm Bokeh)
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

  const count = Math.min(28, Math.floor((width * height) / 28000));
  const particles = [];

  const colors = [
    'rgba(198, 166, 107, 0.22)', // Soft academic gold
    'rgba(181, 148, 86, 0.16)',  // Antique champagne
    'rgba(224, 182, 188, 0.14)', // Very faint warm blush hint
    'rgba(30, 41, 59, 0.06)'     // Subtle slate mote
  ];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -Math.random() * 0.28 - 0.08,
      alpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      color: colors[i % colors.length]
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.015;

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
   2. WEB AUDIO SYNTHESIZER (Gentle Chime & Paper Rustle)
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
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.12);

      gain.gain.setValueAtTime(0.16, now);
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
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

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
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.08 + 1.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.15);
      });
    } catch (_) {}
  }

  return { playSealCrack, playPaperSlide, playSoftChime };
}

/* ==========================================================================
   3. SMART SCROLL-REVEAL TRANSITIONS FOR MOBILE
   ========================================================================== */
let revealObserver = null;

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.scroll-reveal');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-inview'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

function triggerInitialReveals() {
  const revealEls = document.querySelectorAll('.scroll-reveal');
  revealEls.forEach((el, idx) => {
    if (idx < 3) {
      setTimeout(() => {
        el.classList.add('is-inview');
      }, idx * 110);
    }
  });
}

/* ==========================================================================
   4. DETERMINISTIC 5-LAYER ENVELOPE CHOREOGRAPHY
   ========================================================================== */
function initEnvelopeChoreography(audioEngine) {
  const sanctuary = document.getElementById('envelope-sanctuary');
  const assembly = document.getElementById('envelope-assembly');
  const openBtn = document.getElementById('open-trigger-btn');
  const replayBtn = document.getElementById('replay-envelope-btn');
  const royalInvitation = document.getElementById('royal-invitation');
  const manuscriptSheet = document.getElementById('manuscript-sheet');

  const sanctuaryHeader = document.getElementById('sanctuary-header');
  const sanctuaryPrompt = document.getElementById('sanctuary-prompt');
  const waxAuraRing = document.getElementById('wax-aura-ring');
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

  function clearAnimations() {
    activeAnimations.forEach((anim) => {
      try {
        anim.cancel();
      } catch (_) {}
    });
    activeAnimations = [];
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
    clearAnimations();

    // Hide prompt & header smoothly
    if (waxAuraRing) waxAuraRing.style.opacity = '0';
    animateEl(sanctuaryPrompt, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(10px)' }], {
      duration: 280,
      easing: 'ease-out'
    });
    animateEl(sanctuaryHeader, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-10px)' }], {
      duration: 320,
      easing: 'ease-out'
    });

    // STAGE 1: Seal fracture (0ms -> 240ms)
    audioEngine.playSealCrack();
    if (waxCrackPath) {
      waxCrackPath.style.opacity = '1';
      animateEl(
        waxCrackPath,
        [{ strokeDashoffset: 140 }, { strokeDashoffset: 0 }],
        { duration: 220, easing: 'ease-out' }
      );
    }

    // STAGE 2: Split wax seal halves (200ms -> 580ms)
    setTimeout(() => {
      if (waxCrackPath) waxCrackPath.style.opacity = '0';
      animateEl(
        waxHalfLeft,
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(-26px, 14px) rotate(-18deg)', opacity: 0 }
        ],
        { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      animateEl(
        waxHalfRight,
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(26px, 14px) rotate(18deg)', opacity: 0 }
        ],
        { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
    }, 200);

    // STAGE 3: Open 3D Top Flap (420ms -> 1120ms)
    // Switch z-index from 4 to 1 at exact 90deg midpoint (770ms)
    setTimeout(() => {
      audioEngine.playPaperSlide();
      animateEl(
        topFlap,
        [
          { transform: 'rotateX(0deg)' },
          { transform: 'rotateX(180deg)' }
        ],
        { duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
      );
    }, 420);

    setTimeout(() => {
      if (topFlapWrap) topFlapWrap.style.zIndex = '1';
    }, 770);

    // STAGE 4: Letter rises gently while envelope pocket slides downward (1020ms -> 1780ms)
    setTimeout(() => {
      audioEngine.playSoftChime();

      animateEl(
        envLetter,
        [
          { transform: 'translateY(0) scale(1)' },
          { transform: 'translateY(-18%) scale(1.03)' }
        ],
        { duration: 720, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );

      const pocketSlide = [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(108%)', opacity: 0 }
      ];
      const slideOpts = { duration: 740, easing: 'cubic-bezier(0.32, 0, 0.2, 1)' };

      animateEl(envBack, pocketSlide, slideOpts);
      animateEl(envPocket, pocketSlide, slideOpts);
      animateEl(topFlapWrap, pocketSlide, slideOpts);
      animateEl(envAura, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 });
    }, 1020);

    // STAGE 5: Morph into full mobile-optimized academic invitation card (1650ms)
    setTimeout(() => {
      document.body.classList.remove('is-locked');
      sanctuary.classList.add('is-dismissed');

      royalInvitation.classList.add('is-visible');
      royalInvitation.setAttribute('aria-hidden', 'false');

      if (replayBtn) replayBtn.classList.remove('hidden');

      if (manuscriptSheet && manuscriptSheet.animate) {
        manuscriptSheet.animate(
          [
            { opacity: 0, transform: 'translateY(24px) scale(0.97)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
          ],
          { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
        );
      }

      triggerInitialReveals();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1650);
  }

  function resetEnvelope() {
    clearAnimations();
    isOpening = false;

    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.add('is-locked');

    royalInvitation.classList.remove('is-visible');
    royalInvitation.setAttribute('aria-hidden', 'true');
    sanctuary.classList.remove('is-dismissed');

    if (replayBtn) replayBtn.classList.add('hidden');
    if (topFlapWrap) topFlapWrap.style.zIndex = '4';
    if (waxAuraRing) waxAuraRing.style.opacity = '1';
    if (waxCrackPath) waxCrackPath.style.opacity = '0';
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
   5. COUNTDOWN TIMER (Target: Sunday, Nov 29, 2026 - r="35" -> 219.91)
   ========================================================================== */
function initCountdownTimer() {
  const targetDate = new Date('2026-11-29T13:00:00+03:00').getTime();
  const CIRCUMFERENCE = 2 * Math.PI * 35; // 219.91

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  const ringDays = document.getElementById('ring-days');
  const ringHours = document.getElementById('ring-hours');
  const ringMinutes = document.getElementById('ring-minutes');
  const ringSeconds = document.getElementById('ring-seconds');

  function setProgress(circle, fraction) {
    if (!circle) return;
    const clamped = Math.max(0, Math.min(1, fraction));
    const offset = CIRCUMFERENCE * (1 - clamped);
    circle.style.strokeDasharray = `${CIRCUMFERENCE}`;
    circle.style.strokeDashoffset = `${offset}`;
  }

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');

    setProgress(ringDays, Math.min(1, days / 365));
    setProgress(ringHours, hours / 24);
    setProgress(ringMinutes, minutes / 60);
    setProgress(ringSeconds, seconds / 60);
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   6. RSVP CONFIRMATION & CONGRATULATIONS BOARD
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

  // Toggle companions dropdown based on attendance radio
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

      if (passName) passName.textContent = name;
      if (passStatus) {
        passStatus.textContent = isAttending
          ? `مؤكد بإذن الله (${countText})`
          : 'معتذر عن الحضور';
      }

      form.classList.add('hidden');
      if (passContainer) passContainer.classList.remove('hidden');

      if (wishText && blessingsGrid) {
        const card = document.createElement('div');
        card.className = 'wish-card';

        const p = document.createElement('p');
        p.className = 'wish-body';
        p.textContent = wishText;

        const footer = document.createElement('div');
        footer.className = 'wish-footer';

        const author = document.createElement('span');
        author.className = 'wish-author';
        author.textContent = name;

        const meta = document.createElement('span');
        meta.className = 'wish-meta';
        meta.textContent = 'تهنئة مضافة الآن';

        footer.appendChild(author);
        footer.appendChild(meta);
        card.appendChild(p);
        card.appendChild(footer);

        blessingsGrid.prepend(card);
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
   7. SHARE TOOLS (Copy Link & Share on WhatsApp)
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
