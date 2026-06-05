/* ================================================================
   script.js
================================================================ */

const NAV_HEIGHT = 56;

/* ── FORCE TOP ON EVERY LOAD/REFRESH ────────────────────────────
   Browsers cache scroll position — this overrides that so the
   hero always starts large and the page always starts at top.
────────────────────────────────────────────────────────────────── */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'; // stop browser restoring scroll
}
window.scrollTo(0, 0); // always start at very top

/* ── 1. SCROLL SPY ──────────────────────────────────────────────
────────────────────────────────────────────────────────────────── */
const SECTION_IDS = ['about', 'education', 'skills', 'projects', 'experience', 'contact'];

function setActiveLink(activeId) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    const sectionId = a.getAttribute('href').replace('#', '');
    a.classList.toggle('nav-active', sectionId === activeId);
  });
}

function onScroll() {
  const scrollY  = window.scrollY;
  const trigger  = scrollY + window.innerHeight / 3;
  let   activeId = null;

  SECTION_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY - NAV_HEIGHT;
    if (trigger >= top) activeId = id;
  });

  if (scrollY < 80) activeId = null;
  setActiveLink(activeId);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── 2. MOBILE MENU ─────────────────────────────────────────────
────────────────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

function closeMenu() {
  hamburger.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('nav-open');
}

hamburger.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = navLinks.classList.toggle('nav-open');
  hamburger.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeMenu();
  }
});

/* ── 3. SECTION REVEAL ──────────────────────────────────────────
────────────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.11,
  rootMargin: '-76px 0px 0px 0px'
});

setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}, 150);

/* ── 3b. ABOUT FADE ─────────────────────────────────────────────
   Only triggers after actual scroll, never on load/refresh.
────────────────────────────────────────────────────────────────── */
const aboutSection = document.getElementById('about');
let aboutVisible = false;

function checkAbout() {
  if (aboutVisible) return;
  if (window.scrollY > 30) { // raised from 0 to 30 so refresh cant trigger it
    aboutSection.classList.add('visible');
    aboutVisible = true;
    window.removeEventListener('scroll', checkAbout);
  }
}

window.addEventListener('scroll', checkAbout, { passive: true });

/* ── 3c. HERO SHRINK ────────────────────────────────────────────
   Only triggers after actual scroll, never on load/refresh.
────────────────────────────────────────────────────────────────── */
const heroSection = document.getElementById('hero');
let heroShrunk = false;

const linksBar = document.getElementById('links');

function checkHero() {
  if (heroShrunk) return;
  if (window.scrollY > 30) {
    heroSection.classList.remove('hero-large');
    linksBar.classList.remove('links-large');  // shrinks with hero
    heroShrunk = true;
    window.removeEventListener('scroll', checkHero);
  }
}

window.addEventListener('scroll', checkHero, { passive: true });

/* ── 4. SMOOTH SCROLL WITH OFFSET ───────────────────────────────
   Accounts for the hero being large when clicking nav buttons
   before scrolling — the extra hero padding shifts all section
   positions down, so we measure the extra offset and add it.
────────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    /* If hero is still large, shrink it first then scroll */
    if (!heroShrunk) {
      heroSection.classList.remove('hero-large');
      linksBar.classList.remove('links-large');
      heroShrunk = true;
      aboutSection.classList.add('visible');
      aboutVisible = true;
      /* wait for the CSS transition (0.6s) to finish before scrolling */
      setTimeout(() => {
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 620);
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 5. SCROLL HINT ─────────────────────────────────────────────
────────────────────────────────────────────────────────────────── */
const scrollHint = document.getElementById('scroll-hint');

function hideScrollHint() {
  if (window.scrollY > 30) {
    scrollHint.classList.add('hidden');
    window.removeEventListener('scroll', hideScrollHint);
    setTimeout(() => scrollHint.remove(), 650);
  }
}

window.addEventListener('scroll', hideScrollHint, { passive: true });