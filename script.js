// script.js
// Interactivity & scroll animations using IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal elements
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // If this is the skills section, also ensure children styles update
        if (entry.target.classList.contains('skills')) {
          // Add class for CSS-driven progress fill
          entry.target.classList.add('visible');
          // also add 'in-view' to .skills so CSS selector will apply
          // (we already added in-view above)
        }
        // Unobserve once shown to avoid repeated triggers
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // For better UX on smaller screens, handle nav anchor smooth scroll
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Extra: lighten the avatar border when header in-view (subtle)
  const profile = document.getElementById('profile');
  if (profile) {
    const avatar = profile.querySelector('.avatar');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          avatar.style.borderImage = 'linear-gradient(180deg, var(--accent), var(--accent-2)) 1';
          io.unobserve(profile);
        }
      });
    }, { threshold: 0.4 });
    io.observe(profile);
  }

  // Accessibility: reduce-motion respect
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('in-view');
    });
    document.querySelectorAll('.progress-fill').forEach(fill => {
      fill.style.transition = 'none';
      // set immediately to level
      const level = getComputedStyle(fill).getPropertyValue('--level') || fill.dataset.level;
      if (level) fill.style.width = level;
    });
  }
});