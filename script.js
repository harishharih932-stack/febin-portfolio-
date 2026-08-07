/* ═══════════════════════════════════════════════════════════
   Febin Lawrence — Portfolio Script
   - 0.5s delay then avatar voice starts
   - Voice stops on scroll past hero
   - Videos autoplay when scrolled into view
   - Scroll reveal animations
   - D-ID logo masked via CSS
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────
     LOADER
  ────────────────────────────────────── */
  const loader = document.getElementById('pageLoader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
    }, 2000);
  });

  /* ──────────────────────────────────────
     CUSTOM CURSOR
  ────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  let cx = 0, cy = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (cx - rx) * 0.14;
    ry += (cy - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .vcard-screen, .svc-row, .testi-card, .faq-q, .ch-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('big');
      ring.classList.add('big');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('big');
      ring.classList.remove('big');
    });
  });

  /* ──────────────────────────────────────
     FLOATING PARTICLES IN HERO
  ────────────────────────────────────── */
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hp';
      p.style.setProperty('--dur', (6 + Math.random() * 8) + 's');
      p.style.setProperty('--delay', (Math.random() * 6) + 's');
      p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      p.style.left = (Math.random() * 100) + '%';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      particlesContainer.appendChild(p);
    }
  }

  /* ──────────────────────────────────────
     AVATAR VIDEO — 0.5s DELAY START, MUTED
     Voice auto-unmutes after 0.5s
     Voice mutes when hero leaves viewport
  ────────────────────────────────────── */
  const avatarVideo = document.getElementById('avatarVideo');
  let heroVoiceEnabled = false;
  let heroLeft = false;

  if (avatarVideo) {
    // Start muted (browser policy)
    avatarVideo.muted = true;
    avatarVideo.volume = 0.85;

    // After 0.5s from load, unmute — give voice to avatar
    setTimeout(() => {
      if (!heroLeft) {
        avatarVideo.muted = false;
        heroVoiceEnabled = true;
      }
    }, 500);

    // When user scrolls past hero → mute avatar
    const heroSection = document.getElementById('hero');

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Scrolled away from hero → mute
          avatarVideo.muted = true;
          heroLeft = true;
        } else {
          // Back to hero → unmute if voice was enabled
          heroLeft = false;
          if (heroVoiceEnabled) {
            setTimeout(() => {
              if (!heroLeft) avatarVideo.muted = false;
            }, 200);
          }
        }
      });
    }, { threshold: 0.1 });

    if (heroSection) heroObserver.observe(heroSection);
  }

  /* ──────────────────────────────────────
     NAV — scroll effects + dark-mode switch
  ────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const darkZone = document.querySelector('.dark-zone');
  const goTop = document.getElementById('goTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // scrolled class
    nav.classList.toggle('scrolled', scrollY > 60);

    // dark nav when inside dark zone
    if (darkZone) {
      const dzTop = darkZone.getBoundingClientRect().top;
      nav.classList.toggle('dark-nav', dzTop <= 60);
    }

    // go top button
    goTop.classList.toggle('show', scrollY > 600);
  });

  goTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ──────────────────────────────────────
     MOBILE NAV
  ────────────────────────────────────── */
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('mobileDrawer');
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    drawer.classList.toggle('open', menuOpen);
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = menuOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.transform = menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  document.querySelectorAll('.md-link').forEach(l => {
    l.addEventListener('click', () => {
      menuOpen = false;
      drawer.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; });
    });
  });

  /* ──────────────────────────────────────
     SCROLL REVEAL — [data-reveal]
  ────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────
     SKILL BARS — animate on scroll
  ────────────────────────────────────── */
  const skillFills = document.querySelectorAll('.sk3-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.w;
        entry.target.style.width = w + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(b => skillObserver.observe(b));

  /* ──────────────────────────────────────
     COUNTER ANIMATION — stats
  ────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const dur = 1600;
        const start = performance.now();

        const run = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target);
          if (p < 1) requestAnimationFrame(run);
          else el.textContent = target;
        };

        requestAnimationFrame(run);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));

  /* ──────────────────────────────────────
     VIDEO GRID — AUTO-PLAY ON SCROLL IN
     All videos play automatically when visible
     Pause when out of view
  ────────────────────────────────────── */
  const gridVideos = document.querySelectorAll('.grid-vid[data-autoplay]');

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        // Only play if src is loaded
        if (vid.src && vid.src !== window.location.href) {
          vid.play().catch(() => { /* ignore autoplay errors */ });
        }
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.25 });

  gridVideos.forEach(v => videoObserver.observe(v));

  /* ──────────────────────────────────────
     3D TILT EFFECT ON CARDS
  ────────────────────────────────────── */
  document.querySelectorAll('.vcard-screen, .sk3-card, .testi-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ──────────────────────────────────────
     FAQ ACCORDION
  ────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ──────────────────────────────────────
     VIDEO UPLOAD SLOTS
  ────────────────────────────────────── */
  document.querySelectorAll('.upload-zone').forEach(zone => {
    const prompt = zone.querySelector('.uz-prompt');
    const input = zone.querySelector('.uz-input');
    const preview = zone.querySelector('.uz-preview');

    if (!prompt || !input || !preview) return;

    prompt.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      preview.src = url;
      preview.style.display = 'block';
      preview.muted = false;
      preview.volume = 0.85;
      preview.play().catch(() => {});
      prompt.style.display = 'none';
    });
  });

  /* ──────────────────────────────────────
     CONTACT FORM
  ────────────────────────────────────── */
  window.handleSubmit = function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      e.target.reset();
    }, 3000);
  };

  /* ──────────────────────────────────────
     SMOOTH NAV ANCHOR SCROLLING
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────
     SURPRISE SCROLL EFFECTS (dark zone)
     Parallax float on section titles
  ────────────────────────────────────── */
  const sectionTitles = document.querySelectorAll('.section-title');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    sectionTitles.forEach(title => {
      const rect = title.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * -30;
        title.style.transform = `translateY(${offset}px)`;
      }
    });
  });

})();
