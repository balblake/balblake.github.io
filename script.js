// Setup
const NAV_HEIGHT = 56;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// Mobile Menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

function closeMenu() {
  hamburger.classList.remove("is-open");
  hamburger.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("nav-open");
}

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = navLinks.classList.toggle("nav-open");
  hamburger.classList.toggle("is-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", closeMenu);
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeMenu();
  }
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

// Section Reveal
const currentPage = window.location.pathname;
const isOneWayPage =
  currentPage.endsWith(".io") ||
  currentPage.endsWith("/") ||
  currentPage.endsWith("about");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (isOneWayPage) {
          revealObserver.unobserve(entry.target);
        }
      } else {
        if (!isOneWayPage) {
          entry.target.classList.remove("visible");
        }
      }
    });
  },
  {
    threshold: 0.11,
    rootMargin: "-76px 0px 0px 0px",
  },
);

setTimeout(() => {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
}, 150);
