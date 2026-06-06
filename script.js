// Setup
const NAV_HEIGHT = 56;

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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
// 1. Check if the current page is index.html, about.html, or the root directory
const currentPage = window.location.pathname;
const isOneWayPage = currentPage.endsWith('index.html') || 
                     currentPage.endsWith('about.html');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Always reveal the element when it comes into view
      entry.target.classList.add('visible');
      
      // If we are on Index or About, stop watching it so it never disappears
      if (isOneWayPage) {
        revealObserver.unobserve(entry.target);
      }
    } else {
      // If we are NOT on Index or About, remove the class so it can reveal again
      if (!isOneWayPage) {
        entry.target.classList.remove('visible');
      }
    }
  });
}, {
  threshold: 0.11,
  rootMargin: '-76px 0px 0px 0px'
});

setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}, 150);