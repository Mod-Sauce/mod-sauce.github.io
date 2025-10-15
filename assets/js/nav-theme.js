// Accessible nav + theme toggle
(function () {
  // Create references
  const THEME_KEY = 'site-theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Init theme
  let saved = localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light');
  applyTheme(saved);

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    // Build fallback nav if markup missing
    const navs = document.querySelectorAll('nav.navbar');
    navs.forEach((oldNav) => {
      // If .site-nav already present, skip
      if (oldNav.classList.contains('site-nav')) return;
      // Replace old structure with new accessible structure while preserving links
      const newNav = document.createElement('nav');
      newNav.className = 'navbar site-nav';
      newNav.setAttribute('role', 'navigation');
      newNav.setAttribute('aria-label', 'Main');

      // left: logo
      const left = document.createElement('div');
      left.className = 'nav-content';
      // move logo link
      const logo = oldNav.querySelector('.logo');
      if (logo) left.appendChild(logo.cloneNode(true));

      // burger
      const btn = document.createElement('button');
      btn.id = 'nav-toggle';
      btn.className = 'burger';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'primary-menu');
      btn.setAttribute('aria-label', 'Toggle menu');
      btn.innerHTML = '<span class="burger-box"><span class="burger-inner"></span></span>';
      left.appendChild(btn);

      // theme toggle
      const themeBtn = document.createElement('button');
      themeBtn.id = 'theme-toggle';
      themeBtn.className = 'theme-toggle';
      themeBtn.setAttribute('aria-pressed', 'false');
      themeBtn.setAttribute('aria-label', 'Toggle color theme');
      themeBtn.innerHTML = '<span class="icon-sun" aria-hidden="true">☀️</span><span class="icon-moon" aria-hidden="true">🌙</span>';
      left.appendChild(themeBtn);

      // menu: try to reuse existing .nav-links
      const menu = document.createElement('div');
      menu.id = 'primary-menu';
      menu.className = 'nav-menu';
      menu.hidden = true;
      const existingLinks = oldNav.querySelector('.nav-links');
      if (existingLinks) {
        const clone = existingLinks.cloneNode(true);
        clone.classList.remove('nav-links');
        // wrap into a container to keep styles
        const ul = document.createElement('div');
        ul.className = 'nav-links';
        // move children
        Array.from(clone.children).forEach((c) => ul.appendChild(c));
        menu.appendChild(ul);
      }

      newNav.appendChild(left);
      newNav.appendChild(menu);
      oldNav.replaceWith(newNav);
    });

    // Wire up interactions
    const navToggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('primary-menu');
    const themeBtn = document.getElementById('theme-toggle');

    if (navToggle && menu) {
      navToggle.addEventListener('click', () => {
        const open = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!open));
        if (open) {
          menu.hidden = true;
        } else {
          menu.hidden = false;
          const first = menu.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
          if (first) first.focus();
        }
      });

      // close on outside click
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !navToggle.contains(e.target) && !menu.hidden) {
          menu.hidden = true;
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Esc to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) {
          menu.hidden = true;
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.focus();
        }
      });
    }

    // Theme toggle wiring
    if (themeBtn) {
      // reflect saved
      themeBtn.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark');
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
        themeBtn.setAttribute('aria-pressed', next === 'dark');
      });
    }
  });
})();
