/* ═══ Febin Lawrence Portfolio — script.js v4 ═══ */
(function () {
  'use strict';

  /* ─── LOADER ─── */
  const loader = document.getElementById('pageLoader');
  let loaderDone = false;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
      loaderDone = true;  // Voice unlock enabled only after this
    }, 1800);
  });

  /* ─── CURSOR ─── */
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
  (function follow() { rx += (mx - rx) * .13; ry += (my - ry) * .13; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(follow); })();
  document.querySelectorAll('a,button,.wcard-vid-wrap,.test-c,.svc-row,.sk-card,.ch').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('big'); ring.classList.add('big'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('big'); ring.classList.remove('big'); });
  });

  /* ─── AVATAR VOICE ─── */
  const avatarVid  = document.getElementById('avatarVid');
  const soundBtn   = document.getElementById('soundBtn');
  const icMuted    = document.getElementById('icMuted');
  const icSound    = document.getElementById('icSound');
  const soundLabel = document.getElementById('soundLabel');
  const heroSec    = document.getElementById('hero');
  let voiceMuted = false;
  let voiceOn = true;
  let heroVis = true;

  function enableVoice() {
    if (!avatarVid) return;
    avatarVid.muted = false; avatarVid.volume = 0.85;
    if (icMuted && icSound) { icMuted.style.display = 'none'; icSound.style.display = 'block'; }
    if (soundLabel) soundLabel.textContent = 'Mute';
    if (soundBtn) soundBtn.classList.add('active');
    voiceOn = true;
    voiceMuted = false;
  }
  function muteVoice() {
    if (!avatarVid) return;
    avatarVid.muted = true;
    if (icMuted && icSound) { icMuted.style.display = 'block'; icSound.style.display = 'none'; }
    if (soundLabel) soundLabel.textContent = 'Click to hear me';
    if (soundBtn) soundBtn.classList.remove('active');
    voiceOn = false;
    voiceMuted = true;
  }
  function firstInteraction() {
    if (!loaderDone) return;
    enableVoice();
    ['mousemove','click','touchstart','keydown','scroll'].forEach(e => document.removeEventListener(e, firstInteraction));
  }
  // Register voice unlock — trigger on ANY interaction for immediate playback
  ['mousemove','click','touchstart','keydown','scroll'].forEach(e => document.addEventListener(e, firstInteraction));
  if (soundBtn) soundBtn.addEventListener('click', () => {
    if (!voiceOn) { enableVoice(); }
    else if (!avatarVid.muted) { muteVoice(); }
    else { enableVoice(); }
  });
  if (heroSec && avatarVid) {
    new IntersectionObserver(entries => {
      heroVis = entries[0].isIntersecting;
      if (!heroVis) avatarVid.muted = true;
      else if (voiceOn && !voiceMuted) setTimeout(() => { if (heroVis) avatarVid.muted = false; }, 200);
    }, { threshold: 0.15 }).observe(heroSec);
  }

  /* ─── NAV ─── */
  const nav = document.getElementById('nav');
  const dz  = document.getElementById('darkZone');
  const goTop = document.getElementById('goTop');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    nav.classList.toggle('solid', sy > 60);
    if (dz) nav.classList.toggle('dark-nav', dz.getBoundingClientRect().top <= 64);
    goTop.classList.toggle('show', sy > 600);
  }, { passive: true });
  goTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─── MOBILE NAV ─── */
  const burger = document.getElementById('navBurger');
  const mobileNv = document.getElementById('mobileNav');
  const mnClose = document.getElementById('mnClose');
  let menuOpen = false;
  function openMenu()  { menuOpen = true;  mobileNv.classList.add('open');    const [s0,s1]=burger.querySelectorAll('span'); s0.style.transform='rotate(45deg) translate(5px,5px)'; s1.style.transform='rotate(-45deg) translate(5px,-5px)'; }
  function closeMenu() { menuOpen = false; mobileNv.classList.remove('open'); const [s0,s1]=burger.querySelectorAll('span'); s0.style.transform=''; s1.style.transform=''; }
  burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  if (mnClose) mnClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mn-lnk').forEach(l => l.addEventListener('click', closeMenu));

  /* ─── SCROLL REVEAL ─── */
  const revEls = document.querySelectorAll('[data-reveal]');
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.02 });
  revEls.forEach(el => revObs.observe(el));
  setTimeout(() => { revEls.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible'); }); }, 1900);

  /* ─── HOVER-TO-PLAY on wcard-vid-wrap ─── */
  document.querySelectorAll('[data-hover-play]').forEach(wrap => {
    const vid = wrap.querySelector('video');
    if (!vid) return;
    wrap.addEventListener('mouseenter', () => {
      // Temporarily mute the hero avatar voice if it is playing
      if (avatarVid && !avatarVid.muted) {
        avatarVid.muted = true;
        avatarVid.dataset.wasPlaying = "true";
      }
      vid.muted = false; // UNMUTE!
      vid.volume = 0.85;
      wrap.classList.add('playing');
      vid.play().catch(() => {});
    });
    wrap.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
      vid.muted = true; // Mute back
      wrap.classList.remove('playing');
      // Restore hero avatar voice if it was active
      if (avatarVid && avatarVid.dataset.wasPlaying === "true" && heroVis) {
        avatarVid.muted = false;
        delete avatarVid.dataset.wasPlaying;
      }
    });
  });

  /* ─── 3D TILT ─── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x*12}deg) rotateX(${-y*12}deg) translateY(-6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ─── SKILL BARS ─── */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; skillObs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  document.querySelectorAll('.sk-fill').forEach(f => skillObs.observe(f));

  /* ─── COUNTERS ─── */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, dur = 1600, t0 = performance.now();
      const tick = now => { const p = Math.min((now - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(ease * target); if (p < 1) requestAnimationFrame(tick); else el.textContent = target; };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(c => countObs.observe(c));

  /* ─── FAQ ─── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement, ans = item.querySelector('.faq-a'), open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(fi => { fi.classList.remove('open'); fi.querySelector('.faq-a').style.maxHeight = null; });
      if (!open) { item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
    });
  });

  /* ─── ADD VIDEO + BUTTON ─── */
  const addBtn   = document.getElementById('addVideoBtn');
  const addInput = document.getElementById('addVideoInput');
  const worksGrid = document.getElementById('worksGrid');

  if (addBtn && addInput) {
    addBtn.addEventListener('click', () => addInput.click());
    addInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);

      // Create new wcard
      const count = worksGrid.querySelectorAll('.wcard').length + 1;
      const isRev = count % 2 === 0;
      const card = document.createElement('div');
      card.className = 'wcard' + (isRev ? ' wcard-rev' : '');

      card.innerHTML = `
        <div class="wcard-num">0${count}</div>
        <div class="wcard-vid-wrap" data-hover-play>
          <video src="${url}" loop playsinline muted style="width:100%;height:100%;object-fit:cover;display:block;"></video>
          <div class="wcard-hover-cta"><div class="wcard-play-ring"><span>▶</span></div></div>
        </div>
        <div class="wcard-info">
          <div class="wcard-cat">New Upload</div>
          <h3 class="wcard-title" contenteditable="true">Click to Edit Title</h3>
          <div class="wcard-tags"><span contenteditable="true">Category</span></div>
        </div>
      `;

      worksGrid.appendChild(card);
      card.style.opacity = '0'; card.style.transform = 'translateY(40px)';
      requestAnimationFrame(() => { card.style.transition = 'opacity .6s ease, transform .6s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });

      // Wire hover-play for new card
      const vid = card.querySelector('video');
      const wrap = card.querySelector('[data-hover-play]');
      wrap.addEventListener('mouseenter', () => vid.play().catch(() => {}));
      wrap.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });

      addInput.value = '';
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ─── CONTACT FORM ─── */
  window.submitForm = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = '✓ Message Sent!'; btn.style.background = '#22c55e'; btn.style.color = '#fff';
    setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; btn.style.color = ''; e.target.reset(); }, 3000);
  };

  /* ─── SMOOTH ANCHOR ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ─── MARQUEE ─── */
  const track = document.getElementById('marqueeTrack');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* ─── SURPRISE: PARALLAX ON SECTION TITLES ─── */
  const titles = document.querySelectorAll('.dark-zone .sec-title');
  window.addEventListener('scroll', () => {
    titles.forEach(t => {
      const r = t.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const prog = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        t.style.transform = `translateY(${(prog - 0.5) * -18}px)`;
      }
    });
  }, { passive: true });

  /* ─── SURPRISE: WCARD TITLE CHAR SPLIT on hover ─── */
  document.querySelectorAll('.wcard-title').forEach(title => {
    if (title.hasAttribute('contenteditable')) return;
    const text = title.textContent;
    title.innerHTML = text.split('').map(c => c === ' ' ? ' ' : `<span style="display:inline-block;transition:transform .3s ease,color .3s">${c}</span>`).join('');
    title.closest('.wcard').addEventListener('mouseenter', () => {
      title.querySelectorAll('span').forEach((s, i) => {
        s.style.transitionDelay = i * 18 + 'ms';
        s.style.transform = 'translateY(-4px)';
        s.style.color = 'var(--acc)';
      });
    });
    title.closest('.wcard').addEventListener('mouseleave', () => {
      title.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.color = ''; });
    });
  });

})();
