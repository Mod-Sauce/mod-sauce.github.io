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

  // Init routine
  function initNavAndTheme() {
    try {
      console.debug('nav-theme: init start');
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

  // Wire up interactions per nav (support multiple navs)
  const siteNavs = document.querySelectorAll('nav.site-nav');
    siteNavs.forEach((nav) => {
      const navToggle = nav.querySelector('#nav-toggle');
      const menu = nav.querySelector('#primary-menu');

      // Ensure menu visibility based on viewport
      const innerLinks = menu ? menu.querySelector('.nav-links') : null;
      function syncForViewport() {
        if (window.innerWidth >= 720) {
          // show menu on desktop
          if (menu) menu.hidden = false;
          if (innerLinks) innerLinks.classList.remove('active');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        } else {
          // mobile: hide menu by default
          if (menu) menu.hidden = true;
          if (innerLinks) innerLinks.classList.remove('active');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
      }

      syncForViewport();
      window.addEventListener('resize', syncForViewport);

      if (navToggle && menu) {
        navToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          console.debug('nav-theme: navToggle click, innerWidth=', window.innerWidth, 'menu.hidden=', menu ? menu.hidden : 'no-menu');
          const open = navToggle.getAttribute('aria-expanded') === 'true';
          navToggle.setAttribute('aria-expanded', String(!open));
          if (open) {
            menu.hidden = true;
            if (innerLinks) innerLinks.classList.remove('active');
          } else {
            menu.hidden = false;
            if (innerLinks) innerLinks.classList.add('active');
            const first = menu.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
            if (first) first.focus();
          }
        });

        // close on outside click
        document.addEventListener('click', (e) => {
          if (!menu.contains(e.target) && !navToggle.contains(e.target) && !menu.hidden && window.innerWidth < 720) {
              menu.hidden = true;
              if (innerLinks) innerLinks.classList.remove('active');
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


    });
    console.debug('nav-theme: init done, navs=', siteNavs.length);
    } catch (err) {
      console.error('nav-theme: init error', err);
    }
  }

  // Listen for navbar loaded event (from navbar-loader.js)
  document.addEventListener('navbarLoaded', initNavAndTheme);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavAndTheme);
  } else {
    // DOM already ready
    initNavAndTheme();
  }

  // Delegated handler as a fallback: catch clicks on any .burger button
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.burger');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const nav = btn.closest && btn.closest('nav.site-nav');
    if (!nav) return;
    const navToggle = btn;
    const menu = nav.querySelector('#primary-menu');
    const innerLinks = menu ? menu.querySelector('.nav-links') : null;
    console.log('Burger menu clicked!');
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    if (open) {
      if (menu) menu.hidden = true;
      if (innerLinks) innerLinks.classList.remove('active');
    } else {
      if (menu) menu.hidden = false;
      if (innerLinks) innerLinks.classList.add('active');
      const first = menu ? menu.querySelector('a,button,[tabindex]:not([tabindex="-1"])') : null;
      if (first) first.focus();
    }
  });


})();
