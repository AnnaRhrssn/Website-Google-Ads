/* ============================================
   ANNA ROHRSSEN — main.js
   GSAP · Lenis · ScrollTrigger
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   LENIS SMOOTH SCROLL
   ============================================ */
const lenis = new Lenis({
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
        .add(() => runPageAnimations());
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
    if (el.closest('#about') || el.closest('#problem') || el.closest('#cta')) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0, y: 32,
      duration: 0.9, ease: 'power4.out',
    });
  });

  /* ---- Tags & Subs (nicht in #about, #problem oder #cta) ---- */
  document.querySelectorAll('.s-tag, .s-sub').forEach(el => {
    if (el.closest('#about') || el.closest('#problem') || el.closest('#cta')) return;
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
   BOOT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNav();
});
