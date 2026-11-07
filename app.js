/**
 * ============================================================================
 * ROYAL MASTER'S DEFENSE & BANQUET INVITATION — INTERACTIVE ENGINE
 * Honoree: Researcher Ibtisam Mahmoud Saleh — University of Mosul
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CINEMATIC WEB AUDIO SYNTHESIZER (Warm Harp, Wax Crack & Cotton Paper)
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

  // Realistic Wax Seal Crack & Snap Sound
  function playWaxCrackSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      // Crisp high snap
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.14);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Secondary deep thud
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(160, now + 0.05);
      subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.22);

      subGain.gain.setValueAtTime(0.38, now + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);
      subOsc.start(now + 0.05);
      subOsc.stop(now + 0.23);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Heavy Cotton Paper Sliding against Silk Lining
  function playPaperSlideSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const duration = 0.65;
      const bufferSize = Math.floor(audioCtx.sampleRate * duration);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Shaped pink-like noise envelope
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.16;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(650, now);
      bandpass.frequency.linearRampToValueAtTime(1100, now + duration * 0.6);
      bandpass.Q.value = 1.4;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Warm Celestial Harp / Oud Arpeggio Chord
  function playRoyalFanfare() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      // Warm Middle-Eastern / Royal Maqam Rast / Major 9th arpeggio notes
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99];

      notes.forEach((freq, index) => {
        const startTime = now + index * 0.095;
        const osc = audioCtx.createOscillator();
        const overtone = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        overtone.type = 'triangle';

        osc.frequency.setValueAtTime(freq, startTime);
        overtone.frequency.setValueAtTime(freq * 2, startTime);

        const overtoneGain = audioCtx.createGain();
        overtoneGain.gain.value = 0.15;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.14, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0008, startTime + 1.8);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        overtoneGain.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + 1.85);
        overtone.stop(startTime + 1.85);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ensureAudioContext();
      isMuted = !isMuted;
      if (isMuted) {
        audioIcon.className = 'fa-solid fa-volume-xmark';
        audioToggleBtn.style.opacity = '0.6';
      } else {
        audioIcon.className = 'fa-solid fa-volume-high';
        audioToggleBtn.style.opacity = '1';
        playRoyalFanfare();
      }
    });
  }


  // ==========================================================================
  // 2. THREE.JS CELESTIAL GOLDEN DUST & CANDLELIGHT BOKEH
  // ==========================================================================
  const bgCanvas = document.getElementById('bg-canvas');
  function initCelestialScene() {
    if (!bgCanvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 160;

    const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Circular Soft Glow Texture for Golden Bokeh
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 245, 195, 1)');
    grad.addColorStop(0.35, 'rgba(212, 175, 55, 0.75)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(spriteCanvas);

    const count = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 340;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 340;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 180;
      speeds[i] = 0.08 + Math.random() * 0.18;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 4.8,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('pointermove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 18;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 18;
    });

    function animate() {
      requestAnimationFrame(animate);

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = posAttr.getY(i);
        y += speeds[i];
        if (y > 170) y = -170;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      camera.position.x += (mouseX - camera.position.x) * 0.03;
      camera.position.y += (mouseY - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initCelestialScene();


  // ==========================================================================
  // 3. PRECISION 3D ENVELOPE CHOREOGRAPHY (GSAP TIMELINE)
  // ==========================================================================
  const sanctuary = document.getElementById('envelope-sanctuary');
  const sanctuaryHeader = document.getElementById('sanctuary-header');
  const sanctuaryPrompt = document.getElementById('sanctuary-prompt');
  const envelopeTiltZone = document.getElementById('envelope-tilt-zone');
  const envelopeAssembly = document.getElementById('envelope-assembly');
  const topFlapWrap = document.getElementById('env-top-flap-wrap');
  const topFlap3d = document.getElementById('env-top-flap');
  const envLetter = document.getElementById('env-letter');
  const waxSealStage = document.getElementById('wax-seal-stage');
  const waxCrackPath = document.getElementById('wax-crack-path');
  const royalInvitation = document.getElementById('royal-invitation');
  const manuscriptSheet = document.getElementById('manuscript-sheet');
  const replayBtn = document.getElementById('replay-envelope-btn');
  const openTriggerBtn = document.getElementById('open-trigger-btn');

  let isOpeningOrOpen = false;

  // Interactive 3D Hover / Pointer Tilt on Closed Envelope
  if (envelopeTiltZone && envelopeAssembly) {
    envelopeTiltZone.addEventListener('pointermove', (e) => {
      if (isOpeningOrOpen) return;
      const rect = envelopeAssembly.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const clampX = Math.max(-1, Math.min(1, deltaX));
      const clampY = Math.max(-1, Math.min(1, deltaY));

      gsap.to(envelopeAssembly, {
        rotateY: clampX * 12,
        rotateX: -clampY * 10,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    envelopeTiltZone.addEventListener('pointerleave', () => {
      if (isOpeningOrOpen) return;
      gsap.to(envelopeAssembly, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  }

  // Master Envelope Opening Sequence
  function triggerEnvelopeOpen() {
    if (isOpeningOrOpen) return;
    isOpeningOrOpen = true;

    ensureAudioContext();

    const tl = gsap.timeline();

    // Step 0: Center the envelope & hide touch prompt
    tl.to(envelopeAssembly, {
      rotateX: 0,
      rotateY: 0,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    }, 0);

    tl.to([sanctuaryPrompt, sanctuaryHeader], {
      opacity: 0,
      y: -15,
      duration: 0.4,
      ease: 'power2.inOut'
    }, 0);

    // Step 1: Crack the Royal Wax Seal (0.15s -> 0.65s)
    tl.call(() => playWaxCrackSound(), null, 0.15);

    tl.to(waxCrackPath, {
      strokeDashoffset: 0,
      duration: 0.28,
      ease: 'power2.in'
    }, 0.15);

    tl.to(waxSealStage, {
      scale: 1.12,
      duration: 0.15,
      ease: 'back.out(2)'
    }, 0.25);

    // Burst of golden wax sparks at seal position
    tl.call(() => {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 35,
          spread: 55,
          startVelocity: 22,
          origin: { y: 0.55 },
          colors: ['#d4af37', '#fae596', '#8f111e']
        });
      }
    }, null, 0.38);

    // Drop and dissolve broken wax seal
    tl.to(waxSealStage, {
      y: 45,
      scale: 0.65,
      opacity: 0,
      duration: 0.32,
      ease: 'power2.in'
    }, 0.42);

    // Step 2: Unfold the 3D Top Flap (0.65s -> 1.60s)
    tl.call(() => playPaperSlideSound(), null, 0.68);

    tl.to(topFlap3d, {
      rotateX: 180,
      duration: 0.95,
      ease: 'power2.inOut'
    }, 0.65);

    // CRITICAL Z-INDEX HANDOFF AT EXACT 90-DEGREE MIDPOINT (0.65 + 0.475 = 1.125s):
    // Places the opened top flap BEHIND the letter (z-index: 1 < letter z-index: 2)
    // while the front pocket remains at z-index: 3 (IN FRONT of letter z-index: 2)!
    tl.set(topFlapWrap, { zIndex: 1 }, 1.125);

    // Step 3: Slide the Letter UP Out of the Pocket (1.50s -> 2.55s)
    // Because envLetter is z-index: 2 and env-layer-pocket is z-index: 3,
    // the letter genuinely slides out from INSIDE the pocket without ever floating over the front flaps!
    tl.call(() => playPaperSlideSound(), null, 1.52);

    tl.to(envLetter, {
      yPercent: -112,
      duration: 1.05,
      ease: 'power3.inOut'
    }, 1.50);

    tl.to(envelopeAssembly, {
      y: 65,
      duration: 1.05,
      ease: 'power3.inOut'
    }, 1.50);

    // Step 4: Now that the bottom edge of the letter has 100% cleared the top rim of the pocket
    // (at yPercent: -112, zero overlap with pocket!), bring letter to foreground (z-index: 10)
    // and glide it down as the envelope recedes into the background!
    tl.set(envLetter, { zIndex: 10 }, 2.56);

    tl.to(['.env-layer-back', '.env-layer-pocket', topFlapWrap, '.envelope-aura'], {
      opacity: 0,
      scale: 0.88,
      y: 80,
      duration: 0.65,
      ease: 'power2.inOut'
    }, 2.58);

    tl.to(envLetter, {
      yPercent: -18,
      scale: 1.18,
      duration: 0.7,
      ease: 'power3.inOut'
    }, 2.58);

    // Step 5: Unfurl the Letter into the Full Illuminated Royal Manuscript (3.15s -> 4.10s)
    tl.call(() => {
      playRoyalFanfare();
      document.body.classList.remove('is-locked');
      royalInvitation.classList.add('is-active');
      royalInvitation.setAttribute('aria-hidden', 'false');
    }, null, 3.12);

    tl.to(envLetter, {
      opacity: 0,
      scale: 1.35,
      duration: 0.55,
      ease: 'power2.inOut'
    }, 3.15);

    tl.fromTo(manuscriptSheet,
      { opacity: 0, y: 50, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: 'power3.out' },
      3.15
    );

    tl.call(() => {
      sanctuary.classList.add('hidden');
      replayBtn.classList.remove('hidden');

      // Royal Golden Confetti Shower
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 55,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.65 },
          colors: ['#d4af37', '#fae596', '#80111d', '#ffffff']
        });
        confetti({
          particleCount: 55,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.65 },
          colors: ['#d4af37', '#fae596', '#80111d', '#ffffff']
        });
      }

      // Stagger reveal sections inside manuscript
      gsap.fromTo('.reveal-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.14, ease: 'power2.out' }
      );
    }, null, 3.65);
  }

  // Attach click/touch listeners to open the envelope
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
        // Reset all states cleanly
        royalInvitation.classList.remove('is-active');
        royalInvitation.setAttribute('aria-hidden', 'true');
        replayBtn.classList.add('hidden');
        sanctuary.classList.remove('hidden');
        document.body.classList.add('is-locked');

        gsap.set([sanctuaryPrompt, sanctuaryHeader], { opacity: 1, y: 0 });
        gsap.set(envelopeAssembly, { y: 0, scale: 1, rotateX: 0, rotateY: 0 });
        gsap.set(['.env-layer-back', '.env-layer-pocket', topFlapWrap, '.envelope-aura'], {
          opacity: 1,
          scale: 1,
          y: 0
        });
        gsap.set(topFlapWrap, { zIndex: 4 });
        gsap.set(topFlap3d, { rotateX: 0 });
        gsap.set(envLetter, { yPercent: 0, scale: 1, opacity: 1, zIndex: 2 });
        gsap.set(waxSealStage, { y: 0, scale: 1, opacity: 1 });
        gsap.set(waxCrackPath, { strokeDashoffset: 140 });

        isOpeningOrOpen = false;
      }, 300);
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

  const CIRCUMFERENCE = 2 * Math.PI * 52; // 326.72
  // Target Date: Sunday, Nov 29, 2026 at 13:00 Mosul Time (UTC+3)
  const targetTimestamp = new Date('2026-11-29T13:00:00+03:00').getTime();

  function setRingProgress(circleEl, fraction) {
    if (!circleEl) return;
    const clamped = Math.max(0, Math.min(1, fraction));
    const offset = CIRCUMFERENCE - clamped * CIRCUMFERENCE;
    circleEl.style.strokeDashoffset = offset;
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

  // Toggle companions select visibility based on attendance radio
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

  // Load saved blessings from LocalStorage
  try {
    const savedBlessings = JSON.parse(localStorage.getItem('ibtisam_royal_blessings') || '[]');
    savedBlessings.forEach((item) => {
      prependBlessingCard(item.author, item.text, item.time);
    });
  } catch (e) {
    console.warn('Storage read error:', e);
  }

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

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#d4af37', '#fae596', '#80111d']
        });
      }

      // Populate & Show VIP Royal Pass
      vipGuestName.textContent = nameVal;
      vipGuestStatus.textContent = isAttending
        ? `مؤكد بإذن الله (${countVal})`
        : 'معتذر مع خالص التبريكات';

      rsvpForm.classList.add('hidden');
      vipPassContainer.classList.remove('hidden');

      // Add blessing to Golden Wall if provided
      if (wishesVal) {
        prependBlessingCard(nameVal, wishesVal, 'مؤخراً');
        try {
          const current = JSON.parse(localStorage.getItem('ibtisam_royal_blessings') || '[]');
          current.push({ author: nameVal, text: wishesVal, time: '٢٠٢٦' });
          localStorage.setItem('ibtisam_royal_blessings', JSON.stringify(current));
        } catch (err) {
          console.warn('Storage save error:', err);
        }
      }
    });
  }

  if (editRsvpBtn) {
    editRsvpBtn.addEventListener('click', () => {
      vipPassContainer.classList.add('hidden');
      rsvpForm.classList.remove('hidden');
    });
  }

  // WhatsApp Direct RSVP
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
