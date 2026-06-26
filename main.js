/* ============================================
   ANNA ROHRSSEN — main.js
   GSAP · Lenis · ScrollTrigger
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   LENIS SMOOTH SCROLL
   ============================================ */
const lenis = window.__lenis = new Lenis({
  duration: 1.15,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ============================================
   SCROLL PROGRESS
   ============================================ */
const progressEl = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  if (progressEl) progressEl.style.width = `${pct * 100}%`;
}, { passive: true });

/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  ScrollTrigger.create({
    start:       80,
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(() => mobileMenu.classList.add('open'));
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
      document.body.style.overflow = '';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      mobileMenu.classList.remove('open');
      setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   PAKETE FLIP CARDS (Mobile)
   ============================================ */
function initPaketFlip() {
  const isMobile = () => window.innerWidth <= 768;
  document.querySelectorAll('.paket').forEach(paket => {
    paket.addEventListener('click', e => {
      if (!isMobile()) return;
      if (e.target.closest('a')) return;
      paket.classList.toggle('is-open');
    });
  });
}

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
  const pre  = document.getElementById('preloader');
  const logo = document.querySelector('.pre__logo');
  const bar  = document.querySelector('.pre__bar');
  const pct  = document.querySelector('.pre__pct');
  if (!pre) return;

  gsap.to('.pre__img', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
  gsap.to(logo, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.25 });

  gsap.to(bar, {
    width: '100%',
    duration: 1.8,
    ease: 'power2.inOut',
    delay: 0.3,
    onUpdate() {
      if (pct) pct.textContent = Math.round(this.progress() * 100) + '%';
    },
    onComplete() {
      gsap.timeline()
        .to(pre, { opacity: 0, duration: 0.65, ease: 'power2.inOut', delay: 0.1 })
        .set(pre, { display: 'none' })
        .add(() => { runPageAnimations(); equalizeDescHeights(); });
    },
  });
}

/* ============================================
   PAGE ANIMATIONS
   ============================================ */
function runPageAnimations() {

  /* ---- Hero ---- */
  gsap.timeline({ delay: 0.05 })
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to('.hero__headline .word', {
      y: '0%',
      duration: 1.0,
      ease: 'power4.out',
      stagger: 0.07,
    }, '-=0.4')
    .to('.hero__audience', { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.3')
    .to('.hero__sub',  { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.4')
    .to('.hero__ctas', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.4');

  /* ---- Section headings (nicht in #about oder #problem – dort separat animiert) ---- */
  document.querySelectorAll('.s-heading, .s-script').forEach(el => {
    if (el.closest('#about') || el.closest('#problem') || el.closest('#cta') || el.closest('.pakete__intro')) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0, y: 32,
      duration: 0.9, ease: 'power4.out',
    });
  });

  /* ---- Tags & Subs (nicht in #about, #problem oder #cta) ---- */
  document.querySelectorAll('.s-tag, .s-sub').forEach(el => {
    if (el.closest('#about') || el.closest('#problem') || el.closest('#cta') || el.closest('.pakete__intro')) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      opacity: 0, y: 20,
      duration: 0.75, ease: 'power3.out',
    });
  });

  /* ---- Stats bar ---- */
  gsap.from('.stat-cell', {
    scrollTrigger: { trigger: '#stats-bar', start: 'top 85%', once: true },
    opacity: 0, y: 24,
    duration: 0.7, stagger: 0.1,
    ease: 'power3.out',
  });

  /* ---- Problem-Sektion ---- */
  gsap.from('.pain__item', {
    scrollTrigger: { trigger: '#problem', start: 'top 75%', once: true },
    opacity: 0, x: 24,
    duration: 0.75, stagger: 0.12,
    ease: 'power3.out',
  });
  gsap.from('.problem__left > *', {
    scrollTrigger: { trigger: '#problem', start: 'top 78%', once: true },
    opacity: 0, y: 28,
    duration: 0.75, stagger: 0.1,
    ease: 'power3.out',
  });
  gsap.from('.problem__bridge', {
    scrollTrigger: { trigger: '.problem__bridge', start: 'top 90%', once: true },
    opacity: 0, y: 20,
    duration: 0.7, ease: 'power3.out',
  });

  /* ---- For-whom ---- */
  gsap.from('.forwho__item', {
    scrollTrigger: { trigger: '#for-whom', start: 'top 78%', once: true },
    opacity: 0, x: -18,
    duration: 0.65, stagger: 0.08,
    ease: 'power3.out',
  });

  /* ---- Services: ALLE gleichzeitig einblenden (kein y-Stagger = kein Treppen-Effekt) ---- */
  ScrollTrigger.create({
    trigger: '#services',
    start:   'top 80%',
    once:    true,
    onEnter() {
      gsap.fromTo('.svc',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out', clearProps: 'transform' }
      );
    },
  });

  /* ---- Pakete: ebenfalls synchron ---- */
  gsap.fromTo('.paket',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 0.65, stagger: 0.08, ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: '.pakete__grid', start: 'top 82%', once: true },
    }
  );
  gsap.from('.pakete__intro > *', {
    scrollTrigger: { trigger: '.pakete__intro', start: 'top 85%', once: true },
    opacity: 0, y: 20,
    duration: 0.7, stagger: 0.1,
    ease: 'power3.out',
  });

  /* ---- Process ---- */
  document.querySelectorAll('.step').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      opacity: 0, y: 40,
      duration: 0.75, delay: i * 0.13,
      ease: 'power3.out',
    });
  });

  /* ---- About parallax ---- */
  gsap.to('.about__img', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end:   'bottom top',
      scrub: 1.4,
    },
    y: -70, ease: 'none',
  });
  gsap.from('.about__body > *', {
    scrollTrigger: { trigger: '#about', start: 'top 74%', once: true },
    opacity: 0, x: 32,
    duration: 0.8, stagger: 0.1,
    ease: 'power3.out',
  });
  gsap.from('.about__badge', {
    scrollTrigger: { trigger: '.about__badge', start: 'top 88%', once: true },
    opacity: 0, scale: 0.88,
    duration: 0.7, ease: 'back.out(1.4)',
  });

  /* ---- Testimonials ---- */
  gsap.fromTo('.testi',
    { opacity: 0, y: 42 },
    {
      opacity: 1, y: 0,
      duration: 0.8, stagger: 0.18,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: '#testimonials', start: 'top 80%', once: true },
    }
  );

  /* ---- CTA: kein Parallax – Bild bleibt fixiert damit Kopf oben sichtbar bleibt ---- */
  gsap.from('.cta__body > *', {
    scrollTrigger: { trigger: '#cta', start: 'top 80%', once: true },
    opacity: 0, y: 30,
    duration: 0.75, stagger: 0.1,
    ease: 'power3.out',
  });

  /* ---- FAQ ---- */
  gsap.from('.faq__item', {
    scrollTrigger: { trigger: '#faq', start: 'top 78%', once: true },
    opacity: 0, y: 22,
    duration: 0.65, stagger: 0.1,
    ease: 'power3.out',
  });

  /* ---- For-whom heading ---- */
  gsap.from('.forwho__heading', {
    scrollTrigger: { trigger: '#for-whom', start: 'top 82%', once: true },
    opacity: 0, y: 20,
    duration: 0.65, stagger: 0.12,
    ease: 'power3.out',
  });

  /* ---- Contact ---- */
  gsap.from('.contact__info, .contact__cta-box', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
    opacity: 0, y: 32,
    duration: 0.8, stagger: 0.16,
    ease: 'power3.out',
  });

  /* ---- Footer ---- */
  gsap.from('.footer__inner > *', {
    scrollTrigger: { trigger: '#footer', start: 'top 92%', once: true },
    opacity: 0, y: 16,
    duration: 0.6, stagger: 0.1,
    ease: 'power3.out',
  });
}

