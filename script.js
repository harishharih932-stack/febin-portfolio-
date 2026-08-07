/* ═══════════════════════════════════════════════════════════
   Febin Lawrence Portfolio — script.js v3
   FIXES:
   ✅ Voice: unmutes on first user interaction (mousemove/click)
   ✅ Scroll reveal: IntersectionObserver on [data-reveal]
   ✅ Videos: autoplay when scrolled into view
   ✅ 3D tilt on cards
   ✅ Counter animation
   ✅ Skill bars animate on scroll
   ✅ Nav dark-switch when entering dark zone
   ✅ FAQ accordion
   ✅ Upload zones
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. PAGE LOADER ─────────────────────────────── */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 1800);
  });

  /* ─── 2. CUSTOM CURSOR ───────────────────────────── */
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left  = mx + 'px';
    cur.style.top   = my + 'px';
  });

  // smooth ring follow
  (function followRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  })();

  // hover scale on interactive elements
  document.querySelectorAll('a, button, .vc-screen, .svc-row, .test-c, .faq-q, .ch, .sk-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('big'); ring.classList.add('big'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('big'); ring.classList.remove('big'); });
  });

  /* ─── 3. AVATAR VOICE ────────────────────────────────
     Browser blocks autoplay audio by default.
     Strategy: start muted, unmute on FIRST user interaction.
     Also: mute when scrolled past hero, unmute when back.
  ─────────────────────────────────────────────────────── */
  const avatarVid  = document.getElementById('avatarVid');
  const soundBtn   = document.getElementById('soundBtn');
  const icMuted    = document.getElementById('icMuted');
  const icSound    = document.getElementById('icSound');
  const soundLabel = document.getElementById('soundLabel');
  const heroSection = document.getElementById('hero');

  let voiceUnlocked = false;   // has user interacted yet?
  let voiceMuted    = false;   // user manually muted?
  let heroVisible   = true;

  function enableVoice() {
    if (!avatarVid) return;
    avatarVid.muted  = false;
    avatarVid.volume = 0.85;
    icMuted.style.display  = 'none';
    icSound.style.display  = 'block';
    soundLabel.textContent = 'Mute';
    soundBtn.classList.add('active');
    voiceUnlocked = true;
  }

  function muteVoice() {
    if (!avatarVid) return;
    avatarVid.muted = true;
    icMuted.style.display  = 'block';
    icSound.style.display  = 'none';
    soundLabel.textContent = 'Click to hear me';
    soundBtn.classList.remove('active');
  }

  // Unlock on FIRST interaction (mousemove counts on desktop)
  function firstInteraction() {
    if (voiceUnlocked || voiceMuted) return;
    // small delay so page has properly loaded
    setTimeout(() => {
      if (!voiceMuted && heroVisible) enableVoice();
    }, 500);
    document.removeEventListener('mousemove', firstInteraction);
    document.removeEventListener('click',     firstInteraction);
    document.removeEventListener('touchstart',firstInteraction);
    document.removeEventListener('keydown',   firstInteraction);
  }

  document.addEventListener('mousemove',  firstInteraction, { once: false });
  document.addEventListener('click',      firstInteraction, { once: false });
  document.addEventListener('touchstart', firstInteraction, { once: false });
  document.addEventListener('keydown',    firstInteraction, { once: false });

  // Sound button — manual toggle
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (!voiceUnlocked) {
        enableVoice();
        voiceMuted = false;
      } else if (!avatarVid.muted) {
        muteVoice();
        voiceMuted = true;
      } else {
        enableVoice();
        voiceMuted = false;
      }
    });
  }

  // Mute when hero scrolls out of view, restore when back
  if (heroSection && avatarVid) {
    const heroObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        heroVisible = e.isIntersecting;
        if (!e.isIntersecting) {
          // left hero → mute
          avatarVid.muted = true;
        } else {
          // back to hero → restore if not manually muted
          if (voiceUnlocked && !voiceMuted) {
            setTimeout(() => { if (heroVisible) avatarVid.muted = false; }, 200);
          }
        }
      });
    }, { threshold: 0.15 });
    heroObs.observe(heroSection);
  }

  /* ─── 4. NAV SCROLL EFFECTS ─────────────────────── */
  const nav      = document.getElementById('nav');
  const darkZone = document.getElementById('darkZone');
  const goTop    = document.getElementById('goTop');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;

    // solid bg after 60px
    nav.classList.toggle('solid', sy > 60);

    // dark-nav when dark zone starts
    if (darkZone) {
      const dzTop = darkZone.getBoundingClientRect().top;
      nav.classList.toggle('dark-nav', dzTop <= 64);
    }

    // go-top button
    goTop.classList.toggle('show', sy > 600);
  }, { passive: true });

  goTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─── 5. MOBILE NAV ─────────────────────────────── */
  const burger   = document.getElementById('navBurger');
  const mobileNv = document.getElementById('mobileNav');
  const mnClose  = document.getElementById('mnClose');
  let menuOpen   = false;

  function openMenu()  { menuOpen = true;  mobileNv.classList.add('open');    animBurger(true);  }
  function closeMenu() { menuOpen = false; mobileNv.classList.remove('open'); animBurger(false); }

  function animBurger(open) {
    const [s0, s1] = burger.querySelectorAll('span');
    s0.style.transform = open ? 'rotate(45deg) translate(5px,5px)'   : '';
    s1.style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  }

  burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  if (mnClose) mnClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mn-lnk').forEach(l => l.addEventListener('click', closeMenu));

  /* ─── 6. SCROLL REVEAL ──────────────────────────────
     Watches [data-reveal] elements.
     Adds class 'visible' when in viewport.
  ─────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revObs.observe(el));

  /* ─── 7. SKILL BAR ANIMATION ────────────────────── */
  const skillFills = document.querySelectorAll('.sk-fill');

  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(f => skillObs.observe(f));

  /* ─── 8. COUNTER ANIMATION ──────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseInt(el.dataset.count);
        const dur    = 1600;
        const t0     = performance.now();

        const tick = now => {
          const p    = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3); // ease-out-cubic
          el.textContent = Math.floor(ease * target);
          if (p < 1) requestAnimationFrame(tick);
          else        el.textContent = target;
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObs.observe(c));

  /* ─── 9. VIDEO GRID — AUTO-PLAY ON SCROLL ─────────
     Videos with [data-ap] autoplay when 25% visible.
     They pause when out of view (saves resources).
  ─────────────────────────────────────────────────────── */
  const gridVids = document.querySelectorAll('.gv[data-ap]');

  const vidObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        // attempt play; gracefully catch blocked promise
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.25 });

  gridVids.forEach(v => vidObs.observe(v));

  /* ─── 10. 3D TILT ON CARDS ──────────────────────── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── 11. FAQ ACCORDION ─────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const ans  = item.querySelector('.faq-a');
      const open = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-a').style.maxHeight = null;
      });

      if (!open) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ─── 12. VIDEO UPLOAD ZONES ────────────────────── */
  document.querySelectorAll('.upload-zone').forEach(zone => {
    const prompt  = zone.querySelector('.uz-prompt');
    const input   = zone.querySelector('.uz-input');
    const preview = zone.querySelector('.uz-prev');
    if (!prompt || !input || !preview) return;

    prompt.addEventListener('click', () => input.click());

    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      preview.src = url;
      preview.style.display = 'block';
      preview.muted  = false;
      preview.volume = 0.85;
      preview.play().catch(() => {});
      prompt.style.display = 'none';

      // also observe for autoplay
      vidObs.observe(preview);
    });
  });

  /* ─── 13. CONTACT FORM ──────────────────────────── */
  window.submitForm = function(e) {
    e.preventDefault();
    const btn  = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      e.target.reset();
    }, 3000);
  };

  /* ─── 14. SMOOTH ANCHOR SCROLL ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── 15. MARQUEE PAUSE ON HOVER ────────────────── */
  const track = document.getElementById('marqueeTrack');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* ─── 16. SECTION TITLE PARALLAX (dark zone) ─── */
  const secTitles = document.querySelectorAll('.dark-zone .sec-title');

  window.addEventListener('scroll', () => {
    secTitles.forEach(t => {
      const r = t.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const prog   = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        const offset = (prog - 0.5) * -20;
        t.style.transform = `translateY(${offset}px)`;
      }
    });
  }, { passive: true });

  /* ─── 17. SURPRISE ENTRANCE — dark zone sections ─
     Extra pop effect when first entering each dark section
  ─────────────────────────────────────────────────────── */
  const darkSecs = document.querySelectorAll('.dark-zone .sec');
  const secEntryObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.setProperty('--entry', '1');
        secEntryObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  darkSecs.forEach(s => secEntryObs.observe(s));

})(); // end IIFE
