// Setup
const NAV_HEIGHT = 56;

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Scroll Spy
const SECTION_IDS = ['about', 'education', 'skills', 'projects', 'experience', 'contact'];

function setActiveLink(activeId) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    const sectionId = a.getAttribute('href').replace('#', '');
    a.classList.toggle('nav-active', sectionId === activeId);
  });
}

function onScroll() {
  const scrollY      = window.scrollY;
  const trigger      = scrollY + window.innerHeight / 3;
  const atBottom     = window.scrollY + window.innerHeight >= document.body.scrollHeight - 10;
  let   activeId     = null;

  SECTION_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY - NAV_HEIGHT;
    if (trigger >= top) activeId = id;
  });

  if (scrollY < 80) activeId = null;
  if (atBottom) activeId = 'contact';

  setActiveLink(activeId);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile Menu
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

// Section Reveal
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

// Main Content Fade
const mainContent = document.getElementById('main-content');
let contentVisible = false;

function checkContent() {
  if (contentVisible) return;
  if (window.scrollY > 30) {
    mainContent.classList.add('visible');
    contentVisible = true;
    window.removeEventListener('scroll', checkContent);
  }
}

window.addEventListener('scroll', checkContent, { passive: true });

// Hero Shrink
const heroSection = document.getElementById('hero');
let heroShrunk = false;
const linksBar = document.getElementById('links');

function checkHero() {
  if (heroShrunk) return;
  if (window.scrollY > 30) {
    heroSection.classList.remove('hero-large');
    linksBar.classList.remove('links-large');
    heroShrunk = true;
    window.removeEventListener('scroll', checkHero);
  }
}

window.addEventListener('scroll', checkHero, { passive: true });

// Smooth Scroll With Offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    if (!heroShrunk) {
      heroSection.classList.remove('hero-large');
      linksBar.classList.remove('links-large');
      heroShrunk = true;
      
      mainContent.classList.add('visible');
      contentVisible = true;
      
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

// Scroll Hint
const scrollHint = document.getElementById('scroll-hint');

function hideScrollHint() {
  if (window.scrollY > 30) {
    scrollHint.classList.add('hidden');
    window.removeEventListener('scroll', hideScrollHint);
    setTimeout(() => scrollHint.remove(), 650);
  }
}

window.addEventListener('scroll', hideScrollHint, { passive: true });