/* ============================================
   PAKET-KARTEN: Beschreibungen auf gleiche Höhe
   ============================================ */
function equalizeDescHeights() {
  const descs = document.querySelectorAll('.pakete__grid .paket__desc');
  descs.forEach(d => d.style.minHeight = '');
  if (window.innerWidth <= 768) return;
  const max = Math.max(...Array.from(descs).map(d => d.offsetHeight));
  descs.forEach(d => d.style.minHeight = max + 'px');
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(equalizeDescHeights, 120);
});

/* ============================================
   COOKIE BANNER + GOOGLE FONTS
   ============================================ */
function loadGoogleFonts() {
  if (document.getElementById('gf-loaded')) return;
  const pc1 = document.createElement('link');
  pc1.rel = 'preconnect';
  pc1.href = 'https://fonts.googleapis.com';
  const pc2 = document.createElement('link');
  pc2.rel = 'preconnect';
  pc2.href = 'https://fonts.gstatic.com';
  pc2.crossOrigin = 'anonymous';
  const lnk = document.createElement('link');
  lnk.id = 'gf-loaded';
  lnk.rel = 'stylesheet';
  lnk.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Montserrat:wght@300;400;500;600&display=swap';
  document.head.appendChild(pc1);
  document.head.appendChild(pc2);
  document.head.appendChild(lnk);
}

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const consent = localStorage.getItem('ar-cookie-consent');
  if (consent === 'accepted') { loadGoogleFonts(); return; }
  if (consent === 'declined') return;

  // Kurze Verzögerung damit Preloader zuerst sichtbar ist
  setTimeout(() => banner.classList.add('visible'), 800);

  banner.querySelector('.cookie-banner__accept').addEventListener('click', () => {
    localStorage.setItem('ar-cookie-consent', 'accepted');
    loadGoogleFonts();
    banner.classList.remove('visible');
  });

  banner.querySelector('.cookie-banner__decline').addEventListener('click', () => {
    localStorage.setItem('ar-cookie-consent', 'declined');
    banner.classList.remove('visible');
  });
}

function initTestiDots() {
  const grid = document.querySelector('.testi__grid--3');
  const dots = document.querySelectorAll('.testi__dot');
  if (!grid || !dots.length) return;

  grid.addEventListener('scroll', () => {
    const index = Math.round(grid.scrollLeft / grid.offsetWidth);
    dots.forEach((d, i) => d.classList.toggle('testi__dot--active', i === index));
  }, { passive: true });
}

/* ============================================
   BOOT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner();
  initPreloader();
  initNav();
  initPaketFlip();
  initTestiDots();
});
