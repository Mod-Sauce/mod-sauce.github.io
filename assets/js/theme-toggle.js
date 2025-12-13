// Simple Theme Toggle Implementation
(function () {
  const THEME_KEY = "site-theme";
  console.log("Theme toggle script loaded");

  // Apply theme to document
  function applyTheme(theme) {
    console.log("applyTheme called with:", theme);
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateToggleButton(theme);
    updateDiscordLogo(theme);
  }

  function updateDiscordLogo(theme) {
    const discordLogo = document.getElementById("discord-logo-img");
    if (discordLogo) {
      discordLogo.src =
        theme === "dark"
          ? "assets/png/discord-btn-dark.png"
          : "assets/png/discord-btn-light.png";
    }
  }

  // Update toggle button appearance
  function updateToggleButton(theme) {
    console.log("updateToggleButton called with:", theme);
    const toggle = document.getElementById("theme-toggle");
    console.log("toggle element:", toggle);
    if (toggle) {
      const newHTML =
        theme === "dark"
          ? '<span class="toggle-icon">☀️</span>'
          : '<span class="toggle-icon">🌙</span>';
      console.log("Setting toggle HTML to:", newHTML);
      toggle.innerHTML = newHTML;
    }
  }

  // Toggle between dark and light theme
  function toggleTheme(e) {
    console.log("toggleTheme called, event:", e);
    e.preventDefault();
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    console.log("currentTheme:", currentTheme);
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    console.log("newTheme:", newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }

  // Initialize theme
  function initTheme() {
    console.log("initTheme called");
    const savedTheme = localStorage.getItem(THEME_KEY);
    console.log("savedTheme from localStorage:", savedTheme);
    let theme;

    if (savedTheme) {
      // Use saved preference if available
      theme = savedTheme;
      console.log("Using saved theme:", theme);
    } else {
      // Check system preference (browser settings)
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      console.log("System prefers dark mode:", prefersDark);
      theme = prefersDark ? "dark" : "light";
      console.log("Using system theme:", theme);
    }

    console.log("theme to apply:", theme);
    applyTheme(theme);
  }

  // Listen for system theme changes
  function setupSystemThemeListener() {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addEventListener("change", (e) => {
      // Only apply system theme if user hasn't saved a preference
      if (!localStorage.getItem(THEME_KEY)) {
        const newTheme = e.matches ? "dark" : "light";
        console.log("System theme changed to:", newTheme);
        applyTheme(newTheme);
      }
    });
  }

  // Setup click handler
  function setupClickHandler() {
    console.log("setupClickHandler called");
    const toggle = document.getElementById("theme-toggle");
    console.log("toggle element found:", !!toggle);
    if (toggle) {
      console.log("Adding click listener to toggle button");
      toggle.addEventListener("click", toggleTheme);
      console.log("Click listener added");
    } else {
      console.log("ERROR: toggle element not found!");
    }
  }

  // Initialize on page load
  function init() {
    console.log("init called");
    initTheme();
    setupClickHandler();
    setupSystemThemeListener();
  }

  // Run initialization
  console.log("document.readyState:", document.readyState);

  // Wait for navbar to be loaded first
  document.addEventListener("navbarLoaded", function () {
    console.log("navbarLoaded event received, initializing theme toggle");
    setTimeout(init, 50);
  });

  // Also try on DOMContentLoaded as fallback
  if (document.readyState === "loading") {
    console.log("DOM still loading, waiting for DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", function () {
      console.log("DOMContentLoaded fired");
      setTimeout(init, 100);
    });
  } else {
    console.log("DOM already loaded, trying init");
    setTimeout(init, 100);
  }

  // Listen for footer
  document.addEventListener("footerLoaded", function () {
    console.log("footerLoaded event received, updating discord logo");
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    updateDiscordLogo(currentTheme);
  });
})();
