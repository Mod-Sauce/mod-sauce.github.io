// Load navbar from navbar.html and inject it into the page
(function () {
  async function loadNavbar() {
    try {
      // Use absolute path from root
      const navbarPath = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/navbar.html';

      const response = await fetch(navbarPath);
      if (!response.ok) throw new Error(`Failed to load navbar: ${response.status}`);
      const html = await response.text();
      
      // Insert navbar at the beginning of body
      const body = document.body;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const navbar = tempDiv.firstElementChild;
      
      // Remove any existing navbar
      const existingNav = document.querySelector('nav.site-nav');
      if (existingNav) {
        existingNav.remove();
      }
      
      // Insert new navbar at the beginning
      body.insertBefore(navbar, body.firstChild);
      
      // Dispatch event to signal navbar is loaded
      document.dispatchEvent(new CustomEvent('navbarLoaded'));
    } catch (err) {
      console.error('navbar-loader: Failed to load navbar', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
  } else {
    loadNavbar();
  }
})();

