// Load footer from footer.html and inject it into the page
(function () {
  async function loadFooter() {
    try {
      // Use absolute path from root
      const footerPath =
        window.location.origin +
        window.location.pathname.split("/").slice(0, -1).join("/") +
        "/footer.html";

      const response = await fetch(footerPath);
      if (!response.ok)
        throw new Error(`Failed to load footer: ${response.status}`);
      const html = await response.text();

      // Insert footer at the end of body
      document.body.insertAdjacentHTML("beforeend", html);

      // Dispatch event to signal footer is loaded
      document.dispatchEvent(new CustomEvent("footerLoaded"));
    } catch (err) {
      console.error("footer-loader: Failed to load footer", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFooter);
  } else {
    loadFooter();
  }
})();
