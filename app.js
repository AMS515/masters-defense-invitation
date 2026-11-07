/**
 * Royal Master's Defense Invitation
 * Researcher: Ibtisam Mahmoud Saleh - University of Mosul
 * Interactive 3D Envelope, Three.js Ambience, Audio Synthesizer & RSVP
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // 1. WEB AUDIO SYNTHESIZER (No external audio file dependencies)
  // ==========================================================
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Wax seal crack sound
  function playSealBreakSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Paper rustle / slide sound
  function playPaperRustleSound() {
    if (isMuted || !audioCtx) return;
    try {
      const bufferSize = audioCtx.sampleRate * 0.25;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.25);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Celebratory Royal Chime
  function playCelebrationChime() {
    if (isMuted || !audioCtx) return;
    try {
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      frequencies.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 1.0);
      });
    } catch (e) {
      console.warn('Chime failed', e);
    }
  }

  // Audio Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    isMuted = !isMuted;
    if (isMuted) {
      audioIcon.className = 'fa-solid fa-volume-xmark';
      audioBtn.style.opacity = '0.5';
    } else {
      audioIcon.className = 'fa-solid fa-volume-high';
      audioBtn.style.opacity = '1';
      playCelebrationChime();
    }
  });


  // ==========================================================
  // 2. THREE.JS 3D AMBIENT PARTICLES & LIGHTING
  // ==========================================================
  const canvas = document.getElementById('bg-canvas');
  let scene, camera, renderer, particlesMesh;

  function initThreeBg() {
    if (typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 150;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Geometry (Golden celebration dust)
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 350;
      positions[i + 1] = (Math.random() - 0.5) * 350;
      positions[i + 2] = (Math.random() - 0.5) * 200;
      scales[i / 3] = Math.random() * 2.5 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Subtle golden particles shader material
    const material = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 2.2,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Render loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (particlesMesh) {
        particlesMesh.rotation.y = elapsedTime * 0.04;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;
      }

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initThreeBg();


  // ==========================================================
  // 3. 3D ENVELOPE TILT & OPENING SEQUENCE
  // ==========================================================
  const envelopeStage = document.getElementById('envelope-stage');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const invitationMain = document.getElementById('invitation-main');
  const replayBtn = document.getElementById('replay-btn');

  let isEnvelopeOpen = false;

  // 3D Tilt on Hover / Pointer move
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('mousemove', (e) => {
      if (isEnvelopeOpen) return;
      const rect = envelopeWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 12;
      const rotateY = (x / (rect.width / 2)) * 14;
      envelopeWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    envelopeWrapper.addEventListener('mouseleave', () => {
      if (!isEnvelopeOpen) {
        envelopeWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    });
  }

  // Open Envelope Trigger Function
  function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    initAudio();
    playSealBreakSound();

    // Reset tilt transform
    envelopeWrapper.style.transform = 'none';

    // 1. Add class to envelope to trigger CSS 3D transitions
    envelope.classList.add('is-open');

    // 2. Play paper sound as flap opens and card pulls up
    setTimeout(() => {
      playPaperRustleSound();
    }, 450);

    // 3. Confetti Burst
    setTimeout(() => {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#cba135', '#fae69e', '#8c1726', '#ffffff']
        });
      }
      playCelebrationChime();
    }, 700);

    // 4. Smooth Transition from Envelope to Main Invitation Sheet
    setTimeout(() => {
      envelopeStage.classList.add('stage-vanish');

      setTimeout(() => {
        envelopeStage.classList.add('hidden');
        invitationMain.classList.remove('hidden');
        replayBtn.classList.remove('hidden');

        // Scroll gracefully to top of sheet
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Extra celebratory gentle confetti shower
        if (typeof confetti === 'function') {
          setTimeout(() => {
            confetti({
              particleCount: 45,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#cba135', '#fae69e', '#8c1726']
            });
            confetti({
              particleCount: 45,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#cba135', '#fae69e', '#8c1726']
            });
          }, 400);
        }

      }, 700);
    }, 1500);
  }

  // Trigger on click anywhere on envelope or seal
  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
  }

  // Re-close Envelope Trigger
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      isEnvelopeOpen = false;
      invitationMain.classList.add('hidden');
      replayBtn.classList.add('hidden');

      envelopeStage.classList.remove('stage-vanish');
      envelopeStage.classList.remove('hidden');
      envelope.classList.remove('is-open');
      envelopeWrapper.style.transform = 'none';

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ==========================================================
  // 4. COUNTDOWN TIMER (November 29, 2026)
  // ==========================================================
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // November 29, 2026 13:00 (1:00 PM)
  const targetEventDate = new Date('2026-11-29T13:00:00+03:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetEventDate - now;

    if (difference <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ==========================================================
  // 5. RSVP & WISHES MANAGEMENT
  // ==========================================================
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const rsvpSuccessMsg = document.getElementById('rsvp-success-msg');
  const whatsappRsvpBtn = document.getElementById('whatsapp-rsvp-btn');
  const wishesContainer = document.getElementById('wishes-container');

  // Load stored wishes from LocalStorage
  function loadWishes() {
    try {
      const stored = localStorage.getItem('ibtisam_wishes');
      if (stored && wishesContainer) {
        const wishes = JSON.parse(stored);
        wishes.forEach(item => appendWishCard(item.name, item.text, item.date));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }

  function appendWishCard(name, text, dateStr) {
    if (!wishesContainer) return;
    const card = document.createElement('div');
    card.className = 'wish-item';
    card.innerHTML = `
      <div class="wish-author">${escapeHTML(name)}</div>
      <p class="wish-text">${escapeHTML(text)}</p>
      <span class="wish-date">${dateStr || 'مؤخراً'}</span>
    `;
    wishesContainer.prepend(card);
  }

  function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  loadWishes();

  // Form Submission
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = document.getElementById('guest-name').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const guestCount = document.getElementById('guest-count').value;
      const guestWishes = document.getElementById('guest-wishes').value.trim();

      if (!guestName) return;

      initAudio();
      playCelebrationChime();

      // Confetti celebration
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#cba135', '#fae69e', '#16a34a']
        });
      }

      // Hide form and show confirmation banner
      rsvpForm.style.display = 'none';
      rsvpSuccess.classList.remove('hidden');

      if (attendance === 'declined') {
        rsvpSuccessMsg.textContent = `شكراً جزيلاً لك يا ${guestName} على مشاعرك الطيبة وتمنياتك الصادقة للباحثة.`;
      } else {
        rsvpSuccessMsg.textContent = `يسعدنا ويشرفنا حضوركم يا ${guestName} (${guestCount === '1' ? 'شخص واحد' : guestCount + ' أشخاص'})، ونتطلع للقائكم بكل محبة وسرور.`;
      }

      // Add wish to board if written
      if (guestWishes) {
        appendWishCard(guestName, guestWishes, 'الآن');
        try {
          const stored = JSON.parse(localStorage.getItem('ibtisam_wishes') || '[]');
          stored.push({ name: guestName, text: guestWishes, date: 'الآن' });
          localStorage.setItem('ibtisam_wishes', JSON.stringify(stored));
        } catch (err) {
          console.warn('Wish save failed', err);
        }
      }
    });
  }

  // Direct WhatsApp RSVP
  if (whatsappRsvpBtn) {
    whatsappRsvpBtn.addEventListener('click', () => {
      const guestName = document.getElementById('guest-name').value.trim() || 'الضيف الكريم';
      const attendanceInput = document.querySelector('input[name="attendance"]:checked');
      const isAttending = attendanceInput ? attendanceInput.value === 'attending' : true;
      const count = document.getElementById('guest-count').value;
      const wishes = document.getElementById('guest-wishes').value.trim();

      const statusText = isAttending 
        ? `يشرفني الحضور بكل سرور (العدد: ${count})`
        : `أعتذر بكل محبة لظرف طارئ`;

      let message = `السلام عليكم ورحمة الله وبركاته،\n\n`;
      message += `تأكيد حضور دعوة مأدبة الغداء احتفاءً بنيل الباحثة ابتسام محمود صالح درجة الماجستير:\n`;
      message += `• الاسم: ${guestName}\n`;
      message += `• الحالة: ${statusText}\n`;
      if (wishes) {
        message += `• كلمة التهنئة: ${wishes}\n`;
      }
      message += `\nألف مبارك ومنها للأعلى والتوفيق الدائم.`;

      const encodedMsg = encodeURIComponent(message);
      window.open(`https://api.whatsapp.com/send?text=${encodedMsg}`, '_blank');
    });
  }


  // ==========================================================
  // 6. SHARE INVITATION (Link Copy & WhatsApp)
  // ==========================================================
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const shareWhatsAppBtn = document.getElementById('share-whatsapp-btn');

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = 'تم نسخ الرابط بنجاح! ✓';
        copyLinkBtn.style.background = '#dcfce7';
        copyLinkBtn.style.borderColor = '#16a34a';

        setTimeout(() => {
          copyBtnText.textContent = originalText;
          copyLinkBtn.style.background = '';
          copyLinkBtn.style.borderColor = '';
        }, 2500);
      }).catch(() => {
        prompt('انسخ الرابط التالي:', url);
      });
    });
  }

  if (shareWhatsAppBtn) {
    shareWhatsAppBtn.addEventListener('click', () => {
      const url = window.location.href;
      const shareText = `🎓 دعوة لحضور مأدبة غداء احتفالية 🎓\n\nبمناسبة نيل الباحثة ابتسام محمود صالح درجة الماجستير في إدارة الأعمال (تخصص أمن المعلومات) - جامعة الموصل.\n\nيسعدنا ويشرفنا حضوركم وتبريكاتكم:\n${url}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    });
  }

});
